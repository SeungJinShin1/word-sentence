import React, { useState, useEffect } from 'react';
import { X, CheckCircle, RotateCcw } from 'lucide-react';

const SentenceBuilder = ({ scrambledWords, onComplete }) => {
  const [wordBank, setWordBank] = useState([...scrambledWords]);
  const [userSentence, setUserSentence] = useState([]);

  useEffect(() => {
    setWordBank([...scrambledWords]);
    setUserSentence([]);
  }, [scrambledWords]);

  const moveToSentence = (word, index) => {
    const newBank = wordBank.filter((_, i) => i !== index);
    setWordBank(newBank);
    setUserSentence([...userSentence, word]);
  };

  const returnToBank = (word, index) => {
    const newSentence = userSentence.filter((_, i) => i !== index);
    setUserSentence(newSentence);
    setWordBank([...wordBank, word]);
  };

  const handleReset = () => {
    setWordBank([...scrambledWords]);
    setUserSentence([]);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-white border-b-4 border-indigo-200 min-h-[120px] p-4 rounded-xl flex flex-wrap gap-2 items-center justify-center transition-all">
        {userSentence.length === 0 && (
          <span className="text-slate-400 select-none">아래 단어 카드를 눌러 문장을 완성하세요</span>
        )}
        {userSentence.map((word, idx) => (
          <button
            key={`sent-${idx}`}
            onClick={() => returnToBank(word, idx)}
            className="px-4 py-2 bg-indigo-100 hover:bg-red-100 text-indigo-700 font-bold rounded-lg shadow-sm border border-indigo-200 animate-in fade-in zoom-in duration-200 flex items-center gap-1 group"
          >
            {word}
            <X size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400" />
          </button>
        ))}
      </div>

      <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200 flex flex-wrap justify-center gap-3">
        {wordBank.length === 0 ? (
          <div className="text-green-600 font-bold flex items-center gap-2">
            <CheckCircle size={20} /> 모든 카드를 사용했습니다! 정답을 확인해보세요.
          </div>
        ) : (
          wordBank.map((word, idx) => (
            <button
              key={`bank-${idx}`}
              onClick={() => moveToSentence(word, idx)}
              className="px-5 py-3 bg-white hover:bg-yellow-100 border-2 border-yellow-300 text-slate-700 font-bold rounded-xl shadow-md transform active:scale-95 transition-all text-lg"
            >
              {word}
            </button>
          ))
        )}
      </div>

      <div className="flex justify-center">
        <button 
          onClick={handleReset}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-100"
        >
          <RotateCcw size={16} /> 다시 놓기
        </button>
      </div>
    </div>
  );
};

export default SentenceBuilder;