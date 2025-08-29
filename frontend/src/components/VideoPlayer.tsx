import { useEffect, useRef } from "react";
import { Card } from "antd";
import { useSendFrame } from "../hooks/useSendFrame";
import { PredictionData } from "../types";

const FRAME_CAPTURE_INTERVAL = 5000;

interface VideoPlayerProps {
  userId: string;
  roomId: string;
  name: string;
  stream?: MediaStream;
  isMuted?: boolean;
  isFlipped?: boolean;
  captureFrames?: boolean;
  prediction?: PredictionData | null;
}

export function VideoPlayer({
  userId,
  roomId,
  name,
  stream,
  isMuted,
  isFlipped,
  captureFrames,
  prediction,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mutate: sendFrameMutation } = useSendFrame();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (!captureFrames || !videoRef.current || !roomId || !userId) return;

    const videoElement = videoRef.current;

    const intervalId = setInterval(() => {
      if (
        videoElement.readyState >= videoElement.HAVE_ENOUGH_DATA &&
        canvasRef.current &&
        videoElement.videoWidth > 0
      ) {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (context) {
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          const imageData = canvas.toDataURL("image/jpeg");
          sendFrameMutation({ imageData, roomId, userId });
        }
      }
    }, FRAME_CAPTURE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [captureFrames, sendFrameMutation, roomId, userId]);

  let borderColor = "border-gray-200";
  let tagBgColor = "";
  let tagTextColor = "text-white";
  let tagText = "";

  if (prediction) {
    if (prediction.label === "Fake") {
      borderColor = "border-red-500";
      tagBgColor = "bg-red-500";
      tagText = `Fake: ${(prediction.confidence_fake * 100).toFixed(0)}%`;
    } else {
      borderColor = "border-green-500";
      tagBgColor = "bg-green-500";
      tagText = `Real: ${(prediction.confidence_real * 100).toFixed(0)}%`;
    }
  }

  return (
    <Card
      title={name}
      className={`relative border-4 ${borderColor} transition-all duration-300`}
    >
      <video
        ref={videoRef}
        muted={isMuted}
        autoPlay
        playsInline
        className={`w-full h-full object-cover bg-black ${isFlipped ? "-scale-x-100" : ""}`}
      />
      <canvas ref={canvasRef} className="hidden" />

      {tagText && (
        <div
          className={`absolute top-2 right-2 ${tagBgColor} ${tagTextColor} text-xs font-bold px-2 py-1 rounded-md shadow-lg`}
        >
          {tagText}
        </div>
      )}
    </Card>
  );
}
