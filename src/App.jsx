import React, { useState } from 'react';
import { Sparkles, BookOpen, RefreshCw, Edit2, Save } from 'lucide-react';
import Timer from './components/Timer';
import LearningCard from './components/LearningCard';
import { generateLearningContent } from './services/geminiService';

export default function App() {
  const [inputKeywords, setInputKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState('chosung');
  const [isEditingSentence, setIsEditingSentence] = useState(false);
  const [tempSentence, setTempSentence] = useState('');

  const handleGenerate = async () => {
    if (!inputKeywords.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setIsEditingSentence(false);
    try {
      const data = await generateLearningContent(inputKeywords);
      setResult(data);
      setMode('chosung');
    } catch (err) {
      setError("AI 선생님이 문장을 만드는 데 실패했어요. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    if (result) {
      setTempSentence(result.original_sentence);
      setIsEditingSentence(true);
    }
  };

  const saveEditedSentence = () => {
    if (!tempSentence.trim()) return;
    const newScrambled = tempSentence.trim().split(/\s+/).sort(() => Math.random() - 0.5);

    setResult(prev => ({
      ...prev,
      original_sentence: tempSentence.trim(),
      scrambled_words: newScrambled
    }));
    setIsEditingSentence(false);
  };

  return (
    <div className="min-h-screen bg-amber-50 font-sans pb-20">
      <div className="sticky top-0 z-50">
        <Timer />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
        <header className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 min-w-fit">
            <div className="p-3 bg-green-400 rounded-xl text-white shadow-md">
              <BookOpen size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                오늘의 배움 키(Key)우기
              </h1>
            </div>
          </div>
          
          <div className="w-full h-px bg-slate-100 md:hidden"></div>

          <div className="flex-1 w-full flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputKeywords}
                onChange={(e) => setInputKeywords(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="예: 태양, 지구, 공전"
                className="flex-1 px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 text-lg text-slate-700 outline-none transition-all"
              />
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-md active:transform active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                {loading ? <RefreshCw className="animate-spin" /> : <Sparkles />}
                생성
              </button>
            </div>
            <p className="text-slate-400 text-xs pl-2">
              * 핵심 키워드는 최대 5개까지 입력할 수 있어요.
            </p>
          </div>
        </header>

        <main className="flex flex-col gap-6">
          {error && <div className="p-4 bg-red-100 text-red-600 rounded-xl text-center font-bold">{error}</div>}

          {result ? (
            <section className="flex flex-col items-center gap-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex p-1 bg-white rounded-xl shadow-sm border border-slate-100">
                  {[
                    { id: 'chosung', label: '1단계: 초성 퀴즈', color: 'indigo' },
                    { id: 'blank', label: '2단계: 빈칸 채우기', color: 'rose' },
                    { id: 'scramble', label: '3단계: 문장 만들기', color: 'amber' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setMode(tab.id)}
                      disabled={isEditingSentence}
                      className={`px-4 py-3 rounded-lg font-bold text-sm md:text-base transition-all ${
                        mode === tab.id 
                          ? `bg-${tab.color}-100 text-${tab.color}-700 shadow-sm` 
                          : 'text-slate-400 hover:bg-slate-50'
                      } ${isEditingSentence ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {!isEditingSentence && (
                  <button 
                    onClick={startEditing}
                    className="flex items-center gap-2 px-4 py-2 text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold transition-colors"
                  >
                    <Edit2 size={16} /> 문장 수정하기
                  </button>
                )}
              </div>

              {isEditingSentence ? (
                <div className="w-full bg-white rounded-3xl shadow-md border-2 border-indigo-200 p-8 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
                  <h3 className="text-lg font-bold text-indigo-800 flex items-center gap-2">
                    <Edit2 size={20} /> 학습 문장 수정
                  </h3>
                  <textarea
                    value={tempSentence}
                    onChange={(e) => setTempSentence(e.target.value)}
                    className="w-full p-4 text-xl md:text-2xl border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none leading-relaxed resize-none min-h-[150px]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditingSentence(false)}
                      className="px-6 py-2 rounded-lg text-slate-500 font-bold hover:bg-slate-100"
                    >
                      취소
                    </button>
                    <button
                      onClick={saveEditedSentence}
                      className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-2"
                    >
                      <Save size={18} /> 수정 완료
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">
                    * 문장을 수정하면 3단계(문장 만들기) 카드도 자동으로 변경됩니다.
                  </p>
                </div>
              ) : (
                <div className="w-full">
                  <LearningCard mode={mode} data={result} />
                </div>
              )}
            </section>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
              <Sparkles size={48} className="text-slate-300" />
              <p className="text-lg">상단에 키워드를 입력하여 수업을 시작해보세요!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}