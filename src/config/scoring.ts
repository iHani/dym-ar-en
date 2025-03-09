import type { ScoringConfig } from "../types"

// Scoring configuration - easily adjust weights for different detection algorithms
export const SCORING: ScoringConfig = {
  Arabic: {
    // Positive indicators
    DEFINITE_ARTICLE: 5, // Words starting with "ال"
    TA_MARBUTA_ENDING: 5, // Words ending with "ة"
    COMMON_WORD_ENDINGS: 3, // Words with endings like "ون", "ين", "ات"
    COMMON_PREFIXES: 2, // Words with prefixes like "و", "ف", "ب"
    SUN_MOON_LETTERS: 3, // Proper sun/moon letter patterns after "ال"
    COMMON_PARTICLES: 4, // Common standalone words like "في", "من"
    LAM_ALEF_LIGATURE: 3, // Words with "لا" ligature
    WAW_CONJUNCTION: 3, // "و" as standalone or prefix
    DIACRITICS: 3, // Per diacritic mark, up to 15 total
    ARABIC_PUNCTUATION: 5, // Presence of Arabic-specific punctuation
    ALEF_LAM_SEQUENCE: 2, // Per "ال" sequence, up to 10 total
    CONNECTED_LETTERS: 1, // Per connected letter pattern, up to 10 total

    // Negative indicators
    VOWEL_AS_STANDALONE: -3, // Single vowel words
    MULTIPLE_ENDING_CONSONANTS: -2, // Words ending with multiple consonants
  },

  English: {
    // Positive indicators
    COMMON_WORDS_RATIO: 100, // Multiplier for common word ratio (max 40)
    VOWEL_CONSONANT_RATIO: 15, // Proper vowel/consonant distribution
    COMMON_PREFIXES: 2, // Words with prefixes like "re", "un"
    COMMON_SUFFIXES: 3, // Words with suffixes like "ing", "ed"
    DOUBLE_LETTERS: 2, // Words with double letter patterns
    COMMON_TRIGRAPHS: 2, // Words with common 3-letter sequences
    CONSONANT_CLUSTERS: 2, // Words with distinctive consonant clusters
    TH_VOWEL_PATTERN: 2, // Words with "th" followed by vowel
    SENTENCE_PUNCTUATION: 5, // Proper sentence-ending punctuation
    APOSTROPHE_CONTRACTIONS: 5, // Contractions with apostrophes
    ARTICLE_USAGE: 3, // Per article usage, up to 10 total

    // Negative indicators
    COMMA_AT_WORD_START: -3, // Words starting with comma
    UNCOMMON_SINGLE_LETTERS: -2, // Single letter words besides "a", "i"
    MID_WORD_SEMICOLONS: -2, // Words containing semicolons
    MID_WORD_SLASHES: -2, // Words containing slashes
    STANDALONE_COMMAS: -3, // Per standalone comma, up to 10 total
  },

  Common: {
    REASONABLE_WORD_LENGTH: 10, // Maximum score for proper word lengths
    HIGH_SCORE_THRESHOLD: 60, // Threshold for applying confidence multiplier
    BASE_THRESHOLD: 10, // Base threshold for correction decisions
    HIGH_SCORE_CERTAINTY: 70, // Score that indicates high certainty
  },
}

// Common English words for detection
export const COMMON_ENGLISH_WORDS = [
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "if",
  "of",
  "at",
  "by",
  "for",
  "with",
  "about",
  "to",
  "in",
  "on",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "can",
  "could",
  "will",
  "would",
  "should",
  "may",
  "might",
  "must",
  "that",
  "this",
  "these",
  "those",
  "it",
  "they",
  "he",
  "she",
  "we",
  "you",
  "i",
  "me",
  "him",
  "her",
  "us",
  "them",
  "my",
  "your",
  "his",
  "her",
  "its",
  "our",
  "their",
  "from",
  "as",
  "not",
]

