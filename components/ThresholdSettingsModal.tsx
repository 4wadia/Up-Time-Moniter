import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Service, Threshold, MetricType, ComparisonOperator } from '../types';
import { X, Plus, Trash2, BellRing, Save } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onSave: (serviceId: string, thresholds: Threshold[]) => void;
}

export const ThresholdSettingsModal: React.FC<Props> = ({ isOpen, onClose, service, onSave }) => {
  const [thresholds, setThresholds] = useState<Threshold[]>([]);
  
  // Sync state when service changes
  React.useEffect(() => {
    if (service) {
      setThresholds(service.thresholds || []);
    }
  }, [service]);

  const handleAddThreshold = () => {
    const newThreshold: Threshold = {
      id: Math.random().toString(36).substr(2, 9),
      metric: MetricType.LATENCY,
      operator: ComparisonOperator.GREATER_THAN,
      value: 500,
      durationMinutes: 5,
      enabled: true
    };
    setThresholds([...thresholds, newThreshold]);
  };

  const handleRemoveThreshold = (id: string) => {
    setThresholds(thresholds.filter(t => t.id !== id));
  };

  const handleUpdateThreshold = (id: string, field: keyof Threshold, value: any) => {
    setThresholds(thresholds.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const handleSave = () => {
    if (service) {
      onSave(service.id, thresholds);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && service && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-linen shadow-card rounded-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dust-grey bg-parchment/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-powder-petal rounded-lg border border-dust-grey">
                    <BellRing className="w-5 h-5 text-foreground" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-foreground">Alert Thresholds</h2>
                    <p className="text-xs text-foreground-muted">Configure alerts for {service.name}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-parchment rounded-full transition-colors text-foreground-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 bg-parchment/30">
              <div className="space-y-3">
                {thresholds.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center justify-center border-2 border-dashed border-dust-grey rounded-xl bg-linen">
                    <BellRing className="w-8 h-8 text-dust-grey mb-3" />
                    <p className="text-foreground font-medium">No thresholds configured</p>
                    <p className="text-sm text-foreground-muted mt-1">Add a rule to get notified when performance degrades.</p>
                  </div>
                ) : (
                  thresholds.map((threshold) => (
                    <div key={threshold.id} className="bg-linen border border-dust-grey rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                        {/* Metric Select */}
                        <div className="flex flex-col gap-1.5">
                           <label className="text-[10px] uppercase font-bold text-foreground-muted tracking-wider">Metric</label>
                           <select 
                             value={threshold.metric}
                             onChange={(e) => handleUpdateThreshold(threshold.id, 'metric', e.target.value)}
                             className="bg-parchment border border-dust-grey rounded-lg text-sm px-3 py-2 text-foreground focus:outline-none focus:border-foreground-muted"
                           >
                             {Object.values(MetricType).map(m => <option key={m} value={m}>{m}</option>)}
                           </select>
                        </div>

                        {/* Operator Select */}
                        <div className="flex flex-col gap-1.5">
                           <label className="text-[10px] uppercase font-bold text-foreground-muted tracking-wider">Condition</label>
                           <select 
                             value={threshold.operator}
                             onChange={(e) => handleUpdateThreshold(threshold.id, 'operator', e.target.value)}
                             className="bg-parchment border border-dust-grey rounded-lg text-sm px-3 py-2 text-foreground focus:outline-none focus:border-foreground-muted"
                           >
                             {Object.values(ComparisonOperator).map(op => <option key={op} value={op}>{op}</option>)}
                           </select>
                        </div>

                        {/* Value Input */}
                        <div className="flex flex-col gap-1.5">
                           <label className="text-[10px] uppercase font-bold text-foreground-muted tracking-wider">Value {threshold.metric === MetricType.LATENCY ? '(ms)' : '(%)'}</label>
                           <input 
                             type="number" 
                             value={threshold.value}
                             onChange={(e) => handleUpdateThreshold(threshold.id, 'value', Number(e.target.value))}
                             className="bg-parchment border border-dust-grey rounded-lg text-sm px-3 py-2 text-foreground focus:outline-none focus:border-foreground-muted"
                           />
                        </div>

                        {/* Duration Input */}
                        <div className="flex flex-col gap-1.5">
                           <label className="text-[10px] uppercase font-bold text-foreground-muted tracking-wider">Duration (min)</label>
                           <input 
                             type="number" 
                             value={threshold.durationMinutes}
                             onChange={(e) => handleUpdateThreshold(threshold.id, 'durationMinutes', Number(e.target.value))}
                             className="bg-parchment border border-dust-grey rounded-lg text-sm px-3 py-2 text-foreground focus:outline-none focus:border-foreground-muted"
                           />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pl-4 md:border-l border-dust-grey/50">
                         <button 
                            onClick={() => handleUpdateThreshold(threshold.id, 'enabled', !threshold.enabled)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${
                                threshold.enabled 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : 'bg-stone-100 text-stone-500 border-stone-200'
                            }`}
                         >
                            {threshold.enabled ? 'ON' : 'OFF'}
                         </button>
                         <button 
                           onClick={() => handleRemoveThreshold(threshold.id)}
                           className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  ))
                )}
                
                <button 
                  onClick={handleAddThreshold}
                  className="w-full py-3 border border-dashed border-dust-grey rounded-xl text-foreground-muted hover:border-foreground-muted hover:text-foreground hover:bg-linen transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" /> Add Threshold Rule
                </button>
              </div>
            </div>
            
            <div className="bg-linen p-4 border-t border-dust-grey flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 bg-transparent text-foreground-muted hover:text-foreground text-sm font-medium transition-colors">
                    Cancel
                </button>
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-foreground text-parchment rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors shadow-sm">
                    <Save className="w-4 h-4" /> Save Changes
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};