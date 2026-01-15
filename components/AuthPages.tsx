import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, Lock, Mail, User as UserIcon } from 'lucide-react';
import { PageView } from '../types';
import { InteractiveHoverButton } from './ui/InteractiveHoverButton';

interface AuthProps {
  view: 'signin' | 'signup';
  onNavigate: (view: PageView) => void;
  onAuth: () => void;
}

export const AuthPages: React.FC<AuthProps> = ({ view, onNavigate, onAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onAuth();
    }, 1500);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    // Simulate Google Auth
    setTimeout(() => {
      setIsLoading(false);
      onAuth();
    }, 1500);
  };

  const isSignIn = view === 'signin';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-parchment relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-almond-silk/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-dust-grey/20 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-linen shadow-card rounded-2xl overflow-hidden relative z-10"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-foreground text-parchment rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-foreground mb-2">
            {isSignIn ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-center text-foreground-muted text-sm mb-8">
            {isSignIn 
              ? 'Enter your credentials to access the dashboard' 
              : 'Start monitoring your services in minutes'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isSignIn && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-parchment border border-dust-grey rounded-lg py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-foreground-muted focus:ring-1 focus:ring-foreground-muted transition-all placeholder:text-foreground-muted/50"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-parchment border border-dust-grey rounded-lg py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-foreground-muted focus:ring-1 focus:ring-foreground-muted transition-all placeholder:text-foreground-muted/50"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-parchment border border-dust-grey rounded-lg py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-foreground-muted focus:ring-1 focus:ring-foreground-muted transition-all placeholder:text-foreground-muted/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <InteractiveHoverButton 
              type="submit" 
              loading={isLoading}
              className="mt-6 shadow-soft"
            >
              {isSignIn ? 'Sign In' : 'Create Account'}
            </InteractiveHoverButton>
          </form>

          <div className="my-6 flex items-center gap-3">
             <div className="h-px bg-dust-grey flex-1" />
             <span className="text-xs text-foreground-muted uppercase tracking-wider">Or continue with</span>
             <div className="h-px bg-dust-grey flex-1" />
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full bg-parchment border border-dust-grey hover:bg-powder-petal text-foreground py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
              Google
          </button>

          <div className="mt-6 text-center text-sm text-foreground-muted">
            {isSignIn ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => onNavigate(isSignIn ? 'signup' : 'signin')}
              className="text-foreground font-semibold hover:underline"
            >
              {isSignIn ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
        
        {/* Footer decoration */}
        <div className="bg-parchment p-4 border-t border-dust-grey text-center">
            <p className="text-xs text-foreground-muted">Protected by Sentinel Security</p>
        </div>
      </motion.div>
    </div>
  );
};