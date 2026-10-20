import React, { useState } from 'react';
import { 
  Terminal, 
  Sliders, 
  Play, 
  Code2, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  FileCode, 
  Zap, 
  Cpu,
  Layers,
  Share2
} from 'lucide-react';
import { ImageUploader } from './ImageUploader';

interface RapidPlaygroundProps {
  currentImage: string | null;
  onImageChange: (dataUrl: string | null, suggestedPrompt?: string) => void;
  onRunMultimodal: (params: {
    prompt: string;
    imageBase64: string;
    systemInstruction?: string;
    temperature?: number;
  }) => Promise<any>;
}

export const RapidPlayground: React.FC<RapidPlaygroundProps> = ({
  currentImage,
  onImageChange,
  onRunMultimodal,
}) => {
  const [prompt, setPrompt] = useState('Analyze this image and provide a comprehensive structured breakdown of all visible objects, text, relationships, and actionable insights.');
  const [systemInstruction, setSystemInstruction] = useState('You are GURU, an open-weights lightweight multimodal assistant powered by Google DeepMind. Provide precise, well-formatted, and high-utility analysis.');
  const [temperature, setTemperature] = useState(0.3);
  const [codeLanguage, setCodeLanguage] = useState<'typescript' | 'python' | 'curl' | 'ollama'>('typescript');

  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  const presets = [
    {
      label: 'Structured JSON Extractor',
      prompt: 'Extract all data from this image and return strictly valid JSON matching this schema: { summary: string, entities: Array<{ name: string, confidence: number }>, tags: string[] }',
      system: 'You are an automated visual data parser. Return JSON output only, no markdown wrapping.',
      temp: 0.1,
    },
    {
      label: 'Creative Visual Critique',
      prompt: 'Evaluate the visual composition, color harmony, typography hierarchy, and emotional impact of this image. Suggest 3 concrete improvements.',
      system: 'You are an award-winning creative art and design director.',
      temp: 0.6,
    },
    {
      label: 'Technical Reverse Engineering',
      prompt: 'Identify the underlying technical architecture, protocols, and data models implied by this visual diagram.',
      system: 'You are a principal systems architect specializing in scalable distributed computing.',
      temp: 0.2,
    },
  ];

  const handleRun = async () => {
    if (!currentImage && !prompt) return;
    setIsLoading(true);
    setOutput(null);

    try {
      const res = await onRunMultimodal({
        prompt,
        imageBase64: currentImage || '',
        systemInstruction,
        temperature,
      });

      if (res && res.text) {
        setOutput(res.text);
        setLatency(res.latencyMs || null);
      }
    } catch (err: any) {
      console.error(err);
      setOutput('Error executing playground inference. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  const getExportCode = () => {
    switch (codeLanguage) {
      case 'typescript':
        return `// Rapid Prototype: GURU via @google/genai TypeScript SDK
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' }
  }
});

async function runGuruMultimodal() {
  const imagePart = {
    inlineData: {
      mimeType: "image/jpeg",
      data: "BASE64_IMAGE_DATA_HERE"
    }
  };

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash", // GURU multimodal engine
    contents: {
      parts: [imagePart, { text: ${JSON.stringify(prompt)} }]
    },
    config: {
      systemInstruction: ${JSON.stringify(systemInstruction)},
      temperature: ${temperature}
    }
  });

  console.log(response.text);
}

runGuruMultimodal();`;

      case 'python':
        return `# Rapid Prototype: GURU via google-genai Python SDK
from google import genai
from google.genai import types

client = genai.Client()

def analyze_multimodal():
    with open("image.jpg", "rb") as f:
        image_bytes = f.read()

    response = client.models.generate_content(
        model="gemini-3.8-flash",
        contents=[
            types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
            ${JSON.stringify(prompt)}
        ],
        config=types.GenerateContentConfig(
            system_instruction=${JSON.stringify(systemInstruction)},
            temperature=${temperature}
        )
    )
    print(response.text)

if __name__ == "__main__":
    analyze_multimodal()`;

      case 'curl':
        return `# Rapid Prototype: GURU REST API
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$GEMINI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "systemInstruction": {
      "parts": [{ "text": ${JSON.stringify(systemInstruction)} }]
    },
    "contents": [{
      "parts": [
        { "inlineData": { "mimeType": "image/jpeg", "data": "BASE64_DATA" } },
        { "text": ${JSON.stringify(prompt)} }
      ]
    }],
    "generationConfig": {
      "temperature": ${temperature}
    }
  }'`;

      case 'ollama':
        return `# GURU Open Weights Local Edge Deployment
# 1. Pull the model weights
ollama pull guru:latest

# 2. Run local interactive inference
ollama run guru:latest "${prompt}"

# 3. Serve with OpenAI-compatible API
ollama serve`;
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getExportCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
              <Terminal className="w-3.5 h-3.5" /> Rapid Prototyping Pillar
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              GURU Multimodal Prototyping Lab
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Tweak hyperparameters, test multimodal vision prompts, inspect sub-second latency telemetry, and export ready-to-ship SDK code for Python, TypeScript, and edge runtimes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/70 border border-indigo-800/80 px-2.5 py-1 rounded-lg">
              Low Latency • Edge Ready
            </span>
          </div>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Rapid Presets:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setPrompt(p.prompt);
              setSystemInstruction(p.system);
              setTemperature(p.temp);
            }}
            className="px-3 py-1.5 rounded-xl text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 whitespace-nowrap transition-all"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Multimodal Image Input */}
      <ImageUploader
        currentImage={currentImage}
        onImageChange={(dataUrl) => onImageChange(dataUrl)}
      />

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Prompt & System Tuning */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Prompt / User Query:</span>
                <span className="text-[10px] text-slate-500 font-mono">Multimodal Part</span>
              </label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask GURU anything about the visual..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>System Instruction:</span>
                <span className="text-[10px] text-slate-500 font-mono">Role & Persona</span>
              </label>
              <textarea
                rows={2}
                value={systemInstruction}
                onChange={(e) => setSystemInstruction(e.target.value)}
                placeholder="Define role instructions..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-mono"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
              <div className="w-full sm:w-64 space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Temperature:
                  </span>
                  <span className="font-mono text-indigo-400">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={handleRun}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50 whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-200" />
                    <span>Inferring...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current text-cyan-300" />
                    <span>Run Inference</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Inference Output Box */}
          {output && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">GURU Output</span>
                  {latency && (
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/60">
                      {latency}ms TTFT
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={copyOutput}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  {copiedOutput ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Output</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-5 text-xs sm:text-sm text-slate-200 font-sans whitespace-pre-wrap leading-relaxed max-h-[450px] overflow-y-auto selection:bg-indigo-500/30">
                {output}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Code Exporter & Deployment Hub */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">1-Click Prototyping Code</span>
              </div>
              <button
                type="button"
                onClick={copyCode}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 p-2 bg-slate-950/80 border-b border-slate-800/80">
              <button
                type="button"
                onClick={() => setCodeLanguage('typescript')}
                className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-all ${
                  codeLanguage === 'typescript'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                TypeScript
              </button>
              <button
                type="button"
                onClick={() => setCodeLanguage('python')}
                className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-all ${
                  codeLanguage === 'python'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Python SDK
              </button>
              <button
                type="button"
                onClick={() => setCodeLanguage('curl')}
                className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-all ${
                  codeLanguage === 'curl'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                cURL REST
              </button>
              <button
                type="button"
                onClick={() => setCodeLanguage('ollama')}
                className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-all ${
                  codeLanguage === 'ollama'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Ollama Local
              </button>
            </div>

            <pre className="p-4 bg-slate-950 text-slate-300 text-[11px] font-mono overflow-x-auto max-h-[360px] selection:bg-indigo-500/30">
              <code>{getExportCode()}</code>
            </pre>
          </div>

          {/* Open Weights Deployment Matrix */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              GURU Deployment Versatility
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block">Cloud API</span>
                <span className="font-semibold text-emerald-400">Gemini API / Vertex AI</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block">Edge & Local</span>
                <span className="font-semibold text-indigo-400">GGUF / Ollama / ONNX</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block">Quantization</span>
                <span className="font-semibold text-amber-400">INT4, INT8, FP8, BF16</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block">Memory Footprint</span>
                <span className="font-semibold text-cyan-400">&lt; 3.2 GB RAM (Edge)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
