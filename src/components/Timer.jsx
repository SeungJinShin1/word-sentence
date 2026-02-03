import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const startTimer = (seconds) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(seconds);
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeLeft(0);
  };

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-orange-50 border-b-2 border-orange-200 px-4 py-2 flex items-center justify-center gap-4 flex-wrap shadow-sm">
      <div className="flex items-center gap-2 text-orange-600 font-bold">
        <Clock size={20} />
        <span className="hidden md:inline">활동 타이머</span>
      </div>
      
      <div className="text-3xl font-mono font-bold text-slate-800 bg-white px-4 py-1 rounded-md min-w-[100px] text-center shadow-inner border border-orange-100">
        {formatTime(timeLeft)}
      </div>

      <div className="flex gap-2">
        <button onClick={() => startTimer(30)} className="px-3 py-1 bg-orange-200 hover:bg-orange-300 text-orange-800 rounded-lg text-sm font-bold transition-colors">30초</button>
        <button onClick={() => startTimer(60)} className="px-3 py-1 bg-orange-200 hover:bg-orange-300 text-orange-800 rounded-lg text-sm font-bold transition-colors">1분</button>
        <button onClick={() => startTimer(120)} className="px-3 py-1 bg-orange-200 hover:bg-orange-300 text-orange-800 rounded-lg text-sm font-bold transition-colors">2분</button>
        {isRunning && (
          <button onClick={stopTimer} className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-bold">
            정지
          </button>
        )}
      </div>
    </div>
  );
};

export default Timer;