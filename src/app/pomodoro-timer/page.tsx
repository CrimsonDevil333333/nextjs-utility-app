'use client';

import { useState, useEffect, useCallback } from 'react';
import { triggerHapticFeedback } from '@/utils/haptics';

const POMODORO_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;

const PomodoroTimerPage = () => {
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [time, setTime] = useState(POMODORO_TIME);
  const [isActive, setIsActive] = useState(false);

  const switchMode = useCallback((newMode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    triggerHapticFeedback();
    setIsActive(false);
    setMode(newMode);
    switch (newMode) {
      case 'shortBreak':
        setTime(SHORT_BREAK_TIME);
        break;
      case 'longBreak':
        setTime(LONG_BREAK_TIME);
        break;
      default:
        setTime(POMODORO_TIME);
        break;
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      if (mode === 'pomodoro') {
        switchMode('shortBreak');
      } else {
        switchMode('pomodoro');
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, mode, switchMode]);

  const toggleTimer = () => {
    triggerHapticFeedback();
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    triggerHapticFeedback();
    setIsActive(false);
    setTime(
      mode === 'pomodoro' ? POMODORO_TIME :
        mode === 'shortBreak' ? SHORT_BREAK_TIME :
          LONG_BREAK_TIME
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const modeColors = {
    pomodoro: 'bg-red-500 hover:bg-red-600',
    shortBreak: 'bg-blue-500 hover:bg-blue-600',
    longBreak: 'bg-green-500 hover:bg-green-600',
  }

  const selectedModeClass = 'bg-gray-900/50 dark:bg-black/50 text-white';

  return (
    <div className={`min-h-[calc(100vh-100px)] w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-500 ${mode === 'pomodoro' ? 'bg-red-100 dark:bg-red-900/50' :
        mode === 'shortBreak' ? 'bg-blue-100 dark:bg-blue-900/50' :
          'bg-green-100 dark:bg-green-900/50'
      }`}>
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">Pomodoro Timer 🍅</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Stay focused and productive.</p>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-8 text-center">
          <div className="flex justify-center space-x-1 sm:space-x-2 mb-8 bg-gray-200 dark:bg-gray-700 p-1 rounded-full">
            <button onClick={() => switchMode('pomodoro')} className={`w-1/3 px-2 sm:px-4 py-2 text-sm sm:text-base rounded-full font-semibold transition ${mode === 'pomodoro' ? selectedModeClass : ''}`}>Pomodoro</button>
            <button onClick={() => switchMode('shortBreak')} className={`w-1/3 px-2 sm:px-4 py-2 text-sm sm:text-base rounded-full font-semibold transition ${mode === 'shortBreak' ? selectedModeClass : ''}`}>Short Break</button>
            <button onClick={() => switchMode('longBreak')} className={`w-1/3 px-2 sm:px-4 py-2 text-sm sm:text-base rounded-full font-semibold transition ${mode === 'longBreak' ? selectedModeClass : ''}`}>Long Break</button>
          </div>
          <div className="text-7xl sm:text-8xl md:text-9xl font-mono font-bold text-gray-900 dark:text-white my-6 sm:my-8">
            {formatTime(time)}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button onClick={toggleTimer} className={`w-full sm:w-auto flex-grow px-8 py-4 text-xl sm:text-2xl font-bold text-white rounded-lg shadow-lg transition-transform transform hover:scale-105 ${modeColors[mode]}`}>
              {isActive ? 'PAUSE' : 'START'}
            </button>
            <button onClick={resetTimer} className="w-full sm:w-auto px-6 py-4 font-bold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg shadow-lg hover:bg-gray-300 dark:hover:bg-gray-500">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimerPage;
