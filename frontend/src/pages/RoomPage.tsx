import { Spin, Typography } from "antd";
import { useWebRTC } from "../hooks/useWebRTC";
import { Route } from "../routes/room.$roomId.route";
import { VideoPlayer } from "../components/VideoPlayer";
import { useEffect, useState } from "react";
import { PredictionData } from "../types";

interface PredictionState {
  [userId: string]: PredictionData | null;
}

export const RoomPage = () => {
  const { roomId } = Route.useParams();
  const { myStream, peers, myClientId, wsRef } = useWebRTC(roomId!);

  const [predictions, setPredictions] = useState<PredictionState>({});

  useEffect(() => {
    const ws = wsRef.current;
    if (ws) {
      const handleMessage = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data);
          if (message.event === "detection_result") {
            const { user_id, prediction } = message.data;
            setPredictions((prev) => ({
              ...prev,
              [user_id]: {
                label: prediction.label,
                confidence_real: prediction.confidence_real,
                confidence_fake: prediction.confidence_fake,
              },
            }));
          }
        } catch (e) {
          console.error("Failed to parse WebSocket message", e);
        }
      };

      ws.addEventListener("message", handleMessage);

      return () => {
        ws.removeEventListener("message", handleMessage);
      };
    }
  }, [wsRef.current]);

  if (!myStream) {
    return <Spin tip="Starting camera..." size="large" fullscreen />;
  }

  return (
    <div>
      <Typography.Title level={2} className="mb-4">
        Room: {roomId}
      </Typography.Title>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VideoPlayer
          name="You"
          userId={myClientId}
          roomId={roomId!}
          stream={myStream}
          isMuted
          isFlipped
          captureFrames={false}
          prediction={predictions[myClientId] || null}
        />

        {peers.map((peer) => (
          <VideoPlayer
            key={peer.id}
            name={`Peer ${peer.id.substring(0, 6)}`}
            userId={peer.id}
            roomId={roomId!}
            stream={peer.stream}
            captureFrames={true}
            prediction={predictions[peer.id] || null}
          />
        ))}
      </div>
    </div>
  );
};
