import React, { useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';

export const FlagLibrary = ({
  countries,
  isLoading,
  error,
  onRetry,
  onExit,
}) => {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All');

  const regions = useMemo(() => {
    const unique = Array.from(
      new Set(countries.map((c) => c.region).filter(Boolean))
    ).sort();
    return ['All', ...unique];
  }, [countries]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return countries.filter((country) => {
      const matchesRegion =
        region === 'All' || country.region === region;
      const matchesQuery =
        normalized.length === 0 ||
        country.name.toLowerCase().includes(normalized) ||
        country.capital.toLowerCase().includes(normalized);
      return matchesRegion && matchesQuery;
    });
  }, [countries, query, region]);

  return (
    <div className='min-h-screen w-full flex items-center justify-center px-4 sm:px-6 py-10 relative bg-black'>
      <div className='w-full max-w-6xl rounded-[2.5rem] border border-white/10 bg-neutral-950 px-4 sm:px-8 py-6 sm:py-8 shadow-[0_40px_120px_rgba(0,0,0,0.8)]'>
        <div className='flex flex-col gap-6'>
          <div className='flex items-center justify-between gap-4'>
            <button
              onClick={onExit}
              className='w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-900 text-slate-300 hover:text-white border border-white/10 transition-all'
            >
              <FaArrowLeft size={18} />
            </button>
            <div className='flex flex-col items-center'>
              <div className='text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1'>
                Flag Library
              </div>
              <div className='text-sm font-black text-white'>
                {filtered.length}{' '}
                <span className='text-slate-700'>COUNTRIES</span>
              </div>
            </div>
            <div className='w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-brand-secondary'>
              <FaSearch size={16} />
            </div>
          </div>

          <div className='flex flex-col lg:flex-row gap-4 items-stretch'>
            <div className='flex-1 flex items-center gap-3 rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3'>
              <FaSearch size={14} className='text-slate-500' />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder='Search by country or capital'
                className='w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none'
              />
            </div>
            <div className='flex-1'>
              <select
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                className='w-full h-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white'
              >
                {regions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading && (
            <div className='py-16 text-center text-slate-500 text-sm'>
              Loading country data...
            </div>
          )}

          {!isLoading && error && (
            <div className='py-12 text-center'>
              <div className='text-sm text-slate-400 mb-4'>{error}</div>
              <button
                onClick={onRetry}
                className='inline-flex items-center justify-center rounded-2xl bg-white text-black px-6 py-3 text-sm font-bold'
              >
                Retry loading countries
              </button>
            </div>
          )}

          {!isLoading && !error && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {filtered.map((country, index) => (
                <Motion.div
                  key={`${country.name}-${index}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.2) }}
                  className='rounded-2xl border border-white/10 bg-neutral-900 overflow-hidden'
                >
                  <div className='aspect-video overflow-hidden'>
                    <img
                      src={country.flag}
                      alt={country.name}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <div className='p-4 flex flex-col gap-1'>
                    <div className='text-sm font-bold text-white'>
                      {country.name}
                    </div>
                    <div className='text-xs text-slate-500'>
                      Capital: {country.capital}
                    </div>
                    <div className='text-[10px] uppercase tracking-[0.3em] text-slate-600'>
                      {country.region || 'Unknown region'}
                    </div>
                  </div>
                </Motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
