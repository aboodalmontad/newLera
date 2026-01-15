import React, { useEffect, useState } from 'react';
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
  const [isOfflineReady, setIsOfflineReady] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      if (navigator.serviceWorker.controller) {
        setIsOfflineReady(true);
      } else {
        navigator.serviceWorker.ready.then(() => {
          setIsOfflineReady(true);
        });
      }

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setIsOfflineReady(true);
      });
    }

    // مؤقت أمان للتأكد من تحديث الحالة للمستخدم
    const safetyTimer = setTimeout(() => {
      setIsOfflineReady(true);
    }, 4000);

    return () => clearTimeout(safetyTimer);
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center py-6 px-4 md:py-12 select-none overflow-x-hidden">
      <header className="w-full max-w-2xl text-center mb-10 animate-in">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 border border-slate-100 shadow-lg p-1.5 transition-transform hover:scale-105">
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

      <main className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.04)] overflow-hidden border border-slate-100 animate-in delay-100">
        <div className="p-6 md:p-10">
          <ConverterCard />
        </div>
      </main>

      <footer className="mt-16 text-slate-400 text-xs text-center space-y-4 pb-12 opacity-80 animate-in delay-100">
        <div className="flex flex-col items-center gap-3">
           <div className="flex flex-col items-center gap-1">
             <p className="font-black uppercase tracking-[0.3em] text-slate-400">تطبيق وطني خدمي سريع &bull; ٢٠٢٦</p>
             
             {isOfflineReady ? (
               <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 animate-in zoom-in">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                 <p className="text-[10px] font-bold">جاهز للعمل بدون إنترنت ✅</p>
               </div>
             ) : (
               <div className="flex items-center gap-1.5 text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">
                 <span className="w-2 h-2 bg-slate-300 rounded-full animate-pulse"></span>
                 <p className="text-[10px] font-bold">جاري تأمين النسخة الاحتياطية...</p>
               </div>
             )}
           </div>
           
           <div className="pt-6 border-t border-slate-100 w-48 flex flex-col items-center gap-2">
             <span className="text-red-500 text-lg">❤️</span>
             <div className="space-y-1 text-center">
               <p className="text-sm font-black text-slate-800 tracking-wide">هدية لسورية الحبيبة</p>
               <p className="text-xs font-bold text-slate-500 italic">عبد الرحمن نحوي</p>
             </div>
           </div>
        </div>
      </footer>

      {/* المساعد الذكي */}
      <AIAssistant />
    </div>
  );
};

export default App;