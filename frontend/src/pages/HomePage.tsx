import { useNavigate } from "@tanstack/react-router";
import { Button, Card, Input, Space } from "antd";
import { useState } from "react";

export const HomePage = ()  => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      navigate({ to: '/room/$roomId', params: { roomId: roomId.trim() } });
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Card title="Join a Video Call" className="w-full max-w-sm">
        <Space direction="vertical" className="w-full">
          <Input 
            placeholder="Enter Room ID" 
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)} 
            onPressEnter={handleJoinRoom}
          />
          <Button type="primary" onClick={handleJoinRoom} block>
            Join Room
          </Button>
        </Space>
      </Card>
    </div>
  );
}