import React, { useEffect, useState } from 'react';
import ConverterCard from './components/ConverterCard';

const SyrianFlag = () => (
  <svg viewBox="0 0 900 600" className="w-full h-full rounded-full shadow-lg" xmlns="http://www.w3.org/2000/svg">
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
  const [offlineStatus, setOfflineStatus] = useState<'loading' | 'ready' | 'not-supported'>('loading');

  useEffect(() => {
    const checkStatus = async () => {
      if (!('serviceWorker' in navigator)) {
        setOfflineStatus('not-supported');
        return;
      }

      try {
        // محاولة الحصول على التسجيل الحالي بأمان
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.active) {
          setOfflineStatus('ready');
        }
      } catch (e) {
        // في حال فشل الوصول (بسبب خطأ Origin المذكور)، ننتقل لوضع "غير مدعوم" بدلاً من التعليق
        setOfflineStatus('not-supported');
      }
    };

    // فحص دوري كل ثانية
    const interval = setInterval(checkStatus, 1000);
    
    // مهلة زمنية قصيرة لضمان عدم بقاء المستخدم في حالة "التحميل" في بيئات المعاينة
    const timeout = setTimeout(() => {
      setOfflineStatus((prev) => prev === 'loading' ? 'not-supported' : prev);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center py-8 px-4 md:py-16 select-none overflow-x-hidden">
      <header className="w-full max-w-2xl text-center mb-12 animate-fade">
        <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white rounded-full mb-6 md:mb-8 border border-slate-100 shadow-xl p-1.5 transition-all hover:scale-110">
           <SyrianFlag />
        </div>
        <h1 className="text-3xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight px-2">
          محوّل الليرة السورية
        </h1>
        <div className="flex items-center justify-center gap-3">
          <span className="h-[2px] w-8 md:w-10 bg-emerald-500 rounded-full opacity-20"></span>
          <p className="text-slate-500 font-bold tracking-wide text-xs md:text-base">الإصدار المستقل المعتمد ٢٠٢٦</p>
          <span className="h-[2px] w-8 md:w-10 bg-emerald-500 rounded-full opacity-20"></span>
        </div>
      </header>

      <main className="w-full max-w-xl bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-[0_32px_80px_rgba(0,0,0,0.06)] overflow-hidden border border-slate-50 animate-fade" style={{animationDelay: '0.1s'}}>
        <div className="p-5 md:p-12">
          <ConverterCard />
        </div>
      </main>

      <footer className="mt-12 md:mt-16 text-slate-400 text-xs text-center space-y-6 pb-16 opacity-90 animate-fade" style={{animationDelay: '0.2s'}}>
        <div className="flex flex-col items-center gap-4">
           {offlineStatus === 'ready' ? (
             <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50/80 px-5 md:px-6 py-2 md:py-2.5 rounded-full border border-emerald-100 shadow-sm backdrop-blur-sm transition-all scale-100 active:scale-95 cursor-default">
               <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
               </span>
               <p className="text-[10px] md:text-[11px] font-black uppercase tracking-widest">جاهز للعمل بدون إنترنت (١٠٠٪)</p>
             </div>
           ) : offlineStatus === 'loading' ? (
             <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-5 md:px-6 py-2 md:py-2.5 rounded-full border border-amber-100">
               <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-[10px] md:text-[11px] font-black tracking-widest uppercase">جاري تهيئة وضع الأوفلاين...</p>
             </div>
           ) : (
             <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-5 md:px-6 py-2 md:py-2.5 rounded-full border border-slate-100 opacity-60">
               <p className="text-[10px] md:text-[11px] font-black tracking-widest uppercase">وضع العرض المباشر</p>
             </div>
           )}
           
           <div className="pt-6 border-t border-slate-100 w-full max-w-[200px] flex flex-col items-center gap-3">
             <div className="text-center">
               <p className="text-sm font-black text-slate-800 tracking-wide">هدية لسورية الحبيبة ❤️</p>
               <p className="text-[10px] font-bold text-slate-400 mt-1 leading-relaxed">عبد الرحمن نحوي</p>
             </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;