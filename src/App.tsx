/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Activity, 
  Brain, 
  ChevronRight, 
  ClipboardList, 
  Database, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert,
  Loader2,
  Stethoscope,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { extractFeaturesFromNotes } from './services/geminiService';
import { evaluateSymbolicLogic } from './services/symbolicEngine';
import { DiagnosticResult, ClinicalFeatures } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [notes, setNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!notes.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      // Neural Phase: Extraction
      const features = await extractFeaturesFromNotes(notes);
      
      // Symbolic Phase: Reasoning
      const diagnostic = evaluateSymbolicLogic(features, "Gemini-3-Flash extracted structured clinical features from unstructured clinical notes.");
      
      setResult(diagnostic);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Moderate': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Critical': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">OncoLogic</h1>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Neuro-Symbolic Diagnostic System</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            HIPAA Compliant
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Hybrid AI Engine
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <section className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-slate-800">Clinical Notes</h2>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter patient clinical notes, imaging reports, or biopsy findings here..."
              className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none bg-slate-50/50 text-slate-700 placeholder:text-slate-400"
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !notes.trim()}
              className="w-full mt-4 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Patient Data...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Run Neuro-Symbolic Analysis
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-xs leading-relaxed text-blue-800">
                <strong>System Note:</strong> This tool uses a hybrid approach. 
                The <strong>Neural layer</strong> extracts entities from text, while the 
                <strong>Symbolic layer</strong> applies deterministic medical rules for staging.
              </p>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!result && !isAnalyzing && !error && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-3xl"
              >
                <div className="p-4 bg-slate-100 rounded-full mb-4">
                  <Stethoscope className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700">Awaiting Clinical Data</h3>
                <p className="text-slate-500 max-w-xs mt-2">
                  Input patient notes on the left to begin the diagnostic reasoning process.
                </p>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center space-y-6"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                  <Brain className="w-10 h-10 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-800">Neuro-Symbolic Processing</h3>
                  <p className="text-slate-500 text-sm">Synthesizing neural features with symbolic logic...</p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-4"
              >
                <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
                <div>
                  <h3 className="font-bold text-rose-800">Analysis Error</h3>
                  <p className="text-rose-700 text-sm mt-1">{error}</p>
                </div>
              </motion.div>
            )}

            {result && !isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Summary Card */}
                <div className="glass-card p-8 rounded-3xl border border-slate-200 overflow-hidden relative">
                  <div className={cn(
                    "absolute top-0 right-0 px-6 py-2 rounded-bl-2xl text-xs font-bold uppercase tracking-widest border-b border-l",
                    getRiskColor(result.riskLevel)
                  )}>
                    {result.riskLevel} Risk
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
                    <div>
                      <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Diagnostic Outcome</span>
                      <h2 className="text-5xl font-black text-slate-900 mt-1">{result.stage}</h2>
                    </div>
                    <div className="flex-1 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-sm font-medium text-slate-600 italic">
                        "{result.recommendation}"
                      </p>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Tumor Size</span>
                      <p className="text-lg font-bold text-slate-800">{result.features.tumorSizeMm ?? 'N/A'} mm</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Nodal Inv.</span>
                      <p className="text-lg font-bold text-slate-800">{result.features.lymphNodeInvolvement}</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Metastasis</span>
                      <p className="text-lg font-bold text-slate-800">{result.features.metastasis}</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Biopsy</span>
                      <p className={cn(
                        "text-lg font-bold",
                        result.features.biopsyResult === 'Malignant' ? 'text-rose-600' : 'text-emerald-600'
                      )}>{result.features.biopsyResult}</p>
                    </div>
                  </div>
                </div>

                {/* Reasoning Trace */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-2">
                    <Database className="w-4 h-4 text-slate-400" />
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Reasoning Trace</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {result.reasoning.map((step, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-4"
                      >
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                            step.type === 'neural' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'
                          )}>
                            {step.type === 'neural' ? <Brain className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                          {idx !== result.reasoning.length - 1 && (
                            <div className="w-px h-full bg-slate-200 my-1" />
                          )}
                        </div>
                        <div className="pb-6">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-slate-800">{step.description}</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-mono">
                              {(step.confidence * 100).toFixed(0)}% Conf.
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {step.evidence}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Biomarkers & Symptoms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card p-6 rounded-2xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ClipboardList className="w-3 h-3" />
                      Biomarkers
                    </h4>
                    <div className="space-y-2">
                      {result.features.biomarkers.length > 0 ? result.features.biomarkers.map((b, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="text-sm font-medium text-slate-700">{b.name}</span>
                          <span className={cn(
                            "text-xs font-bold px-2 py-0.5 rounded-full",
                            b.status === 'Positive' || b.status === 'Abnormal' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                          )}>
                            {b.value}
                          </span>
                        </div>
                      )) : (
                        <p className="text-sm text-slate-400 italic">No biomarkers identified.</p>
                      )}
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-2xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3" />
                      Clinical Symptoms
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.features.symptoms.length > 0 ? result.features.symptoms.map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                          {s}
                        </span>
                      )) : (
                        <p className="text-sm text-slate-400 italic">No symptoms recorded.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
      
      <footer className="mt-20 pt-8 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400 font-medium">
          &copy; 2026 OncoLogic Diagnostic Systems. For clinical decision support only. 
          Final diagnosis must be confirmed by a qualified medical professional.
        </p>
      </footer>
    </div>
  );
}
