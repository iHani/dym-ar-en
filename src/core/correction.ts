import { SCORING } from "../config"
import { detectLanguage, scoreText } from "./detection"
import { convertText } from "./conversion"
import type { CorrectionResult } from "../types"

// Main correction function
export function correctKeyboardInput(input: string): CorrectionResult {
  const originalLanguage = detectLanguage(input)

  // Convert in both directions and check which makes more sense
  const toArabic = convertText(input, "toArabic")
  const toEnglish = convertText(input, "toEnglish")

  const arabicScore = scoreText(toArabic, "arabic")
  const englishScore = scoreText(toEnglish, "english")
  const originalArabicScore = scoreText(input, "arabic")
  const originalEnglishScore = scoreText(input, "english")

  let corrected = input
  let correctedLanguage = originalLanguage
  let originalScore = 0
  let correctedScore = 0
  let needsCorrection = false

  // Lower the threshold to make corrections more likely
  // We want a higher threshold for shorter texts and when original scores are already decent
  const baseThreshold = SCORING.Common.BASE_THRESHOLD
  const lengthFactor = Math.max(0, 5 - input.split(/\s+/).filter((word) => word.length > 0).length) // Shorter texts need higher threshold
  const scoreFactor = Math.min(5, Math.floor(originalArabicScore / 20) || Math.floor(originalEnglishScore / 20))
  const improvementThreshold = baseThreshold + lengthFactor - scoreFactor

  // Special case: If the converted text has a very high score (>70), we should consider it
  // regardless of the original score
  const highScoreThreshold = SCORING.Common.HIGH_SCORE_CERTAINTY

  if (originalLanguage.language === "english") {
    originalScore = originalEnglishScore
    if (arabicScore > originalEnglishScore + improvementThreshold || arabicScore > highScoreThreshold) {
      corrected = toArabic
      correctedLanguage = { language: "arabic", confidence: 0.9 }
      correctedScore = arabicScore
      needsCorrection = true
    } else {
      correctedScore = originalScore
    }
  } else if (originalLanguage.language === "arabic") {
    originalScore = originalArabicScore
    if (englishScore > originalArabicScore + improvementThreshold || englishScore > highScoreThreshold) {
      corrected = toEnglish
      correctedLanguage = { language: "english", confidence: 0.9 }
      correctedScore = englishScore
      needsCorrection = true
    } else {
      correctedScore = originalScore
    }
  } else {
    // If language is unknown, compare both scores
    if (arabicScore > englishScore + improvementThreshold || arabicScore > highScoreThreshold) {
      corrected = toArabic
      correctedLanguage = { language: "arabic", confidence: 0.7 }
      correctedScore = arabicScore
      originalScore = originalEnglishScore
      needsCorrection = true
    } else if (englishScore > arabicScore + improvementThreshold || englishScore > highScoreThreshold) {
      corrected = toEnglish
      correctedLanguage = { language: "english", confidence: 0.7 }
      correctedScore = englishScore
      originalScore = originalArabicScore
      needsCorrection = true
    } else {
      // Not enough confidence to correct
      if (arabicScore > englishScore) {
        correctedLanguage = { language: "arabic", confidence: 0.6 }
        correctedScore = arabicScore
        originalScore = originalEnglishScore
      } else {
        correctedLanguage = { language: "english", confidence: 0.6 }
        correctedScore = englishScore
        originalScore = originalArabicScore
      }
    }
  }

  return {
    original: input,
    corrected,
    originalLanguage,
    correctedLanguage,
    originalScore,
    correctedScore,
    needsCorrection,
  }
}

