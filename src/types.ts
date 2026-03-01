export interface Bilingual {
  zh: string;
  en: string;
}

export interface BilingualArray {
  zh: string[];
  en: string[];
}

export interface CycleData {
  nineLucks: {
    current: Bilingual;
    period: string;
    status: Bilingual;
    focus: BilingualArray;
    sentiment: Bilingual;
  };
  kWave: {
    current: Bilingual;
    from: Bilingual;
    to: Bilingual;
    sentiment: Bilingual;
  };
  merrillLynch: {
    current: Bilingual;
    indicators: {
      commodities: Bilingual;
      unemployment: Bilingual;
      inflation: Bilingual;
    };
    strategy: Bilingual;
  };
  jupiter: {
    longitude: string;
    sign: Bilingual;
    phase: Bilingual;
    sentiment: Bilingual;
  };
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
