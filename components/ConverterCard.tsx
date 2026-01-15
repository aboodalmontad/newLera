import React, { useState, useMemo } from 'react';
import { ConversionMode } from '../types';

const NEW_DENOMINATIONS = [500, 200, 100, 50, 25, 10];

interface DenomMetadata {
  bg: string;
  text: string;
  border: string;
  accent: string;
  label: string;
  secondaryLabel: string;
  icon: string;
}

const DENOM_INFO: Record<number, DenomMetadata> = {
  500: { 
    bg: 'bg-[#faf7e6]', 
    text: 'text-[#78350f]', 
    border: 'border-[#eab308]', 
    accent: 'bg-[#eab308]', 
    label: 'سنابل القمح',
    secondaryLabel: 'خمس مئة ليرة',
    icon: '🌾'
  },
  200: { 
    bg: 'bg-[#f0fdf4]', 
    text: 'text-[#166534]', 
    border: 'border-[#4ade80]', 
    accent: 'bg-[#22c55e]', 
    label: 'غصن الزيتون',
    secondaryLabel: 'مئتا ليرة',
    icon: '🫒'
  },
  100: { 
    bg: 'bg-[#fdf2f8]', 
    text: 'text-[#9d174d]', 
    border: 'border-[#f472b6]', 
    accent: 'bg-[#ec4899]', 
    label: 'أزهار القطن',
    secondaryLabel: 'مئة ليرة',
    icon: '☁️'
  },
  50: { 
    bg: 'bg-[#fff7ed]', 
    text: 'text-[#c2410c]', 
    border: 'border-[#fb923c]', 
    accent: 'bg-[#f97316]', 
    label: 'ثمار البرتقال',
    secondaryLabel: 'خمسون ليرة',
    icon: '🍊'
  },
  25: { 
    bg: 'bg-[#eef2ff]', 
    text: 'text-[#3730a3]', 
    border: 'border-[#818cf8]', 
    accent: 'bg-[#6366f1]', 
    label: 'ثمار التوت',
    secondaryLabel: 'خمس وعشرون ليرة',
    icon: '🍇'
  },
  10: { 
    bg: 'bg-[#fff1f2]', 
    text: 'text-[#be123c]', 
    border: 'border-[#fb7185]', 
    accent: 'bg-[#f43f5e]', 
    label: 'الوردة الشامية',
    secondaryLabel: 'عشر ليرات',
    icon: '🌹'
  },
};

const Banknote: React.FC<{ 
  value: number; 
  count?: number; 
  onClick?: () => void;
  disabled?: boolean;
}> = ({ value, count, onClick, disabled }) => {
  const info = DENOM_INFO[value];

  return (
    <div 
      onClick={!disabled ? onClick : undefined}
      className={`relative overflow-hidden rounded-2xl border-2 ${info.border} ${info.bg} p-4
      shadow-sm transition-all duration-200 
      ${!disabled && onClick ? 'cursor-pointer hover:shadow-md active:scale-95' : 'cursor-default'} 
      ${disabled ? 'opacity-30 grayscale' : 'opacity-100'}
      group flex flex-col justify-between aspect-[1.6/1] select-none`}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-2xl font-black text-slate-800 leading-none">{value}</span>
          <span className="text-[7px] font-bold text-slate-400 mt-0.5">سورية</span>
        </div>
        <div className="text-3xl filter drop-shadow-sm">{info.icon}</div>
      </div>

      <div className="flex justify-between items-end">
        <div className="text-[9px] font-bold text-slate-500">{info.secondaryLabel}</div>
        {count !== undefined && count > 0 && (
          <div className="bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-black/5 shadow-xs">
             <span className="text-xs font-black text-slate-800">{count}</span>
          </div>
        )}
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

  const handleManualCountChange = (denom: number, requestedValue: string) => {
    let count = parseInt(requestedValue);
    if (isNaN(count) || count < 0) count = 0;

    // Fix for line 138: Explicitly typing the accumulator and ensuring numeric values for arithmetic operations.
    const otherTotal = Object.entries(wallet).reduce((acc: number, [d, c]) => {
      const dNum = Number(d);
      if (dNum === denom) return acc;
      return acc + (dNum * (c as number || 0));
    }, 0);

    // المنطق: لا نسمح بتجاوز المبلغ المطلوب
    const maxAllowed = Math.floor((targetValueNew - otherTotal) / denom);
    const finalCount = Math.min(count, maxAllowed > 0 ? maxAllowed : 0);

    setWallet(prev => ({
      ...prev,
      [denom]: finalCount
    }));
  };

  const addToWallet = (denom: number) => {
    if (walletTotal + denom > targetValueNew) return;
    setWallet(prev => ({
      ...prev,
      [denom]: (prev[denom] || 0) + 1
    }));
  };

  const toggleMode = () => {
    setMode(prev => prev === ConversionMode.OLD_TO_NEW ? ConversionMode.NEW_TO_OLD : ConversionMode.OLD_TO_NEW);
    setInputValue('');
    setWallet({});
  };

  const clearWallet = () => setWallet({});

  const progressPercentage = targetValueNew > 0 ? (walletTotal / targetValueNew) * 100 : 0;
  const isComplete = Math.abs(walletTotal - targetValueNew) < 0.01 && targetValueNew > 0;

  return (
    <div className="space-y-8">
      {/* Switcher */}
      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">نظام التحويل</p>
          <p className="text-base font-bold text-slate-800">
            {mode === ConversionMode.OLD_TO_NEW ? 'من القديمة إلى الجديدة' : 'من الجديدة إلى القديمة'}
          </p>
        </div>
        <button 
          onClick={toggleMode}
          className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-200 text-emerald-600 hover:bg-emerald-50 transition-all active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      {/* Input */}
      <div className="relative">
        <label className="block text-slate-400 text-[10px] font-bold mb-1.5 pr-2 uppercase tracking-widest">المبلغ المراد تحويله</label>
        <div className="relative">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setWallet({}); 
            }}
            placeholder="0.00"
            className="w-full text-4xl font-black py-6 px-6 rounded-3xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all placeholder:text-slate-100 pr-12 text-right"
            dir="rtl"
          />
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
            {mode === ConversionMode.OLD_TO_NEW ? 'قديمة' : 'جديدة'}
          </div>
        </div>
      </div>

      {/* Result */}
      {inputValue && (
        <div className={`p-6 rounded-3xl shadow-xl transition-all duration-300 ${mode === ConversionMode.OLD_TO_NEW ? 'bg-emerald-600' : 'bg-amber-500'} text-white`}>
          <p className="text-white/60 text-[10px] font-bold mb-1 uppercase tracking-widest">القيمة الناتجة:</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-black tracking-tight truncate">
              {result.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </h2>
            <span className="text-sm font-bold opacity-80">
              {mode === ConversionMode.OLD_TO_NEW ? 'ليرة جديدة' : 'ليرة قديمة'}
            </span>
          </div>
        </div>
      )}

      {/* Wallet Progress */}
      {targetValueNew > 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">💰</span>
              <h3 className="font-bold text-slate-800 text-sm">تجميع المبلغ (محفظتي)</h3>
            </div>
            {walletTotal > 0 && (
              <button onClick={clearWallet} className="text-[10px] font-bold text-red-400 hover:text-red-500">تفريغ</button>
            )}
          </div>

          <div className="space-y-2">
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${isComplete ? 'bg-emerald-500' : 'bg-emerald-400 animate-pulse'}`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className={isComplete ? 'text-emerald-600' : 'text-slate-400'}>
                {isComplete ? 'تم تجميع المبلغ بالكامل ✅' : `${walletTotal.toLocaleString()} / ${targetValueNew.toLocaleString()}`}
              </span>
              {!isComplete && (
                <span className="text-amber-500">المتبقي: {(targetValueNew - walletTotal).toLocaleString()}</span>
              )}
            </div>
          </div>

          {/* Denomination Manual Inputs */}
          <div className="grid grid-cols-2 gap-3">
            {NEW_DENOMINATIONS.map(denom => (
              <div key={denom} className="flex flex-col gap-1.5 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black text-slate-500">{denom} ليرة</span>
                   <span className="text-xs">{DENOM_INFO[denom].icon}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="number"
                    value={wallet[denom] || ''}
                    onChange={(e) => handleManualCountChange(denom, e.target.value)}
                    placeholder="0"
                    disabled={isComplete && !wallet[denom]}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-center text-sm font-black text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:opacity-50"
                  />
                  <button 
                    onClick={() => addToWallet(denom)}
                    disabled={isComplete || (walletTotal + denom > targetValueNew)}
                    className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 disabled:opacity-30 disabled:hover:bg-emerald-100 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guide / Quick Gallery */}
      <div className="mt-10 pt-8 border-t border-slate-100">
        <p className="text-center text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-6">
          انقر للإضافة السريعة أو أدخل العدد يدوياً أعلاه
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {NEW_DENOMINATIONS.map(val => (
            <Banknote 
              key={val} 
              value={val} 
              onClick={() => addToWallet(val)}
              count={wallet[val]}
              disabled={targetValueNew > 0 && (walletTotal + val > targetValueNew) && !isComplete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConverterCard;