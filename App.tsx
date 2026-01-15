
import React from 'react';
import ConverterCard from './components/ConverterCard';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center py-6 px-4 md:py-12">
      <header className="w-full max-w-2xl text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full mb-6 border border-emerald-100 shadow-inner">
           <span className="text-4xl">🇸🇾</span>
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

      {/* Adding AI Assistant for context-aware help */}
      <AIAssistant />
    </div>
  );
};

export default App;