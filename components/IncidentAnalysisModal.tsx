import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IncidentAnalysis } from '../types';
import { X, AlertTriangle, CheckCircle, Clock, Wrench } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  analysis: IncidentAnalysis | null;
  loading: boolean;
}

export const IncidentAnalysisModal: React.FC<Props> = ({ isOpen, onClose, analysis, loading }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-800/20 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-linen border border-dust-grey rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dust-grey/50 bg-parchment/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-powder-petal rounded-lg">
                    <Wrench className="w-5 h-5 text-foreground" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-foreground">AI Incident Analysis</h2>
                    <p className="text-xs text-foreground-muted">Powered by Gemini 2.5 Flash</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-dust-grey/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 min-h-[300px]">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 py-12">
                   <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full border-4 border-dust-grey opacity-30"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-t-almond-silk animate-spin"></div>
                   </div>
                   <p className="text-foreground-muted animate-pulse">Analyzing logs & diagnostic data...</p>
                </div>
              ) : analysis ? (
                <div className="space-y-6">
                  {/* Root Cause Section */}
                  <div className="bg-parchment rounded-xl p-4 border border-dust-grey/30">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        Root Cause
                    </h3>
                    <p className="text-foreground leading-relaxed">{analysis.rootCause}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-parchment rounded-xl p-4 border border-dust-grey/30">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            Est. Resolution
                        </h3>
                        <p className="text-foreground font-medium">{analysis.estimatedResolutionTime}</p>
                     </div>
                     <div className="bg-parchment rounded-xl p-4 border border-dust-grey/30">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            Impact
                        </h3>
                        <p className="text-foreground text-sm">{analysis.impact}</p>
                     </div>
                  </div>

                  {/* Fix Section */}
                  <div className="bg-white/50 rounded-xl p-4 border border-green-200/50">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Suggested Remediation
                    </h3>
                    <div className="prose prose-sm text-foreground">
                        <p>{analysis.suggestedFix}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-red-400">
                    Failed to load analysis.
                </div>
              )}
            </div>
            
            <div className="bg-parchment/50 p-4 border-t border-dust-grey/50 flex justify-end">
                <button onClick={onClose} className="px-4 py-2 bg-white border border-dust-grey rounded-lg text-sm font-medium hover:bg-linen transition-colors">
                    Close Report
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};