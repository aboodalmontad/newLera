import React from 'react';
import ConverterCard from './components/ConverterCard';

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
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center py-6 px-4 md:py-12 select-none">
      <header className="w-full max-w-2xl text-center mb-10">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 border border-slate-100 shadow-lg p-1.5 transition-transform hover:rotate-6">
           <SyrianFlag />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">
          محوّل الليرة السورية
        </h1>
        <div className="flex items-center justify-center gap-2">
          <span className="h-[2px] w-8 bg-emerald-500 rounded-full opacity-30"></span>
          <p className="text-slate-500 font-medium tracking-wide">الإصدار المعتمد لحذف الصفرين (٢٠٢٦)</p>
          <span className="h-[2px] w-8 bg-emerald-500 rounded-full opacity-30"></span>
        </div>
      </header>

      <main className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.04)] overflow-hidden border border-slate-100">
        <div className="p-6 md:p-10">
          <ConverterCard />
        </div>
      </main>

      <footer className="mt-16 text-slate-400 text-xs text-center space-y-3 pb-8">
        <div className="flex items-center justify-center gap-4 opacity-40 font-bold">
           <span>١٠٠ ليرة قديمة = ١ ليرة جديدة</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-25">
           <p className="font-black uppercase tracking-[0.3em]">تطبيق وطني خدمي سريع &bull; ٢٠٢٦</p>
           <p className="text-[10px]">يعمل بالكامل بدون إنترنت</p>
        </div>
      </footer>
    </div>
  );
};

export default App;