import React, { useState } from 'react';
import { 
  Globe2, 
  Sprout, 
  Volume2, 
  Apple, 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check, 
  Play, 
  Square,
  VolumeX,
  HeartHandshake
} from 'lucide-react';
import { ImageUploader } from './ImageUploader';

interface CommunityAssistantProps {
  currentImage: string | null;
  onImageChange: (dataUrl: string | null, suggestedPrompt?: string) => void;
  onRunMultimodal: (params: {
    prompt: string;
    imageBase64: string;
    systemInstruction?: string;
    temperature?: number;
  }) => Promise<any>;
}

export const CommunityAssistant: React.FC<CommunityAssistantProps> = ({
  currentImage,
  onImageChange,
  onRunMultimodal,
}) => {
  const [utilityDomain, setUtilityDomain] = useState<'agriculture' | 'accessibility' | 'nutrition'>('agriculture');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const getSystemConfig = () => {
    switch (utilityDomain) {
      case 'agriculture':
        return {
          instruction: `You are an expert Agricultural Agronomist and Plant Pathologist using GURU.
Analyze this leaf or crop photo:
1. Plant & Crop Identification (common and scientific name).
2. Diagnostic Findings (identify disease symptoms, e.g., Early Blight, Powdery Mildew, Chlorosis, or Pest Damage).
3. Severity Assessment (Mild, Moderate, Severe).
4. Immediate Low-Cost Organic Remediation (accessible for local smallholder farmers, such as neem oil, baking soda wash, compost tea, or pruning infected foliage).
5. Preventative Field Management (irrigation practices, crop rotation, soil drainage).
Use empathetic, clear language accessible to farming communities.`,
          prompt: `Diagnose this plant leaf for crop diseases, explain symptoms, and provide organic treatment advice for farmers.`
        };
      case 'accessibility':
        return {
          instruction: `You are an Accessibility and Assistive Vision Companion powered by GURU.
Generate a rich, empathetic, and clear audio-friendly scene description for a visually impaired user:
1. One-Sentence Immediate Orientation: What is right in front of the viewer.
2. Spatial Layout & Obstacles: Clock-position guide (e.g., at 12 o'clock, 2 o'clock) of objects, doors, steps, or hazards.
3. Text & Signs: Read any visible signs, labels, or numbers verbatim.
4. Lighting & Ambience: Describe light direction and overall mood.
Keep tone calm, supportive, and descriptive.`,
          prompt: `Provide an audio-friendly descriptive scene narration for someone who is visually impaired.`
        };
      case 'nutrition':
        return {
          instruction: `You are a Community Nutritionist and Allergen Safety Advisor using GURU.
Inspect this food meal or ingredient packaging:
1. Identified Foods & Ingredients.
2. Estimated Macronutrient Breakdown (Protein, Carbs, Healthy Fats, Fiber).
3. Allergen Alert (highlight common allergens: peanuts, tree nuts, dairy, soy, gluten, shellfish, eggs).
4. Healthier Substitutions or Dietary Balancing Tips for family meals.`,
          prompt: `Analyze this meal or food item for nutrition, ingredients, and allergen warnings.`
        };
    }
  };

  const handleAnalyze = async () => {
    if (!currentImage) return;
    setIsLoading(true);
    setResult(null);
    stopAudio();

    const { instruction, prompt } = getSystemConfig();

    try {
      const res = await onRunMultimodal({
        prompt,
        imageBase64: currentImage,
        systemInstruction: instruction,
        temperature: 0.2,
      });

      if (res && res.text) {
        setResult(res.text);
        setLatency(res.latencyMs || null);
      }
    } catch (err: any) {
      console.error(err);
      setResult('Failed to complete community diagnosis. Please verify image input.');
    } finally {
      setIsLoading(false);
    }
  };

  // Audio Playback using server TTS or Web Speech fallback
  const playAudioNarration = async () => {
    if (!result) return;
    setAudioError(null);

    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    setIsPlayingAudio(true);

    try {
      // First attempt server-side TTS with gemini-3.8-flash-lite-tts
      const response = await fetch('/api/multimodal/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: result.slice(0, 350), // Narration summary snippet
          voice: 'Kore',
        }),
      });

      const data = await response.json();

      if (data.audioUrl) {
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        audioRef.current.src = data.audioUrl;
        audioRef.current.onended = () => setIsPlayingAudio(false);
        audioRef.current.onerror = () => fallbackWebSpeech();
        await audioRef.current.play();
        return;
      } else {
        fallbackWebSpeech();
      }
    } catch (err) {
      fallbackWebSpeech();
    }
  };

  const fallbackWebSpeech = () => {
    if ('speechSynthesis' in window && result) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(result.slice(0, 400));
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(false);
      setAudioError('Text-to-speech is not supported on this browser.');
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
              <HeartHandshake className="w-3.5 h-3.5" /> Focused AI Tool: Community Pillar
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              EcoField & Assistive Accessibility Lens
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Real-world assistance for local farmers (crop diagnostics & organic care), nutrition awareness, and spatial audio narration for visually impaired users.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setUtilityDomain('agriculture')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                utilityDomain === 'agriculture'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" /> Crop Health
            </button>
            <button
              type="button"
              onClick={() => setUtilityDomain('accessibility')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                utilityDomain === 'accessibility'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" /> Voice Narration
            </button>
            <button
              type="button"
              onClick={() => setUtilityDomain('nutrition')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                utilityDomain === 'nutrition'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Apple className="w-3.5 h-3.5" /> Meal Nutrition
            </button>
          </div>
        </div>
      </div>

      {/* Image Uploader */}
      <ImageUploader
        currentImage={currentImage}
        onImageChange={(dataUrl) => onImageChange(dataUrl)}
        selectedCategory="community"
      />

      {/* Action Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            {utilityDomain === 'agriculture' && <Sprout className="w-4 h-4" />}
            {utilityDomain === 'accessibility' && <Volume2 className="w-4 h-4" />}
            {utilityDomain === 'nutrition' && <Apple className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              {utilityDomain === 'agriculture' && 'Run Crop Pathology & Organic Treatment Analysis'}
              {utilityDomain === 'accessibility' && 'Generate Assistive Spatial Description with TTS'}
              {utilityDomain === 'nutrition' && 'Screen Ingredients for Allergens & Nutrition'}
            </h4>
            <p className="text-[11px] text-slate-400">
              Community-focused open intelligence with real-world accessibility
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={isLoading || !currentImage}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 whitespace-nowrap"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-200" />
              <span>Analyzing Specimen...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Diagnose with GURU</span>
            </>
          )}
        </button>
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-slate-200">
                GURU Community Diagnosis ({utilityDomain.toUpperCase()})
              </span>
              {latency && (
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/60">
                  {latency}ms
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={playAudioNarration}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                  isPlayingAudio
                    ? 'bg-rose-600 text-white shadow animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <Square className="w-3.5 h-3.5" />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Listen Aloud (TTS)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={copyResult}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-6 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap selection:bg-emerald-500/30">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};
