import { useEffect, useRef } from 'react';
import { Card } from 'antd';
import { useSendFrame } from '../hooks/useSendFrame';

const FRAME_CAPTURE_INTERVAL = 5000; 

interface VideoPlayerProps {
  name: string;
  stream?: MediaStream;
  isMuted?: boolean;
  isFlipped?: boolean;
  captureFrames?: boolean;
}

export function VideoPlayer({ name, stream, isMuted, isFlipped, captureFrames }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mutate: sendFrameMutation } = useSendFrame();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (!captureFrames || !videoRef.current) return;

    const videoElement = videoRef.current;
    const intervalId = setInterval(() => {

        if (videoElement.readyState >= videoElement.HAVE_ENOUGH_DATA && canvasRef.current) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          const imageData = canvas.toDataURL('image/jpeg');
          sendFrameMutation(imageData);
        }
      }
    }, FRAME_CAPTURE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [captureFrames, sendFrameMutation]);

  return (
    <Card title={name}>
      <video
        ref={videoRef}
        muted={isMuted}
        autoPlay
        playsInline
        className={`w-full h-full object-cover ${isFlipped ? '-scale-x-100' : ''}`}
      />
      <canvas ref={canvasRef} className="hidden" />
    </Card>
  );
}