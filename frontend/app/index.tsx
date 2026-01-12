import { useTheme } from '@/contexts/ThemeContext';
import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Modal, FlatList, Platform, KeyboardAvoidingView, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SettingsModal from '@/components/SettingsModal';
import * as DocumentPicker from 'expo-document-picker';
import { storageService } from '@/services/storage';

// Get the API URL based on platform
const getApiUrl = () => {
  // Use your computer's local network IP address
  // This works for all platforms: web, iOS simulator, Android emulator, and physical devices
  return 'https://transintel.onrender.com';
};

const LANGUAGES = [
  { code: 'auto', name: 'Auto Detect' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'sq', name: 'Albanian' },
  { code: 'am', name: 'Amharic' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hy', name: 'Armenian' },
  { code: 'az', name: 'Azerbaijani' },
  { code: 'eu', name: 'Basque' },
  { code: 'be', name: 'Belarusian' },
  { code: 'bn', name: 'Bengali' },
  { code: 'bs', name: 'Bosnian' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'ca', name: 'Catalan' },
  { code: 'ceb', name: 'Cebuano' },
  { code: 'ny', name: 'Chichewa' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'co', name: 'Corsican' },
  { code: 'hr', name: 'Croatian' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'en', name: 'English' },
  { code: 'eo', name: 'Esperanto' },
  { code: 'et', name: 'Estonian' },
  { code: 'tl', name: 'Filipino' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'fy', name: 'Frisian' },
  { code: 'gl', name: 'Galician' },
  { code: 'ka', name: 'Georgian' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ht', name: 'Haitian Creole' },
  { code: 'ha', name: 'Hausa' },
  { code: 'haw', name: 'Hawaiian' },
  { code: 'he', name: 'Hebrew' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hmn', name: 'Hmong' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'is', name: 'Icelandic' },
  { code: 'ig', name: 'Igbo' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ga', name: 'Irish' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'jv', name: 'Javanese' },
  { code: 'kn', name: 'Kannada' },
  { code: 'kk', name: 'Kazakh' },
  { code: 'km', name: 'Khmer' },
  { code: 'rw', name: 'Kinyarwanda' },
  { code: 'ko', name: 'Korean' },
  { code: 'ku', name: 'Kurdish (Kurmanji)' },
  { code: 'ky', name: 'Kyrgyz' },
  { code: 'lo', name: 'Lao' },
  { code: 'la', name: 'Latin' },
  { code: 'lv', name: 'Latvian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'lb', name: 'Luxembourgish' },
  { code: 'mk', name: 'Macedonian' },
  { code: 'mg', name: 'Malagasy' },
  { code: 'ms', name: 'Malay' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'mt', name: 'Maltese' },
  { code: 'mi', name: 'Maori' },
  { code: 'mr', name: 'Marathi' },
  { code: 'mn', name: 'Mongolian' },
  { code: 'my', name: 'Myanmar (Burmese)' },
  { code: 'ne', name: 'Nepali' },
  { code: 'no', name: 'Norwegian' },
  { code: 'or', name: 'Odia (Oriya)' },
  { code: 'ps', name: 'Pashto' },
  { code: 'fa', name: 'Persian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sm', name: 'Samoan' },
  { code: 'gd', name: 'Scots Gaelic' },
  { code: 'sr', name: 'Serbian' },
  { code: 'st', name: 'Sesotho' },
  { code: 'sn', name: 'Shona' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'si', name: 'Sinhala' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'so', name: 'Somali' },
  { code: 'es', name: 'Spanish' },
  { code: 'su', name: 'Sundanese' },
  { code: 'sw', name: 'Swahili' },
  { code: 'sv', name: 'Swedish' },
  { code: 'tg', name: 'Tajik' },
  { code: 'ta', name: 'Tamil' },
  { code: 'tt', name: 'Tatar' },
  { code: 'te', name: 'Telugu' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'tk', name: 'Turkmen' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'ug', name: 'Uyghur' },
  { code: 'uz', name: 'Uzbek' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'cy', name: 'Welsh' },
  { code: 'xh', name: 'Xhosa' },
  { code: 'yi', name: 'Yiddish' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'zu', name: 'Zulu' },
];

// Right-to-left languages
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'yi', 'ps', 'sd', 'ug', 'ku'];

export default function TranslateScreen() {
  const { theme } = useTheme();
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [alternatives, setAlternatives] = useState<string[]>([]);
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const [showTargetPicker, setShowTargetPicker] = useState(false);
  const [sourceSearchQuery, setSourceSearchQuery] = useState('');
  const [targetSearchQuery, setTargetSearchQuery] = useState('');
  const sourcePickerAnim = useRef(new Animated.Value(0)).current;
  const targetPickerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showSourcePicker) {
      sourcePickerAnim.setValue(0);
      Animated.timing(sourcePickerAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showSourcePicker]);

  useEffect(() => {
    if (showTargetPicker) {
      targetPickerAnim.setValue(0);
      Animated.timing(targetPickerAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showTargetPicker]);

  const closeSourcePicker = () => {
    Animated.timing(sourcePickerAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowSourcePicker(false);
      setSourceSearchQuery('');
    });
  };

  const closeTargetPicker = () => {
    Animated.timing(targetPickerAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowTargetPicker(false);
      setTargetSearchQuery('');
    });
  };

  // Load saved language preferences on mount
  useEffect(() => {
    const loadLanguagePreferences = async () => {
      try {
        const prefs = await storageService.getItem<{ sourceLanguage: string; targetLanguage: string }>('@language_preferences');
        if (prefs) {
          if (prefs.sourceLanguage) setSourceLanguage(prefs.sourceLanguage);
          if (prefs.targetLanguage) setTargetLanguage(prefs.targetLanguage);
          console.log('Loaded language preferences:', prefs);
        }
      } catch (error) {
        console.error('Error loading language preferences:', error);
      }
    };
    loadLanguagePreferences();
  }, []);

  // Track if we should skip the next reset (when setting from API)
  const skipResetRef = useRef<boolean>(false);

  // Reset similar sections whenever translated text changes
  useEffect(() => {
    if (skipResetRef.current) {
      skipResetRef.current = false;
      return;
    }
    // Reset both alternatives and synonyms when translation changes
    if (translatedText) {
      setAlternatives([]);
      setSynonyms([]);
    }
  }, [translatedText]);

  // Reset similar sections whenever input text changes (user is editing)
  useEffect(() => {
    // Reset alternatives, synonyms, and translated text when input changes
    setAlternatives([]);
    setSynonyms([]);
    setTranslatedText('');
  }, [inputText]);

  const getLanguageName = (code: string) => {
    return LANGUAGES.find(lang => lang.code === code)?.name || code;
  };

  const isRTL = (languageCode: string) => {
    return RTL_LANGUAGES.includes(languageCode);
  };

  const getFilteredSourceLanguages = () => {
    if (!sourceSearchQuery.trim()) return LANGUAGES;
    return LANGUAGES.filter(lang => 
      lang.name.toLowerCase().includes(sourceSearchQuery.toLowerCase())
    );
  };

  const getFilteredTargetLanguages = () => {
    const languagesWithoutAuto = LANGUAGES.filter(lang => lang.code !== 'auto');
    if (!targetSearchQuery.trim()) return languagesWithoutAuto;
    return languagesWithoutAuto.filter(lang => 
      lang.name.toLowerCase().includes(targetSearchQuery.toLowerCase())
    );
  };

  const swapLanguages = () => {
    // Don't swap if source is auto detect
    if (sourceLanguage === 'auto') {
      return;
    }
    
    const tempLang = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(tempLang);
    
    // Also swap the text
    const tempText = inputText;
    setInputText(translatedText);
    setTranslatedText(tempText);
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'text/*',
          'image/*',
          'application/pdf',
          'audio/*',
          'audio/ogg',
          'audio/vorbis',
          'application/ogg',
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      
      // Check file size (10MB limit)
      if (file.size && file.size > 10 * 1024 * 1024) {
        Alert.alert(
          'File Too Large',
          'The selected file is too large. Please choose a file smaller than 10MB.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      setExtracting(true);

      // For text files, read directly
      if (file.mimeType?.startsWith('text/')) {
        const response = await fetch(file.uri);
        const text = await response.text();
        setInputText(text);
        setExtracting(false);
        // Automatically translate
        await handleTranslate(text);
      } else {
        // For images, PDFs, audio, video, send to backend for processing
        const formData = new FormData();
        
        // In React Native, append the file URI directly with proper structure
        formData.append('file', {
          uri: file.uri,
          type: file.mimeType || 'application/octet-stream',
          name: file.name,
        } as any);

        const response = await fetch(`${getApiUrl()}/extract-text`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.text) {
          setInputText(data.text);
          setExtracting(false);
          // Automatically translate the extracted text
          await handleTranslate(data.text);
        } else if (data.error) {
          Alert.alert(
            'Extraction Failed',
            'We couldn\'t extract text from this file. Please make sure the file contains readable text or try a different file.',
            [{ text: 'OK' }]
          );
          setExtracting(false);
        }
      }
    } catch (error) {
      console.error('File upload error:', error);
      Alert.alert(
        'Upload Failed',
        'There was a problem uploading your file. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
      setExtracting(false);
    }
  };

  const handleTranslate = async (textToTranslate?: string) => {
    // If textToTranslate is not a string (e.g., event object from onSubmitEditing), use inputText
    const text = typeof textToTranslate === 'string' ? textToTranslate : inputText;
    if (!text?.trim()) return;
    
    setTranslating(true);
    skipResetRef.current = true;
    try {
      const response = await fetch(`${getApiUrl()}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          sourceLanguage,
          targetLanguage,
        }),
      });

      const data = await response.json();
      if (data.translatedText) {
        // Parse synonyms if they exist
        if (data.synonyms) {
          const syns = data.synonyms
            .split(',')
            .map((s: string) => s.trim())
            .filter((s: string) => {
              // Filter out invalid or irrelevant synonyms
              if (!s || s.length === 0) return false;
              // Remove very long strings (likely not synonyms)
              if (s.length > 50) return false;
              // Remove entries that look like translations with semicolons
              if (s.includes(';')) return false;
              // Remove entries with excessive punctuation
              const punctuationCount = (s.match(/[;:,]/g) || []).length;
              if (punctuationCount > 2) return false;
              return true;
            })
            .slice(0, 8); // Limit to 8 synonyms max
          setSynonyms(syns);
        } else {
          setSynonyms([]);
        }
        
        // Check if alternatives are provided separately
        if (data.alternatives && Array.isArray(data.alternatives)) {
          // Backend provides alternatives in a separate field
          setTranslatedText(data.translatedText);
          setAlternatives(data.alternatives.filter((alt: string) => alt && alt.trim()));
        } else if (data.translatedText.includes(';')) {
          // Parse alternatives from translatedText (separated by semicolons)
          // First word/phrase is the main translation, rest are similar alternatives
          const translations = data.translatedText
            .split(';')
            .map((t: string) => t.trim())
            .filter((t: string) => t.length > 0 && t.length <= 100); // Filter out empty and very long strings
          
          if (translations.length > 0) {
            // Set the first translation as the main one
            setTranslatedText(translations[0]);
            
            // Store remaining translations as alternatives (max 8 to avoid clutter)
            if (translations.length > 1) {
              setAlternatives(translations.slice(1, 9));
            } else {
              setAlternatives([]);
            }
          } else {
            // Fallback if filtering removed everything
            setTranslatedText(data.translatedText);
            setAlternatives([]);
          }
        } else {
          // No alternatives, just set the translation
          setTranslatedText(data.translatedText);
          setAlternatives([]);
        }
        
        // If language was auto-detected, update the source language
        if (sourceLanguage === 'auto' && data.detectedLanguage && data.detectedLanguage !== 'auto') {
          setSourceLanguage(data.detectedLanguage);
        }
      } else if (data.error) {
        setTranslatedText(`Error: ${data.error}`);
        setAlternatives([]);
        setSynonyms([]);
      }
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('');
      Alert.alert(
        'Translation Failed',
        'We couldn\'t connect to the translation service. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setTranslating(false);
    }
  };

  const handleReset = () => {
    setInputText('');
    setTranslatedText('');
    setAlternatives([]);
    setSynonyms([]);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>TransIntel</Text>
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: theme.card }]}
          onPress={() => setSettingsVisible(true)}
        >
          <Ionicons name="settings" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Language Selectors */}
        <View style={styles.languageRow}>
          <TouchableOpacity 
            style={styles.languageButton}
            onPress={() => setShowSourcePicker(true)}
          >
            <View style={styles.languageValueRow}>
              <Text style={[styles.languageValue, { color: theme.text }]}>{getLanguageName(sourceLanguage)}</Text>
              <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Swap Button */}
          <TouchableOpacity 
            style={styles.swapButton}
            onPress={swapLanguages}
          >
            <Ionicons name="swap-horizontal" size={24} color={theme.primary} />
          </TouchableOpacity>

          {/* Reset Button */}
          <TouchableOpacity 
            style={styles.swapButton}
            onPress={handleReset}
          >
            <Ionicons name="refresh" size={24} color={theme.primary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.languageButton}
            onPress={() => setShowTargetPicker(true)}
          >
            <View style={styles.languageValueRow}>
              <Text style={[styles.languageValue, { color: theme.text }]}>{getLanguageName(targetLanguage)}</Text>
              <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Translation Panels */}
        <View style={styles.panelsRow}>
          {/* Input Panel */}
          <View style={[styles.panel, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {extracting ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
              </View>
            ) : (
              <View style={styles.panelContent}>
                <TextInput
                  style={[
                    styles.textInput, 
                    { color: theme.text },
                    isRTL(sourceLanguage) && { textAlign: 'right', writingDirection: 'rtl' }
                  ]}
                  multiline
                  placeholder="Enter text to translate..."
                  placeholderTextColor={theme.placeholder}
                  value={inputText}
                  onChangeText={setInputText}
                  blurOnSubmit={true}
                  onSubmitEditing={handleTranslate}
                  returnKeyType="done"
                />
                {synonyms.length > 0 && (
                  <View style={styles.synonymsContainer}>
                    <Text style={[styles.synonymsTitle, { color: theme.textSecondary }]}>Similar:</Text>
                    <View style={[
                      styles.synonymsRow,
                      isRTL(sourceLanguage) && { flexDirection: 'row-reverse' }
                    ]}>
                      {synonyms.map((syn, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[styles.synonymChip, { backgroundColor: theme.inputBackground }]}
                          onPress={() => {
                            setInputText(syn);
                          }}
                        >
                          <Text style={[
                            styles.synonymText, 
                            { color: theme.text },
                            isRTL(sourceLanguage) && { writingDirection: 'rtl' }
                          ]}>{syn}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
            <TouchableOpacity 
              style={[styles.uploadButton, { backgroundColor: theme.card }]}
              onPress={handleFileUpload}
            >
              <Ionicons name="document-attach" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>

          {/* Output Panel */}
          <View style={[styles.panel, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {translating ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
              </View>
            ) : (
              <View style={styles.panelContent}>
                <ScrollView style={styles.textOutput}>
                  <Text style={[
                    styles.outputText, 
                    { color: theme.text },
                    isRTL(targetLanguage) && { textAlign: 'right', writingDirection: 'rtl' }
                  ]}>
                    {translatedText || '...'}
                  </Text>
                </ScrollView>
                {alternatives.length > 0 && (
                  <View style={styles.synonymsContainer}>
                    <Text style={[styles.synonymsTitle, { color: theme.textSecondary }]}>Also translated as:</Text>
                    <View style={[
                      styles.synonymsRow,
                      isRTL(targetLanguage) && { flexDirection: 'row-reverse' }
                    ]}>
                      {alternatives.map((alt, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[styles.synonymChip, { backgroundColor: theme.inputBackground }]}
                          onPress={() => {
                            setTranslatedText(alt);
                          }}
                        >
                          <Text style={[
                            styles.synonymText, 
                            { color: theme.text },
                            isRTL(targetLanguage) && { writingDirection: 'rtl' }
                          ]}>{alt}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />

      {/* Language Picker Modals */}
      <Modal
        visible={showSourcePicker}
        transparent={true}
        animationType="none"
        onRequestClose={closeSourcePicker}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: sourcePickerAnim }]}>
          <Animated.View 
            style={[
              styles.modalContent, 
              { 
                backgroundColor: theme.card,
                transform: [{
                  translateY: sourcePickerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  })
                }]
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Select Source Language</Text>
              <TouchableOpacity onPress={closeSourcePicker}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            {/* Search Input */}
            <View style={[styles.searchContainer, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
              <Ionicons name="search" size={20} color={theme.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: theme.text }]}
                placeholder="Search languages..."
                placeholderTextColor={theme.placeholder}
                value={sourceSearchQuery}
                onChangeText={setSourceSearchQuery}
              />
              {sourceSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSourceSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={getFilteredSourceLanguages()}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.languageItem,
                    sourceLanguage === item.code && { backgroundColor: theme.primary + '20' }
                  ]}
                  onPress={() => {
                    setSourceLanguage(item.code);
                    closeSourcePicker();
                    // Save preference
                    storageService.setItem('@language_preferences', { 
                      sourceLanguage: item.code, 
                      targetLanguage 
                    });
                  }}
                >
                  <Text style={[styles.languageItemText, { color: theme.text }]}>
                    {item.name}
                  </Text>
                  {sourceLanguage === item.code && (
                    <Ionicons name="checkmark" size={20} color={theme.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        </Animated.View>
      </Modal>

      <Modal
        visible={showTargetPicker}
        transparent={true}
        animationType="none"
        onRequestClose={closeTargetPicker}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: targetPickerAnim }]}>
          <Animated.View 
            style={[
              styles.modalContent, 
              { 
                backgroundColor: theme.card,
                transform: [{
                  translateY: targetPickerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  })
                }]
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Select Target Language</Text>
              <TouchableOpacity onPress={closeTargetPicker}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            {/* Search Input */}
            <View style={[styles.searchContainer, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
              <Ionicons name="search" size={20} color={theme.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: theme.text }]}
                placeholder="Search languages..."
                placeholderTextColor={theme.placeholder}
                value={targetSearchQuery}
                onChangeText={setTargetSearchQuery}
              />
              {targetSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setTargetSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={getFilteredTargetLanguages()}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.languageItem,
                    targetLanguage === item.code && { backgroundColor: theme.primary + '20' }
                  ]}
                  onPress={() => {
                    setTargetLanguage(item.code);
                    closeTargetPicker();
                    // Save preference
                    storageService.setItem('@language_preferences', { 
                      sourceLanguage, 
                      targetLanguage: item.code 
                    });
                  }}
                >
                  <Text style={[styles.languageItemText, { color: theme.text }]}>
                    {item.name}
                  </Text>
                  {targetLanguage === item.code && (
                    <Ionicons name="checkmark" size={20} color={theme.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        </Animated.View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1,
  },
  settingsButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 8,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  languageRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
    alignItems: 'center',
  },
  languageButton: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  languageValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  languageItemText: {
    fontSize: 16,
  },
  pickerContainer: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    minHeight: 80,
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  picker: {
    height: 50,
  },
  panelsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
    minHeight: 240,
  },
  panel: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    position: 'relative',
  },
  panelContent: {
    flex: 1,
  },
  uploadButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  textInput: {
    height: 160,
    fontSize: 16,
    textAlignVertical: 'top',
    padding: 0,
  },
  textOutput: {
    height: 160,
    padding: 0,
  },
  outputText: {
    fontSize: 16,
    lineHeight: 24,
  },
  synonymsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  synonymsTitle: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  synonymsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  synonymChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  synonymText: {
    fontSize: 13,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  translateButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
