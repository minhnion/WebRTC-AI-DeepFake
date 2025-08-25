import { Spin, Typography } from "antd";
import { useWebRTC } from "../hooks/useWebRTC";
import { Route } from "../routes/room.$roomId.route";
import { VideoPlayer } from "../components/VideoPlayer";

export const RoomPage = () => {
  const { roomId } = Route.useParams();
  const { myStream, peers } = useWebRTC(roomId!);

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
          stream={myStream}
          isMuted
          isFlipped
          captureFrames={true}
        />

        {peers.map((peer) => (
          <VideoPlayer
            key={peer.id}
            name={`Peer ${peer.id.substring(0, 6)}`}
            stream={peer.stream}
            captureFrames={true}
          />
        ))}
      </div>
    </div>
  );
};
