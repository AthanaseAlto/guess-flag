import React, { useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaFire,
  FaBullseye,
  FaUsers,
  FaVolumeUp,
  FaVolumeMute,
} from 'react-icons/fa';
import { soundManager } from '../utils/sounds';
import confetti from 'canvas-confetti';

export const QuizScreen = ({
  question,
  options,
  onAnswer,
  onExit,
  scores,
  currentPlayer,
  currentNum,
  total,
  timeLeft,
  mode,
  players,
  timeLimit,
  soundEnabled,
  onToggleSound,
}) => {
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [combo, setCombo] = useState(0);

  useEffect(() => {
    setSelected(null);
    setIsCorrect(null);
  }, [question.name]);

  useEffect(() => {
    if (timeLeft !== 0 || selected) return;

    setSelected('__timeout__');
    setIsCorrect(false);
    soundManager.play('wrong');
    const timeoutId = setTimeout(() => {
      onAnswer(null);
      setSelected(null);
      setIsCorrect(null);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [timeLeft, selected, onAnswer]);

  const handleSelect = (option) => {
    if (selected) return;

    setSelected(option.name);
    const correct = option.name === question.name;
    setIsCorrect(correct);

    if (correct) {
      soundManager.play('correct');
      setCombo((prev) => prev + 1);
      if (combo >= 2) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#06b6d4', '#10b981'],
        });
      }
    } else {
      soundManager.play('wrong');
      setCombo(0);
    }

    setTimeout(() => {
      onAnswer(option.name);
      setSelected(null);
      setIsCorrect(null);
    }, 1500);
  };

  const progressPercentage = (currentNum / total) * 100;

  return (
    <div className='min-h-screen w-full flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10 relative bg-black'>
      <canvas id='confetti-canvas' />
      <div className='w-full max-w-5xl rounded-[2.5rem] border border-white/10 bg-neutral-950 px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-stretch relative shadow-[0_40px_120px_rgba(0,0,0,0.8)]'>
        <div className='w-full mb-6 sm:mb-8 relative z-20'>
          <div className='flex justify-between items-center mb-4'>
            <button
              onClick={() => {
                soundManager.play('click');
                onExit();
              }}
              className='w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-900 text-slate-300 hover:text-white border border-white/10 transition-all'
            >
              <FaArrowLeft size={18} />
            </button>

            <div className='flex flex-col items-center'>
              <div className='text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1'>
                Mission Progress
              </div>
              <div className='text-sm font-black text-white'>
                {currentNum} <span className='text-slate-700'>OF</span> {total}
              </div>
            </div>

            <div className='flex items-center gap-4'>
              {combo >= 2 && (
                <Motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='flex items-center gap-1 bg-brand-accent/10 px-3 py-1 rounded-full text-brand-accent border border-brand-accent/40'
                >
                  <FaFire size={14} />
                  <span className='text-xs font-black'>x{combo}</span>
                </Motion.div>
              )}
              <div className='w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-brand-secondary'>
                <FaBullseye size={18} />
              </div>
              <button
                onClick={onToggleSound}
                className='w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-900 text-slate-300 hover:text-white border border-white/10 transition-all'
                aria-label='Toggle sound'
              >
                {soundEnabled ? (
                  <FaVolumeUp size={16} />
                ) : (
                  <FaVolumeMute size={16} />
                )}
              </button>
            </div>
          </div>
          <div className='w-full h-1.5 bg-white/5 rounded-full overflow-hidden'>
            <Motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              className='h-full bg-gradient-to-r from-brand-primary to-brand-secondary shadow-[0_0_10px_#8b5cf6]'
            />
          </div>
        </div>

        <div className='w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-center relative z-10 mt-6'>
          <div className='hidden lg:flex flex-col gap-6 w-48'>
            <div className='p-6 rounded-[2rem] bg-neutral-900 border border-white/10 flex flex-col items-center gap-2'>
              <div className='text-[10px] font-black text-slate-500 uppercase tracking-widest'>
                Score
              </div>
              <div className='text-4xl font-black text-brand-success'>
                {scores[currentPlayer]}
              </div>
            </div>
            {timeLeft !== null && (
              <div className='p-6 rounded-[2rem] bg-neutral-900 border border-white/10 flex flex-col items-center gap-4'>
                <div className='relative w-20 h-20 flex items-center justify-center'>
                  <svg className='absolute inset-0 w-full h-full -rotate-90'>
                    <circle
                      cx='40'
                      cy='40'
                      r='36'
                      fill='none'
                      stroke='rgba(255,255,255,0.05)'
                      strokeWidth='4'
                    />
                    <Motion.circle
                      cx='40'
                      cy='40'
                      r='36'
                      fill='none'
                      stroke={timeLeft < 4 ? '#f43f5e' : '#06b6d4'}
                      strokeWidth='4'
                      strokeDasharray='226'
                      animate={{
                        strokeDashoffset: 226 -
                          (226 * timeLeft) / (timeLimit || 10),
                      }}
                    />
                  </svg>
                  <span
                    className={`text-xl font-black ${
                      timeLeft < 4 ? 'text-brand-accent' : 'text-white'
                    }`}
                  >
                    {timeLeft}
                  </span>
                </div>
                <div className='text-[10px] font-black text-slate-500 uppercase tracking-widest'>
                  Countdown
                </div>
              </div>
            )}
          </div>

          <div className='flex-1 w-full flex flex-col items-center'>
            <AnimatePresence mode='wait'>
              <Motion.div
                key={question.name}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={`w-full max-w-lg aspect-video rounded-[2rem] sm:rounded-[3rem] bg-neutral-900 border border-white/10 p-3 sm:p-4 relative group ${
                  selected
                    ? isCorrect
                      ? 'neon-glow-primary'
                      : 'neon-glow-secondary'
                    : ''
                } ${selected && !isCorrect ? 'animate-shake' : ''}`}
              >
                <div className='w-full h-full overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] relative'>
                  <img
                    src={question.flag}
                    alt='Flag'
                    className='w-full h-full object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                </div>

                <AnimatePresence>
                  {selected && (
                    <Motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`absolute inset-0 flex items-center justify-center z-20 rounded-[2rem] sm:rounded-[3rem] ${
                        isCorrect
                          ? 'bg-brand-success/20 backdrop-blur-sm'
                          : 'bg-brand-accent/20 backdrop-blur-sm'
                      }`}
                    >
                      <div
                        className={`p-6 rounded-full bg-neutral-900 border border-white/20 ${
                          isCorrect ? 'text-brand-success' : 'text-brand-accent'
                        }`}
                      >
                        {isCorrect ? (
                          <FaCheckCircle size={64} />
                        ) : (
                          <FaTimesCircle size={64} />
                        )}
                      </div>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </Motion.div>
            </AnimatePresence>

            <div className='mt-8 sm:mt-12 flex gap-4 lg:hidden'>
              <div className='px-6 py-2 rounded-2xl bg-neutral-900 border border-white/10 text-sm font-black text-brand-success uppercase'>
                Score: {scores[currentPlayer]}
              </div>
              {timeLeft !== null && (
                <div className='px-6 py-2 rounded-2xl bg-neutral-900 border border-white/10 text-sm font-black text-brand-secondary uppercase'>
                  Time: {timeLeft}s
                </div>
              )}
            </div>
          </div>

          <div className='flex-1 w-full grid grid-cols-1 gap-4 lg:max-w-md'>
            <div className='text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2 ml-2'>
              {mode === 'capital'
                ? `Capital of ${question.name}`
                : 'Analyze Options'}
            </div>
            {options.map((option, idx) => {
              const isThisSelected = selected === option.name;
              const isCorrectAnswer = selected && option.name === question.name;

              return (
                <Motion.button
                  key={option.name}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => handleSelect(option)}
                  disabled={!!selected}
                  className={`
                    w-full p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] text-left transition-all duration-400 bg-neutral-900 border border-white/10 relative overflow-hidden group
                    ${
                      isThisSelected
                        ? isCorrect
                          ? 'bg-brand-primary text-white neon-glow-primary border-brand-primary'
                          : 'bg-brand-accent text-white border-brand-accent'
                        : isCorrectAnswer
                        ? 'border-brand-success text-brand-success bg-brand-success/10'
                        : 'hover:bg-neutral-800 text-slate-300'
                    }
                  `}
                >
                  <div className='flex justify-between items-center relative z-10'>
                    <span className='text-lg font-black tracking-tight'>
                      {mode === 'flag' ? option.name : option.capital}
                    </span>
                    <div className='w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-black'>
                      {String.fromCharCode(65 + idx)}
                    </div>
                  </div>
                  <div className='absolute top-0 left-0 w-1 h-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity' />
                </Motion.button>
              );
            })}
          </div>
        </div>

        {players === 2 && (
          <div className='mt-10 sm:mt-12 w-full max-w-4xl grid grid-cols-2 gap-4 sm:gap-8 relative z-10 self-center'>
            {[1, 2].map((p) => (
              <div
                key={p}
                className={`p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] bg-neutral-900 border border-white/10 transition-all ${
                  currentPlayer === p
                    ? 'neon-glow-primary border-brand-primary/60'
                    : 'opacity-40'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <FaUsers
                      className={
                        currentPlayer === p
                          ? 'text-brand-primary'
                          : 'text-slate-500'
                      }
                      size={20}
                    />
                    <span className='text-xs font-black uppercase tracking-widest text-white'>
                      Player {p}
                    </span>
                  </div>
                  <div className='text-2xl font-black text-white'>
                    {scores[p]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
