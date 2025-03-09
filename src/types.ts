export interface LanguageDetectionResult {
  language: string;
  confidence: number;
}

export interface CorrectionResult {
  original: string;
  corrected: string;
  originalLanguage: LanguageDetectionResult;
  correctedLanguage: LanguageDetectionResult;
  originalScore: number;
  correctedScore: number;
  needsCorrection: boolean;
}

export type ConversionDirection = "toArabic" | "toEnglish";

export interface ScoringConfig {
  Arabic: {
    DEFINITE_ARTICLE: number;
    TA_MARBUTA_ENDING: number;
    COMMON_WORD_ENDINGS: number;
    COMMON_PREFIXES: number;
    SUN_MOON_LETTERS: number;
    COMMON_PARTICLES: number;
    LAM_ALEF_LIGATURE: number;
    WAW_CONJUNCTION: number;
    DIACRITICS: number;
    ARABIC_PUNCTUATION: number;
    ALEF_LAM_SEQUENCE: number;
    CONNECTED_LETTERS: number;
    VOWEL_AS_STANDALONE: number;
    MULTIPLE_ENDING_CONSONANTS: number;
  };
  English: {
    COMMON_WORDS_RATIO: number;
    VOWEL_CONSONANT_RATIO: number;
    COMMON_PREFIXES: number;
    COMMON_SUFFIXES: number;
    DOUBLE_LETTERS: number;
    COMMON_TRIGRAPHS: number;
    CONSONANT_CLUSTERS: number;
    TH_VOWEL_PATTERN: number;
    SENTENCE_PUNCTUATION: number;
    APOSTROPHE_CONTRACTIONS: number;
    ARTICLE_USAGE: number;
    COMMA_AT_WORD_START: number;
    UNCOMMON_SINGLE_LETTERS: number;
    MID_WORD_SEMICOLONS: number;
    MID_WORD_SLASHES: number;
    STANDALONE_COMMAS: number;
  };
  Common: {
    REASONABLE_WORD_LENGTH: number;
    HIGH_SCORE_THRESHOLD: number;
    BASE_THRESHOLD: number;
    HIGH_SCORE_CERTAINTY: number;
  };
}