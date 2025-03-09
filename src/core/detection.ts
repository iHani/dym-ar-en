import { SCORING, COMMON_ENGLISH_WORDS } from "../config"
import type { LanguageDetectionResult } from "../types"

// Language detection function
export function detectLanguage(text: string): LanguageDetectionResult {
  if (!text) return { language: "unknown", confidence: 0 }

  // Count characters from each language
  let arabicCount = 0
  let englishCount = 0

  for (const char of text) {
    if (/[\u0600-\u06FF]/.test(char)) {
      arabicCount++
    } else if (/[a-zA-Z]/.test(char)) {
      englishCount++
    }
  }

  const total = arabicCount + englishCount
  if (total === 0) return { language: "unknown", confidence: 0 }

  if (arabicCount > englishCount) {
    return { language: "arabic", confidence: arabicCount / total }
  } else {
    return { language: "english", confidence: englishCount / total }
  }
}

// Scoring system for language correctness
export function scoreText(text: string, language: "arabic" | "english"): number {
  if (!text) return 0

  let score = 0
  const textLength = text.length

  // Split text into words for more accurate analysis
  const words = text.split(/\s+/).filter((word) => word.length > 0)
  if (words.length === 0) return 0

  // Basic pattern analysis
  if (language === "english") {
    // English patterns
    score += scoreEnglishText(text, words, textLength)
  } else {
    // Arabic patterns
    score += scoreArabicText(text, words)
  }

  // Add general text structure analysis
  score += scoreGeneralTextStructure(words)

  // Apply a confidence multiplier for high-scoring texts
  if (score > SCORING.Common.HIGH_SCORE_THRESHOLD) {
    const multiplier = 1 + (score - SCORING.Common.HIGH_SCORE_THRESHOLD) / 100
    score = Math.min(100, score * multiplier)
  }

  // Normalize score to 0-100 range
  return Math.min(100, Math.max(0, score))
}

function scoreEnglishText(text: string, words: string[], textLength: number): number {
  let score = 0

  // Check for common English words - very strong indicators
  let commonWordCount = 0
  for (const word of words) {
    if (COMMON_ENGLISH_WORDS.includes(word.toLowerCase())) {
      commonWordCount++
    }
  }

  // If more than 20% of words are common English words, this is a strong indicator
  const commonWordRatio = commonWordCount / words.length
  if (commonWordRatio > 0) {
    score += Math.min(40, commonWordRatio * SCORING.English.COMMON_WORDS_RATIO)
  }

  // Vowel/consonant patterns - fundamental to English
  const vowels = ["a", "e", "i", "o", "u"]
  let vowelCount = 0

  for (const char of text.toLowerCase()) {
    if (vowels.includes(char)) {
      vowelCount++
    }
  }

  // English typically has ~40% vowels - this is a strong indicator
  const vowelRatio = vowelCount / textLength
  if (vowelRatio >= 0.2 && vowelRatio <= 0.6) {
    score += SCORING.English.VOWEL_CONSONANT_RATIO
  }

  // Word-level analysis
  let wordScores = 0
  for (const word of words) {
    wordScores += scoreEnglishWord(word.toLowerCase())
  }

  // Normalize word scores based on number of words
  score += Math.min(30, wordScores * (5 / Math.max(1, words.length)))

  // Check for common English punctuation patterns
  if (/[.!?]$/.test(text)) {
    // Ending with sentence punctuation
    score += SCORING.English.SENTENCE_PUNCTUATION
  }

  // Check for apostrophes in common contractions - very distinctive in English
  if (/(\w)'(s|t|re|ve|ll|d|m)(\W|$)/i.test(text)) {
    score += SCORING.English.APOSTROPHE_CONTRACTIONS
  }

  // Check for English sentence structure patterns
  // Articles followed by potential nouns
  let articleCount = 0
  for (let i = 0; i < words.length - 1; i++) {
    if (["the", "a", "an"].includes(words[i].toLowerCase())) {
      articleCount++
    }
  }
  score += Math.min(10, articleCount * SCORING.English.ARTICLE_USAGE)

  // NEGATIVE PATTERNS: Check for standalone characters that are uncommon in English
  const standaloneCommas = (text.match(/\s,\s/g) || []).length
  if (standaloneCommas > 0) {
    score += Math.min(10, standaloneCommas * SCORING.English.STANDALONE_COMMAS)
  }

  return score
}

function scoreEnglishWord(word: string): number {
  let score = 0

  // Common prefixes at the beginning of words
  const commonPrefixes = ["re", "un", "in", "dis", "pre", "pro", "con", "com", "ex"]
  for (const prefix of commonPrefixes) {
    if (word.startsWith(prefix) && word.length > prefix.length + 1) {
      score += SCORING.English.COMMON_PREFIXES
      break // Only count one prefix per word
    }
  }

  // Common suffixes at the end of words - strong indicators of English
  const commonSuffixes = ["ing", "ed", "ly", "ment", "ness", "tion", "able", "ible", "ful", "less"]
  for (const suffix of commonSuffixes) {
    if (word.endsWith(suffix) && word.length > suffix.length + 1) {
      score += SCORING.English.COMMON_SUFFIXES
      break // Only count one suffix per word
    }
  }

  // Double letter analysis - distinctive in English
  const doubleLetters = ["ll", "ss", "ee", "oo", "tt", "ff", "mm", "nn", "pp", "rr"]
  for (const double of doubleLetters) {
    if (word.includes(double)) {
      score += SCORING.English.DOUBLE_LETTERS
      break // Only count one double letter pattern per word
    }
  }

  // Common English trigraphs - strong indicators
  const commonTrigraphs = ["the", "and", "ing", "ion", "tio", "ent", "ati"]
  for (const trigraph of commonTrigraphs) {
    if (word.includes(trigraph)) {
      score += SCORING.English.COMMON_TRIGRAPHS
      break // Only count one trigraph per word
    }
  }

  // Consonant cluster analysis - distinctive in English
  const commonClusters = ["str", "spr", "scr", "spl", "thr", "chr", "sch"]
  for (const cluster of commonClusters) {
    if (word.includes(cluster)) {
      score += SCORING.English.CONSONANT_CLUSTERS
      break // Only count one cluster per word
    }
  }

  // Check for 'th' followed by vowel (common English pattern)
  if (/th[aeiou]/i.test(word)) {
    score += SCORING.English.TH_VOWEL_PATTERN
  }

  // NEGATIVE PATTERNS: Check for patterns that are uncommon in English

  // Comma at the beginning of a word (mapped from Arabic "و")
  if (word.startsWith(",")) {
    score += SCORING.English.COMMA_AT_WORD_START
  }

  // Single letter words that aren't common in English
  if (word.length === 1 && !["a", "i"].includes(word)) {
    score += SCORING.English.UNCOMMON_SINGLE_LETTERS
  }

  // Semicolon in the middle of a word (uncommon in English)
  if (word.includes(";") && word.length > 1) {
    score += SCORING.English.MID_WORD_SEMICOLONS
  }

  // Slash in the middle of a word (uncommon in English)
  if (word.includes("/") && word.length > 1) {
    score += SCORING.English.MID_WORD_SLASHES
  }

  return score
}

function scoreArabicText(text: string, words: string[]): number {
  let score = 0

  // Word-level analysis
  let wordScores = 0
  for (const word of words) {
    wordScores += scoreArabicWord(word)
  }

  // Normalize word scores based on number of words
  score += Math.min(40, wordScores * (5 / Math.max(1, words.length)))

  // Check for Arabic diacritics (tashkeel) - very distinctive in Arabic
  const tashkeel = ["َ", "ً", "ُ", "ٌ", "ِ", "ٍ", "ْ", "ّ"]
  let tashkeelCount = 0
  for (const mark of tashkeel) {
    const count = (text.match(new RegExp(mark, "g")) || []).length
    tashkeelCount += count
  }

  if (tashkeelCount > 0) {
    // Tashkeel is a strong indicator of Arabic
    score += Math.min(15, tashkeelCount * SCORING.Arabic.DIACRITICS)
  }

  // Check for Arabic punctuation - distinctive
  if (/[،؛؟]/.test(text)) {
    score += SCORING.Arabic.ARABIC_PUNCTUATION
  }

  // Check for common Arabic letter patterns
  // Alef followed by lam (ال) is very common
  const alefLamCount = (text.match(/ال/g) || []).length
  score += Math.min(10, alefLamCount * SCORING.Arabic.ALEF_LAM_SEQUENCE)

  // Check for Arabic letter connectivity patterns
  // Many Arabic letters connect differently based on position
  const connectedLetters = [
    "ب",
    "ت",
    "ث",
    "ج",
    "ح",
    "خ",
    "س",
    "ش",
    "ص",
    "ض",
    "ط",
    "ظ",
    "ع",
    "غ",
    "ف",
    "ق",
    "ك",
    "ل",
    "م",
    "ن",
    "ه",
    "ي",
  ]
  let connectedCount = 0

  for (let i = 0; i < text.length - 1; i++) {
    if (connectedLetters.includes(text[i]) && /[\u0600-\u06FF]/.test(text[i + 1])) {
      connectedCount++
    }
  }

  score += Math.min(10, connectedCount * SCORING.Arabic.CONNECTED_LETTERS)

  return score
}

function scoreArabicWord(word: string): number {
  let score = 0

  // Check for Arabic definite article at the beginning of words - fundamental to Arabic
  if (word.startsWith("ال") && word.length > 2) {
    score += SCORING.Arabic.DEFINITE_ARTICLE
  }

  // Check for ta marbuta at the end of words - very distinctive in Arabic
  if (word.endsWith("ة") && word.length > 1) {
    score += SCORING.Arabic.TA_MARBUTA_ENDING
  }

  // Check for common Arabic word endings - strong indicators
  const commonEndings = ["ون", "ين", "ات", "ان", "ية", "ها", "هم", "نا"]
  for (const ending of commonEndings) {
    if (word.endsWith(ending) && word.length > ending.length) {
      score += SCORING.Arabic.COMMON_WORD_ENDINGS
      break // Only count one ending per word
    }
  }

  // Check for common Arabic prefixes - distinctive in Arabic
  const commonPrefixes = ["و", "ف", "ب", "ل", "لل", "مت", "است"]
  for (const prefix of commonPrefixes) {
    if (word.startsWith(prefix) && word.length > prefix.length) {
      score += SCORING.Arabic.COMMON_PREFIXES
      break // Only count one prefix per word
    }
  }

  // Check for Arabic letter patterns (sun and moon letters after ال)
  if (word.startsWith("ال") && word.length > 3) {
    // Sun letters: ت ث د ذ ر ز س ش ص ض ط ظ ل ن
    const sunLetters = ["ت", "ث", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ل", "ن"]
    if (sunLetters.includes(word.charAt(2))) {
      score += SCORING.Arabic.SUN_MOON_LETTERS
    }
  }

  // Check for common Arabic particles as standalone words - strong indicators
  const arabicParticles = ["في", "من", "إلى", "على", "عن", "مع", "هذا", "هذه", "أن", "لم", "لن", "قد"]
  if (arabicParticles.includes(word)) {
    score += SCORING.Arabic.COMMON_PARTICLES
  }

  // Check for لا ligature as a standalone word or at the beginning
  if (word === "لا" || (word.startsWith("لا") && word.length > 2)) {
    score += SCORING.Arabic.LAM_ALEF_LIGATURE
  }

  // Check for و (and) as a standalone word or at the beginning - very common in Arabic
  if (word === "و" || (word.startsWith("و") && word.length > 1)) {
    score += SCORING.Arabic.WAW_CONJUNCTION
  }

  // NEGATIVE PATTERNS: Check for patterns that are uncommon in Arabic

  // Vowels as standalone words (uncommon in Arabic)
  if (word.length === 1 && /[aeiou]/i.test(word)) {
    score += SCORING.Arabic.VOWEL_AS_STANDALONE
  }

  // Words ending with multiple consonants (uncommon in Arabic)
  if (word.length > 2 && /[bcdfghjklmnpqrstvwxyz]{3}$/i.test(word)) {
    score += SCORING.Arabic.MULTIPLE_ENDING_CONSONANTS
  }

  return score
}

function scoreGeneralTextStructure(words: string[]): number {
  // Check for reasonable word lengths (2-15 characters is typical for both languages)
  const reasonableWordLengths = words.filter((word) => word.length >= 2 && word.length <= 15).length
  return (reasonableWordLengths / words.length) * SCORING.Common.REASONABLE_WORD_LENGTH
}

