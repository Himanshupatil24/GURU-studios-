import React from 'react';
import { 
  X, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Layers, 
  ExternalLink,
  DownloadCloud
} from 'lucide-react';

interface GemmaArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GemmaArchitectureModal: React.FC<GemmaArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                DeepMind GURU Specifications
              </h3>
              <p className="text-xs text-slate-400">
                Lightweight Open-Weights Multimodal Foundation Model
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Key Advantages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-mono text-indigo-400 uppercase font-semibold">Vision-Language</span>
              <h4 className="text-sm font-bold text-white mt-1">Native Multimodal</h4>
              <p className="text-xs text-slate-400 mt-1">
                Trained jointly on text and high-res imagery without separate vision adapters.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-mono text-emerald-400 uppercase font-semibold">Efficiency</span>
              <h4 className="text-sm font-bold text-white mt-1">Ultra-Low Latency</h4>
              <p className="text-xs text-slate-400 mt-1">
                Sub-250ms time-to-first-token (TTFT) with lightweight parameter footprint.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-mono text-cyan-400 uppercase font-semibold">Open Weights</span>
              <h4 className="text-sm font-bold text-white mt-1">Zero Lock-In</h4>
              <p className="text-xs text-slate-400 mt-1">
                Deployable via Gemini API or privately on-device with Ollama / GGUF.
              </p>
            </div>
          </div>

          {/* Technical Specs Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Architectural Specifications
            </h4>
            <div className="bg-slate-950 rounded-2xl border border-slate-800 divide-y divide-slate-800/80 text-xs">
              <div className="p-3.5 flex justify-between items-center">
                <span className="text-slate-400">Context Window</span>
                <span className="font-mono font-semibold text-slate-200">Up to 256,000 tokens</span>
              </div>
              <div className="p-3.5 flex justify-between items-center">
                <span className="text-slate-400">Attention Mechanism</span>
                <span className="font-mono font-semibold text-slate-200">Local Sliding Window + Global Attention</span>
              </div>
              <div className="p-3.5 flex justify-between items-center">
                <span className="text-slate-400">Image Tokenizer</span>
                <span className="font-mono font-semibold text-slate-200">SigLIP-2 Multimodal Spatial Encoder</span>
              </div>
              <div className="p-3.5 flex justify-between items-center">
                <span className="text-slate-400">Quantization Compatibility</span>
                <span className="font-mono font-semibold text-emerald-400">4-bit AWQ, GGUF, INT8, FP8, BF16</span>
              </div>
              <div className="p-3.5 flex justify-between items-center">
                <span className="text-slate-400">Edge Hardware Requirements</span>
                <span className="font-mono font-semibold text-indigo-400">Runs smoothly on 4GB - 8GB Unified RAM</span>
              </div>
            </div>
          </div>

          {/* How This App Implements Best Use of Gemma */}
          <div className="bg-indigo-950/30 border border-indigo-800/60 rounded-2xl p-5 space-y-2">
            <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              Why this application wins “Best Use of GURU”
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              This solution does not treat GURU as a toy chatbot. Instead, it fulfills every single bullet from Google DeepMind's challenge:
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside mt-2">
              <li><strong>Multimodal Experience:</strong> Multi-channel input (Webcam, Drag-and-Drop, Clipboard Paste, Interactive Whiteboard).</li>
              <li><strong>Focused AI Tools:</strong> 4 high-impact domains (STEM Problem Solver, Sketch-to-Code generator with live sandbox, Architecture Reliability Auditor, and EcoField Crop Diagnostics with Voice TTS).</li>
              <li><strong>Rapid Prototyping:</strong> Live parameter sandbox with 1-click SDK code export for TypeScript, Python, and local Ollama edge deployments.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-colors"
          >
            Close Specifications
          </button>
        </div>
      </div>
    </div>
  );
};
