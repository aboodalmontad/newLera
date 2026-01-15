import React, { useState, useMemo } from 'react';
import { ConversionMode } from '../types';

const NEW_DENOMINATIONS = [500, 200, 100, 50, 25, 10];

interface DenomMetadata {
  bg: string;
  text: string;
  border: string;
  accent: string;
  secondaryLabel: string;
  icon: string;
}

const DENOM_INFO: Record<number, DenomMetadata> = {
  500: { bg: 'bg-[#faf7e6]', text: 'text-[#78350f]', border: 'border-[#eab308]', accent: 'bg-[#eab308]', secondaryLabel: 'خمس مئة ليرة', icon: '🌾' },
  200: { bg: 'bg-[#f0fdf4]', text: 'text-[#166534]', border: 'border-[#4ade80]', accent: 'bg-[#22c55e]', secondaryLabel: 'مئتا ليرة', icon: '🫒' },
  100: { bg: 'bg-[#fdf2f8]', text: 'text-[#9d174d]', border: 'border-[#f472b6]', accent: 'bg-[#ec4899]', secondaryLabel: 'مئة ليرة', icon: '☁️' },
  50: { bg: 'bg-[#fff7ed]', text: 'text-[#c2410c]', border: 'border-[#fb923c]', accent: 'bg-[#f97316]', secondaryLabel: 'خمسون ليرة', icon: '🍊' },
  25: { bg: 'bg-[#eef2ff]', text: 'text-[#3730a3]', border: 'border-[#818cf8]', accent: 'bg-[#6366f1]', secondaryLabel: 'خمس وعشرون ليرة', icon: '🍇' },
  10: { bg: 'bg-[#fff1f2]', text: 'text-[#be123c]', border: 'border-[#fb7185]', accent: 'bg-[#f43f5e]', secondaryLabel: 'عشر ليرات', icon: '🌹' },
};

interface BanknoteProps {
  value: number;
  count: number;
  onCountChange: (newCount: number) => void;
  onAutoFill: () => void;
  disabled: boolean;
}

const Banknote: React.FC<BanknoteProps> = ({ value, count, onCountChange, onAutoFill, disabled }) => {
  const info = DENOM_INFO[value];

  return (
    <div 
      onClick={() => !disabled && onAutoFill()}
      className={`relative overflow-hidden rounded-[2rem] border-2 ${info.border} ${info.bg} p-5
      shadow-sm transition-all duration-300 
      ${!disabled ? 'cursor-pointer hover:shadow-xl active:scale-95' : 'cursor-default opacity-40 grayscale-[0.3]'} 
      group flex flex-col justify-between aspect-[1.5/1] select-none`}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className={`text-3xl font-black ${info.text} leading-none`}>{value}</span>
          <span className={`text-[8px] font-bold ${info.text} opacity-50 mt-1 uppercase tracking-tighter`}>ليرة سورية جديدة</span>
        </div>
        <div className="text-4xl filter drop-shadow-md transform group-hover:scale-110 transition-transform">{info.icon}</div>
      </div>

      <div className="flex justify-between items-end gap-2">
        <div className={`text-[10px] font-bold ${info.text} opacity-60`}>{info.secondaryLabel}</div>
        <div 
          className="relative"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="number"
            value={count || ''}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              onCountChange(isNaN(val) ? 0 : val);
            }}
            placeholder="٠"
            className={`w-14 h-10 bg-white/90 backdrop-blur-md rounded-xl text-center font-black ${info.text} 
            border border-black/5 shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all`}
          />
          {count > 0 && (
            <div className="absolute -top-3 -right-2 bg-emerald-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
              العدد
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ConverterCard: React.FC = () => {
  const [mode, setMode] = useState<ConversionMode>(ConversionMode.OLD_TO_NEW);
  const [inputValue, setInputValue] = useState<string>('');
  const [wallet, setWallet] = useState<Record<number, number>>({});

  const targetValueNew = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val) || val < 0) return 0;
    return mode === ConversionMode.OLD_TO_NEW ? val / 100 : val;
  }, [inputValue, mode]);

  const walletTotal = useMemo<number>(() => {
    return Object.entries(wallet).reduce((acc: number, [denom, count]) => acc + (Number(denom) * (Number(count) || 0)), 0);
  }, [wallet]);

  const result = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val) || val < 0) return 0;
    return mode === ConversionMode.OLD_TO_NEW ? val / 100 : val * 100;
  }, [inputValue, mode]);

  // منطق الملء التلقائي المطور: يكمل المبلغ المتبقي باستخدام هذه الفئة دون مسح السابق
  const handleAutoFill = (denom: number) => {
    if (targetValueNew === 0) return;
    
    const remaining = targetValueNew - walletTotal;
    if (remaining <= 0) return;

    const addedCount = Math.floor(remaining / denom);
    if (addedCount > 0) {
      setWallet(prev => ({
        ...prev,
        [denom]: (prev[denom] || 0) + addedCount
      }));
    }
  };

  // منطق التعديل اليدوي: يمنع تجاوز الإجمالي
  const handleCountChange = (denom: number, requestedCount: number) => {
    if (targetValueNew === 0) {
      setWallet(prev => ({ ...prev, [denom]: requestedCount }));
      return;
    }

    const otherTotal = Object.entries(wallet).reduce((acc: number, [d, c]) => {
      const dNum = Number(d);
      if (dNum === denom) return acc;
      return acc + (dNum * (Number(c) || 0));
    }, 0);

    const maxAllowed = Math.floor((targetValueNew - otherTotal) / denom);
    const finalCount = Math.max(0, Math.min(requestedCount, maxAllowed));

    setWallet(prev => ({
      ...prev,
      [denom]: finalCount
    }));
  };

  const toggleMode = () => {
    setMode(prev => prev === ConversionMode.OLD_TO_NEW ? ConversionMode.NEW_TO_OLD : ConversionMode.OLD_TO_NEW);
    setInputValue('');
    setWallet({});
  };

  const progressPercentage = targetValueNew > 0 ? (walletTotal / targetValueNew) * 100 : 0;
  const isComplete = Math.abs(walletTotal - targetValueNew) < 0.01 && targetValueNew > 0;

  return (
    <div className="space-y-8 animate-in">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">اتجاة التحويل الحالي</p>
          <p className="text-base font-black text-slate-800">
            {mode === ConversionMode.OLD_TO_NEW ? 'من القديمة إلى الجديدة' : 'من الجديدة إلى القديمة'}
          </p>
        </div>
        <button 
          onClick={toggleMode}
          className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-emerald-600 hover:text-emerald-700 hover:border-emerald-200 transition-all active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      {/* Input Section */}
      <div className="relative">
        <label className="block text-slate-400 text-[10px] font-bold mb-2 pr-2 uppercase tracking-[0.3em]">المبلغ المطلوب تحويله</label>
        <div className="relative">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setWallet({}); 
            }}
            placeholder="٠"
            className="w-full text-5xl font-black py-7 px-8 rounded-[2.5rem] border-2 border-slate-100 focus:border-emerald-500 focus:ring-8 focus:ring-emerald-50 outline-none transition-all placeholder:text-slate-100 pr-12 text-right"
            dir="rtl"
          />
          <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-sm bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            {mode === ConversionMode.OLD_TO_NEW ? 'ليرة قديمة' : 'ليرة جديدة'}
          </div>
        </div>
      </div>

      {/* Result Card */}
      {inputValue && (
        <div className={`p-8 rounded-[2.5rem] shadow-2xl transition-all duration-500 transform ${mode === ConversionMode.OLD_TO_NEW ? 'bg-emerald-600' : 'bg-amber-500'} text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <p className="text-white/60 text-[10px] font-bold mb-2 uppercase tracking-widest">المبلغ الصافي:</p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight" dir="ltr">
              {result.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </h2>
            <span className="text-xl font-bold opacity-80 whitespace-nowrap">
              {mode === ConversionMode.OLD_TO_NEW ? 'ليرة جديدة' : 'ليرة قديمة'}
            </span>
          </div>
          <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center text-[10px] font-bold opacity-50">
             <span>١٠٠ ليرة قديمة = ١ ليرة جديدة</span>
             <span className="bg-white/10 px-2 py-1 rounded">إصدار ٢٠٢٦</span>
          </div>
        </div>
      )}

      {/* Progress & Denomination Grid */}
      <div className="space-y-6 pt-6 border-t border-slate-100">
        {targetValueNew > 0 && (
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <span className="text-lg">📦</span> تجميع المبلغ
              </h3>
              {walletTotal > 0 && (
                <button 
                  onClick={() => setWallet({})}
                  className="text-[10px] font-bold text-red-400 hover:text-red-600 underline"
                >
                  إعادة تعيين
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full transition-all duration-700 ${isComplete ? 'bg-emerald-500' : 'bg-emerald-400 animate-pulse'}`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-end font-black">
                <div className={`text-4xl leading-none ${isComplete ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {walletTotal.toLocaleString()}
                  <span className="text-sm text-slate-400 font-bold mx-2">/ {targetValueNew.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-end">
                  {!isComplete && (
                    <span className="text-xs text-amber-500 mb-1">المتبقي: {(targetValueNew - walletTotal).toLocaleString()}</span>
                  )}
                  {isComplete && <span className="text-xs text-emerald-600 mb-1 font-bold">اكتمل التجميع بنجاح ✅</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">انقر لإكمال المبلغ بهذه الفئة، أو عدّل العدد يدوياً</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {NEW_DENOMINATIONS.map(denom => (
            <Banknote 
              key={denom} 
              value={denom} 
              count={wallet[denom] || 0}
              onCountChange={(newCount) => handleCountChange(denom, newCount)}
              onAutoFill={() => handleAutoFill(denom)}
              disabled={targetValueNew === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConverterCard;