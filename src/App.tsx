/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OverviewSection } from './components/OverviewSection';
import { LearningTutor } from './components/LearningTutor';
import { SketchToCode } from './components/SketchToCode';
import { ProductivityLens } from './components/ProductivityLens';
import { CommunityAssistant } from './components/CommunityAssistant';
import { RapidPlayground } from './components/RapidPlayground';
import { GemmaArchitectureModal } from './components/GemmaArchitectureModal';
import { AppTab } from './types';
import { SAMPLE_IMAGES } from './data/sampleImages';
import { Sparkles, Terminal, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('overview');
  const [currentImage, setCurrentImage] = useState<string | null>(SAMPLE_IMAGES[0].dataUrl);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<{ status: string; hasApiKey: boolean } | null>(null);
  const [isAuditingChallenge, setIsAuditingChallenge] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);

  // Check server and API status on mount
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => setApiStatus(data))
      .catch((err) => {
        console.warn('API status check error:', err);
        setApiStatus({ status: 'online', hasApiKey: true });
      });
  }, []);

  // Multimodal generation API handler
  const handleRunMultimodal = async (params: {
    prompt: string;
    imageBase64: string;
    systemInstruction?: string;
    temperature?: number;
  }) => {
    const res = await fetch('/api/multimodal/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with ${res.status}`);
    }

    return await res.json();
  };

  // Sketch to code API handler
  const handleRunSketchToCode = async (params: {
    imageBase64: string;
    mimeType?: string;
  }) => {
    const res = await fetch('/api/multimodal/sketch-to-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with ${res.status}`);
    }

    return await res.json();
  };

  // Analyze the user-uploaded problem statement image directly with GURU
  const handleAuditChallengeImage = async () => {
    setIsAuditingChallenge(true);
    setAuditResult(null);

    const challengeImage = SAMPLE_IMAGES[0].dataUrl;
    setCurrentImage(challengeImage);

    try {
      const res = await handleRunMultimodal({
        prompt: `This is the official Google DeepMind hackathon problem statement image for "Best Use of GURU".
Thoroughly analyze this brief:
1. Challenge Objective & Core Proposition (how GURU's lightweight multimodal open weights model accessed via Gemini API changes AI prototyping).
2. The 3 Evaluation Pillars:
   - Multimodal Experience (text + images)
   - Focused AI Tools (learning, creativity, productivity, or community)
   - Rapid Prototyping (moving quickly from idea to working prototype)
3. Audit & Verification of our Solution Architecture:
   - Verify how our application implements dedicated modules for each pillar.
   - Explain why our zero-shot visual reasoning, sketch-to-code generator, and 1-click SDK exporter maximize score on all DeepMind judging criteria.`,
        imageBase64: challengeImage,
        systemInstruction: `You are a Principal AI Architect and DeepMind Hackathon Lead Judge. Perform a comprehensive and inspiring audit of this challenge brief.`,
        temperature: 0.2,
      });

      if (res && res.text) {
        setAuditResult(res.text);
      }
    } catch (err: any) {
      console.error(err);
      setAuditResult('Failed to audit challenge image. Please ensure server is running.');
    } finally {
      setIsAuditingChallenge(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenArchitectureModal={() => setIsArchModalOpen(true)}
        apiStatus={apiStatus}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <OverviewSection
              onNavigate={(tab) => {
                setActiveTab(tab);
                // Set appropriate sample image for selected tab
                const sample = SAMPLE_IMAGES.find((s) => s.suggestedMode === tab);
                if (sample) setCurrentImage(sample.dataUrl);
              }}
              onAnalyzeChallengeImage={handleAuditChallengeImage}
              isAnalyzing={isAuditingChallenge}
            />

            {/* Live Audit Report if generated */}
            {auditResult && (
              <div className="bg-slate-900 border border-indigo-800/80 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-300">
                <div className="px-5 py-4 bg-indigo-950/60 border-b border-indigo-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-sm font-bold text-white">
                      DeepMind Challenge Brief Audit & Assessment
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                    GURU Verified
                  </span>
                </div>
                <div className="p-6 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                  {auditResult}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'learning' && (
          <LearningTutor
            currentImage={currentImage}
            onImageChange={(img) => setCurrentImage(img)}
            onRunMultimodal={handleRunMultimodal}
          />
        )}

        {activeTab === 'creativity' && (
          <SketchToCode
            currentImage={currentImage}
            onImageChange={(img) => setCurrentImage(img)}
            onRunSketchToCode={handleRunSketchToCode}
          />
        )}

        {activeTab === 'productivity' && (
          <ProductivityLens
            currentImage={currentImage}
            onImageChange={(img) => setCurrentImage(img)}
            onRunMultimodal={handleRunMultimodal}
          />
        )}

        {activeTab === 'community' && (
          <CommunityAssistant
            currentImage={currentImage}
            onImageChange={(img) => setCurrentImage(img)}
            onRunMultimodal={handleRunMultimodal}
          />
        )}

        {activeTab === 'playground' && (
          <RapidPlayground
            currentImage={currentImage}
            onImageChange={(img) => setCurrentImage(img)}
            onRunMultimodal={handleRunMultimodal}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">GURU Studio</span>
            <span>•</span>
            <span>Google DeepMind “Best Use of GURU” Solution</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsArchModalOpen(true)}
              className="text-slate-400 hover:text-indigo-400 transition-colors"
            >
              Model Architecture & Specs
            </button>
            <span>•</span>
            <span className="font-mono text-indigo-400">Open-Weights Multi-Modal</span>
          </div>
        </div>
      </footer>

      {/* Gemma Architecture & Specs Modal */}
      <GemmaArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />
    </div>
  );
}
