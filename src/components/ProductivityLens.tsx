import React, { useState } from 'react';
import { 
  Briefcase, 
  ShieldAlert, 
  FileText, 
  Database, 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check, 
  Download,
  AlertTriangle,
  Server
} from 'lucide-react';
import { ImageUploader } from './ImageUploader';

interface ProductivityLensProps {
  currentImage: string | null;
  onImageChange: (dataUrl: string | null, suggestedPrompt?: string) => void;
  onRunMultimodal: (params: {
    prompt: string;
    imageBase64: string;
    systemInstruction?: string;
    temperature?: number;
  }) => Promise<any>;
}

export const ProductivityLens: React.FC<ProductivityLensProps> = ({
  currentImage,
  onImageChange,
  onRunMultimodal,
}) => {
  const [taskType, setTaskType] = useState<'architecture' | 'receipt' | 'table'>('architecture');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const getPromptAndInstruction = () => {
    switch (taskType) {
      case 'architecture':
        return {
          instruction: `You are a Principal Cloud Infrastructure Architect powered by GURU.
Perform an exhaustive architectural inspection of this system diagram:
1. System Topology Overview (detected components, API gateways, databases, proxies, network boundaries).
2. Critical Single Points of Failure (SPOF) & High-Risk Areas (e.g., un-replicated databases, missing rate limiters, cascading failure points).
3. Latency & Throughput Bottlenecks (synchronous RPC chains, cold caches).
4. Concrete Modernization Recommendations (e.g. event-driven message brokers, read replicas, multi-AZ high availability).
5. Architecture Health Score (0-100) with justification.`,
          prompt: `Analyze this cloud infrastructure diagram. Perform a thorough architecture audit, pinpoint SPOFs and bottlenecks, and provide exact modernization recommendations.`
        };
      case 'receipt':
        return {
          instruction: `You are an automated financial document intelligence engine powered by GURU.
Extract all accounting data from this invoice/receipt image into structured format:
1. Vendor/Merchant Name, Address, Contact.
2. Invoice / Receipt #, Transaction Date & Time, Payment Method.
3. Itemized List of Products/Services (Item Name, Qty, Unit Price, Line Total).
4. Subtotal, Tax Breakdown, Discounts, and Grand Total with Currency Symbol.
5. Anomaly & Fraud Check (mismatched arithmetic, illegible entries).
Output both a clean summary table and a structured JSON schema block.`,
          prompt: `Extract all key data, line items, taxes, currency, and totals from this invoice or receipt image.`
        };
      case 'table':
        return {
          instruction: `You are a visual data digitization and analytics specialist using GURU.
Extract the data table or visual chart from this screenshot:
1. Transcribe the table into clean GitHub-flavored Markdown.
2. Provide the raw JSON representation of all rows and columns.
3. Compute summary statistics (row count, key totals, anomalies).
4. Provide 3 high-impact executive insights derived from the numbers.`,
          prompt: `Digitize this table/chart into Markdown and JSON with key analytical takeaways.`
        };
    }
  };

  const handleExecute = async () => {
    if (!currentImage) return;
    setIsLoading(true);
    setResult(null);

    const { instruction, prompt } = getPromptAndInstruction();

    try {
      const res = await onRunMultimodal({
        prompt,
        imageBase64: currentImage,
        systemInstruction: instruction,
        temperature: 0.1,
      });

      if (res && res.text) {
        setResult(res.text);
        setLatency(res.latencyMs || null);
      }
    } catch (err: any) {
      console.error(err);
      setResult('Failed to analyze document. Please check connection or image format.');
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
              <Briefcase className="w-3.5 h-3.5" /> Focused AI Tool: Productivity Pillar
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Architecture Auditor & Document Intel
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Inspect cloud systems for single points of failure, extract financial tables and invoices into structured JSON, and parse complex technical diagrams with GURU visual reasoning.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setTaskType('architecture')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                taskType === 'architecture'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" /> Architecture Audit
            </button>
            <button
              type="button"
              onClick={() => setTaskType('receipt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                taskType === 'receipt'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Invoice / Receipt
            </button>
            <button
              type="button"
              onClick={() => setTaskType('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                taskType === 'table'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" /> Table Digitizer
            </button>
          </div>
        </div>
      </div>

      {/* Image Uploader */}
      <ImageUploader
        currentImage={currentImage}
        onImageChange={(dataUrl) => onImageChange(dataUrl)}
        selectedCategory="productivity"
      />

      {/* Action Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              {taskType === 'architecture' && 'Execute Cloud Reliability & SPOF Audit'}
              {taskType === 'receipt' && 'Extract Structured Financial JSON & Line Items'}
              {taskType === 'table' && 'Digitize Screenshot Data Table into Markdown / JSON'}
            </h4>
            <p className="text-[11px] text-slate-400">
              Evaluated with zero-shot multimodal intelligence on open weights
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExecute}
          disabled={isLoading || !currentImage}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 whitespace-nowrap"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-amber-200" />
              <span>Analyzing Systems...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Run Intelligence Audit</span>
            </>
          )}
        </button>
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-xs font-bold text-slate-200">
                GURU Audit Report ({taskType.toUpperCase()})
              </span>
              {latency && (
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/60">
                  {latency}ms
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
                  <span>Copy Report</span>
                </>
              )}
            </button>
          </div>
          <div className="p-6 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap selection:bg-amber-500/30">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};
