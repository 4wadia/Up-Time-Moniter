import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';
import { X, User as UserIcon, Mail, Save, Camera } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (updatedUser: User) => void;
}

export const ProfileModal: React.FC<Props> = ({ isOpen, onClose, user, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = () => {
    if (user) {
        // Generate initials from new name
        const initials = name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

        onSave({
            ...user,
            name,
            email,
            initials: initials || 'UR'
        });
        onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && user && (
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
            className="relative w-full max-w-md bg-linen border border-dust-grey rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dust-grey/50 bg-parchment/50">
              <h2 className="text-xl font-semibold text-foreground">Edit Profile</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-dust-grey/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
                {/* Avatar Placeholder */}
                <div className="flex flex-col items-center gap-3 mb-6">
                    <div className="w-24 h-24 rounded-full bg-almond-silk/30 border-2 border-dashed border-dust-grey flex items-center justify-center relative group cursor-pointer hover:border-almond-silk transition-colors">
                        <span className="text-2xl font-bold text-foreground opacity-50">{user.initials}</span>
                        <div className="absolute inset-0 bg-black/5 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Camera className="w-6 h-6 text-foreground/70" />
                        </div>
                    </div>
                    <p className="text-xs text-foreground-muted">Click to upload new picture</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-parchment border border-dust-grey rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:border-almond-silk focus:ring-1 focus:ring-almond-silk transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-parchment border border-dust-grey rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:border-almond-silk focus:ring-1 focus:ring-almond-silk transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-parchment/50 p-4 border-t border-dust-grey/50 flex justify-end gap-3">
                <button 
                    onClick={onClose} 
                    className="px-4 py-2 bg-transparent text-foreground-muted hover:text-foreground text-sm font-medium transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSave} 
                    className="flex items-center gap-2 px-4 py-2 bg-foreground text-white rounded-lg text-sm font-medium hover:bg-stone-700 transition-colors shadow-sm"
                >
                    <Save className="w-4 h-4" /> Save Changes
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};