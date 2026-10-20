import React, { useState } from 'react';
import { 
  Palette, 
  Code, 
  Eye, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Layers, 
  Maximize2,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ImageUploader } from './ImageUploader';

interface SketchToCodeProps {
  currentImage: string | null;
  onImageChange: (dataUrl: string | null, suggestedPrompt?: string) => void;
  onRunSketchToCode: (params: {
    imageBase64: string;
    mimeType?: string;
  }) => Promise<{
    text: string;
    extractedCode: string;
    latencyMs: number;
  }>;
}

export const SketchToCode: React.FC<SketchToCodeProps> = ({
  currentImage,
  onImageChange,
  onRunSketchToCode,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'breakdown'>('preview');
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Default demo prototype for quick showcase
  const defaultHtmlPreview = `
    <div class="min-h-[400px] bg-slate-900 text-slate-100 p-6 rounded-xl font-sans">
      <nav class="flex items-center justify-between pb-6 border-b border-slate-800">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">T</div>
          <span class="font-bold text-lg text-white">TaskFlow Pro</span>
        </div>
        <div class="flex items-center gap-3">
          <button class="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white">Sign In</button>
          <button class="px-4 py-1.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md">Get Started</button>
        </div>
      </nav>

      <div class="py-10 text-center max-w-2xl mx-auto">
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Synthesized by GURU Multimodal</span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">Collaborate in real-time with your team</h1>
        <p class="text-slate-400 text-sm mt-3">Organize workflows, track sprint velocity, and ship 3x faster with open-weights AI assistance.</p>
        <div class="mt-6 flex justify-center gap-3">
          <button class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20">Start Free Trial ➔</button>
          <button class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium">Watch Demo</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div class="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
          <div class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">⚡</div>
          <h3 class="font-bold text-white text-sm">Fast Kanban</h3>
          <p class="text-xs text-slate-400 mt-1">Drag and drop cards with instant real-time sync across distributed teams.</p>
        </div>
        <div class="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
          <div class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">📊</div>
          <h3 class="font-bold text-white text-sm">Team Metrics</h3>
          <p class="text-xs text-slate-400 mt-1">Automated burndown charts, cycle times, and velocity telemetry.</p>
        </div>
        <div class="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
          <div class="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">🧠</div>
          <h3 class="font-bold text-white text-sm">AI Assistant</h3>
          <p class="text-xs text-slate-400 mt-1">Auto-summarize pull requests, standup notes, and backlog priorities.</p>
        </div>
      </div>
    </div>
  `;

  const handleGenerate = async () => {
    if (!currentImage) return;
    setIsLoading(true);
    try {
      const data = await onRunSketchToCode({
        imageBase64: currentImage,
      });

      if (data) {
        setExplanation(data.text);
        setGeneratedCode(data.extractedCode || data.text);
        setLatency(data.latencyMs);
        setActiveTab('preview');
        // Celebrate with confetti
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      console.error('Sketch to code error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadComponent = () => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GuruGeneratedComponent.tsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Convert React component code into an iframe-friendly HTML document
  const getIframeSrcDoc = (code: string | null) => {
    if (!code) {
      return `<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-slate-900 text-white">${defaultHtmlPreview}</body></html>`;
    }

    // Strip react imports and wrappers if needed, extract JSX or fallback to rendered wrapper
    const cleanJsx = code
      .replace(/import.*?;/g, '')
      .replace(/export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{/, '')
      .replace(/return\s*\(/, '')
      .replace(/\);\s*\}\s*$/, '');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; padding: 1.5rem; background-color: #0b0f19; font-family: system-ui, sans-serif; }
          </style>
        </head>
        <body>
          <div id="preview-root">
            ${cleanJsx.includes('<') ? cleanJsx : defaultHtmlPreview}
          </div>
        </body>
      </html>
    `;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold mb-2">
              <Palette className="w-3.5 h-3.5" /> Focused AI Tool: Creativity Pillar
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Sketch-to-Code: Rapid UI Prototyping
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Turn whiteboard wireframes, napkin drawings, or UI mockups directly into production-grade React + Tailwind components with real-time visual sandbox rendering.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading || !currentImage}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-pink-600/25 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing UI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-pink-200" />
                <span>Transform Sketch into Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Image Uploader */}
      <ImageUploader
        currentImage={currentImage}
        onImageChange={(dataUrl) => onImageChange(dataUrl)}
        selectedCategory="creativity"
      />

      {/* Interactive Code / Preview Playground */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Tab Controls Bar */}
        <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-pink-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Live Sandbox Preview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'code'
                  ? 'bg-pink-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" /> React + Tailwind Code
            </button>
            {explanation && (
              <button
                type="button"
                onClick={() => setActiveTab('breakdown')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'breakdown'
                    ? 'bg-pink-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> UX Rationale
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {latency && (
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/60">
                {latency}ms synthesis
              </span>
            )}
            <button
              type="button"
              onClick={copyCode}
              disabled={!generatedCode}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={downloadComponent}
              disabled={!generatedCode}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export TSX</span>
            </button>
          </div>
        </div>

        {/* Tab Content 1: Live Sandbox Preview */}
        {activeTab === 'preview' && (
          <div className="p-4 bg-slate-950/50">
            <div className="border border-slate-800 rounded-xl overflow-hidden shadow-inner bg-slate-950">
              <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 font-mono text-[11px] text-slate-300">
                    https://guru-prototype.local
                  </span>
                </div>
                <span className="text-[11px] font-mono text-indigo-400">
                  Interactive Tailwind Sandbox
                </span>
              </div>
              <iframe
                title="GURU UI Sandbox Preview"
                srcDoc={getIframeSrcDoc(generatedCode)}
                className="w-full h-[460px] border-none bg-slate-950"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        )}

        {/* Tab Content 2: Clean Code Editor */}
        {activeTab === 'code' && (
          <div className="p-4 bg-slate-950">
            <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto max-h-[500px] border border-slate-800 selection:bg-pink-500/30">
              <code>{generatedCode || '// Select a sketch and click "Transform Sketch into Code" to view generated React + Tailwind output.'}</code>
            </pre>
          </div>
        )}

        {/* Tab Content 3: UX Rationale */}
        {activeTab === 'breakdown' && explanation && (
          <div className="p-6 bg-slate-950 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
            {explanation}
          </div>
        )}
      </div>
    </div>
  );
};
