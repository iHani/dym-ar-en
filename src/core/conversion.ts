import { englishToArabicMap, arabicToEnglishMap } from "../mappings"
import type { ConversionDirection } from "../types"

// Convert text between languages based on keyboard layout
export function convertText(text: string, direction: ConversionDirection): string {
  const map = direction === "toArabic" ? englishToArabicMap : arabicToEnglishMap

  return text
    .split("")
    .map((char) => {
      return map[char] || char
    })
    .join("")
}

