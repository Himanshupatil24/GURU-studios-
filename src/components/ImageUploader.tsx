import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Camera, 
  PenTool, 
  Image as ImageIcon, 
  X, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Maximize2 
} from 'lucide-react';
import { SAMPLE_IMAGES } from '../data/sampleImages';
import { SampleImage } from '../types';

interface ImageUploaderProps {
  currentImage: string | null;
  onImageChange: (dataUrl: string | null, suggestedPrompt?: string) => void;
  selectedCategory?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageChange,
  selectedCategory,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'camera' | 'draw' | 'presets'>('presets');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Drawing canvas states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#2563eb');
  const [penWidth, setPenWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  // Camera video ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Global paste handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                onImageChange(event.target.result as string);
              }
            };
            reader.readAsDataURL(file);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onImageChange]);

  // Clean up camera on unmount or mode change
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Camera handling
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera. Please check permissions or upload a file.');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      onImageChange(dataUrl);
      stopCamera();
    }
  };

  // Canvas drawing handlers
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    if (activeMode === 'draw') {
      setTimeout(initCanvas, 50);
    }
  }, [activeMode]);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#ffffff' : penColor;
    ctx.lineWidth = isEraser ? penWidth * 3 : penWidth;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onImageChange(dataUrl, 'Analyze this drawing and provide a detailed breakdown.');
  };

  const clearCanvas = () => {
    initCanvas();
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-md border border-indigo-800/60 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Multimodal Input
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Paste an image with Ctrl+V anytime
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setActiveMode('presets');
              stopCamera();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeMode === 'presets'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Presets
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMode('upload');
              stopCamera();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeMode === 'upload'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Upload
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMode('camera');
              startCamera();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeMode === 'camera'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Camera
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMode('draw');
              stopCamera();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeMode === 'draw'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" /> Draw
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Interactive Input Controller */}
        <div className="lg:col-span-7">
          {/* Mode 1: Presets Gallery */}
          {activeMode === 'presets' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Select a sample multimodal specimen:</span>
                <span className="text-slate-500">{SAMPLE_IMAGES.length} sample templates</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SAMPLE_IMAGES.map((sample) => {
                  const isSelected = currentImage === sample.dataUrl;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => onImageChange(sample.dataUrl, sample.defaultPrompt)}
                      className={`group relative text-left rounded-xl p-2.5 border transition-all overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/20'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-900 mb-2 border border-slate-800 relative">
                        <img
                          src={sample.dataUrl}
                          alt={sample.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 bg-indigo-600 text-white rounded-full p-1 shadow">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        <span className="absolute bottom-1 left-1 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/70 text-slate-300">
                          {sample.category}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                          {sample.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {sample.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mode 2: Upload Zone */}
          {activeMode === 'upload' && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-indigo-500 hover:bg-indigo-950/20 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform mb-3">
                <Upload className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300">
                Click to browse or drag and drop an image
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports PNG, JPEG, WEBP, SVG, or paste from clipboard (Ctrl+V)
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">
                  Up to 20MB
                </span>
                <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">
                  High-res Multimodal Vision
                </span>
              </div>
            </div>
          )}

          {/* Mode 3: Live Camera */}
          {activeMode === 'camera' && (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative">
              {cameraError ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-rose-400 mb-3">{cameraError}</p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="relative aspect-video bg-black flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={captureCameraPhoto}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg flex items-center gap-2 transition-all hover:scale-105"
                    >
                      <Camera className="w-4 h-4" /> Snap Photo
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode 4: Interactive Canvas Whiteboard */}
          {activeMode === 'draw' && (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-3.5 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Palette:</span>
                  {['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#0f172a'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setPenColor(color);
                        setIsEraser(false);
                      }}
                      className={`w-5 h-5 rounded-full border ${
                        penColor === color && !isEraser
                          ? 'border-white scale-110 shadow'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsEraser(!isEraser)}
                    className={`ml-2 px-2 py-0.5 rounded text-[11px] border ${
                      isEraser
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Eraser
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Clear
                  </button>
                  <button
                    type="button"
                    onClick={saveDrawing}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow"
                  >
                    <Check className="w-3.5 h-3.5" /> Use Sketch
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl overflow-hidden border border-slate-700 relative cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  width={560}
                  height={320}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={stopDraw}
                  onMouseLeave={stopDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={stopDraw}
                  className="w-full h-auto block touch-none"
                />
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                Draw wireframes, circuit diagrams, math problems, or layout ideas directly.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Active Preview & Info */}
        <div className="lg:col-span-5 bg-slate-950/70 rounded-2xl border border-slate-800/80 p-4 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" /> Active Visual Context
              </span>
              {currentImage && (
                <button
                  type="button"
                  onClick={() => onImageChange(null)}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-rose-950/40"
                >
                  <X className="w-3 h-3" /> Remove
                </button>
              )}
            </div>

            {currentImage ? (
              <div className="space-y-3">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner group">
                  <img
                    src={currentImage}
                    alt="Active multimodal input"
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded-md text-[10px] font-mono text-emerald-400 border border-emerald-900/60">
                    Ready for GURU
                  </div>
                </div>

                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Multimodal Engine:</span>
                    <span className="font-mono text-indigo-300">GURU / Gemini API</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Input Resolution:</span>
                    <span className="font-mono text-slate-200">Adaptive (256K Context)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                <ImageIcon className="w-8 h-8 mb-2 text-slate-600" />
                <p className="text-xs font-medium text-slate-400">No image loaded yet</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                  Choose a preset above, upload a screenshot, or draw on the whiteboard to activate multimodal vision.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-900 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Powered by DeepMind GURU</span>
            <span className="text-indigo-400 font-mono">Open Weights</span>
          </div>
        </div>
      </div>
    </div>
  );
};
