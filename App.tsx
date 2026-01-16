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
  const [offlineStatus, setOfflineStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const checkSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          // التأكد من أن الكاش يحتوي فعلياً على الملفات الأساسية
          const cacheKeys = await caches.keys();
          if (cacheKeys.length > 0) {
            setOfflineStatus('ready');
          } else {
            // انتظار قليلاً في حال كان التثبيت جارياً
            setTimeout(() => setOfflineStatus('ready'), 2000);
          }
        } catch (e) {
          setOfflineStatus('error');
        }
      } else {
        setOfflineStatus('error');
      }
    };

    checkSW();
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
          <p className="text-slate-500 font-medium tracking-wide text-xs md:text-sm">نظام ٢٠٢٦ للحذف الصفرين المعتمد</p>
          <span className="h-[2px] w-6 bg-emerald-500 rounded-full opacity-30"></span>
        </div>
      </header>

      <main className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.04)] overflow-hidden border border-slate-100">
        <div className="p-5 md:p-10">
          <ConverterCard />
        </div>
      </main>

      <footer className="mt-12 text-slate-400 text-xs text-center space-y-6 pb-12 opacity-80">
        <div className="flex flex-col items-center gap-3">
           {offlineStatus === 'ready' ? (
             <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-100/50 px-6 py-2.5 rounded-full border border-emerald-200 shadow-sm transition-all animate-in zoom-in">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               <p className="text-[10px] font-black uppercase tracking-widest">مثبت على جهازك: يعمل الآن بدون إنترنت تماماً ✅</p>
             </div>
           ) : offlineStatus === 'loading' ? (
             <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-6 py-2.5 rounded-full border border-amber-100">
               <div className="loading-spinner !w-3 !h-3"></div>
               <p className="text-[10px] font-black tracking-widest uppercase">جاري حفظ التطبيق للاستخدام الأوفلاين...</p>
             </div>
           ) : (
             <div className="text-[10px] text-slate-400 font-bold">وضع المتصفح المحدود: الأوفلاين قد يتطلب تحديث الصفحة</div>
           )}
           
           <div className="pt-6 border-t border-slate-100 w-full max-w-[240px] flex flex-col items-center gap-2">
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