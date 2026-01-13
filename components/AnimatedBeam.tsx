import React from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../types';

// A simplified version of the "Animated Beam" connecting two points visually
export const AnimatedBeam: React.FC<{
  className?: string;
  active?: boolean;
}> = ({ className, active = true }) => {
  
  return (
    <div className={`relative flex items-center justify-center w-full h-12 overflow-hidden ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 300 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        {/* Base Path */}
        <path
          d="M 20 25 H 280"
          stroke={THEME.dustGrey}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
        
        {/* Animated Beam Particle */}
        {active && (
           <motion.path
             d="M 20 25 H 280"
             stroke={THEME.foreground}
             strokeWidth="3"
             strokeLinecap="round"
             initial={{ pathLength: 0, opacity: 0, x: -100 }}
             animate={{ 
                pathLength: [0, 0.3, 0], 
                opacity: [0, 1, 0],
                x: [0, 0, 0], 
                strokeDasharray: "0 1",
             }}
           />
        )}
        
         {/* Better Beam Effect with Framer Motion */}
         {active && (
          <motion.path
            d="M 20 25 H 280"
            stroke="url(#gradient-beam)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 300, strokeDasharray: "300 300" }}
            animate={{ strokeDashoffset: -300 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear",
              repeatDelay: 0.5 
            }}
          />
         )}

         <defs>
           <linearGradient id="gradient-beam" x1="0%" y1="0%" x2="100%" y2="0%">
             <stop offset="0%" stopColor={THEME.almondSilk} stopOpacity="0" />
             <stop offset="50%" stopColor={THEME.foreground} stopOpacity="1" />
             <stop offset="100%" stopColor={THEME.almondSilk} stopOpacity="0" />
           </linearGradient>
         </defs>
      </svg>
      
      <div className="flex justify-between w-full px-4 relative z-10">
         <div className="w-8 h-8 rounded-full bg-white border-2 border-dust-grey flex items-center justify-center shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
         </div>
         <div className="w-8 h-8 rounded-full bg-white border-2 border-dust-grey flex items-center justify-center shadow-sm">
             <div className="w-2 h-2 rounded-full bg-foreground" />
         </div>
      </div>
    </div>
  );
};

export const MiniBeam: React.FC<{ active: boolean }> = ({ active }) => {
    return (
        <div className="w-24 h-6 relative flex items-center">
             <svg className="w-full h-full absolute top-0 left-0">
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke={THEME.dustGrey} strokeWidth="1" strokeDasharray="2 2" />
                {active && (
                    <motion.line 
                        x1="0" y1="50%" x2="40%" y2="50%" 
                        stroke={THEME.foreground} 
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                )}
             </svg>
        </div>
    )
}