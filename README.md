# Did You Mean (dym-ar-en)

Corrects "hgsbl ugd;l" to "السلام عليكم" and "اثممخ صخقمي" to "hello world"

A keyboard layout correction library for Arabic/English text. It detects and corrects text typed with the wrong keyboard layout (QWERTY).

## Features

- Detects when text is typed with the wrong keyboard layout
- Corrects Arabic text typed with an English layout and vice versa
- Provides confidence scores for language detection
- Works in both browser and Node.js environments

## Installation

```bash
npm install dym-ar-en
# or
yarn add dym-ar-en
```

## Usage Example


```javascript
const result = correctKeyboardInput('hgsbl ugd;l');

console.log(result);
/* Output:
{
  original: "hgsbl ugd;l",
  corrected: "السلام عليكم",
  originalLanguage: { 
    language: "english", 
    confidence: 0.9 
  },
  correctedLanguage: { 
    language: "arabic", 
    confidence: 0.95 
  },
  originalScore: 12.5,  // Low score for original text
  correctedScore: 85.3, // High score for corrected text
  needsCorrection: true
}
*/
```

### Correction Result Object

The `correctKeyboardInput` function returns an object with the following properties:

- `original`: The original input text
- `corrected`: The corrected text (if needed)
- `originalLanguage`: Object with `language` and `confidence` properties
- `correctedLanguage`: Object with `language` and `confidence` properties
- `originalScore`: Score of the original text (0-100)
- `correctedScore`: Score of the corrected text (0-100)
- `needsCorrection`: Boolean indicating if correction is needed

### Language Detection

```javascript
import { detectLanguage } from 'dym-ar-en';

const result = detectLanguage('Hello world');
console.log(result); // { language: "english", confidence: 1 }

const result2 = detectLanguage('مرحبا بالعالم');
console.log(result2); // { language: "arabic", confidence: 1 }
```

### Text Conversion

```javascript
import { convertText } from 'dym-ar-en';

// Convert English characters to their Arabic keyboard equivalents
const arabicText = convertText('hgf hghl', 'toArabic');
console.log(arabicText); // "هلا اهلا"

// Convert Arabic characters to their English keyboard equivalents
const englishText = convertText('مرحبا', 'toEnglish');
console.log(englishText); // "pvfhh"
```

## Scoring System

The library uses a sophisticated scoring system to determine the likelihood that text is in a particular language. Higher scores indicate greater confidence.

For example:

```javascript
import { scoreText } from 'dym-ar-en';

const arabicScore = scoreText('مرحبا بالعالم', 'arabic');
console.log(arabicScore); // Returns a score between 0-100

const englishScore = scoreText('Hello world', 'english');
console.log(englishScore); // Returns a score between 0-100
```

For a complete list of scoring factors, see the source code in `src/config/scoring.ts`.

## Limitations

- Works specifically with QWERTY keyboard layouts
- Accuracy improves with longer text samples
- Not 100% accurate, especially with very short texts or ambiguous content
- Designed for Arabic/English language pair only

## How It Works

1. The library detects the apparent language of the input text
2. It converts the text to both possible keyboard layouts
3. It scores each version based on language-specific patterns
4. It returns the higher-scoring version if it's significantly better than the original

## Custom Thresholds

You can use the score values to implement custom thresholds for when to apply corrections:

```javascript
import { correctKeyboardInput } from 'dym-ar-en';

function customCorrection(text, minImprovement = 30) {
  const result = correctKeyboardInput(text);
  
  // Only apply correction if the improvement is significant
  if (result.correctedScore - result.originalScore > minImprovement) {
    return result.corrected;
  }
  
  // Otherwise return the original text
  return text;
}

// Example usage
console.log(customCorrection('hgsbl ugd;l')); // Returns "السلام عليكم"
console.log(customCorrection('hello', 50)); // Might return "hello" if improvement isn't significant
```

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Areas for Improvement

- Adding support for more keyboard layouts
- Improving detection accuracy for short texts
- Adding support for more language pairs
- Optimizing performance for large texts
- Improving the scoring algorithm

## License

MIT

