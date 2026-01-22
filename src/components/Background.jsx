import React from 'react';

export const Background = () => {
  return (
    <div className='fixed inset-0 -z-10 bg-brand-bg overflow-hidden'>
      {/* Animated ambient orbs */}
      <div className='absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse' />
      <div className='absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[100px]' />

      {/* Subtle grid pattern */}
      <div
        className='absolute inset-0 opacity-[0.03] pointer-events-none'
        style={{
          backgroundImage: 'radial-gradient(white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating particles decoration */}
      <div className='absolute top-[10%] left-[20%] w-1 h-1 bg-brand-primary rounded-full animate-pulse shadow-[0_0_10px_#8b5cf6]' />
      <div className='absolute top-[40%] left-[80%] w-1.5 h-1.5 bg-brand-secondary rounded-full animate-bounce shadow-[0_0_10px_#06b6d4]' />
      <div className='absolute top-[70%] left-[15%] w-1 h-1 bg-brand-accent rounded-full animate-pulse shadow-[0_0_10px_#f43f5e]' />
    </div>
  );
};
