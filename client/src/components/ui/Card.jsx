import React from 'react';

export default function Card({
  children,
  className = '',
  hoverEffect = false,
  glow = false,
  onClick,
  as: Component = 'div',
  ...props
}) {
  return (
    <Component
      onClick={onClick}
      className={`bg-dark-850/90 border border-slate-800/80 rounded-xl p-5 backdrop-blur-sm transition-all duration-200 ${
        hoverEffect
          ? 'hover:border-slate-750 hover:bg-dark-850 hover:shadow-lg hover:shadow-black/20'
          : ''
      } ${
        glow ? 'border-emerald-500/30 shadow-glow-emerald' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
