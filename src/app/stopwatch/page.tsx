'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Flag } from 'lucide-react';

const StopwatchPage = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now() - time;
      timerRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10); // Update every 10ms for smooth display
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, time]);

  const handleStartStop = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps(prevLaps => [...prevLaps, time]);
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    const milliseconds = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return `${minutes}:${seconds}.${milliseconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900 font-sans">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-full aspect-square flex flex-col justify-center items-center shadow-2xl border-4 border-gray-200 dark:border-gray-700">
          <p className="text-6xl sm:text-7xl font-mono tracking-tighter text-gray-900 dark:text-white">
            {formatTime(time)}
          </p>
        </div>

        <div className="flex justify-around mt-8">
            <button onClick={handleLap} disabled={!isRunning} className="w-20 h-20 flex justify-center items-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 transition-colors">
                <Flag size={32} />
            </button>
            <button onClick={handleStartStop} className={`w-24 h-24 flex justify-center items-center rounded-full text-white font-bold text-xl shadow-lg transition-colors ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                {isRunning ? <Pause size={40} /> : <Play size={40} className="ml-1" />}
            </button>
            <button onClick={handleReset} className="w-20 h-20 flex justify-center items-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 transition-colors">
                <RefreshCw size={32} />
            </button>
        </div>
      </div>
      
      {laps.length > 0 && (
        <div className="w-full max-w-md mt-8">
            <h2 className="text-xl font-bold text-center mb-2">Laps</h2>
            <ul className="space-y-2 max-h-48 overflow-y-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow-inner">
                {laps.slice().reverse().map((lap, index) => (
                    <li key={index} className="flex justify-between items-center text-lg font-mono">
                        <span className="text-gray-500 dark:text-gray-400">Lap {laps.length - index}</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{formatTime(lap)}</span>
                    </li>
                ))}
            </ul>
        </div>
      )}
    </div>
  );
};

export default StopwatchPage;
