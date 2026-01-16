import React, { useState, useMemo } from 'react';
import { ConversionMode } from '../types';

const NEW_DENOMINATIONS = [500, 200, 100, 50, 25, 10];

interface DenomMetadata {
  bg: string;
  text: string;
  border: string;
  secondaryLabel: string;
  icon: string;
}

const DENOM_INFO: Record<number, DenomMetadata> = {
  500: { bg: 'bg-[#faf7e6]', text: 'text-[#78350f]', border: 'border-[#eab308]', secondaryLabel: 'خمس مئة', icon: '🌾' },
  200: { bg: 'bg-[#f0fdf4]', text: 'text-[#166534]', border: 'border-[#4ade80]', secondaryLabel: 'مئتا ليرة', icon: '🫒' },
  100: { bg: 'bg-[#fdf2f8]', text: 'text-[#9d174d]', border: 'border-[#f472b6]', secondaryLabel: 'مئة ليرة', icon: '☁️' },
  50: { bg: 'bg-[#fff7ed]', text: 'text-[#c2410c]', border: 'border-[#fb923c]', secondaryLabel: 'خمسون', icon: '🍊' },
  25: { bg: 'bg-[#eef2ff]', text: 'text-[#3730a3]', border: 'border-[#818cf8]', secondaryLabel: '٢٥ ليرة', icon: '🍇' },
  10: { bg: 'bg-[#fff1f2]', text: 'text-[#be123c]', border: 'border-[#fb7185]', secondaryLabel: 'عشر ليرات', icon: '🌹' },
};

const Banknote: React.FC<{ value: number; count: number; onCountChange: (v: number) => void; onAutoFill: () => void; disabled: boolean }> = ({ value, count, onCountChange, onAutoFill, disabled }) => {
  const info = DENOM_INFO[value];
  return (
    <div 
      onClick={() => !disabled && onAutoFill()}
      className={`relative overflow-hidden rounded-3xl border-2 ${info.border} ${info.bg} p-4 md:p-6 transition-all duration-300 ${!disabled ? 'cursor-pointer hover:shadow-lg active:scale-95' : 'opacity-40 grayscale-[0.3]'} group flex flex-col justify-between select-none min-h-[120px]`}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className={`text-2xl md:text-3xl font-black ${info.text} leading-none`}>{value}</span>
          <span className={`text-[8px] font-bold ${info.text} opacity-50 uppercase`}>جديدة</span>
        </div>
        <div className="text-3xl md:text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform">{info.icon}</div>
      </div>
      <div className="flex justify-between items-end gap-2 mt-2">
        <div className={`text-[10px] font-bold ${info.text} opacity-60`}>{info.secondaryLabel}</div>
        <input
          type="number"
          value={count || ''}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onCountChange(parseInt(e.target.value) || 0)}
          placeholder="٠"
          className={`w-14 h-10 md:w-16 md:h-12 bg-white/90 rounded-xl text-center text-lg font-black ${info.text} border border-black/5 outline-none`}
        />
      </div>
    </div>
  );
};

const ConverterCard: React.FC = () => {
  const [mode, setMode] = useState<ConversionMode>(ConversionMode.OLD_TO_NEW);
  const [inputValue, setInputValue] = useState<string>('');
  const [wallet, setWallet] = useState<Record<number, number>>({});

  const numericValue = useMemo(() => parseFloat(inputValue.replace(/,/g, '')) || 0, [inputValue]);
  const targetValueNew = useMemo(() => mode === ConversionMode.OLD_TO_NEW ? numericValue / 100 : numericValue, [numericValue, mode]);
  const resultValue = useMemo(() => mode === ConversionMode.OLD_TO_NEW ? numericValue / 100 : numericValue * 100, [numericValue, mode]);
  const walletTotal = useMemo(() => Object.entries(wallet).reduce((acc, [d, c]) => acc + (Number(d) * (Number(c) || 0)), 0), [wallet]);
  
  const progressPercentage = targetValueNew > 0 ? (walletTotal / targetValueNew) * 100 : 0;
  const isComplete = Math.abs(walletTotal - targetValueNew) < 0.01 && targetValueNew > 0;

  const handleAutoFill = (denom: number) => {
    const remaining = targetValueNew - walletTotal;
    if (remaining <= 0) return;
    const added = Math.floor(remaining / denom);
    if (added > 0) setWallet(p => ({ ...p, [denom]: (p[denom] || 0) + added }));
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade">
      {/* Switcher */}
      <div className="flex items-center justify-between bg-slate-100/50 p-2 rounded-2xl border border-slate-200 shadow-inner">
        <div className="pr-3">
          <p className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">النمط</p>
          <p className="text-xs md:text-sm font-black text-slate-800">{mode === ConversionMode.OLD_TO_NEW ? 'من القديمة للجديدة' : 'من الجديدة للقديمة'}</p>
        </div>
        <button onClick={() => {setMode(m => m === ConversionMode.OLD_TO_NEW ? ConversionMode.NEW_TO_OLD : ConversionMode.OLD_TO_NEW); setInputValue(''); setWallet({});}} className="p-3 bg-white rounded-xl shadow-sm text-emerald-600 hover:bg-emerald-50 active:scale-90 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
        </button>
      </div>

      {/* Main Input */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المبلغ المراد تحويله</label>
          <span className={`px-2 py-1 rounded text-[9px] font-black ${mode === ConversionMode.OLD_TO_NEW ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {mode === ConversionMode.OLD_TO_NEW ? 'بالعملة القديمة' : 'بالعملة الجديدة'}
          </span>
        </div>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={inputValue}
            onChange={(e) => {
              const val = e.target.value.replace(/,/g, '');
              if (/^\d*$/.test(val)) setInputValue(val ? Number(val).toLocaleString() : '');
            }}
            placeholder="٠"
            className="w-full text-4xl md:text-6xl font-black py-6 md:py-10 px-6 md:px-10 rounded-[2rem] md:rounded-[3rem] border-2 border-slate-100 focus:border-emerald-500 outline-none text-right shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Result Card */}
      {inputValue && (
        <div className={`p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl text-white relative overflow-hidden transition-all ${mode === ConversionMode.OLD_TO_NEW ? 'bg-emerald-600' : 'bg-amber-500'}`}>
          <p className="text-white/60 text-[10px] font-bold mb-2 uppercase">المبلغ المقابل:</p>
          <div className="flex items-baseline flex-wrap gap-2">
            <h2 className="text-4xl md:text-6xl font-black tabular-nums">{resultValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h2>
            <span className="text-sm md:text-lg font-bold opacity-80">{mode === ConversionMode.OLD_TO_NEW ? 'ليرة جديدة' : 'ليرة قديمة'}</span>
          </div>
        </div>
      )}

      {/* Progress & Grid */}
      <div className="pt-6 border-t border-slate-100 space-y-6">
        {targetValueNew > 0 && (
          <div className="bg-slate-50 p-4 md:p-6 rounded-[2rem] border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase">توزيع الفئات الجديدة</span>
              <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${Math.min(progressPercentage, 100)}%` }}></div>
              </div>
            </div>
            <div className="flex justify-between items-end">
               <div>
                 <p className="text-[8px] text-slate-400 font-bold uppercase mb-1">المجموع الحالي</p>
                 <p className={`text-2xl font-black ${isComplete ? 'text-emerald-600' : 'text-slate-800'}`}>{walletTotal.toLocaleString()}</p>
               </div>
               {!isComplete && (
                 <div className="text-left">
                   <p className="text-[8px] text-amber-500 font-bold uppercase mb-1 text-left">المتبقي</p>
                   <p className="text-xl font-black text-amber-600">{(targetValueNew - walletTotal).toLocaleString()}</p>
                 </div>
               )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {NEW_DENOMINATIONS.map(d => (
            <Banknote key={d} value={d} count={wallet[d] || 0} onCountChange={(v) => {
              const other = Object.entries(wallet).reduce((a, [dn, c]) => Number(dn) === d ? a : a + (Number(dn) * (Number(c) || 0)), 0);
              const max = Math.floor((targetValueNew - other) / d);
              setWallet(p => ({ ...p, [d]: targetValueNew > 0 ? Math.max(0, Math.min(v, max)) : v }));
            }} onAutoFill={() => handleAutoFill(d)} disabled={targetValueNew === 0} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConverterCard;