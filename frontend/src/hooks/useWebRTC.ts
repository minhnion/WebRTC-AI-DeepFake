import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { v4 as uuidv4 } from "uuid";
import { getWebSocketURL } from "../lib/utils";

interface PeerData {
  peerID: string;
  peer: Peer.Instance;
}
interface PeerStream {
  id: string;
  stream: MediaStream;
}

export function useWebRTC(roomId: string) {
  const [myStream, setMyStream] = useState<MediaStream>();
  const [peers, setPeers] = useState<PeerStream[]>([]);

  const peersRef = useRef<PeerData[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const myClientIdRef = useRef<string>(uuidv4());

  useEffect(() => {
    const setupMediaAndWebSocket = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setMyStream(stream);

        const clientId = myClientIdRef.current;
        const wsUrl = getWebSocketURL(roomId, clientId);
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log(`WebSocket connected with Client ID: ${clientId}`);
        };

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          const eventName = message.event;
          const eventData = message.data;

          switch (eventName) {
            case "all users":
              eventData.forEach((userID: string) => {
                const peer = createPeer(userID, clientId, stream);
                peersRef.current.push({ peerID: userID, peer });
              });
              break;

            case "user joined":
              const peer = addPeer(
                eventData.signal,
                eventData.callerID,
                stream
              );
              peersRef.current.push({ peerID: eventData.callerID, peer });
              break;

            case "receiving returned signal":
              const item = peersRef.current.find(
                (p) => p.peerID === eventData.id
              );
              item?.peer.signal(eventData.signal);
              break;

            case "user left":
              const peerToRemove = peersRef.current.find(
                (p) => p.peerID === eventData
              );
              if (peerToRemove) {
                peerToRemove.peer.destroy();
              }
              peersRef.current = peersRef.current.filter(
                (p) => p.peerID !== eventData
              );
              setPeers((prevPeers) =>
                prevPeers.filter((p) => p.id !== eventData)
              );
              break;
          }
        };

        ws.onclose = () => {
          console.log("WebSocket disconnected");
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };
      } catch (err) {
        console.error("Failed to get local stream or connect WebSocket", err);
      }
    };

    setupMediaAndWebSocket();

    return () => {
      wsRef.current?.close();
      myStream?.getTracks().forEach((track) => track.stop());
      peersRef.current.forEach((p) => p.peer.destroy());
    };
  }, [roomId]);

  const sendMessage = (event: string, data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ event, data });
      wsRef.current.send(message);
    }
  };

  function createPeer(
    userToSignal: string,
    callerID: string,
    stream: MediaStream
  ): Peer.Instance {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      sendMessage("sending signal", { userToSignal, callerID, signal });
    });

    peer.on("stream", (peerStream) => {
      setPeers((prev) => [
        ...prev.filter((p) => p.id !== userToSignal),
        { id: userToSignal, stream: peerStream },
      ]);
    });

    return peer;
  }

  function addPeer(
    incomingSignal: Peer.SignalData,
    callerID: string,
    stream: MediaStream
  ): Peer.Instance {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      sendMessage("return signal", { signal, userToSignal: callerID });
    });

    peer.on("stream", (peerStream) => {
      setPeers((prev) => [
        ...prev.filter((p) => p.id !== callerID),
        { id: callerID, stream: peerStream },
      ]);
    });

    peer.signal(incomingSignal);
    return peer;
  }

  return { myStream, peers, myClientId: myClientIdRef.current, wsRef };
}
