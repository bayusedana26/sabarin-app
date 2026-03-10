export type Tone = 'Professional' | 'Savage-but-Polite' | 'Direct';
export type Language = 'ID-ID' | 'EN-EN' | 'ID-EN' | 'EN-ID';

export interface TranslationResult {
  id: string;
  timestamp: number;
  original: string;
  translated: string;
  tone: Tone;
  language: Language;
  score: {
    professional: number;
    savage: number;
  };
}
