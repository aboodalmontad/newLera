
import React, { useState, useMemo } from 'react';
import { ConversionMode, DenominationBreakdown } from '../types';

const NEW_DENOMINATIONS = [500, 200, 100, 50, 25, 10];

interface DenomMetadata {
  bg: string;
  text: string;
  border: string;
  accent: string;
  motif: string;
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
    motif: '🌾', 
    label: 'سنابل القمح',
    secondaryLabel: 'خمس مئة ليرة',
    icon: '🌾'
  },
  200: { 
    bg: 'bg-[#f0fdf4]', 
    text: 'text-[#166534]', 
    border: 'border-[#4ade80]', 
    accent: 'bg-[#22c55e]', 
    motif: '🫒', 
    label: 'غصن الزيتون',
    secondaryLabel: 'مئتا ليرة',
    icon: '🫒'
  },
  100: { 
    bg: 'bg-[#fdf2f8]', 
    text: 'text-[#9d174d]', 
    border: 'border-[#f472b6]', 
    accent: 'bg-[#ec4899]', 
    motif: '☁️', 
    label: 'أزهار القطن',
    secondaryLabel: 'مئة ليرة',
    icon: '☁️'
  },
  50: { 
    bg: 'bg-[#fff7ed]', 
    text: 'text-[#c2410c]', 
    border: 'border-[#fb923c]', 
    accent: 'bg-[#f97316]', 
    motif: '🍊', 
    label: 'ثمار البرتقال',
    secondaryLabel: 'خمسون ليرة',
    icon: '🍊'
  },
  25: { 
    bg: 'bg-[#eef2ff]', 
    text: 'text-[#3730a3]', 
    border: 'border-[#818cf8]', 
    accent: 'bg-[#6366f1]', 
    motif: '🍇', 
    label: 'ثمار التوت',
    secondaryLabel: 'خمس وعشرون ليرة',
    icon: '🍇'
  },
  10: { 
    bg: 'bg-[#fff1f2]', 
    text: 'text-[#be123c]', 
    border: 'border-[#fb7185]', 
    accent: 'bg-[#f43f5e]', 
    motif: '🌹', 
    label: 'الوردة الشامية',
    secondaryLabel: 'عشر ليرات',
    icon: '🌹'
  },
};

const Banknote: React.FC<{ 
  value: number; 
  count?: number; 
  size?: 'sm' | 'md';
  onClick?: () => void;
  disabled?: boolean;
}> = ({ value, count, size = 'md', onClick, disabled }) => {
  const info = DENOM_INFO[value];
  const isSmall = size === 'sm';

  return (
    <div 
      onClick={!disabled ? onClick : undefined}
      className={`relative overflow-hidden rounded-xl border-2 ${info.border} ${info.bg} ${isSmall ? 'p-3' : 'p-5'} 
      shadow-sm transition-all duration-200 
      ${!disabled && onClick ? 'cursor-pointer hover:shadow-lg active:scale-95' : 'cursor-default'} 
      ${disabled ? 'opacity-40 grayscale-[0.5] scale-[0.98]' : ''}
      group flex flex-col justify-between aspect-[1.8/1] select-none`}
    >
      <div className={`absolute top-0 right-[25%] bottom-0 w-1 ${info.accent} opacity-10 border-x border-black/5`}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-black">
           <path d="M50 0 L61 39 L100 50 L61 61 L50 100 L39 61 L0 50 L39 39 Z" />
        </svg>
      </div>

      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col">
          <span className={`${isSmall ? 'text-xl' : 'text-3xl'} font-black ${info.text} leading-none`}>{value}</span>
          <span className={`text-[8px] font-bold ${info.text} opacity-60 leading-tight mt-1`}>مصرف سورية المركزي</span>
        </div>
        <div className={`${isSmall ? 'text-2xl' : 'text-4xl'} filter drop-shadow-sm`}>{info.icon}</div>
      </div>

      <div className="flex justify-between items-end relative z-10">
        <div className="max-w-[70%]">
          <div className={`text-[7px] font-bold ${info.text} opacity-50 uppercase tracking-tighter mb-0.5`}>{info.label}</div>
          <div className={`${isSmall ? 'text-[9px]' : 'text-xs'} font-black ${info.text}`}>{info.secondaryLabel}</div>
        </div>
        {count !== undefined && count > 0 && (
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-black/5 shadow-sm">
             <span className={`text-sm font-black ${info.text}`}>{count}</span>
             <span className={`text-[9px] font-bold ${info.text} mr-1`}>ورقة</span>
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

  const result = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val) || val < 0) return 0;
    return mode === ConversionMode.OLD_TO_NEW ? val / 100 : val * 100;
  }, [inputValue, mode]);

  const targetValueNew = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val) || val < 0) return 0;
    return mode === ConversionMode.OLD_TO_NEW ? val / 100 : val;
  }, [inputValue, mode]);

  const walletTotal = useMemo<number>(() => {
    return Object.entries(wallet).reduce((acc: number, [denom, count]) => acc + (Number(denom) * (Number(count) || 0)), 0);
  }, [wallet]);

  const addToWallet = (denom: number) => {
    if (targetValueNew > 0 && walletTotal + denom > targetValueNew) return;
    setWallet(prev => ({
      ...prev,
      [denom]: (prev[denom] || 0) + 1
    }));
  };

  const handleManualCountChange = (denom: number, value: string) => {
    const count = parseInt(value);
    if (isNaN(count) || count <= 0) {
      setWallet(prev => {
        const next = { ...prev };
        delete next[denom];
        return next;
      });
      return;
    }
    setWallet(prev => ({
      ...prev,
      [denom]: count
    }));
  };

  const toggleMode = () => {
    setMode(prev => prev === ConversionMode.OLD_TO_NEW ? ConversionMode.NEW_TO_OLD : ConversionMode.OLD_TO_NEW);
    setInputValue('');
    setWallet({});
  };

  const clearWallet = () => setWallet({});

  const progressPercentage = targetValueNew > 0 ? (walletTotal / targetValueNew) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-inner">
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">اتجاة التحويل</p>
          <div className="flex items-center gap-2">
             <div className={`w-2.5 h-2.5 rounded-full ${mode === ConversionMode.OLD_TO_NEW ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`}></div>
             <p className="text-lg font-bold text-slate-800">
              {mode === ConversionMode.OLD_TO_NEW ? 'من القديمة إلى الجديدة' : 'من الجديدة إلى القديمة'}
            </p>
          </div>
        </div>
        <button 
          onClick={toggleMode}
          className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 transition-all active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      {/* Input Field */}
      <div className="relative">
        <label className="block text-slate-500 text-xs font-bold mb-2 pr-2 uppercase tracking-widest">المبلغ المراد تحويله</label>
        <div className="relative group">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setWallet({}); 
            }}
            placeholder="أدخل المبلغ هنا..."
            className="w-full text-4xl font-black py-7 px-8 rounded-[2rem] border-2 border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all placeholder:text-slate-200 pr-12 text-right"
            dir="rtl"
          />
          <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-sm bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            {mode === ConversionMode.OLD_TO_NEW ? 'ليرة قديمة' : 'ليرة جديدة'}
          </div>
        </div>
      </div>

      {/* Result Display */}
      {inputValue && (
        <div className={`p-8 rounded-[2.5rem] shadow-2xl transition-all duration-500 transform ${mode === ConversionMode.OLD_TO_NEW ? 'bg-gradient-to-br from-emerald-600 to-teal-700' : 'bg-gradient-to-br from-amber-500 to-orange-600'} text-white animate-in`}>
          <p className="text-white/70 text-xs font-bold mb-2 uppercase tracking-widest">القيمة المقابلة:</p>
          <div className="flex items-baseline gap-3 overflow-hidden">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight truncate" dir="ltr">
              {result.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </h2>
            <span className="text-xl font-bold opacity-80 whitespace-nowrap">
              {mode === ConversionMode.OLD_TO_NEW ? 'ليرة جديدة' : 'ليرة قديمة'}
            </span>
          </div>
          <div className="mt-5 pt-4 border-t border-white/20 flex justify-between items-center text-[10px] font-bold opacity-70">
             <span>١٠٠ ليرة قديمة = ١ ليرة جديدة</span>
             <span className="bg-white/10 px-2 py-1 rounded">إصدار ٢٠٢٦</span>
          </div>
        </div>
      )}

      {/* Manual Counter / Wallet Section */}
      {targetValueNew > 0 && (
        <div className="mt-12 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4 animate-in">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-black text-slate-800">تجميع المبلغ (محفظتي)</h3>
            </div>
            {walletTotal > 0 && (
              <button 
                onClick={clearWallet}
                className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-wider transition-colors"
              >
                تفريغ المحفظة
              </button>
            )}
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl text-center space-y-4">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-2">التقدم نحو المبلغ المطلوب</p>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${progressPercentage >= 100 ? 'bg-emerald-500' : 'bg-emerald-400 animate-pulse'}`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-4xl font-black text-slate-800">
                {walletTotal.toLocaleString()} <span className="text-sm text-slate-400 font-medium">/ {targetValueNew.toLocaleString()}</span>
              </div>
              <div className={`font-bold text-xs mt-1 transition-colors ${progressPercentage >= 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {progressPercentage >= 100 ? 'تم تجميع كامل المبلغ بنجاح ✅' : `متبقي ${(targetValueNew - walletTotal).toLocaleString()} ليرة جديدة`}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(wallet).sort((a,b) => Number(b[0]) - Number(a[0])).map(([denom, count]) => (
              <div key={denom} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group hover:border-emerald-200 transition-all">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${DENOM_INFO[Number(denom)].bg} flex items-center justify-center text-lg`}>
                      {DENOM_INFO[Number(denom)].icon}
                    </div>
                    <div>
                      <span className="text-sm font-black text-slate-700 block leading-none">{denom} ليرة</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">فئة نقدية</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input 
                      type="number"
                      value={count}
                      onChange={(e) => handleManualCountChange(Number(denom), e.target.value)}
                      className="w-16 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5 text-center text-sm font-black text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                      min="0"
                    />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                       <span className="text-[8px] font-bold text-slate-400">العدد</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleManualCountChange(Number(denom), '0')}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="حذف من المحفظة"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            {Object.keys(wallet).length === 0 && (
              <div className="col-span-full py-8 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                <p className="text-slate-300 text-sm font-medium">المحفظة فارغة حالياً</p>
                <p className="text-slate-400 text-[10px] mt-1">اختر الفئات من الأسفل أو أدخل العدد يدوياً</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Banknote Gallery & Interaction */}
      <div className="mt-16 pt-10 border-t border-slate-100">
        <h3 className="text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-10">
          {targetValueNew > 0 ? 'انقر لإضافة ورقة نقدية إلى محفظتك' : 'دليل الفئات النقدية الجديدة ٢٠٢٦'}
        </h3>
        <div className="grid grid-cols-2 gap-5">
          {NEW_DENOMINATIONS.sort((a,b) => a-b).map(val => (
            <Banknote 
              key={val} 
              value={val} 
              size="sm" 
              onClick={() => addToWallet(val)}
              count={wallet[val]}
              disabled={targetValueNew > 0 && walletTotal + val > targetValueNew && !wallet[val]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConverterCard;
