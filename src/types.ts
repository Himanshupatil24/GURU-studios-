export type AppTab = 
  | 'overview' 
  | 'learning' 
  | 'creativity' 
  | 'productivity' 
  | 'community' 
  | 'playground';

export interface SampleImage {
  id: string;
  title: string;
  category: 'learning' | 'creativity' | 'productivity' | 'community' | 'challenge';
  description: string;
  dataUrl: string;
  defaultPrompt: string;
  suggestedMode: AppTab;
  tags: string[];
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  prompt: string;
  imageThumbnail?: string;
  outputText: string;
  extractedCode?: string;
  latencyMs: number;
  tokensEstimated?: number;
  mode: AppTab;
  systemInstruction?: string;
}

export interface QuickActionPrompt {
  id: string;
  label: string;
  prompt: string;
  iconName: string;
}
