import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchCountries, getRandomItems } from '../utils/countryApi';
import { soundManager } from '../utils/sounds';

export const useGame = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [gameStatus, setGameStatus] = useState('menu'); // menu, playing, finished, library
  const [gameSettings, setGameSettings] = useState({
    mode: 'flag', // flag, capital
    totalQuestions: 10,
    timeLimit: null, // in seconds
    players: 1,
    difficulty: 'Medium',
  });
  const [timeLeft, setTimeLeft] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [askedCountries, setAskedCountries] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(
    soundManager.getEnabled()
  );

  const loadCountries = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await fetchCountries();
    setAllCountries(data);
    setLoadError(error);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  const remainingCountries = useMemo(() => {
    if (!askedCountries.length) return allCountries;
    const askedSet = new Set(askedCountries);
    return allCountries.filter((c) => !askedSet.has(c.name));
  }, [allCountries, askedCountries]);

  const buildOptions = useCallback(
    (correctCountry, settings) => {
      const others = allCountries.filter(
        (c) => c.name !== correctCountry.name
      );
      const sameRegion = others.filter(
        (c) => c.region && c.region === correctCountry.region
      );

      if (settings.difficulty === 'Medium' && sameRegion.length > 0) {
        const oneRegional = getRandomItems(sameRegion, 1);
        const remaining = others.filter(
          (c) => !oneRegional.some((picked) => picked.name === c.name)
        );
        return [...oneRegional, ...getRandomItems(remaining, 2)];
      }

      if (
        (settings.difficulty === 'Hard' ||
          settings.difficulty === 'Expert') &&
        sameRegion.length >= 3
      ) {
        return getRandomItems(sameRegion, 3);
      }

      return getRandomItems(others, 3);
    },
    [allCountries]
  );

  const generateNextQuestion = useCallback(
    (settingsOverride, askedOverride) => {
      if (allCountries.length === 0) return;
      const remainingList = askedOverride
        ? allCountries.filter((c) => !new Set(askedOverride).has(c.name))
        : remainingCountries;
      if (remainingList.length === 0) {
        setGameStatus('finished');
        return;
      }

      const settings = settingsOverride ?? gameSettings;
      const correctCountry =
        remainingList[Math.floor(Math.random() * remainingList.length)];
      const otherOptions = buildOptions(correctCountry, settings);
      const allOptions = [...otherOptions, correctCountry].sort(
        () => 0.5 - Math.random()
      );

      setCurrentQuestion(correctCountry);
      setOptions(allOptions);
      setAskedCountries((prev) =>
        prev.includes(correctCountry.name)
          ? prev
          : [...prev, correctCountry.name]
      );
      if (settings.timeLimit) {
        setTimeLeft(settings.timeLimit);
      } else {
        setTimeLeft(null);
      }
    },
    [
      allCountries.length,
      buildOptions,
      gameSettings,
      remainingCountries,
    ]
  );

  const startNewGame = useCallback(
    (settings) => {
      const availableQuestions = allCountries.length;
      const normalizedSettings = {
        ...settings,
        totalQuestions:
          settings.totalQuestions === 250
            ? availableQuestions
            : Math.min(settings.totalQuestions, availableQuestions),
      };

      setGameSettings(normalizedSettings);
      setScores({ 1: 0, 2: 0 });
      setCurrentPlayer(1);
      setQuestionNumber(1);
      setAskedCountries([]);

      if (normalizedSettings.mode === 'library') {
        setGameStatus('library');
        return;
      }

      setGameStatus('playing');
      generateNextQuestion(normalizedSettings, []);
    },
    [allCountries.length, generateNextQuestion]
  );

  const exitGame = useCallback(() => {
    setGameStatus('menu');
    setScores({ 1: 0, 2: 0 });
    setCurrentPlayer(1);
    setTimeLeft(null);
  }, []);

  const handleAnswer = (selectedName) => {
    if (!currentQuestion) return;
    const isCorrect = selectedName === currentQuestion.name;

    if (isCorrect) {
      setScores((prev) => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] + 1,
      }));
    }

    if (
      questionNumber < gameSettings.totalQuestions &&
      remainingCountries.length > 0
    ) {
      setQuestionNumber((n) => n + 1);
      if (gameSettings.players === 2) {
        setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
      }
      generateNextQuestion();
    } else {
      setGameStatus('finished');
    }
  };

  useEffect(() => {
    if (gameStatus === 'playing' && timeLeft !== null && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, gameStatus]);

  const toggleSound = useCallback(() => {
    const nextValue = soundManager.toggle();
    setSoundEnabled(nextValue);
  }, []);

  return {
    gameStatus,
    setGameStatus,
    currentQuestion,
    options,
    scores,
    currentPlayer,
    questionNumber,
    gameSettings,
    timeLeft,
    isLoading,
    loadError,
    countriesCount: allCountries.length,
    allCountries,
    soundEnabled,
    toggleSound,
    reloadCountries: loadCountries,
    startNewGame,
    exitGame,
    handleAnswer,
  };
};
