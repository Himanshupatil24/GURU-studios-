import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Palette, 
  Briefcase, 
  Globe2, 
  Terminal, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Layers,
  Flame,
  Code
} from 'lucide-react';
import { AppTab } from '../types';

interface OverviewSectionProps {
  onNavigate: (tab: AppTab) => void;
  onAnalyzeChallengeImage: () => void;
  isAnalyzing: boolean;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  onNavigate,
  onAnalyzeChallengeImage,
  isAnalyzing,
}) => {
  return (
    <div className="space-y-8">
      {/* Hero Problem Statement Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-900/40 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Google DeepMind Challenge Submission: Best Use of GURU
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Lightweight Intelligence,{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              Unlimited Multimodal Impact
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            Google DeepMind challenged developers: <em>“It’s time to see how much you can build with a lightweight, open model. GURU packs multimodal intelligence into an open-weights model that you can access through the Gemini API. So, what can GURU bring to your project?”</em>
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onAnalyzeChallengeImage}
              disabled={isAnalyzing}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>{isAnalyzing ? 'Analyzing Challenge Brief...' : 'Audit Official Challenge Brief with GURU'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('creativity')}
              className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Palette className="w-4 h-4 text-pink-400" />
              <span>Try Sketch-to-Code Prototype</span>
            </button>
          </div>
        </div>
      </div>

      {/* The 3 Core Pillars Defined in Problem Statement */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" /> The 3 Pillars of the Problem Statement
            </h2>
            <p className="text-xs text-slate-400">
              Direct implementation mapping for Google DeepMind’s evaluation criteria
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/60 transition-all hover:shadow-xl group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
              Pillar 1
            </span>
            <h3 className="text-base font-bold text-white mt-1">
              Multimodal Experience
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Seamlessly integrates text and visuals. Users can upload images, paste diagrams, use a live camera, or draw hand sketches on the interactive canvas. GURU interprets visual geometry, equations, layouts, and organic biology.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Camera • SVG • Whiteboard</span>
              <button
                type="button"
                onClick={() => onNavigate('learning')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/60 transition-all hover:shadow-xl group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Pillar 2
            </span>
            <h3 className="text-base font-bold text-white mt-1">
              Focused AI Tools
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Provides dedicated, task-specific engines across all 4 target domains:
              <strong> Learning</strong> (STEM tutor),
              <strong> Creativity</strong> (Sketch-to-Code generator),
              <strong> Productivity</strong> (Architecture & document intel), and
              <strong> Community</strong> (Agri-disease & accessibility audio).
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">4 Tailored Suites</span>
              <button
                type="button"
                onClick={() => onNavigate('creativity')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                View Tools <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/60 transition-all hover:shadow-xl group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Code className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Pillar 3
            </span>
            <h3 className="text-base font-bold text-white mt-1">
              Rapid Prototyping
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Empowers developers to move immediately from an idea to working code. Features a live Playground with system instruction tuning, token streaming, sub-second latency telemetry, and 1-click SDK export in Python, TypeScript, and cURL.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Export TS/Python/cURL</span>
              <button
                type="button"
                onClick={() => onNavigate('playground')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                Launch Lab <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tool Suite Showcase Grid */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">
          Explore the GURU Tool Suite
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tool 1 */}
          <button
            type="button"
            onClick={() => onNavigate('learning')}
            className="text-left bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-indigo-500 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                Visual Tutor & Solver
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Deconstructs physics formulas, calculus graphs, geometry, and chemistry from diagrams into step-by-step guides.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-indigo-400 gap-1">
              Launch Tutor <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Tool 2 */}
          <button
            type="button"
            onClick={() => onNavigate('creativity')}
            className="text-left bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-pink-500 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-3">
                <Palette className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                Sketch-to-Code
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Converts whiteboard wireframes or napkin sketches into functional React + Tailwind components with live preview.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-pink-400 gap-1">
              Convert Sketch <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Tool 3 */}
          <button
            type="button"
            onClick={() => onNavigate('productivity')}
            className="text-left bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-amber-500 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <Briefcase className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Architecture & Data Intel
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Audits cloud architectures for SPOFs, extracts complex tabular data, and parses receipts into clean structured JSON.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-amber-400 gap-1">
              Audit Systems <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Tool 4 */}
          <button
            type="button"
            onClick={() => onNavigate('community')}
            className="text-left bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <Globe2 className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                EcoField & Accessibility
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Diagnoses crop plant diseases for farmers and generates audio-narrated visual assistance for the visually impaired.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-emerald-400 gap-1">
              Explore EcoField <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
