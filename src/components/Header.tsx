import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Palette, 
  Briefcase, 
  Globe2, 
  Terminal, 
  Layers, 
  Info, 
  Cpu, 
  CheckCircle2 
} from 'lucide-react';
import { AppTab } from '../types';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onOpenArchitectureModal: () => void;
  apiStatus: {
    status: string;
    hasApiKey: boolean;
  } | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenArchitectureModal,
  apiStatus,
}) => {
  const tabs = [
    { id: 'overview' as AppTab, label: 'Challenge Brief', icon: Info, badge: 'PS Core' },
    { id: 'learning' as AppTab, label: 'Learning Tutor', icon: BookOpen },
    { id: 'creativity' as AppTab, label: 'Sketch-to-Code', icon: Palette },
    { id: 'productivity' as AppTab, label: 'Document Intel', icon: Briefcase },
    { id: 'community' as AppTab, label: 'EcoField & Assist', icon: Globe2 },
    { id: 'playground' as AppTab, label: 'Rapid Lab', icon: Terminal, badge: 'SDK' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  GURU Studio
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/80 font-semibold tracking-wide">
                  DeepMind Open Weights
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Multimodal AI Suite for Learning, Creativity, Productivity & Community
              </p>
            </div>
          </div>

          {/* Right Status & Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenArchitectureModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>GURU Specs</span>
            </button>

            {/* API Status Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <span className={`w-2 h-2 rounded-full ${apiStatus?.hasApiKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-mono text-[11px] text-slate-300">
                {apiStatus?.hasApiKey ? 'Gemini API Live' : 'Initializing...'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-900">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-1 ring-indigo-400/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                      isActive
                        ? 'bg-indigo-700/80 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
