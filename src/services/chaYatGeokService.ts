import { LunarInfo } from './lunarService';

export type Direction = '東方' | '南方' | '西方' | '北方' | '中宮' | '東南' | '西南' | '東北' | '西北';
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
  directionElement: string;
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
  '【五方路頭神】': '主掌道路通行，多發於「遠行、驚嚇、十字路口」。',
  '【十類孤魂】': '游蕩之無主能量，多發於「水邊、夜間、低頻場所」。',
  '【家先 / 門官】': '血緣能量波動，強觸發於「夢見先人、家宅不安」。',
  '【土煞地靈】': '地脈反噬，強觸發於「施工動土、鑽牆、裝修」。',
  '【地基主】': '建築原生能量，多發於「搬家、翻動舊物、室內死角」。',
  '【流年關煞】': '年度阻礙（如太歲、歲破），多發於「生肖沖克之日」。',
  '【小兒關煞】': '專屬未成年人之碰撞，多發於「小孩無故驚啼」。',
  '【冤親債主】': '跨維度因果能量，多發於「長期運滯、莫名壓抑」。',
  '【遊魂驚擾】': '短暫能量附著，多發於「身處鬧區、能量低迷」。',
  '【天羅地網】': '能量束縛，多發於「決策失誤、被困感強烈」。',
  '【五鬼 / 官符】': '負性震盪，多發於「口舌、官非、意外擦撞」。',
  '【病符 / 耗神】': '能量持續損耗，多發於「久病不癒、忽冷忽熱」。'
};

export function analyzeChaYatGeok(
  lunarInfo: LunarInfo,
  direction: Direction,
  symptoms: Symptom[],
  userZodiac?: string,
  scenario?: Scenario
): AnalysisResult {
  const directions: Record<Direction, string> = {
    '東方': '木 (震卦)', '南方': '火 (離卦)', '西方': '金 (兌卦)', '北方': '水 (坎卦)',
    '中宮': '土 (坤/艮)', '東南': '木/火', '西南': '土/金', '東北': '土/水', '西北': '金/水'
  };

  const element = directions[direction];
  const isZodiacClash = userZodiac === lunarInfo.clashZodiac;
  const isBadDay = lunarInfo.isBadDay;

  // AI Diagnostic Core v2.6.5
  let targetObject: IncidentObject = '【遊魂驚擾】';

  if (symptoms.includes('小兒驚啼')) {
    targetObject = '【小兒關煞】';
  } else if (symptoms.includes('夢見先人') || symptoms.includes('夜夢亡人')) {
    targetObject = '【家先 / 門官】';
  } else if (symptoms.includes('電器頻壞') || scenario === '搬遷入伙' || scenario === '舊物處理 (遺物)') {
    targetObject = '【地基主】';
  } else if (direction === '中宮' && (symptoms.includes('事事碰壁') || symptoms.includes('莫名寒戰') || scenario === '施工動土 (中)')) {
    targetObject = '【土煞地靈】';
  } else if (isZodiacClash && isBadDay) {
    targetObject = '【流年關煞】';
  } else if (symptoms.includes('口舌是非') || symptoms.includes('事事碰壁')) {
    targetObject = '【五鬼 / 官符】';
  } else if (symptoms.includes('能量低迷') || symptoms.includes('莫名寒戰')) {
    targetObject = '【病符 / 耗神】';
  } else if (symptoms.includes('肩頸沉重') || symptoms.includes('鬼壓床')) {
    targetObject = '【冤親債主】';
  } else if (scenario === '探病白事 (西)' || scenario === '夜間水邊 (北)') {
    targetObject = '【十類孤魂】';
  } else if (scenario === '異地暫居' || scenario === '商務差旅 (酒店)') {
    targetObject = '【天羅地網】';
  } else if (symptoms.includes('魂不守舍') || symptoms.includes('突發失魂') || scenario === '長途回程') {
    targetObject = '【五方路頭神】';
  }

  const translation = GLOSSARY[targetObject];
  let analysis = `【首席鑑定官審核】：觀乎今日「${lunarInfo.ganZhiDay}」，氣場於「${direction}」${element}產生顯著相位交感。`;
  
  if (isZodiacClash) {
    analysis += `閣下生肖(${userZodiac})與日課產生「正沖」，導致個人防禦力跌至低點。`;
  }

  // Deep Reasoning Logic
  analysis += `在此背景下，閣下身處「${direction}」場域進行「${symptoms[0] || '日常'}」等活動，誘發了${targetObject}。`;
  
  if (targetObject === '【五鬼 / 官符】') {
    analysis += `生肖${userZodiac}者在今日火金交戰之局中，極易誘發口舌或意外擦撞之負性震盪。`;
  } else if (targetObject === '【土煞地靈】') {
    analysis += `地脈能量因近期動土而處於躁動狀態，與閣下今日之運勢座標產生共振。`;
  } else {
    analysis += `此為時空磁場與個人生物場在特定座標下的失焦碰撞。`;
  }

  let materials: string[] = [];
  let labAdvice = '';

  // Recommendations based on Target
  switch (targetObject) {
    case '【五方路頭神】':
    case '【遊魂驚擾】':
      materials = ['幽衣乙份', '溪錢', '長壽香', '白酒'];
      labAdvice = '推薦「離火」系線香，快速中和外感驚嚇。配合黃銅燃燒夾使用。';
      break;
    case '【家先 / 門官】':
    case '【地基主】':
      materials = ['大金銀元寶', '家神資糧', '五穀', '清茶'];
      labAdvice = '選用「檀香供養系」，溫潤平順家族能量流。';
      break;
    case '【十類孤魂】':
    case '【冤親債主】':
      materials = ['多份幽衣', '大量溪錢', '往生咒紙', '清水'];
      labAdvice = '必須使用「極致降真香」，其強力淨化力能有效切斷低偏能量附著。';
      break;
    default:
      materials = ['通用資糧', '金銀', '長壽香'];
      labAdvice = '推薦實驗室全效艾草系列。';
  }

  return {
    targetObject,
    targetTranslation: translation,
    directionElement: element,
    incidentAnalysis: analysis,
    ritualTime: '傍晚 (17:00 - 19:00)',
    ritualDirection: `面向 ${direction}`,
    materials,
    labAdvice
  };
}
