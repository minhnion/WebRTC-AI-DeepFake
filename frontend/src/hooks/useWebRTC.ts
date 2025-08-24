import { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { socket } from '../lib/socket';

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

  useEffect(() => {
    socket.disconnect(); 
    socket.connect();

    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMyStream(stream);

        socket.emit('join room', roomId);

        socket.on('all users', (users: string[]) => {
          users.forEach((userID) => {
            const peer = createPeer(userID, socket.id!, stream);
            const peerData: PeerData = { peerID: userID, peer };
            peersRef.current.push(peerData);
          });
        });

        socket.on('user joined', (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          const peerData: PeerData = { peerID: payload.callerID, peer };
          peersRef.current.push(peerData);
        });

        socket.on('receiving returned signal', (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item?.peer.signal(payload.signal);
        });

        socket.on('user left', (id: string) => {
          const peerObj = peersRef.current.find((p) => p.peerID === id);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          peersRef.current = peersRef.current.filter((p) => p.peerID !== id);
          setPeers((prevPeers) => prevPeers.filter((p) => p.id !== id));
        });

      } catch (err) {
        console.error('Failed to get local stream', err);
      }
    };

    getMedia();

    return () => {
      socket.off('all users');
      socket.off('user joined');
      socket.off('receiving returned signal');
      socket.off('user left');
      myStream?.getTracks().forEach(track => track.stop());
      peersRef.current.forEach(p => p.peer.destroy());
    };
  }, [roomId]);

  function createPeer(userToSignal: string, callerID: string, stream: MediaStream): Peer.Instance {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socket.emit('sending signal', { userToSignal, callerID, signal });
    });

    peer.on('stream', (peerStream) => {
      setPeers((prev) => [...prev.filter(p => p.id !== userToSignal), { id: userToSignal, stream: peerStream }]);
    });

    return peer;
  }

  function addPeer(incomingSignal: Peer.SignalData, callerID: string, stream: MediaStream): Peer.Instance {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socket.emit('return signal', { signal, callerID });
    });

    peer.on('stream', (peerStream) => {
      setPeers((prev) => [...prev.filter(p => p.id !== callerID), { id: callerID, stream: peerStream }]);
    });

    peer.signal(incomingSignal);
    return peer;
  }

  return { myStream, peers };
}