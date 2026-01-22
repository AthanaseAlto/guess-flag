import React from 'react';
import { useGame } from './hooks/useGame';
import { Background } from './components/Background';
import { Menu } from './components/Menu';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { FlagLibrary } from './components/FlagLibrary';
import { motion as Motion, AnimatePresence } from 'framer-motion';

function App() {
  const {
    gameStatus,
    currentQuestion,
    options,
    scores,
    currentPlayer,
    questionNumber,
    gameSettings,
    timeLeft,
    isLoading,
    loadError,
    allCountries,
    countriesCount,
    soundEnabled,
    toggleSound,
    reloadCountries,
    startNewGame,
    exitGame,
    handleAnswer,
  } = useGame();

  return (
    <div className='min-h-screen text-white font-sans'>
      <Background />

      <main className='relative flex flex-col items-center justify-center min-h-screen'>
        <AnimatePresence mode='wait'>
          {gameStatus === 'menu' && (
            <Motion.div
              key='menu'
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className='w-full flex justify-center'
            >
              <Menu
                onStart={startNewGame}
                isLoading={isLoading}
                error={loadError}
                onRetry={reloadCountries}
                countriesCount={countriesCount}
                soundEnabled={soundEnabled}
                onToggleSound={toggleSound}
              />
            </Motion.div>
          )}

          {gameStatus === 'library' && (
            <Motion.div
              key='library'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className='w-full flex justify-center'
            >
              <FlagLibrary
                countries={allCountries}
                isLoading={isLoading}
                error={loadError}
                onRetry={reloadCountries}
                onExit={exitGame}
              />
            </Motion.div>
          )}

          {gameStatus === 'playing' && currentQuestion && (
            <Motion.div
              key='playing'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className='w-full flex justify-center'
            >
              <QuizScreen
                mode={gameSettings.mode}
                question={currentQuestion}
                options={options}
                onAnswer={handleAnswer}
                onExit={exitGame}
                scores={scores}
                currentPlayer={currentPlayer}
                currentNum={questionNumber}
                total={gameSettings.totalQuestions}
                timeLeft={timeLeft}
                players={gameSettings.players}
                timeLimit={gameSettings.timeLimit}
                soundEnabled={soundEnabled}
                onToggleSound={toggleSound}
              />
            </Motion.div>
          )}

          {gameStatus === 'finished' && (
            <Motion.div
              key='finished'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className='w-full flex justify-center'
            >
              <ResultScreen
                scores={scores}
                total={gameSettings.totalQuestions}
                players={gameSettings.players}
                onRestart={() => startNewGame(gameSettings)}
                onMenu={exitGame}
                soundEnabled={soundEnabled}
                onToggleSound={toggleSound}
              />
            </Motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Social and legal info is now in the Menu component footer for better flow */}
    </div>
  );
}

export default App;
