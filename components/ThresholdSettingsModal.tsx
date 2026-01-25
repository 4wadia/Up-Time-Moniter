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
            className="absolute inset-0 bg-stone-800/20 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-linen border border-dust-grey rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dust-grey/50 bg-parchment/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-powder-petal rounded-lg">
                    <BellRing className="w-5 h-5 text-foreground" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-foreground">Alert Thresholds</h2>
                    <p className="text-xs text-foreground-muted">Configure alerts for {service.name}</p>
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
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                {thresholds.length === 0 ? (
                  <div className="text-center py-8 text-foreground-muted border-2 border-dashed border-dust-grey rounded-xl">
                    <p>No thresholds configured.</p>
                    <p className="text-sm">Add a rule to get notified when performance degrades.</p>
                  </div>
                ) : (
                  thresholds.map((threshold) => (
                    <div key={threshold.id} className="bg-white/50 border border-dust-grey/50 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
                        {/* Metric Select */}
                        <div className="flex flex-col gap-1">
                           <label className="text-[10px] uppercase font-bold text-foreground-muted tracking-wider">Metric</label>
                           <select 
                             value={threshold.metric}
                             onChange={(e) => handleUpdateThreshold(threshold.id, 'metric', e.target.value)}
                             className="bg-parchment border border-dust-grey rounded-md text-sm px-2 py-1 text-foreground focus:outline-none focus:border-almond-silk"
                           >
                             {Object.values(MetricType).map(m => <option key={m} value={m}>{m}</option>)}
                           </select>
                        </div>

                        {/* Operator Select */}
                        <div className="flex flex-col gap-1">
                           <label className="text-[10px] uppercase font-bold text-foreground-muted tracking-wider">Condition</label>
                           <select 
                             value={threshold.operator}
                             onChange={(e) => handleUpdateThreshold(threshold.id, 'operator', e.target.value)}
                             className="bg-parchment border border-dust-grey rounded-md text-sm px-2 py-1 text-foreground focus:outline-none focus:border-almond-silk"
                           >
                             {Object.values(ComparisonOperator).map(op => <option key={op} value={op}>{op}</option>)}
                           </select>
                        </div>

                        {/* Value Input */}
                        <div className="flex flex-col gap-1">
                           <label className="text-[10px] uppercase font-bold text-foreground-muted tracking-wider">Value {threshold.metric === MetricType.LATENCY ? '(ms)' : '(%)'}</label>
                           <input 
                             type="number" 
                             min="0"
                             value={threshold.value}
                             onChange={(e) => handleUpdateThreshold(threshold.id, 'value', Math.max(0, Number(e.target.value)))}
                             className="bg-parchment border border-dust-grey rounded-md text-sm px-2 py-1 text-foreground focus:outline-none focus:border-almond-silk"
                           />
                        </div>

                        {/* Duration Input */}
                        <div className="flex flex-col gap-1">
                           <label className="text-[10px] uppercase font-bold text-foreground-muted tracking-wider">Duration (min)</label>
                           <input 
                             type="number" 
                             min="0"
                             value={threshold.durationMinutes}
                             onChange={(e) => handleUpdateThreshold(threshold.id, 'durationMinutes', Math.max(0, Number(e.target.value)))}
                             className="bg-parchment border border-dust-grey rounded-md text-sm px-2 py-1 text-foreground focus:outline-none focus:border-almond-silk"
                           />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 border-l border-dust-grey/30 pl-4">
                         <button 
                            onClick={() => handleUpdateThreshold(threshold.id, 'enabled', !threshold.enabled)}
                            className={`text-xs font-bold px-2 py-1 rounded transition-colors ${threshold.enabled ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-500'}`}
                         >
                            {threshold.enabled ? 'ON' : 'OFF'}
                         </button>
                         <button 
                           onClick={() => handleRemoveThreshold(threshold.id)}
                           className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  ))
                )}
                
                <button 
                  onClick={handleAddThreshold}
                  className="w-full py-3 border-2 border-dashed border-dust-grey rounded-xl text-foreground-muted hover:border-almond-silk hover:text-foreground hover:bg-linen/50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" /> Add Threshold Rule
                </button>
              </div>
            </div>
            
            <div className="bg-parchment/50 p-4 border-t border-dust-grey/50 flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 bg-transparent text-foreground-muted hover:text-foreground text-sm font-medium transition-colors">
                    Cancel
                </button>
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-foreground text-white rounded-lg text-sm font-medium hover:bg-stone-700 transition-colors shadow-sm">
                    <Save className="w-4 h-4" /> Save Changes
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};