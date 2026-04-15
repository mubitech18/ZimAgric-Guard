
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, RefreshCw, X, Image as ImageIcon } from 'lucide-react';

interface CameraViewProps {
  onCapture: (base64Image: string) => void;
  onClose: () => void;
  onUpload?: () => void;
  isPfumvudza: boolean;
  onTogglePfumvudza: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose, onUpload, isPfumvudza, onTogglePfumvudza }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setIsInitializing(true);
      setError(null);
      const constraints = {
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsInitializing(false);
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const base64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        onCapture(base64);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="relative flex-1 bg-neutral-900 flex items-center justify-center overflow-hidden">
        {isInitializing && (
          <div className="absolute inset-0 flex items-center justify-center text-white flex-col gap-4">
            <RefreshCw className="animate-spin h-8 w-8 text-emerald-400" />
            <p>Initializing sensor...</p>
          </div>
        )}
        
        {error ? (
          <div className="p-6 text-center text-white">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={onClose}
              className="bg-white/10 px-4 py-2 rounded-full"
            >
              Go Back
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            {/* Viewfinder Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12">
              <div className="w-full max-w-sm aspect-square border-2 border-emerald-400/50 rounded-3xl relative overflow-hidden">
                <div className="scan-line" />
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />
              </div>
            </div>

            {/* Pfumvudza Mode Indicator */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2">
              <button 
                onClick={onTogglePfumvudza}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-2xl pointer-events-auto border-2 ${
                  isPfumvudza ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-black/50 text-white/50 border-white/10'
                }`}
              >
                <RefreshCw size={14} className={isPfumvudza ? 'animate-spin' : ''} />
                Pfumvudza Mode: {isPfumvudza ? 'ON' : 'OFF'}
              </button>
            </div>
          </>
        )}

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="h-40 bg-neutral-950 flex items-center justify-between px-10">
        <button
          onClick={onUpload}
          className="h-14 w-14 bg-white/10 text-white rounded-full flex items-center justify-center active:scale-95 transition-all"
        >
          <ImageIcon size={28} />
        </button>
        
        <button
          onClick={captureFrame}
          disabled={isInitializing}
          className="h-20 w-20 bg-emerald-500 rounded-full border-4 border-white/20 flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50 shadow-lg shadow-emerald-500/20"
        >
          <Camera size={36} className="text-white" />
        </button>

        <div className="w-14" /> {/* Spacer */}
      </div>
    </div>
  );
};

export default CameraView;
