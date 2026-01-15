
import React from 'react';
import ConverterCard from './components/ConverterCard';

const SyrianFlag = () => (
  <svg viewBox="0 0 900 600" className="w-full h-full rounded-full shadow-sm" xmlns="http://www.w3.org/2000/svg">
    <path fill="#000" d="M0 0h900v600H0z"/>
    <path fill="#FFF" d="M0 0h900v400H0z"/>
    <path fill="#007A3D" d="M0 0h900v200H0z"/>
    <g fill="#CE1126">
      <path id="s" d="M225 300l23.5 72.3-61.5-44.7h76l-61.5 44.7z"/>
      <use href="#s" x="225"/>
      <use href="#s" x="450"/>
    </g>
  </svg>
);

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center py-6 px-4 md:py-12">
      <header className="w-full max-w-2xl text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 border border-slate-100 shadow-md p-1">
           <SyrianFlag />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">
          محوّل الليرة السورية
        </h1>
        <div className="flex items-center justify-center gap-2">
          <span className="h-[2px] w-8 bg-emerald-500 rounded-full"></span>
          <p className="text-slate-500 font-medium">الإصدار المعتمد لحذف الصفرين (٢٠٢٦)</p>
          <span className="h-[2px] w-8 bg-emerald-500 rounded-full"></span>
        </div>
      </header>

      <main className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-100">
        <div className="p-6 md:p-10">
          <ConverterCard />
        </div>
      </main>

      <footer className="mt-16 text-slate-400 text-xs text-center space-y-2">
        <div className="flex items-center justify-center gap-4 opacity-50">
           <span>١٠٠ ليرة قديمة = ١ ليرة جديدة</span>
        </div>
        <p className="font-medium uppercase tracking-widest opacity-30">تطبيق وطني خدمي &bull; ٢٠٢٦</p>
      </footer>
    </div>
  );
};

export default App;
