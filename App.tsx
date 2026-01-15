import React from 'react';
import ConverterCard from './components/ConverterCard';
import AIAssistant from './components/AIAssistant';

const SyrianFlag = () => (
  <svg viewBox="0 0 900 600" className="w-full h-full rounded-full shadow-md" xmlns="http://www.w3.org/2000/svg">
    <rect width="900" height="200" fill="#007A3D"/>
    <rect y="200" width="900" height="200" fill="#FFF"/>
    <rect y="400" width="900" height="200" fill="#000"/>
    <g fill="#CE1126" transform="translate(450, 300)">
      <path id="star" d="M0-50 L15-15 L50-10 L23 12 L32 48 L0 28 L-32 48 L-23 12 L-50-10 L-15-15 Z" />
      <use href="#star" x="-230"/>
      <use href="#star" x="230"/>
    </g>
  </svg>
);

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center py-6 px-4 md:py-12 select-none overflow-x-hidden">
      <header className="w-full max-w-2xl text-center mb-10 animate-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 border border-slate-100 shadow-lg p-1 transition-transform hover:scale-105">
           <SyrianFlag />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">
          محوّل الليرة السورية
        </h1>
        <p className="text-slate-400 font-medium text-xs">نظام حذف الصفرين المعتمد (٢٠٢٦)</p>
      </header>

      <main className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 animate-in delay-100">
        <div className="p-6 md:p-8">
          <ConverterCard />
        </div>
      </main>

      <footer className="mt-12 text-slate-300 text-[10px] text-center space-y-2 pb-10">
        <p className="font-bold opacity-50">١٠٠ ليرة قديمة = ١ ليرة جديدة</p>
        <p className="font-black uppercase tracking-[0.2em] opacity-20 italic">يعمل بالكامل بدون إنترنت</p>
      </footer>

      {/* AIAssistant handles context-aware help regarding the currency conversion */}
      <AIAssistant />
    </div>
  );
};

export default App;