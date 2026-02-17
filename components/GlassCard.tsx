
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = true }) => {
  return (
    <div className={`
      relative overflow-hidden
      bg-slate-900/40 backdrop-blur-xl
      border border-slate-800/50 rounded-2xl
      ${hoverEffect ? 'hover:border-cyan-500/50 transition-all duration-500 group' : ''}
      ${className}
    `}>
      {/* Subtle glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
