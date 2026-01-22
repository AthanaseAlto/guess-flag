import React, { useState } from 'react';
import {
  FaFlag,
  FaMapMarkerAlt,
  FaPlay,
  FaBookOpen,
  FaUsers,
  FaVolumeUp,
  FaVolumeMute,
  FaGithub,
  FaCommentDots,
  FaLinkedinIn,
  FaYoutube,
} from 'react-icons/fa';
import { motion as Motion } from 'framer-motion';
import { soundManager } from '../utils/sounds';

export const Menu = ({
  onStart,
  isLoading,
  error,
  onRetry,
  countriesCount,
  soundEnabled,
  onToggleSound,
}) => {
  const [settings, setSettings] = useState({
    mode: 'flag',
    totalQuestions: 10,
    timeLimit: null,
    players: 1,
    difficulty: 'Medium',
  });

  const handleStart = () => {
    soundManager.play('start');
    onStart(settings);
  };

  const updateSetting = (key, value) => {
    soundManager.play('click');
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const modeOptions = [
    {
      id: 'flag',
      title: 'Guess the Flag',
      description: 'Identify countries by their flags.',
      icon: FaFlag,
    },
    {
      id: 'capital',
      title: 'Guess the Capital',
      description: 'Name the capital cities.',
      icon: FaMapMarkerAlt,
    },
    {
      id: 'library',
      title: 'Flag Library',
      description: 'Explore all country flags.',
      icon: FaBookOpen,
    },
  ];

  const questionOptions = [10, 20, 50, 'All'];

  const timeOptions = [
    { label: '5s', value: 5 },
    { label: '10s', value: 10 },
    { label: '30s', value: 30 },
    { label: '50s', value: 50 },
    { label: '∞', value: null },
  ];

  const playerOptions = [
    { label: '1 Player', value: 1 },
    { label: '2 Players', value: 2 },
  ];

  return (
    <div className='min-h-screen w-full flex flex-col items-center px-4 sm:px-6 py-10 sm:py-16 relative overflow-hidden bg-black'>
      <div className='pointer-events-none absolute inset-0 flex justify-center'>
        <div
          className='w-full max-w-5xl h-[420px] bg-gradient-to-b from-black via-neutral-900 to-black'
          style={{
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          }}
        />
      </div>

      <div className='w-full max-w-3xl space-y-10 relative z-10'>
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className='rounded-[2.5rem] border border-white/10 bg-neutral-900 px-6 sm:px-10 py-8 sm:py-10 shadow-[0_40px_120px_rgba(0,0,0,0.7)]'
        >
          <div className='flex flex-col gap-4 sm:gap-6'>
            <div className='flex items-center justify-between'>
              <div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-800 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-200'>
                <span className='h-1.5 w-1.5 rounded-full bg-brand-secondary' />
                World Quiz
              </div>
              <button
                onClick={onToggleSound}
                className='w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-800 text-slate-300 hover:text-white border border-white/10 transition-all'
                aria-label='Toggle sound'
              >
                {soundEnabled ? (
                  <FaVolumeUp size={16} />
                ) : (
                  <FaVolumeMute size={16} />
                )}
              </button>
            </div>
            <div className='space-y-3'>
              <h1 className='text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white'>
                Test your geography knowledge
              </h1>
              <p className='text-sm sm:text-base text-slate-400 max-w-xl'>
                Choose a mode, set the pace, and see how far your world
                intuition can go.
              </p>
            </div>
            <div className='flex flex-wrap gap-3 text-[11px] font-semibold text-slate-200'>
              <div className='inline-flex items-center gap-2 rounded-full bg-neutral-800 px-3 py-1'>
                <FaUsers size={14} className='text-brand-secondary' />
                {settings.players === 1 ? 'Solo and duel modes' : 'Duel mode'}
              </div>
              <div className='inline-flex items-center gap-2 rounded-full bg-neutral-800 px-3 py-1'>
                <span className='h-1.5 w-1.5 rounded-full bg-brand-primary' />
                {settings.totalQuestions === 250
                  ? `${countriesCount || 0} questions`
                  : `${settings.totalQuestions} questions`}
              </div>
              <div className='inline-flex items-center gap-2 rounded-full bg-neutral-800 px-3 py-1'>
                <span className='h-1.5 w-1.5 rounded-full bg-brand-accent' />
                {settings.timeLimit
                  ? `${settings.timeLimit}s timer`
                  : 'No time limit'}
              </div>
            </div>
          </div>
        </Motion.div>

        <div className='space-y-4'>
          <div className='flex items-end justify-between'>
            <div>
              <p className='text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500'>
                Modes
              </p>
              <p className='text-xs text-slate-500'>
                Pick how you want to challenge yourself.
              </p>
            </div>
          </div>
          <div className='space-y-3'>
            {modeOptions.map((mode) => {
              const Icon = mode.icon;
              const active = settings.mode === mode.id;
              return (
                <Motion.button
                  key={mode.id}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                      onClick={() => updateSetting('mode', mode.id)}
                      className={`w-full flex items-center justify-between rounded-2xl border px-4 sm:px-5 py-4 sm:py-5 transition-all ${
                        active
                          ? 'border-brand-primary bg-neutral-900 shadow-[0_18px_60px_rgba(0,0,0,0.7)]'
                          : 'border-neutral-800 bg-neutral-950 hover:bg-neutral-900'
                  }`}
                >
                  <div className='flex items-center gap-4'>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        active
                          ? 'bg-brand-primary/20 text-brand-primary'
                          : 'bg-neutral-800 text-slate-300'
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <div className='text-left'>
                      <div className='text-sm sm:text-base font-semibold text-white'>
                        {mode.title}
                      </div>
                      <div className='text-[11px] sm:text-xs text-slate-400'>
                        {mode.description}
                      </div>
                    </div>
                  </div>
                  <div className='text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500'>
                    {active ? 'Selected' : 'Choose'}
                  </div>
                </Motion.button>
              );
            })}
          </div>
        </div>

        <div className='rounded-[2.25rem] border border-white/10 bg-neutral-950 px-6 sm:px-8 py-6 sm:py-8 space-y-8'>
          <div>
            <p className='text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500'>
              Session setup
            </p>
            <p className='text-xs text-slate-500'>
              Fine-tune difficulty, question count, and time pressure.
            </p>
          </div>

          <div className='space-y-6'>
            <div>
              <div className='flex items-center justify-between mb-3'>
                <span className='text-xs font-semibold text-slate-300'>
                  Number of questions
                </span>
                <span className='text-[11px] font-semibold text-slate-500'>
                  {settings.totalQuestions === 250
                    ? 'All available'
                    : `${settings.totalQuestions} per session`}
                </span>
              </div>
              <div className='grid grid-cols-4 gap-2'>
                {questionOptions.map((q) => {
                  const value = q === 'All' ? 250 : q;
                  const active =
                    settings.totalQuestions === value &&
                    (q !== 'All' || settings.totalQuestions === 250);
                  return (
                    <button
                      key={q}
                      onClick={() =>
                        updateSetting('totalQuestions', q === 'All' ? 250 : q)
                      }
                      className={`h-10 rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? 'bg-white text-black'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {q === 'All' ? `All (${countriesCount || 0})` : q}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between mb-3'>
                <span className='text-xs font-semibold text-slate-300'>
                  Time limit (per question)
                </span>
                <span className='text-[11px] font-semibold text-slate-500'>
                  {settings.timeLimit
                    ? `${settings.timeLimit}s per question`
                    : 'Relaxed mode'}
                </span>
              </div>
              <div className='grid grid-cols-5 gap-2'>
                {timeOptions.map((option) => {
                  const active = settings.timeLimit === option.value;
                  return (
                    <button
                      key={option.label}
                      onClick={() =>
                        updateSetting('timeLimit', option.value ?? null)
                      }
                      className={`h-10 rounded-xl text-[11px] font-semibold transition-all ${
                        active
                          ? 'bg-white text-black'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <div className='flex items-center justify-between mb-3'>
                  <span className='text-xs font-semibold text-slate-300'>
                    Players
                  </span>
                  <span className='text-[11px] font-semibold text-slate-500'>
                    {settings.players === 1 ? 'Solo session' : 'Head-to-head'}
                  </span>
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  {playerOptions.map((option) => {
                    const active = settings.players === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => updateSetting('players', option.value)}
                        className={`h-10 rounded-xl text-xs font-semibold transition-all ${
                          active
                            ? 'bg-white text-black'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className='flex items-center justify-between mb-3'>
                  <span className='text-xs font-semibold text-slate-300'>
                    Difficulty
                  </span>
                  <span className='text-[11px] font-semibold text-slate-500'>
                    {settings.difficulty}
                  </span>
                </div>
                <div className='grid grid-cols-4 gap-2'>
                  {['Easy', 'Medium', 'Hard', 'Expert'].map((level) => {
                    const active = settings.difficulty === level;
                    return (
                      <button
                        key={level}
                        onClick={() => updateSetting('difficulty', level)}
                        className={`h-10 rounded-xl text-[11px] font-semibold transition-all ${
                          active
                            ? 'bg-white text-black'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <Motion.button
              whileHover={{ y: -1, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleStart}
              disabled={isLoading || !!error}
              className='mt-2 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-white text-black text-lg font-black shadow-[0_22px_80px_rgba(0,0,0,0.8)] disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <FaPlay size={22} />
              {settings.mode === 'library'
                ? isLoading
                  ? 'Loading library...'
                  : 'Open library'
                : isLoading
                ? 'Preparing session...'
                : 'Start quiz'}
            </Motion.button>

            {error && (
              <div className='pt-4 text-center'>
                <div className='text-xs text-slate-500 mb-3'>{error}</div>
                <button
                  onClick={onRetry}
                  className='inline-flex items-center justify-center rounded-2xl bg-white/10 text-white px-4 py-2 text-xs font-semibold'
                >
                  Retry loading countries
                </button>
              </div>
            )}
          </div>
        </div>

        <div className='pt-4 border-t border-white/5 flex flex-col items-center gap-4'>
          <div className='text-center'>
            <div className='font-script text-4xl sm:text-5xl text-white/90'>
              Altoway
            </div>
            <p className='text-[11px] text-slate-500 mt-1'>Connect with us</p>
          </div>
          <div className='flex gap-4'>
            {[FaGithub, FaCommentDots, FaLinkedinIn, FaYoutube].map(
              (Icon, i) => (
                <Motion.a
                  key={i}
                  href='#'
                  whileHover={{ scale: 1.08, y: -2 }}
                  className='flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 hover:bg-white/10'
                >
                  <Icon size={18} />
                </Motion.a>
              )
            )}
          </div>
          <div className='text-[10px] font-semibold tracking-[0.25em] text-slate-600 uppercase'>
            Guess the flag
          </div>
          <div className='text-[9px] text-slate-600'>Copyright © 2026</div>
        </div>
      </div>
    </div>
  );
};
