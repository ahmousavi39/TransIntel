import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'tr', name: 'Turkish' },
  { code: 'pl', name: 'Polish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'cs', name: 'Czech' },
  { code: 'el', name: 'Greek' },
  { code: 'he', name: 'Hebrew' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'id', name: 'Indonesian' },
];

export default function TranslateScreen() {
  const { theme } = useTheme();
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          sourceLanguage,
          targetLanguage,
        }),
      });

      const data = await response.json();
      if (data.translatedText) {
        setTranslatedText(data.translatedText);
      }
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Error: Could not translate. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>TransIntel</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Language Selectors */}
        <View style={styles.languageRow}>
          <View style={[styles.pickerContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.pickerLabel, { color: theme.textSecondary }]}>From</Text>
            <Picker
              selectedValue={sourceLanguage}
              onValueChange={(value) => setSourceLanguage(value)}
              style={[styles.picker, { color: theme.text }]}
            >
              {LANGUAGES.map((lang) => (
                <Picker.Item key={lang.code} label={lang.name} value={lang.code} />
              ))}
            </Picker>
          </View>

          <View style={[styles.pickerContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.pickerLabel, { color: theme.textSecondary }]}>To</Text>
            <Picker
              selectedValue={targetLanguage}
              onValueChange={(value) => setTargetLanguage(value)}
              style={[styles.picker, { color: theme.text }]}
            >
              {LANGUAGES.map((lang) => (
                <Picker.Item key={lang.code} label={lang.name} value={lang.code} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Translation Panels */}
        <View style={styles.panelsRow}>
          {/* Input Panel */}
          <View style={[styles.panel, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TextInput
              style={[styles.textInput, { color: theme.text }]}
              multiline
              placeholder="Enter text to translate..."
              placeholderTextColor={theme.placeholder}
              value={inputText}
              onChangeText={setInputText}
            />
          </View>

          {/* Output Panel */}
          <View style={[styles.panel, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
              </View>
            ) : (
              <ScrollView style={styles.textOutput}>
                <Text style={[styles.outputText, { color: theme.text }]}>
                  {translatedText || 'Translation will appear here...'}
                </Text>
              </ScrollView>
            )}
          </View>
        </View>

        {/* Translate Button */}
        <TouchableOpacity
          style={[styles.translateButton, { backgroundColor: theme.primary }]}
          onPress={handleTranslate}
          disabled={loading || !inputText.trim()}
        >
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>
            {loading ? 'Translating...' : 'Translate'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  languageRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
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
    gap: 12,
    marginBottom: 16,
    height: 300,
  },
  panel: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  textOutput: {
    flex: 1,
  },
  outputText: {
    fontSize: 16,
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  translateButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
