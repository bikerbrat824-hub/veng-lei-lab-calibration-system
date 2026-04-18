import { Solar, Lunar } from 'lunar-typescript';

export interface LunarInfo {
  lunarDate: string;
  ganZhiYear: string;
  ganZhiMonth: string;
  ganZhiDay: string;
  wuXingDay: string;
  isBadDay: boolean;
  dayType: string;
  clashZodiac: string;
  harmZodiac: string;
}

const WU_XING_MAP: Record<string, string> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

const DAY_TYPES: Record<string, string> = {
  '破': '破日 (大凶)',
  '執': '執日 (凶)',
  '平': '平日',
  '定': '定日 (吉)',
  '成': '成日 (大吉)',
  '收': '收日',
  '除': '除日',
  '滿': '滿日',
  '危': '危日',
  '閉': '閉日',
  '建': '建日',
  '開': '開日'
};

const ZODIAC_CLASH: Record<string, string> = {
  '子': '馬', '丑': '羊', '寅': '猴', '卯': '雞',
  '辰': '狗', '巳': '豬', '午': '鼠', '未': '牛',
  '申': '虎', '酉': '兔', '戌': '龍', '亥': '蛇'
};

const ZODIAC_HARM: Record<string, string> = {
  '子': '羊', '丑': '馬', '寅': '巳', '卯': '辰',
  '辰': '卯', '巳': '寅', '午': '丑', '未': '子',
  '申': '亥', '酉': '戌', '戌': '酉', '亥': '申'
};

export function getLunarInfo(date: Date): LunarInfo {
  const solar = Solar.fromDate(date);
  const lunar = Lunar.fromSolar(solar);

  const dayGan = lunar.getDayGan();
  const dayZhi = lunar.getDayZhi();
  const wuXing = WU_XING_MAP[dayGan] || '未知';
  
  const twelveDeity = lunar.getZhiXing(); // 12 gods (建除十二神)
  const clashZodiac = ZODIAC_CLASH[dayZhi] || '未知';
  const harmZodiac = ZODIAC_HARM[dayZhi] || '未知';
  
  // Basic Sui Po (Year Breaker) logic: If day branch clashes with year branch
  const yearZhi = lunar.getYearZhi();
  const isSuiPo = ZODIAC_CLASH[yearZhi] === dayZhi;

  return {
    lunarDate: `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    ganZhiYear: `${lunar.getYearInGanZhi()}年`,
    ganZhiMonth: `${lunar.getMonthInGanZhi()}月`,
    ganZhiDay: `${lunar.getDayInGanZhi()}日`,
    wuXingDay: wuXing,
    isBadDay: ['破', '執'].includes(twelveDeity) || isSuiPo,
    dayType: isSuiPo ? '日值歲破 (大凶)' : (DAY_TYPES[twelveDeity] || twelveDeity),
    clashZodiac: clashZodiac,
    harmZodiac: harmZodiac
  };
}
