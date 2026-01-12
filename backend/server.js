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
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 
      'image/heic', 'image/heif',
      'application/pdf',
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/aac',
      'audio/flac', 'audio/ogg', 'audio/aiff',
      'text/plain', 'text/csv'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

// Use gemini-2.5-flash-lite which supports text, images, video, audio, and PDFs
const DEFAULT_MODEL = process.env.MODEL || 'gemini-2.5-flash-lite';

// Cache configuration for model
const modelConfig = {
  model: DEFAULT_MODEL,
  generationConfig: {
    temperature: 0.1, // Very low for consistent, accurate translations
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
  },
};

// Request cache to prevent duplicate translations
const translationCache = new Map();
const CACHE_MAX_SIZE = 1000;
const CACHE_TTL = 3600000; // 1 hour

// Helper to generate cache key
function getCacheKey(text, sourceLang, targetLang) {
  return `${text}|${sourceLang}|${targetLang}`;
}

// Helper to manage cache size
function pruneCache() {
  if (translationCache.size > CACHE_MAX_SIZE) {
    const firstKey = translationCache.keys().next().value;
    translationCache.delete(firstKey);
  }
}

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

    // Check cache first
    const cacheKey = getCacheKey(text, sourceLanguage, targetLanguage);
    const cached = translationCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      console.log('✓ Cache hit - returning cached translation');
      return res.json(cached.data);
    }

    const model = genAI.getGenerativeModel(modelConfig);
    
    let detectedLanguage = sourceLanguage;
    let sourceLang = LANGUAGE_NAMES[sourceLanguage] || sourceLanguage;
    const targetLang = LANGUAGE_NAMES[targetLanguage] || targetLanguage;
    
    // If auto detect, first detect the language
    if (sourceLanguage === 'auto') {
      const detectPrompt = `Identify the language of this text. Respond ONLY with the ISO 639-1 two-letter code (e.g., en, es, fr, de, zh, ja, ar, hi, pt, ru).

Text: "${text}"

Respond with ONLY the 2-letter code, nothing else.`;
      
      console.log('Running language detection...');
      try {
        const detectResult = await model.generateContent(detectPrompt);
        const detectedCode = detectResult.response.text().trim().toLowerCase().replace(/[^a-z]/g, '');
        
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
      prompt = `Task: Analyze "${text}" (${sourceLang})

FIRST: Check if "${text}" is a valid word/phrase in ${sourceLang}.

If INVALID/MISSPELLED:
- Line 1: 2-4 similar correct ${sourceLang} words (comma-separated)
- Line 2: NO_TRANSLATION
- Do NOT provide translations for non-existent words

If VALID:
- Line 1: 2-3 ${sourceLang} synonyms (comma-separated)
- Line 2: TRANSLATIONS:
- Line 3: 3-4 ${targetLang} translations (semicolon-separated, ordered from most to least common)

Example for invalid:
hello, held, help, heel
NO_TRANSLATION

Example for valid:
happy, joyful, cheerful
TRANSLATIONS:
feliz; contento; alegre

Provide ONLY the specified format. No explanations.`;
    } else {
      prompt = `Task: Professional translation from ${sourceLang} to ${targetLang}

Text:
${text}

Rules:
- Preserve exact meaning, tone, and intent
- Use natural ${targetLang} expressions and idioms
- Maintain formatting (line breaks, punctuation, emphasis)
- Match formality level of source
- For technical/specialized terms, use standard ${targetLang} equivalents

Output: ONLY the translated text, no explanations or metadata.`;
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
        
        if (wordCount <= 2 && response.includes('NO_TRANSLATION')) {
          // Word doesn't exist - return suggestions only
          const lines = response.split('\n');
          const suggestionsLine = lines[0].trim();
          
          responseData = {
            translatedText: `Word not found. Did you mean one of these?`,
            synonyms: suggestionsLine,
            detectedLanguage: detectedLanguage,
            noTranslation: true
          };
        } else if (wordCount <= 2 && response.includes('TRANSLATIONS:')) {
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
        
        // Cache the result
        pruneCache();
        translationCache.set(cacheKey, {
          data: responseData,
          timestamp: Date.now()
        });
        
        return res.json(responseData);
        
      } catch (error) {
        lastError = error;
        const retryableErrors = [429, 500, 503, 504];
        const errorStatus = error.status || (error.message?.includes('429') ? 429 : 500);
        const isRetryable = retryableErrors.includes(errorStatus);
        
        if (isRetryable && attempt < 2) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          console.log(`⚠️  Error ${errorStatus}: Retry ${attempt + 1} after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        break;
      }
    }
    
    throw lastError;
  } catch (error) {
    console.error('Translation error:', error);
    
    // Provide user-friendly error messages
    let errorMessage = 'Translation failed';
    let statusCode = 500;
    
    if (error.message?.includes('API key')) {
      errorMessage = 'Invalid API key';
      statusCode = 401;
    } else if (error.message?.includes('quota') || error.status === 429) {
      errorMessage = 'API quota exceeded. Please try again later.';
      statusCode = 429;
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Translation timeout. Please try a shorter text.';
      statusCode = 504;
    }
    
    res.status(statusCode).json({ 
      error: errorMessage, 
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

    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });
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
app.post('/extract-text', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      if (err.message === 'Unsupported file type') {
        return res.status(400).json({ 
          error: 'Unsupported file type',
          details: 'Supported types: images (PNG, JPEG, WEBP, HEIC, HEIF), PDFs, and audio (MP3, WAV, AAC, FLAC, OGG, AIFF). Maximum file size: 10MB.'
        });
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          error: 'File too large',
          details: 'Maximum file size is 10MB.'
        });
      }
      return res.status(500).json({ 
        error: 'File upload failed',
        details: err.message 
      });
    }
    next();
  });
}, async (req, res) => {
  let tempFilePath = null;
  let uploadedFile = null;
  
  try {
    console.log('=== File Upload Request ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('========================');
    
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ 
        error: 'No file uploaded',
        details: 'Please select a file to upload.' 
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('API key not configured');
      return res.status(500).json({ 
        error: 'API key not configured',
        details: 'Server configuration error. Please contact support.'
      });
    }

    const model = genAI.getGenerativeModel(modelConfig);
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

    // Handle different file types with optimized prompts
    let prompt;
    if (mimeType.startsWith('image/')) {
      prompt = `Task: OCR text extraction from image

Instructions:
- Extract ALL visible text exactly as it appears
- Preserve line breaks, spacing, and text layout
- Include text from all regions (headers, body, captions, labels)
- Maintain punctuation and formatting

Output: ONLY the extracted text, no descriptions or metadata.`;
    } else if (mimeType === 'application/pdf') {
      prompt = `Task: Extract text from PDF document

Instructions:
- Extract ALL text content in reading order
- Preserve paragraph breaks and structure
- Maintain formatting (bold, italic) if significant
- Include headers, footers, and page content

Output: ONLY the extracted text, no metadata or page numbers unless they're part of content.`;
    } else if (mimeType.startsWith('audio/')) {
      prompt = `Task: Audio transcription

Instructions:
- Transcribe ALL spoken words accurately
- Use proper punctuation and capitalization
- Indicate speaker changes if multiple speakers
- Preserve meaning and context
- Use [inaudible] for unclear segments

Output: ONLY the transcribed text, no timestamps or metadata.`;
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
    console.error('Error stack:', error.stack);
    
    // Clean up temp file on error
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
        console.log('Cleaned up temp file:', tempFilePath);
      } catch (cleanupError) {
        console.error('Failed to cleanup temp file:', cleanupError);
      }
    }
    
    // Provide more specific error messages
    let errorMessage = 'Failed to extract text from file';
    let errorDetails = error.message;
    
    if (error.message?.includes('API key')) {
      errorMessage = 'Invalid API key';
      errorDetails = 'Server API key is invalid or expired.';
    } else if (error.message?.includes('quota')) {
      errorMessage = 'API quota exceeded';
      errorDetails = 'The server has reached its API quota limit. Please try again later.';
    } else if (error.message?.includes('upload file')) {
      errorMessage = 'File upload to processing service failed';
      errorDetails = 'Could not upload file for processing. The file might be corrupted or in an unsupported format.';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: errorDetails 
    });
  }
});

// Graceful shutdown handler
process.on('SIGTERM', () => {
  console.log('\n⏹️  SIGTERM received, shutting down gracefully...');
  translationCache.clear();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n⏹️  SIGINT received, shutting down gracefully...');
  translationCache.clear();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 TransIntel Backend Server`);
  console.log(`${'='.repeat(50)}`);
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🤖 Model: ${DEFAULT_MODEL}`);
  console.log(`💾 Cache: Enabled (max ${CACHE_MAX_SIZE} entries)`);
  console.log(`🔑 API Key: ${process.env.GEMINI_API_KEY ? '✓ Configured' : '✗ Missing'}`);
  console.log(`${'='.repeat(50)}\n`);
  
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  Warning: GEMINI_API_KEY not found in .env file');
    console.log('📝 Get your API key from: https://aistudio.google.com/app/apikey\n');
  }
});
