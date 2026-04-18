import { LunarInfo } from './lunarService';

export type Direction = '東方' | '南方' | '西方' | '北方' | '中宮' | '東南' | '西南' | '東北' | '西北';
export type Gender = 'Male' | 'Female';

export type IncidentObject = 
  | '【五方路頭神】' 
  | '【十類孤魂】' 
  | '【家先 / 門官】' 
  | '【土煞地靈】' 
  | '【地基主】' 
  | '【流年關煞】' 
  | '【小兒關煞】' 
  | '【冤親債主】' 
  | '【遊魂驚擾】' 
  | '【天羅地網】' 
  | '【五鬼 / 官符】' 
  | '【病符 / 耗神】';

export type Scenario = 
  | '山林野外 (東)' 
  | '繁華鬧區 (南)' 
  | '探病白事 (西)' 
  | '夜間水邊 (北)' 
  | '施工動土 (中)' 
  | '商務差旅 (酒店)' 
  | '舊物處理 (遺物)'
  | '搬遷入伙'
  | '異地暫居'
  | '長途回程';

export type Symptom = 
  | '魂不守舍' | '小兒驚啼' | '突發失魂' 
  | '噩夢連連' | '夜夢亡人' | '鬼壓床' 
  | '肩頸沉重' | '莫名寒戰' | '能量低迷' 
  | '事事碰壁' | '口舌是非' | '莫名漏財' 
  | '電器頻壞' | '寵物異常' | '夢見先人';

export interface AnalysisResult {
  targetObject: IncidentObject;
  targetTranslation: string;
  phaseRelationship: string;
  incidentAnalysis: string;
  ritualTime: string;
  ritualDirection: string;
  materials: string[];
  labAdvice: string;
}

export const SCENARIO_MAPPING: Record<Scenario, Direction> = {
  '山林野外 (東)': '東方',
  '繁華鬧區 (南)': '南方',
  '探病白事 (西)': '西方',
  '夜間水邊 (北)': '北方',
  '施工動土 (中)': '中宮',
  '商務差旅 (酒店)': '西北',
  '舊物處理 (遺物)': '西方',
  '搬遷入伙': '中宮',
  '異地暫居': '東北',
  '長途回程': '北方'
};

const GLOSSARY: Record<IncidentObject, string> = {
  '【五方路頭神】': '主掌道路通行之神，多發於移動中的受驚現象。',
  '【十類孤魂】': '游蕩之無主能量，易在低頻或水邊場域產生共鳴。',
  '【家先 / 門官】': '血緣能量波動，係先人或家神發出的守護提醒。',
  '【土煞地靈】': '地脈磁場反噬，多因動土或環境劇烈變動引起。',
  '【地基主】': '建築原生空間能量，與搬遷或翻動舊物高度相關。',
  '【流年關煞】': '年度時空阻礙點，係個體磁場與流年干支的碰撞。',
  '【小兒關煞】': '專屬未成年人之能量碰撞，主突發性的驚恐啼哭。',
  '【冤親債主】': '維度間的因果殘留，主長期壓抑或莫名的沉重感。',
  '【遊魂驚擾】': '場域中的短暫能量附著，多發於人氣混雜處。',
  '【天羅地網】': '能量場的短暫束縛，使人產生決策困頓或封閉感。',
  '【五鬼 / 官符】': '負性震盪能量，主突發的爭執、損財或擦撞。',
  '【病符 / 耗神】': '生機磁場持續受損，導致精神萎靡或體感失調。'
};

export function analyzeChaYatGeok(
  lunarInfo: LunarInfo,
  direction: Direction,
  symptoms: Symptom[],
  userZodiac?: string,
  scenario?: Scenario,
  gender: Gender = 'Male'
): AnalysisResult {
  const directions: Record<Direction, string> = {
    '東方': '木 (震卦)', '南方': '火 (離卦)', '西方': '金 (兌卦)', '北方': '水 (坎卦)',
    '中宮': '土 (坤/艮)', '東南': '木/火', '西南': '土/金', '東北': '土/水', '西北': '金/水'
  };

  const element = directions[direction];
  const isZodiacClash = userZodiac === lunarInfo.clashZodiac;
  const isZodiacHarm = userZodiac === lunarInfo.harmZodiac;
  const isBadDay = lunarInfo.isBadDay;

  // Phase Relationship String
  let phaseRelationship = `生肖 [${userZodiac}] 與今日日課能量平行。`;
  if (isZodiacClash) {
    phaseRelationship = `生肖 [${userZodiac}] 與日課屬「六沖」相位，能量防禦值降至低谷。`;
  } else if (isZodiacHarm) {
    phaseRelationship = `生肖 [${userZodiac}] 與日課屬「六害」相位，磁場穩定性受損。`;
  }

  // AI Diagnostic Core v2.6.5 - Refined Priority
  let targetObject: IncidentObject = '【遊魂驚擾】';

  // Specific high-priority triggers
  const isAncestralTrigger = symptoms.includes('夢見先人') || symptoms.includes('夜夢亡人') || symptoms.includes('寵物異常');
  const isEarthTrigger = direction === '中宮' || scenario === '施工動土 (中)' || scenario === '搬遷入伙';

  if (isAncestralTrigger) {
    targetObject = '【家先 / 門官】';
  } else if (isEarthTrigger && (symptoms.includes('電器頻壞') || scenario === '搬遷入伙')) {
    targetObject = '【地基主】';
  } else if (isEarthTrigger) {
    targetObject = '【土煞地靈】';
  } else if (isZodiacClash && ['西方', '北方', '南方'].includes(direction)) {
    targetObject = direction === '北方' ? '【十類孤魂】' : '【五方路頭神】';
  } else if (isZodiacClash || isZodiacHarm) {
    targetObject = '【流年關煞】';
  } else if (symptoms.includes('小兒驚啼')) {
    targetObject = '【小兒關煞】';
  } else if (symptoms.includes('口舌是非') || symptoms.includes('事事碰壁')) {
    targetObject = '【五鬼 / 官符】';
  } else if (symptoms.includes('肩頸沉重') || symptoms.includes('鬼壓床')) {
    targetObject = '【冤親債主】';
  } else if (scenario === '探病白事 (西)' || scenario === '夜間水邊 (北)') {
    targetObject = '【十類孤魂】';
  } else if (symptoms.includes('能量低迷') || symptoms.includes('莫名寒戰')) {
    targetObject = '【病符 / 耗神】';
  }

  const translation = GLOSSARY[targetObject];
  
  // Professional Deep Analysis
  let analysis = `【首席鑑定官審核】：鑑於閣下之${gender === 'Male' ? '陽性' : '陰性'}氣場特質，`;
  
  if (isZodiacClash) {
    analysis += `以及生肖逢沖之脆弱節點，`;
  }

  analysis += `於「${direction}」場域受${element}能量激盪，最終經 AI 判定為${targetObject}能量反噬。`;
  
  if (targetObject === '【土煞地靈】') {
    analysis += `此乃地幕磁場因環境劇烈變動（${scenario}）而對個人生物場產生的相位擠壓，引發明顯「${symptoms[0] || '不適'}」反應。`;
  } else if (targetObject === '【流年關煞】') {
    analysis += `時空座標存在顯著「刑沖」干擾，閣下個人磁場正處於年度週期性的能量低窪區，極易受外界雜散能量映射。`;
  } else {
    analysis += `此為個體生物能與當前時空編碼失焦所致的能量干擾。`;
  }

  let materials: string[] = [];
  let labAdvice = '';

  // Recommendations
  switch (targetObject) {
    case '【五方路頭神】':
    case '【遊魂驚擾】':
    case '【十類孤魂】':
      materials = ['幽衣乙份', '三份溪錢', '長壽香', '清茶/白酒'];
      labAdvice = '建議使用「離火」系沈香校準受驚神識。建議搭配黃銅燃燒夾。';
      break;
    case '【家先 / 門官】':
    case '【地基主】':
      materials = ['大金銀元寶', '家神資糧', '五穀', '清茶'];
      labAdvice = '推薦選用「檀香供養系」，平衡家宅守護磁場。';
      break;
    case '【流年關煞】':
    case '【冤親債主】':
      materials = ['解連資糧', '大量溪錢', '往生咒', '解冤符'];
      labAdvice = '必須使用「極致降真香」進行垂直次元的能量清理。';
      break;
    default:
      materials = ['基礎資糧', '金銀紙', '長壽香'];
      labAdvice = '推介實驗室全效艾草系列，快速中和負向磁波。';
  }

  if (isZodiacClash) {
    analysis += ` 由於時值「六沖」，鑑定能量反噬度為：HIGH (強烈)。`;
    materials = materials.map(m => `加倍量 ${m}`);
    labAdvice = `【限時強效】因今日生肖相沖，建議增加 200% 之校準量。${labAdvice}`;
  }

  return {
    targetObject,
    targetTranslation: translation,
    phaseRelationship,
    incidentAnalysis: analysis,
    ritualTime: '傍晚 (17:00 - 19:00) 能量交接之時',
    ritualDirection: `面向事發位 [${direction}]`,
    materials,
    labAdvice
  };
}
