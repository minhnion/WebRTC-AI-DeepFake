import { useEffect, useRef } from "react";

function App() {
  const userVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Failed to get local stream", err);
      }
    };

    getMedia();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-6">
      <h1 className="mb-6 text-4xl font-bold text-gray-800">
        WebRTC Video Call
      </h1>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-lg bg-black shadow-lg">
          <video
            ref={userVideoRef}
            muted
            autoPlay
            playsInline
            className="h-full w-full -scale-x-100 object-cover"
          />
          <p className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-sm text-white">
            You
          </p>
        </div>

        <div className="flex items-center justify-center rounded-lg bg-gray-800 shadow-lg">
          <p className="text-gray-400">Waiting for others...</p>
        </div>
      </div>
    </div>
  );
}

export default App;
