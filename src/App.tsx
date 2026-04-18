import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Compass, 
  Loader2,
  FileSearch,
  Zap,
  Clock,
  Info,
  Building,
  Trees,
  Anchor,
  HardHat,
  Activity,
  UserCheck,
  Sparkles,
  Luggage,
  Trash2,
  Box,
  Plane,
  Frown,
  Skull,
  ShieldCheck,
  Search,
  BookOpen
} from 'lucide-react';
import { cn } from './lib/utils';
import { getLunarInfo } from './services/lunarService';
import { analyzeChaYatGeok, Direction, IncidentObject, AnalysisResult, Scenario, SCENARIO_MAPPING, Symptom, Gender } from './services/chaYatGeokService';
import { Solar, Lunar } from 'lunar-typescript';

/**
 * 永利實驗室 (Veng Lei Laboratory) - 查日腳鑑定報告系統
 * Version: 2.6.5 (AI Chief Calibration Officer Edition)
 */

export default function App() {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [birthDate, setBirthDate] = useState<string>('');
  const [gender, setGender] = useState<Gender>('Male');
  const [userZodiac, setUserZodiac] = useState<string>('鼠');
  const [direction, setDirection] = useState<Direction>('中宮');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | '手動'>('自家場域' as any);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const directions: Direction[] = ['東方', '南方', '西方', '北方', '中宮', '東南', '西南', '東北', '西北'];
  const zodiacs = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬'];
  
  const scenarios: { label: Scenario, icon: any }[] = [
    { label: '山林野外 (東)', icon: Trees },
    { label: '繁華鬧區 (南)', icon: Zap },
    { label: '探病白事 (西)', icon: Building },
    { label: '夜間水邊 (北)', icon: Anchor },
    { label: '施工動土 (中)', icon: HardHat },
    { label: '商務差旅 (酒店)', icon: Luggage },
    { label: '舊物處理 (遺物)', icon: Trash2 },
    { label: '搬遷入伙', icon: Box },
    { label: '異地暫居', icon: Plane },
    { label: '長途回程', icon: Plane },
  ];

  const symptomList: { label: Symptom, category: string }[] = [
    { label: '魂不守舍', category: '驚嚇' },
    { label: '小兒驚啼', category: '驚嚇' },
    { label: '突發失魂', category: '驚嚇' },
    { label: '噩夢連連', category: '睡眠' },
    { label: '夜夢亡人', category: '睡眠' },
    { label: '鬼壓床', category: '睡眠' },
    { label: '肩頸沉重', category: '體感' },
    { label: '莫名寒戰', category: '體感' },
    { label: '能量低迷', category: '體感' },
    { label: '事事碰壁', category: '運勢' },
    { label: '口舌是非', category: '運勢' },
    { label: '莫名漏財', category: '運勢' },
    { label: '電器頻壞', category: '家宅' },
    { label: '寵物異常', category: '家宅' },
    { label: '夢見先人', category: '家宅' },
  ];

  const lunarInfo = useMemo(() => getLunarInfo(new Date(date)), [date]);

  // Sync Zodiac with Birth Date
  useEffect(() => {
    if (birthDate) {
      try {
        const solar = Solar.fromDate(new Date(birthDate));
        const lunar = Lunar.fromSolar(solar);
        const z = lunar.getYearZhi();
        const zodiacMap: Record<string, string> = {
          '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兔', '辰': '龍', '巳': '蛇',
          '午': '馬', '未': '羊', '申': '猴', '酉': '雞', '戌': '狗', '亥': '豬'
        };
        if (zodiacMap[z]) setUserZodiac(zodiacMap[z]);
      } catch (e) {
        console.error("Invalid birth date");
      }
    }
  }, [birthDate]);

  const loadingTexts = [
    "正在讀取《崇道堂通勝》數據庫...",
    "掃描時空座標與方位能量...",
    "比對干支五行與生肖共振...",
    "生成 AI 鑑定報告..."
  ];

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingTexts.length);
      }, 600);
      return () => clearInterval(interval);
    } else {
      setLoadingStep(0);
    }
  }, [isAnalyzing]);

  const toggleSymptom = (s: Symptom) => {
    setSymptoms(prev => {
      if (prev.includes(s)) return prev.filter(item => item !== s);
      return [...prev, s];
    });
  };

  const handleScenarioSelect = (s: Scenario) => {
    setSelectedScenario(s);
    setDirection(SCENARIO_MAPPING[s]);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const scenarioParam = selectedScenario === '手動' ? undefined : selectedScenario;
      const analysis = analyzeChaYatGeok(lunarInfo, direction, symptoms, userZodiac, scenarioParam, gender);
      setResult(analysis);
      setIsAnalyzing(false);
    }, 2400);
  };

  return (
    <div className="min-h-screen bg-vl-bg text-vl-text font-sans flex flex-col max-w-[1024px] mx-auto border-x border-vl-border h-screen overflow-hidden">
      
      {/* Header */}
      <header className="px-6 md:px-12 py-4 md:py-6 border-b border-vl-border flex justify-between items-end shrink-0 bg-vl-bg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-vl-gold/5 blur-[100px] rounded-full -mr-24 -mt-24" />
        <div className="flex items-center gap-3 md:gap-4 relative z-10 transition-transform hover:scale-105 duration-300">
          <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-vl-gold flex items-center justify-center font-bold text-vl-gold font-mono text-lg md:text-xl shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            V L
          </div>
          <div className="space-y-0.5">
            <div className="tracking-[0.2em] md:tracking-[0.3em] uppercase text-[9px] md:text-[10px] text-vl-gold font-mono font-bold">
              Veng Lei Laboratory
            </div>
            <div className="text-[8px] md:text-[9px] text-vl-muted font-mono uppercase opacity-60">System V2.6.5</div>
          </div>
        </div>
        <div className="text-right relative z-10">
          <h1 className="font-serif text-xl md:text-2xl italic text-vl-text tracking-tight">鑑定報告系統</h1>
          <p className="text-[8px] md:text-[10px] font-mono text-vl-gold/40 tracking-[0.1em] uppercase">AI Chief Calibration Officer</p>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-[360px_1fr] lg:grid-cols-[360px_1fr_240px] flex-grow overflow-hidden border-b border-vl-border relative">
        
        {/* Step 1: Inputs - Mobile Optimization: Hide on report view on small screens if needed, but here we keep it as a scrollable side */}
        <section className={cn(
          "border-r border-vl-border p-5 md:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 bg-vl-bg/50 backdrop-blur-sm transition-all",
          result && "hidden md:flex"
        )}>
          
          <div className="space-y-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-vl-gold flex items-center gap-2 font-mono font-bold">
              <UserCheck className="w-3.5 h-3.5" /> 個人參數 / Personal
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setGender('Male')}
                className={cn(
                  "py-2 border text-[10px] font-mono uppercase transition-all",
                  gender === 'Male' ? "bg-vl-gold text-black border-vl-gold" : "bg-vl-surface border-vl-border text-vl-muted"
                )}
              >
                男性 (Yang)
              </button>
              <button 
                onClick={() => setGender('Female')}
                className={cn(
                  "py-2 border text-[10px] font-mono uppercase transition-all",
                  gender === 'Female' ? "bg-vl-gold text-black border-vl-gold" : "bg-vl-surface border-vl-border text-vl-muted"
                )}
              >
                女性 (Yin)
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-[8px] font-mono text-vl-muted uppercase">出生日期 (用於算生肖)</p>
              <input 
                type="date" 
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-vl-surface border border-vl-border p-2 rounded-sm text-[11px] font-mono text-vl-gold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-6 gap-1.5 p-1 bg-vl-surface/30 border border-vl-border rounded-sm">
              {zodiacs.map(z => (
                <button
                  key={z}
                  onClick={() => setUserZodiac(z)}
                  className={cn(
                    "h-8 border text-[10px] transition-all flex items-center justify-center",
                    userZodiac === z ? "bg-vl-gold text-black font-bold shadow-lg" : "bg-vl-bg/50 border-vl-border text-vl-muted hover:border-vl-muted"
                  )}
                >
                  {z}
                </button>
              ))}
            </div>
            {(lunarInfo.clashZodiac === userZodiac || lunarInfo.harmZodiac === userZodiac) && (
              <div className="bg-vl-red/5 border border-vl-red/20 p-2 rounded-sm flex items-center gap-2 animate-pulse">
                <Skull className="w-3 h-3 text-vl-red" />
                <span className="text-[9px] text-vl-red font-mono font-bold uppercase tracking-tighter">
                  {lunarInfo.clashZodiac === userZodiac ? 'Six_Clash' : 'Six_Harm'} Detected: Risk++
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-vl-gold flex items-center gap-2 font-mono font-bold">
              <Calendar className="w-3.5 h-3.5" /> 事發時空 / Event Node
            </div>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-vl-surface border border-vl-border p-3 rounded-sm text-sm font-mono text-vl-gold focus:outline-none focus:ring-1 focus:ring-vl-gold transition-all"
            />
          </div>

          <div className="space-y-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-vl-gold flex items-center gap-2 font-mono font-bold">
              <Activity className="w-3.5 h-3.5" /> 多重症狀 / Symptoms
            </div>
            <div className="grid grid-cols-2 gap-2">
              {symptomList.map(s => (
                <button
                  key={s.label}
                  onClick={() => toggleSymptom(s.label)}
                  className={cn(
                    "text-[9px] p-2 border transition-all text-left relative overflow-hidden group leading-tight",
                    symptoms.includes(s.label) 
                      ? "bg-vl-red border-vl-red text-white" 
                      : "bg-vl-surface border-vl-border text-vl-muted hover:border-vl-muted"
                  )}
                >
                   <span className="opacity-40 font-mono text-[7px] block mb-0.5">{s.category}</span>
                   <span className="font-serif italic">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-vl-gold flex items-center gap-2 font-mono font-bold">
              <Compass className="w-3.5 h-3.5" /> 行為組合 / Scenarios
            </div>
            <div className="grid grid-cols-2 gap-2">
              {scenarios.map(s => (
                <button
                  key={s.label}
                  onClick={() => handleScenarioSelect(s.label)}
                  className={cn(
                    "flex items-center gap-2 p-3 border transition-all text-left",
                    selectedScenario === s.label
                      ? "bg-vl-gold/10 border-vl-gold text-vl-gold shadow-[inset_0_0_10px_rgba(212,175,55,0.05)]"
                      : "bg-vl-surface border-vl-border text-vl-muted hover:border-vl-muted"
                  )}
                >
                  <s.icon className="w-4 h-4 shrink-0 opacity-70" />
                  <span className="text-[9px] font-sans leading-tight">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || symptoms.length === 0}
            className="w-full bg-vl-gold text-black py-4 font-mono text-xs font-bold tracking-[0.2em] uppercase hover:bg-yellow-500 transition-all active:scale-[0.98] disabled:opacity-50 mt-auto flex items-center justify-center gap-3 shadow-[0_5px_15px_rgba(0,0,0,0.3)] sticky bottom-0 z-10"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <ShieldCheck className="w-4 h-4" />}
            CALIBRATE_ENERGY
          </button>
        </section>

        {/* Phase 1 & 2 Center Panel */}
        <section className={cn(
          "bg-vl-bg overflow-y-auto custom-scrollbar relative",
          result ? "block" : "hidden md:block"
        )}>
          <AnimatePresence mode="wait">
            {!result && !isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-12 text-center opacity-20"
              >
                 <Search className="w-24 h-24 mb-6 text-vl-muted" />
                 <p className="font-mono text-[10px] tracking-[0.5em] uppercase italic">Awaiting Input Data...</p>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-8 md:p-12 text-center"
              >
                  <div className="w-20 h-20 relative mb-8">
                     <div className="absolute inset-0 border-4 border-vl-border rounded-full" />
                     <div className="absolute inset-0 border-4 border-vl-gold border-t-transparent rounded-full animate-spin" />
                     <div className="absolute inset-4 border border-dashed border-vl-gold/30 rounded-full animate-[spin_10s_linear_infinite]" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-mono text-[11px] tracking-[0.4em] text-vl-gold uppercase">System Calibrating...</h3>
                    <p className="text-[12px] font-serif italic text-vl-muted animate-pulse">{loadingTexts[loadingStep]}</p>
                  </div>
              </motion.div>
            )}

            {result && !isAnalyzing && (
              <motion.div 
                key="report"
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[640px] mx-auto pb-24"
              >
                {/* Mobile Back Button */}
                <button 
                  onClick={() => setResult(null)}
                  className="md:hidden text-[10px] font-mono text-vl-muted flex items-center gap-2 mb-2 bg-vl-surface border border-vl-border px-3 py-1 rounded-full"
                >
                  ← 改動參數 (Back)
                </button>

                {/* Vertical Report Structure */}
                <div className="border-[1px] border-vl-border/60 p-5 md:p-8 space-y-8 bg-vl-surface/10 relative">
                  <div className="absolute top-0 right-0 p-2 font-mono text-[7px] text-vl-muted/30 border-b border-l border-vl-border/30">
                    ID: VLEI-{date.replace(/-/g, '')}-{(Math.random()*100).toFixed(0).padStart(3, '0')}
                  </div>
                  
                  <div className="text-center border-b border-vl-border pb-6">
                    <h2 className="text-xl md:text-2xl font-serif italic text-vl-text tracking-tighter mb-1">🕯️ 時空能量鑑定報告</h2>
                    <p className="text-[9px] font-mono text-vl-gold/60 uppercase tracking-[0.3em]">Official Certificate V2.6.5</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-l-2 border-vl-gold pl-3">
                       <h3 className="text-[11px] font-mono text-vl-gold uppercase tracking-[0.2em] font-bold">【時空定格 / SPACETIME NODE】</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4 pl-4 text-[13px] font-serif italic">
                       <div className="flex justify-between border-b border-vl-border/20 pb-1">
                          <span className="text-vl-muted">事發日課</span>
                          <span>{lunarInfo.lunarDate} | {lunarInfo.ganZhiDay} | {lunarInfo.dayType}</span>
                       </div>
                       <div className="flex justify-between border-b border-vl-border/20 pb-1">
                          <span className="text-vl-muted">先天能量</span>
                          <span>生肖屬 [{userZodiac}]</span>
                       </div>
                       <div className="space-y-1">
                          <span className="text-vl-muted block text-[11px]">相位關係</span>
                          <span className="text-vl-text leading-tight">{result.phaseRelationship}</span>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-l-2 border-vl-red pl-3">
                       <h3 className="text-[11px] font-mono text-vl-red uppercase tracking-[0.2em] font-bold">【鑑定主體 / TARGET IDENTITY】</h3>
                    </div>
                    <div className="pl-4 space-y-2">
                       <div className="text-3xl font-serif italic text-vl-red tracking-tight">{result.targetObject}</div>
                       <p className="text-[12px] font-serif text-vl-text/70 italic bg-vl-red/5 p-2 border-l border-vl-red/30">
                          {result.targetTranslation}
                       </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-l-2 border-vl-gold pl-3">
                       <h3 className="text-[11px] font-mono text-vl-gold uppercase tracking-[0.2em] font-bold">【邏輯解析 / ANALYTICAL LOGIC】</h3>
                    </div>
                    <div className="pl-4">
                       <p className="text-[14px] font-serif leading-relaxed italic text-vl-text/90">
                          <span className="text-vl-gold opacity-50 mr-2 font-mono text-[10px]">DEEP_CALIBRATION:</span>
                          {result.incidentAnalysis}
                       </p>
                    </div>
                  </div>

                  <div className="space-y-5 pt-4">
                    <div className="flex items-center gap-2 border-l-2 border-vl-muted pl-3">
                       <h3 className="text-[11px] font-mono text-vl-muted uppercase tracking-[0.2em] font-bold">【校準協議 / RITUAL PROTOCOLS】</h3>
                    </div>
                    <div className="pl-4 space-y-4">
                       <div className="space-y-2">
                          <p className="text-[9px] font-mono text-vl-muted uppercase">資糧配方 / Recipe</p>
                          <div className="flex flex-wrap gap-2">
                             {result.materials.map(m => (
                               <span key={m} className="px-2 py-1 border border-vl-border text-[10px] font-serif italic bg-vl-surface/20">{m}</span>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[9px] font-mono text-vl-muted uppercase">實驗室推薦 / Lab Choice</p>
                          <p className="text-[11px] font-serif italic text-vl-text/70 leading-relaxed border-l-2 border-vl-border pl-3">{result.labAdvice}</p>
                       </div>
                       <div className="bg-vl-surface/40 p-3 border border-vl-border rounded-sm">
                          <p className="text-[9px] font-mono text-vl-gold uppercase mb-1 flex items-center gap-2"><Compass className="w-2.5 h-2.5" /> 校準導航 / Navigation</p>
                          <p className="text-[11px] font-serif italic">
                             建議於 <span className="font-bold underline text-vl-text">{result.ritualTime}</span>，<span className="text-vl-text font-bold">{result.ritualDirection}</span> 進行操作。
                          </p>
                       </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                    <div className="w-20 h-20 border-2 border-vl-red border-dotted rounded-full flex flex-col items-center justify-center font-serif text-[8px] text-vl-red font-bold uppercase rotate-[-12deg] p-1 text-center">
                       永利實驗室<br/>能源校準<br/>專用章
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-10 border-t border-vl-border/20">
                   <div className="text-[10px] font-mono text-vl-gold uppercase flex items-center gap-2 font-bold whitespace-nowrap overflow-hidden">
                      <BookOpen className="w-3.5 h-3.5 shrink-0" /> 術語辭典 / Glossary
                      <div className="w-full h-[1px] bg-vl-border/30 ml-2" />
                   </div>
                   <div className="bg-vl-surface/20 p-5 space-y-3">
                      <p className="text-[11px] font-serif font-bold italic text-vl-text">{result.targetObject}</p>
                      <p className="text-[12px] font-serif italic text-vl-muted leading-relaxed">{result.targetTranslation}</p>
                   </div>
                </div>

                <button 
                  onClick={() => window.print()} 
                  className="w-full border border-vl-border py-3 text-[10px] font-mono text-vl-muted hover:text-vl-gold hover:border-vl-gold transition-all mt-8"
                >
                  DOWNLOAD_IDENTIFICATION_REPORT (PDF)
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Dictionary / Info Column - Desktop Only */}
        <section className="hidden lg:flex bg-vl-bg p-8 flex-col gap-8 border-l border-vl-border/30 overflow-y-auto custom-scrollbar">
           <div className="space-y-5">
              <div className="text-[11px] uppercase tracking-[0.2em] text-vl-gold border-b border-vl-border pb-1 font-mono font-bold">校準原則 / Protocols</div>
              <ul className="space-y-4 text-[11px] font-serif italic text-vl-muted leading-relaxed">
                 <li className="flex gap-2"><span>1.</span><span>時空座標決定外部能量流向。</span></li>
                 <li className="flex gap-2"><span>2.</span><span>生肖共振點決定個人防禦邊界。</span></li>
                 <li className="flex gap-2"><span>3.</span><span>行為情境是能量失焦的關鍵引信。</span></li>
              </ul>
           </div>

           <div className="space-y-5">
              <div className="text-[11px] uppercase tracking-[0.2em] text-vl-gold border-b border-vl-border pb-1 font-mono font-bold">系統限制 / Constraints</div>
              <p className="text-[10px] font-serif italic text-vl-gold/40 leading-relaxed">
                 AI 首席鑑定官基於古法大數據自動判定鑑定主體 (Target Identity)。此過程為去選擇化設計，旨在排布人為偏差，確保能量鏈接的純粹性。
              </p>
           </div>

           <div className="mt-auto space-y-4 pt-8 border-t border-vl-border/30 opacity-30">
              <div className="w-full h-24 border border-vl-border flex items-center justify-center p-4">
                 <img src="https://picsum.photos/seed/venglei/200/200" alt="VLEI STAMP" className="w-full h-full object-contain grayscale" referrerPolicy="no-referrer" />
              </div>
           </div>
        </section>
      </main>

      <footer className="px-6 md:px-12 py-3 flex justify-between font-mono text-[8px] md:text-[9px] text-vl-muted/40 bg-vl-bg border-t border-vl-border/10 italic shrink-0">
        <div>OFFICER: AI_PROTOCOL_V2.6.5_CALIBRATION</div>
        <div>VENG LEI LAB © 2026. AUTHENTIC CULTURAL PROPERTY.</div>
      </footer>
    </div>
  );
}
