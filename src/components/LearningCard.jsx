import React, { useState, useEffect } from 'react';
import { CheckCircle, Eraser } from 'lucide-react';
import HangulHelper from '../utils/hangulHelper';
import SentenceBuilder from './SentenceBuilder';

const LearningCard = ({ mode, data }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setShowAnswer(false);
  }, [mode, data]);

  if (!data) return null;
  const { original_sentence, keywords, scrambled_words } = data;

  if (mode === 'scramble') {
    return (
      <div className="flex flex-col gap-8 w-full">
        <SentenceBuilder scrambledWords={scrambled_words} />
        <div className="flex flex-col items-center gap-4 mt-4 border-t pt-6 border-slate-100">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${
              showAnswer ? 'bg-slate-200 text-slate-600' : 'bg-green-500 text-white shadow-lg hover:bg-green-600'
            }`}
          >
            {showAnswer ? '정답 숨기기' : '정답 확인하기'}
          </button>
          
          {showAnswer && (
            <div className="w-full bg-green-50 p-6 rounded-xl border-2 border-green-200 text-center animate-in slide-in-from-bottom-2 fade-in">
              <p className="text-2xl font-bold text-green-800 break-keep leading-relaxed">
                {original_sentence}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderText = () => {
    const parts = [];
    let lastIndex = 0;
    const regex = new RegExp(`(${keywords.join('|')})`, 'g');
    let match;

    while ((match = regex.exec(original_sentence)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ text: original_sentence.substring(lastIndex, match.index), type: 'text' });
      }
      const keyword = match[0];
      let displayText = keyword;

      if (!showAnswer) {
        if (mode === 'chosung') displayText = HangulHelper.convertToChosung(keyword);
        else if (mode === 'blank') displayText = '______';
      }
      
      parts.push({ text: displayText, type: 'keyword' });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < original_sentence.length) {
      parts.push({ text: original_sentence.substring(lastIndex), type: 'text' });
    }

    return (
      <div className="text-center break-keep leading-[4rem]">
        {parts.map((part, idx) => (
          <span 
            key={idx} 
            className={`text-3xl md:text-5xl font-bold transition-all duration-300 mx-1 ${
              part.type === 'keyword' 
                ? `${showAnswer ? 'text-green-600' : 'text-indigo-600'} decoration-4 underline-offset-8` 
                : "text-slate-800"
            }`}
          >
            {part.text}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full bg-white rounded-3xl shadow-md border-2 border-slate-200 p-8 md:p-12 min-h-[250px] flex flex-col justify-center items-center relative mb-6">
        {renderText()}
      </div>

      <button
        onClick={() => setShowAnswer(!showAnswer)}
        className={`px-8 py-3 rounded-full font-bold text-lg flex items-center gap-2 transition-all transform hover:scale-105 ${
          showAnswer 
            ? 'bg-slate-200 text-slate-600' 
            : 'bg-indigo-600 text-white shadow-xl hover:bg-indigo-700'
        }`}
      >
        {showAnswer ? (
          <>
            <Eraser size={20} /> 다시 문제 풀기
          </>
        ) : (
          <>
            <CheckCircle size={20} /> 정답 확인하기
          </>
        )}
      </button>
      
      {!showAnswer && (
        <p className="mt-3 text-slate-400 text-sm">
          💡 학생들과 함께 큰 소리로 답을 외쳐보세요!
        </p>
      )}
    </div>
  );
};

export default LearningCard;