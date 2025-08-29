'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw, BarChart2, Smartphone, Clock, Target, CheckCircle, XCircle } from 'lucide-react';
import { generate as randomWords } from 'random-words';
import { triggerHapticFeedback } from '@/utils/haptics';

// --- Types and Constants ---
const WORD_COUNT = 250;
const DURATION_OPTIONS = [15, 30, 60, 120];

type TestStatus = 'waiting' | 'running' | 'finished';
type WordStatus = 'untyped' | 'correct' | 'incorrect';

// --- Main Component ---
const TypingSpeedTestPage = () => {
  // Core State
  const [words, setWords] = useState<string[]>([]);
  const [wordStatuses, setWordStatuses] = useState<WordStatus[]>([]);
  const [userInput, setUserInput] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [status, setStatus] = useState<TestStatus>('waiting');

  // Stats State
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [errors, setErrors] = useState(0);

  // Timer State
  const [testDuration, setTestDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(testDuration);

  // UI & Refs
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wordsContainerRef = useRef<HTMLDivElement | null>(null);
  const activeWordRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(mobileCheck);
  }, []);

  const generateWords = useCallback(() => {
    const generated = randomWords(WORD_COUNT);
    const newWords = Array.isArray(generated) ? generated : [generated];
    setWords(newWords);
    setWordStatuses(Array(newWords.length).fill('untyped'));
  }, []);

  const resetTest = useCallback((duration = testDuration) => {
    triggerHapticFeedback();
    generateWords();
    setStatus('waiting');
    setTestDuration(duration);
    setTimeLeft(duration);
    setUserInput('');
    setCurrentWordIndex(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    setErrors(0);
    wordsContainerRef.current?.scrollTo(0, 0);
    inputRef.current?.focus();
  }, [generateWords, testDuration]);

  useEffect(() => {
    resetTest();
  }, [resetTest]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (status === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && status === 'running') {
      setStatus('finished');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, timeLeft]);

  useEffect(() => {
    if (activeWordRef.current && wordsContainerRef.current) {
      const activeWord = activeWordRef.current;
      const container = wordsContainerRef.current;
      const scrollOffset = activeWord.offsetTop - container.offsetTop - (container.clientHeight / 2) + (activeWord.clientHeight / 2);
      container.scrollTo({
        top: scrollOffset,
        behavior: 'smooth'
      });
    }
  }, [currentWordIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    triggerHapticFeedback();

    if (status === 'finished') return;

    if (status === 'waiting' && value.trim().length > 0) {
      setStatus('running');
    }

    const currentWord = words[currentWordIndex];

    if (value.endsWith(' ')) {
      if (userInput.length === 0) return;

      const typedWord = userInput.trim();
      const isCorrect = typedWord === currentWord;

      const newWordStatuses = [...wordStatuses];
      newWordStatuses[currentWordIndex] = isCorrect ? 'correct' : 'incorrect';
      setWordStatuses(newWordStatuses);

      setCorrectChars(prev => prev + (isCorrect ? currentWord.length : 0));
      setIncorrectChars(prev => prev + (isCorrect ? 0 : currentWord.length));

      setCurrentWordIndex(prev => prev + 1);
      setUserInput('');
      return;
    }

    if (value.length < userInput.length) {
      setUserInput(value);
      return;
    }

    const lastChar = value.slice(-1);
    if (lastChar !== ' ' && value.length > userInput.length) {
      if (currentWord && value.length > currentWord.length && lastChar !== ' ') {
        setErrors(prev => prev + 1);
      } else if (currentWord && currentWord[value.length - 1] !== lastChar) {
        setErrors(prev => prev + 1);
      }
    }

    setUserInput(value);
  };

  const calculateResults = () => {
    const totalTypedChars = correctChars + incorrectChars;
    const netWpm = Math.round((correctChars / 5) / (testDuration / 60));
    const accuracy = totalTypedChars > 0 ? Math.round((correctChars / totalTypedChars) * 100) : 0;
    const score = Math.round(netWpm * (accuracy / 100));

    return { netWpm, accuracy, score };
  };

  const { netWpm, accuracy, score } = status === 'finished' ? calculateResults() : { netWpm: 0, accuracy: 0, score: 0 };

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Typing Speed Test 💨</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">How fast are your fingers? Select a duration and start typing!</p>
        </div>

        {isMobile ? (
          <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-6 rounded-r-lg shadow-md text-center">
            <Smartphone className="mx-auto w-12 h-12 mb-4" />
            <h2 className="text-xl font-bold">Desktop Recommended</h2>
            <p className="mt-2">For the best experience, please use a device with a physical keyboard.</p>
          </div>
        ) : (
          <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
              <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-blue-500">
                <Clock size={24} />
                Time: <span className="font-mono w-12 text-center">{timeLeft}s</span>
              </div>
              <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-red-500">
                <XCircle size={24} />
                Errors: <span className="font-mono w-8 text-center">{errors}</span>
              </div>
              <div className="flex items-center gap-x-2">
                {DURATION_OPTIONS.map(duration => (
                  <button
                    key={duration}
                    onClick={() => resetTest(duration)}
                    disabled={status === 'running'}
                    className={`px-3 py-1 rounded-md text-sm font-semibold transition ${testDuration === duration ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {duration}s
                  </button>
                ))}
              </div>
            </div>

            {status !== 'finished' ? (
              <div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-4">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(timeLeft / testDuration) * 100}%` }}></div>
                </div>
                <div ref={wordsContainerRef} className="text-2xl p-4 bg-gray-100 dark:bg-gray-900 rounded-lg h-36 overflow-hidden leading-relaxed font-mono relative">
                  {words.map((word, index) => {
                    const isCurrent = index === currentWordIndex;
                    return (
                      <span
                        key={index}
                        ref={isCurrent ? activeWordRef : null}
                        className={`${wordStatuses[index] === 'correct' ? 'text-green-500' : ''} ${wordStatuses[index] === 'incorrect' ? 'text-red-500 line-through' : ''} ${wordStatuses[index] === 'untyped' && !isCurrent ? 'text-gray-400' : ''} ${isCurrent ? 'font-bold' : ''}`}
                      >
                        {isCurrent ? (
                          <>
                            {word.split('').map((char, charIndex) => {
                              const isTyped = charIndex < userInput.length;
                              const isCorrect = isTyped && userInput[charIndex] === char;
                              const isIncorrect = isTyped && userInput[charIndex] !== char;
                              return (
                                <span
                                  key={charIndex}
                                  className={`${isCorrect ? 'text-blue-600 dark:text-blue-400' : ''} ${isIncorrect ? 'text-red-500 bg-red-500/20 rounded-sm' : ''} ${!isTyped ? 'text-gray-600 dark:text-gray-400' : ''}`}
                                >
                                  {char}
                                </span>
                              );
                            })}
                            <span className="blinking-caret text-blue-500">|</span>
                          </>
                        ) : (
                          word
                        )}
                        {' '}
                      </span>
                    );
                  })}
                </div>
                <div className="flex items-center mt-4 gap-4">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyDown={(e) => { if (e.key === ' ' && userInput === '') e.preventDefault(); }}
                    className="w-full p-4 text-xl border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder={status === 'waiting' ? 'Start typing to begin...' : ''}
                    autoFocus
                  />
                  <button onClick={() => resetTest()} className="flex items-center gap-2 px-4 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                    <RefreshCw size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-4">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Test Complete! Here are your results:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    <p className="flex items-center justify-center gap-2 text-lg text-gray-500 dark:text-gray-400"><BarChart2 size={20} /> WPM</p>
                    <p className="text-6xl font-bold text-blue-500">{netWpm}</p>
                  </div>
                  <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    <p className="flex items-center justify-center gap-2 text-lg text-gray-500 dark:text-gray-400"><Target size={20} /> Accuracy</p>
                    <p className="text-6xl font-bold text-green-500">{accuracy}%</p>
                  </div>
                  <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    <p className="flex items-center justify-center gap-2 text-lg text-gray-500 dark:text-gray-400">💯 Score</p>
                    <p className="text-6xl font-bold text-yellow-500">{score}</p>
                  </div>
                </div>
                <div className="mt-6 text-center text-md text-gray-600 dark:text-gray-300 font-mono">
                  Character Stats:
                  <span className="text-green-500 font-semibold"> {correctChars} </span>(correct) /
                  <span className="text-red-500 font-semibold"> {incorrectChars} </span>(incorrect) /
                  <span className="text-gray-500 dark:text-gray-400 font-semibold"> {errors} </span>(errors)
                </div>
                <button onClick={() => resetTest()} className="mt-8 flex mx-auto items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105">
                  <RefreshCw size={18} /> Try Again
                </button>
              </div>
            )}
          </div>
        )}
        <style jsx global>{`
                    .blinking-caret {
                        animation: blink 1s step-end infinite;
                    }
                    @keyframes blink {
                        from, to { color: transparent; }
                        50% { color: #3b82f6; }
                    }
                `}</style>
      </div>
    </div>
  );
};

export default TypingSpeedTestPage;
