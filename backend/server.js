require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');

const app = express();
const PORT = process.env.PORT || 3001;

// Configure multer for file uploads (store in memory)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

// Use gemini-2.5-flash-lite which supports text, images, video, audio, and PDFs
const DEFAULT_MODEL = 'gemini-2.5-flash-lite';

// Language name mapping
const LANGUAGE_NAMES = {
  af: 'Afrikaans', sq: 'Albanian', am: 'Amharic', ar: 'Arabic', hy: 'Armenian',
  az: 'Azerbaijani', eu: 'Basque', be: 'Belarusian', bn: 'Bengali', bs: 'Bosnian',
  bg: 'Bulgarian', ca: 'Catalan', ceb: 'Cebuano', ny: 'Chichewa', zh: 'Chinese',
  'zh-TW': 'Chinese (Traditional)', co: 'Corsican', hr: 'Croatian', cs: 'Czech',
  da: 'Danish', nl: 'Dutch', en: 'English', eo: 'Esperanto', et: 'Estonian',
  tl: 'Filipino', fi: 'Finnish', fr: 'French', fy: 'Frisian', gl: 'Galician',
  ka: 'Georgian', de: 'German', el: 'Greek', gu: 'Gujarati', ht: 'Haitian Creole',
  ha: 'Hausa', haw: 'Hawaiian', he: 'Hebrew', hi: 'Hindi', hmn: 'Hmong',
  hu: 'Hungarian', is: 'Icelandic', ig: 'Igbo', id: 'Indonesian', ga: 'Irish',
  it: 'Italian', ja: 'Japanese', jv: 'Javanese', kn: 'Kannada', kk: 'Kazakh',
  km: 'Khmer', rw: 'Kinyarwanda', ko: 'Korean', ku: 'Kurdish', ky: 'Kyrgyz',
  lo: 'Lao', la: 'Latin', lv: 'Latvian', lt: 'Lithuanian', lb: 'Luxembourgish',
  mk: 'Macedonian', mg: 'Malagasy', ms: 'Malay', ml: 'Malayalam', mt: 'Maltese',
  mi: 'Maori', mr: 'Marathi', mn: 'Mongolian', my: 'Myanmar', ne: 'Nepali',
  no: 'Norwegian', or: 'Odia', ps: 'Pashto', fa: 'Persian', pl: 'Polish',
  pt: 'Portuguese', pa: 'Punjabi', ro: 'Romanian', ru: 'Russian', sm: 'Samoan',
  gd: 'Scots Gaelic', sr: 'Serbian', st: 'Sesotho', sn: 'Shona', sd: 'Sindhi',
  si: 'Sinhala', sk: 'Slovak', sl: 'Slovenian', so: 'Somali', es: 'Spanish',
  su: 'Sundanese', sw: 'Swahili', sv: 'Swedish', tg: 'Tajik', ta: 'Tamil',
  tt: 'Tatar', te: 'Telugu', th: 'Thai', tr: 'Turkish', tk: 'Turkmen',
  uk: 'Ukrainian', ur: 'Urdu', ug: 'Uyghur', uz: 'Uzbek', vi: 'Vietnamese',
  cy: 'Welsh', xh: 'Xhosa', yi: 'Yiddish', yo: 'Yoruba', zu: 'Zulu'
};

// Translation endpoint
app.post('/translate', async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    console.log('\n========== TRANSLATION REQUEST ==========');
    console.log('Input text:', text);
    console.log('Source language code:', sourceLanguage);
    console.log('Target language code:', targetLanguage);

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Text and target language are required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'API key not configured. Please add your Gemini API key to the .env file' 
      });
    }

    const model = genAI.getGenerativeModel({ 
      model: DEFAULT_MODEL,
      generationConfig: {
        temperature: 0.3, // Lower temperature for more accurate, deterministic translations
        topP: 0.8,
        topK: 40,
      },
    });
    
    let detectedLanguage = sourceLanguage;
    let sourceLang = LANGUAGE_NAMES[sourceLanguage] || sourceLanguage;
    const targetLang = LANGUAGE_NAMES[targetLanguage] || targetLanguage;
    
    // If auto detect, first detect the language
    if (sourceLanguage === 'auto') {
      const detectPrompt = `Detect the language of the following text and respond with ONLY the ISO 639-1 two-letter language code (e.g., "en" for English, "es" for Spanish, "fr" for French, "de" for German, etc.). Respond with just the code, nothing else:\n\n${text}`;
      
      console.log('Running language detection...');
      try {
        const detectResult = await model.generateContent(detectPrompt);
        const detectedCode = detectResult.response.text().trim().toLowerCase();
        
        console.log('Detected language code:', detectedCode);
        
        // Validate it's a reasonable 2-letter code
        if (detectedCode.length === 2 && /^[a-z]{2}$/.test(detectedCode)) {
          detectedLanguage = detectedCode;
          sourceLang = LANGUAGE_NAMES[detectedCode] || detectedCode;
          console.log('Using detected language:', detectedCode, '(' + sourceLang + ')');
        }
      } catch (error) {
        console.error('Language detection error:', error);
        // Continue with auto if detection fails
      }
    }

    console.log('Source language name:', sourceLang);
    console.log('Target language name:', targetLang);

    // Check if it's 1-2 words to provide alternatives and synonyms
    const wordCount = text.trim().split(/\s+/).length;
    let prompt;
    
    console.log('Word count:', wordCount);
    
    if (wordCount <= 2) {
      prompt = `For the word/phrase "${text}" in ${sourceLang}:

Provide ONLY the following format with NO additional text, explanations, or commentary:
1. First line: 2-3 synonyms in ${sourceLang} separated by commas
2. Second line: the text "TRANSLATIONS:"
3. Third line: alternative translations to ${targetLang} separated by semicolons

Format example (follow this EXACTLY):
happy, joyful, content
TRANSLATIONS:
feliz; contento; alegre

Do NOT include any explanations, notes, or additional text. ONLY the three lines as shown.`;
    } else {
      prompt = `You are a professional translator. Translate the following text from ${sourceLang} to ${targetLang}.

Rules:
- Preserve the original meaning and tone
- Maintain natural ${targetLang} grammar and idioms
- Keep formatting (line breaks, punctuation)
- Provide ONLY the translation, no explanations

Text to translate:
${text}`;
    }

    console.log('\n--- PROMPT SENT TO GEMINI ---');
    console.log(prompt);
    console.log('--- END PROMPT ---\n');

    // Use with retry logic
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        
        console.log('\n--- GEMINI RAW RESPONSE ---');
        console.log(response);
        console.log('--- END RESPONSE ---\n');
        
        // Parse response to extract synonyms and translations
        let responseData = { translatedText: response.trim(), detectedLanguage: detectedLanguage };
        
        if (wordCount <= 2 && response.includes('TRANSLATIONS:')) {
          const parts = response.split('TRANSLATIONS:');
          let synonymsLine = parts[0].trim();
          const translationsLine = parts[1].trim();
          
          // Clean up synonyms: remove any explanatory text before the actual synonyms
          // Look for the last line before TRANSLATIONS: which should contain the synonyms
          const synonymsLines = synonymsLine.split('\n');
          const lastLine = synonymsLines[synonymsLines.length - 1].trim();
          
          // If the last line looks like a list of words (contains commas), use it
          if (lastLine.includes(',')) {
            synonymsLine = lastLine;
          }
          
          // Clean translations: take only the first line if there are multiple
          const translationFirstLine = translationsLine.split('\n')[0].trim();
          
          console.log('Parsed synonyms:', synonymsLine);
          console.log('Parsed translations:', translationFirstLine);
          
          responseData = {
            synonyms: synonymsLine,
            translatedText: translationFirstLine,
            detectedLanguage: detectedLanguage
          };
        }
        
        console.log('\n--- FINAL RESPONSE DATA ---');
        console.log(JSON.stringify(responseData, null, 2));
        console.log('========================================\n');
        
        return res.json(responseData);
        
      } catch (error) {
        lastError = error;
        const retryableErrors = [429, 500, 503, 504];
        const isRetryable = error.status && retryableErrors.includes(error.status);
        
        if (isRetryable && attempt < 2) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        break;
      }
    }
    
    throw lastError;
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      error: 'Translation failed', 
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    apiKeyConfigured: !!process.env.GEMINI_API_KEY 
  });
});

// Test API key endpoint
app.get('/test-api', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'API key not configured' 
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const result = await model.generateContent('Say "API key is working" in one sentence.');
    const testResponse = result.response.text();
    
    res.json({ 
      success: true, 
      message: 'API key is valid and working!',
      testResponse: testResponse 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      details: 'Your API key might be invalid, expired, or has reached quota limits. Get a new key from: https://aistudio.google.com/app/apikey'
    });
  }
});

// File text extraction endpoint
app.post('/extract-text', upload.single('file'), async (req, res) => {
  let tempFilePath = null;
  let uploadedFile = null;
  
  try {
    console.log('=== File Upload Request ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('========================');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'API key not configured' 
      });
    }

    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });
    const mimeType = req.file.mimetype;
    
    // Check if it's a text-based format we can handle directly
    if (mimeType.startsWith('text/')) {
      const text = req.file.buffer.toString('utf8');
      return res.json({ text: text.trim() });
    }

    // For non-text files, use Files API for better reliability
    // Save buffer to temp file
    tempFilePath = path.join(__dirname, `temp_${Date.now()}_${req.file.originalname}`);
    fs.writeFileSync(tempFilePath, req.file.buffer);

    console.log(`Temp file created: ${tempFilePath}, size: ${req.file.size} bytes, mime: ${mimeType}`);

    // Upload file using Files API
    try {
      uploadedFile = await fileManager.uploadFile(tempFilePath, {
        mimeType: mimeType,
        displayName: req.file.originalname,
      });
      
      console.log(`Upload response:`, uploadedFile);
    } catch (uploadError) {
      console.error('File upload error:', uploadError);
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    if (!uploadedFile || !uploadedFile.file || !uploadedFile.file.name) {
      throw new Error('File upload returned invalid response');
    }

    const geminiFile = uploadedFile.file;
    console.log(`Uploaded file ${geminiFile.name} as: ${geminiFile.uri}`);
    
    // Wait for file to be processed (if not already ACTIVE)
    let file = geminiFile;
    if (file.state === 'PROCESSING') {
      file = await fileManager.getFile(geminiFile.name);
      while (file.state === 'PROCESSING') {
        console.log('Waiting for file to be processed...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        file = await fileManager.getFile(geminiFile.name);
      }
    }
    
    if (file.state === 'FAILED') {
      throw new Error('File processing failed');
    }
    
    console.log(`File ready: ${file.uri}`);

    // Handle different file types
    let prompt;
    if (mimeType.startsWith('image/')) {
      prompt = "Extract all text from this image. Return only the extracted text content, without any additional explanation, formatting, or metadata.";
    } else if (mimeType === 'application/pdf') {
      prompt = "Extract all text from this PDF document. Return only the extracted text content, without any additional explanation, formatting, or metadata.";
    } else if (mimeType.startsWith('audio/')) {
      prompt = "Transcribe this audio file. Return only the transcribed text, without any additional explanation or metadata.";
    } else {
      return res.status(400).json({ 
        error: 'Unsupported file type',
        message: 'Supported types: images (PNG, JPEG, WEBP, HEIC, HEIF), PDFs, and audio (MP3, WAV, AAC, FLAC, OGG, AIFF). Maximum file size: 10MB.' 
      });
    }

    const result = await model.generateContent([
      { fileData: { fileUri: file.uri, mimeType: file.mimeType } },
      { text: prompt }
    ]);
    
    const extractedText = result.response.text();
    
    // Clean up temp file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    
    // Delete uploaded file from Gemini
    try {
      await fileManager.deleteFile(file.name);
    } catch (deleteError) {
      console.error('Failed to delete uploaded file:', deleteError);
    }
    
    return res.json({ text: extractedText.trim() });
    
  } catch (error) {
    console.error('Text extraction error:', error);
    
    // Clean up temp file on error
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    
    res.status(500).json({ 
      error: 'Failed to extract text from file',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Translation server running on http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  Warning: GEMINI_API_KEY not found in .env file');
    console.log('📝 Get your API key from: https://makersuite.google.com/app/apikey');
  }
});
