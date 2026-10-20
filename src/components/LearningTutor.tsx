import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Lightbulb, 
  CheckCircle, 
  Sparkles, 
  GraduationCap, 
  ArrowRight, 
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { ImageUploader } from './ImageUploader';

interface LearningTutorProps {
  currentImage: string | null;
  onImageChange: (dataUrl: string | null, suggestedPrompt?: string) => void;
  onRunMultimodal: (params: {
    prompt: string;
    imageBase64: string;
    systemInstruction?: string;
    temperature?: number;
  }) => Promise<any>;
}

export const LearningTutor: React.FC<LearningTutorProps> = ({
  currentImage,
  onImageChange,
  onRunMultimodal,
}) => {
  const [learningMode, setLearningMode] = useState<'step-by-step' | 'socratic' | 'concept' | 'quiz'>('step-by-step');
  const [customQuestion, setCustomQuestion] = useState(
    'Solve this projectile motion problem step-by-step. Show all kinematic equations for time of flight, maximum height H_max, and horizontal range R.'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const getSystemInstruction = () => {
    switch (learningMode) {
      case 'step-by-step':
        return `You are an elite STEM educator and tutor powered by GURU. 
Analyze the provided visual diagram/problem thoroughly.
Provide:
1. Executive Problem Summary (Identified given values, variables, and target unknowns).
2. Governing Scientific/Mathematical Principles & Formulas.
3. Detailed Step-by-Step Derivation & Calculations (show arithmetic clearly).
4. Final Answer Box with correct units and significant figures.
5. Verification / Sanity Check (why this result makes physical sense).`;
      case 'socratic':
        return `You are a Socratic tutor using GURU. DO NOT give the final numeric answer directly.
Instead:
1. Identify what the student should notice first about the visual diagram.
2. Ask 2-3 thought-provoking guiding questions to steer them toward the right formula.
3. Provide one gentle hint about the next logical step.
Encourage the student warmly!`;
      case 'concept':
        return `You are a science communicator. Explain the core concept represented in this visual image to a curious student.
Use an intuitive real-world analogy, explain why this concept matters in technology/daily life, and highlight common misconceptions students have.`;
      case 'quiz':
        return `Based on the scientific or mathematical problem in this visual image, generate 3 follow-up multiple-choice questions (with options A, B, C, D) of varying difficulty (Easy, Medium, Hard). Provide hidden answer keys and explanations at the very end.`;
    }
  };

  const handleSolve = async () => {
    if (!currentImage) return;
    setIsLoading(true);
    setResult(null);
    try {
      const promptText = customQuestion || 'Analyze and solve this educational diagram.';
      const res = await onRunMultimodal({
        prompt: promptText,
        imageBase64: currentImage,
        systemInstruction: getSystemInstruction(),
        temperature: learningMode === 'socratic' ? 0.7 : 0.2,
      });
      if (res && res.text) {
        setResult(res.text);
        setLatency(res.latencyMs || null);
      }
    } catch (err: any) {
      console.error(err);
      setResult('Failed to generate response. Please check your image or connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Pillar Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
              <GraduationCap className="w-3.5 h-3.5" /> Focused AI Tool: Learning Pillar
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Visual Tutor & Step-by-Step Solver
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Upload textbook graphs, geometry problems, physics trajectories, or chemistry reactions. GURU decomposes visual diagrams into structured mathematical solutions and Socratic learning dialogues.
            </p>
          </div>

          {/* Mode Selector Buttons */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setLearningMode('step-by-step')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                learningMode === 'step-by-step'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" /> Step-by-Step
            </button>
            <button
              type="button"
              onClick={() => setLearningMode('socratic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                learningMode === 'socratic'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" /> Socratic Hints
            </button>
            <button
              type="button"
              onClick={() => setLearningMode('concept')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                learningMode === 'concept'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" /> Concept Analogy
            </button>
            <button
              type="button"
              onClick={() => setLearningMode('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                learningMode === 'quiz'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Practice Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Multimodal Image Input */}
      <ImageUploader
        currentImage={currentImage}
        onImageChange={(dataUrl, prompt) => {
          onImageChange(dataUrl);
          if (prompt) setCustomQuestion(prompt);
        }}
        selectedCategory="learning"
      />

      {/* Question Prompt & Execution Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Student Question or Instruction for GURU:
          </label>
          <div className="flex gap-3">
            <textarea
              rows={2}
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="e.g. Find the angle of trajectory, or explain what the reaction intermediate is..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />
            <button
              type="button"
              onClick={handleSolve}
              disabled={isLoading || !currentImage}
              className="px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 whitespace-nowrap min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-200" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Solve with GURU</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Solution Display Area */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span className="text-xs font-bold text-slate-200">
                GURU Multimodal Solution ({learningMode.toUpperCase()})
              </span>
              {latency && (
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/60">
                  {latency}ms latency
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={copyResult}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Solution</span>
                </>
              )}
            </button>
          </div>
          <div className="p-6 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap selection:bg-blue-500/30">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};
