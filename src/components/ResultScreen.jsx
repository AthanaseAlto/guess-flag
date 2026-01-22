import React, { useEffect } from 'react';
import {
  FaTrophy,
  FaRedoAlt,
  FaHome,
  FaShareAlt,
  FaStar,
  FaBolt,
  FaMedal,
  FaVolumeUp,
  FaVolumeMute,
} from 'react-icons/fa';
import { FiTrendingUp } from 'react-icons/fi';
import { motion as Motion } from 'framer-motion';
import { soundManager } from '../utils/sounds';
import confetti from 'canvas-confetti';

export const ResultScreen = ({
  scores,
  total,
  players,
  onRestart,
  onMenu,
  soundEnabled,
  onToggleSound,
}) => {
  const winner =
    players === 2
      ? scores[1] > scores[2]
        ? 1
        : scores[1] < scores[2]
        ? 2
        : 'Tie'
      : null;
  const mainScore =
    players === 1 ? scores[1] : winner === 'Tie' ? scores[1] : scores[winner];
  const percentage = (mainScore / total) * 100;
  const xpGained = mainScore * 10 + (percentage === 100 ? 500 : 0);

  useEffect(() => {
    soundManager.play('finish');
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const getRank = () => {
    if (percentage === 100)
      return { title: 'NEO GOD', icon: FaMedal, color: 'text-brand-primary' };
    if (percentage >= 80)
      return {
        title: 'QUANTUM EXPERT',
        icon: FaStar,
        color: 'text-brand-secondary',
      };
    if (percentage >= 50)
      return {
        title: 'SYSTEM LEARNER',
        icon: FiTrendingUp,
        color: 'text-white',
      };
    return { title: 'ROOKIE PILOT', icon: FaBolt, color: 'text-slate-500' };
  };

  const rank = getRank();

  return (
    <div className='max-w-6xl w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center min-h-screen relative overflow-hidden bg-black'>
      <div className='pointer-events-none absolute inset-0 flex justify-center'>
        <div
          className='w-full max-w-5xl h-[420px] bg-gradient-to-b from-black via-neutral-900 to-black'
          style={{
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          }}
        />
      </div>

      <Motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className='w-full max-w-4xl rounded-[2.5rem] sm:rounded-[4rem] p-8 md:p-20 flex flex-col items-center relative z-10 border border-white/10 bg-neutral-950 shadow-[0_40px_120px_rgba(0,0,0,0.8)]'
      >
        <button
          onClick={onToggleSound}
          className='absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-900 text-slate-300 hover:text-white border border-white/10 transition-all'
          aria-label='Toggle sound'
        >
          {soundEnabled ? (
            <FaVolumeUp size={16} />
          ) : (
            <FaVolumeMute size={16} />
          )}
        </button>
        <div className='relative mb-8 sm:mb-16'>
          <Motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 10 }}
            className='w-32 h-32 sm:w-48 sm:h-48 rounded-full border border-brand-primary/40 bg-neutral-900 flex items-center justify-center p-6 sm:p-8 relative shadow-[0_0_40px_rgba(0,0,0,0.8)]'
          >
            <FaTrophy className='text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] w-16 h-16 sm:w-24 sm:h-24' />
            <Motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className='absolute -inset-3 sm:-inset-4 border border-dashed border-white/20 rounded-full'
            />
          </Motion.div>
        </div>

        <div className='flex flex-col items-center mb-8 sm:mb-16'>
          <div
            className={`flex items-center gap-3 px-6 py-2 rounded-full glass-morphism border-none bg-white/5 mb-4 ${rank.color}`}
          >
            <rank.icon size={16} fill='currentColor' />
            <span className='text-[10px] sm:text-xs font-black tracking-[0.4em] uppercase text-center'>
              {rank.title}
            </span>
          </div>
          <h1 className='text-5xl sm:text-6xl md:text-8xl font-black text-center mb-4 tracking-tighter uppercase leading-none'>
            MISSION <br />
            <span className='text-gradient'>COMPLETE</span>
          </h1>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full mb-8 sm:mb-16'>
          <div className='p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-neutral-900 border border-white/10 flex flex-col items-center'>
            <span className='text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 sm:mb-4'>
              Intel Score
            </span>
            <div className='text-4xl sm:text-5xl font-black text-white'>
              {Math.round(percentage)}
              <span className='text-sm text-slate-600'>%</span>
            </div>
          </div>
          <div className='p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-neutral-900 border border-brand-primary/40 flex flex-col items-center'>
            <span className='text-[10px] font-black text-brand-primary uppercase tracking-widest mb-2 sm:mb-4'>
              XP GAINED
            </span>
            <div className='text-4xl sm:text-5xl font-black text-brand-primary'>
              +{xpGained}
            </div>
          </div>
          <div className='p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-neutral-900 border border-white/10 flex flex-col items-center'>
            <span className='text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 sm:mb-4'>
              Precision
            </span>
            <div className='text-4xl sm:text-5xl font-black text-white'>
              {mainScore}
              <span className='text-sm text-slate-600'>/{total}</span>
            </div>
          </div>
        </div>

        {players === 2 && (
          <div className='w-full flex flex-col sm:flex-row gap-4 mb-8 sm:mb-16'>
            {[1, 2].map((p) => (
              <div
                key={p}
                className={`flex-1 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-neutral-900 border border-white/10 flex items-center justify-between ${
                  winner === p
                    ? 'neon-glow-primary border-brand-primary/60'
                    : 'opacity-40'
                }`}
              >
                <div className='text-xs sm:text-sm font-black text-white uppercase tracking-widest'>
                  Player {p}
                </div>
                <div className='text-2xl sm:text-3xl font-black'>
                  {scores[p]}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className='flex flex-col sm:flex-row gap-4 w-full max-w-xl'>
          <Motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              soundManager.play('click');
              onRestart();
            }}
            className='flex-1 py-5 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] bg-white text-black font-black text-xl sm:text-2xl flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(255,255,255,0.15)]'
          >
            <FaRedoAlt size={24} />
            RE-SYNC
          </Motion.button>

          <div className='flex gap-4'>
            <Motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                soundManager.play('click');
                onMenu();
              }}
              className='flex-1 sm:flex-initial w-full sm:w-20 h-16 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] glass-morphism text-white flex items-center justify-center'
            >
              <FaHome size={28} />
            </Motion.button>
            <Motion.button
              whileHover={{ scale: 1.05 }}
              className='flex-1 sm:flex-initial w-full sm:w-20 h-16 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] glass-morphism text-white flex items-center justify-center'
            >
              <FaShareAlt size={28} />
            </Motion.button>
          </div>
        </div>
      </Motion.div>
    </div>
  );
};
