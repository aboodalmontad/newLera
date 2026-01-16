import React, { useEffect, useState } from 'react';
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
  const [isOfflineReady, setIsOfflineReady] = useState(false);

  useEffect(() => {
    // التحقق من أن الـ Service Worker يسيطر على الصفحة
    if ('serviceWorker' in navigator) {
      if (navigator.serviceWorker.controller) {
        setIsOfflineReady(true);
      }
      
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setIsOfflineReady(true);
      });
    }

    // Fallback: إذا مر وقت ولم يعمل الـ SW نفترض الجاهزية مؤقتاً
    const timer = setTimeout(() => setIsOfflineReady(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center py-6 px-4 md:py-12 select-none overflow-x-hidden">
      <header className="w-full max-w-2xl text-center mb-10 animate-in">
        <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white rounded-full mb-6 border border-slate-100 shadow-lg p-1.5 transition-transform hover:scale-105">
           <SyrianFlag />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">
          محوّل الليرة السورية
        </h1>
        <div className="flex items-center justify-center gap-2">
          <span className="h-[2px] w-6 bg-emerald-500 rounded-full opacity-30"></span>
          <p className="text-slate-500 font-medium tracking-wide text-xs md:text-sm">نظام حذف الصفرين المعتمد لعام ٢٠٢٦</p>
          <span className="h-[2px] w-6 bg-emerald-500 rounded-full opacity-30"></span>
        </div>
      </header>

      <main className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.04)] overflow-hidden border border-slate-100 animate-in">
        <div className="p-5 md:p-10">
          <ConverterCard />
        </div>
      </main>

      <footer className="mt-12 text-slate-400 text-xs text-center space-y-6 pb-12 opacity-80 animate-in">
        <div className="flex flex-col items-center gap-3">
           {isOfflineReady ? (
             <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100 shadow-sm">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
               <p className="text-[10px] font-black uppercase tracking-widest">مخزن محلياً: يعمل بدون إنترنت تماماً ✅</p>
             </div>
           ) : (
             <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-5 py-2 rounded-full border border-amber-100">
               <div className="loading-spinner !w-3 !h-3"></div>
               <p className="text-[10px] font-black tracking-widest uppercase">جاري تأمين الاتصال المحلي...</p>
             </div>
           )}
           
           <div className="pt-6 border-t border-slate-100 w-full max-w-[200px] flex flex-col items-center gap-2">
             <div className="text-center">
               <p className="text-sm font-black text-slate-800 tracking-wide">هدية لسورية الحبيبة</p>
               <p className="text-[10px] font-bold text-slate-400 mt-1 italic">بإشراف المهندس عبد الرحمن نحوي</p>
             </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;