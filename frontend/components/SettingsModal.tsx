import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Animated, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomAlert, { AlertButton } from './CustomAlert';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { theme, isDark, toggleTheme } = useTheme();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    buttons?: AlertButton[];
    icon?: 'info' | 'error' | 'success' | 'warning';
  }>({ title: '', message: '' });
  const [modalVisible, setModalVisible] = useState(visible);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      setModalVisible(true);
      fadeAnim.setValue(0);
      Animated.spring(fadeAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setModalVisible(false);
      });
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleAbout = () => {
    setAlertConfig({
      title: 'About TransIntel',
      message: 'TransIntel v1.0.0\n\nA powerful translation app supporting 110+ languages with intelligent features:\n\n• Auto language detection\n• Multiple translation alternatives\n• Synonym suggestions\n• File translation (text, images, PDFs, audio)\n• Right-to-left language support\n\nPowered by Google Gemini AI\n\nDeveloped by Amir Hossain Mousavi\n\n© 2026 TransIntel. All rights reserved.',
      icon: 'info',
      buttons: [{ text: 'OK' }],
    });
    setAlertVisible(true);
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://transintel.onrender.com/policy.html');
  };

  const handleTerms = () => {
    Linking.openURL('https://transintel.onrender.com/terms.html');
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <Animated.View 
          style={[
            styles.modalContent, 
            { 
              backgroundColor: theme.background,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [600, 0],
                })
              }]
            }
          ]}
        >
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={[styles.section, { borderBottomColor: theme.border }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
              
              <TouchableOpacity
                style={[styles.settingItem, { backgroundColor: theme.card }]}
                onPress={toggleTheme}
              >
                <View style={styles.settingLeft}>
                  <Ionicons 
                    name={isDark ? 'moon' : 'sunny'} 
                    size={24} 
                    color={theme.primary} 
                  />
                  <Text style={[styles.settingText, { color: theme.text }]}>
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={[styles.section, { borderBottomColor: theme.border }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Legal</Text>
              
              <TouchableOpacity
                style={[styles.settingItem, { backgroundColor: theme.card }]}
                onPress={handlePrivacyPolicy}
              >
                <View style={styles.settingLeft}>
                  <Ionicons name="shield-checkmark" size={24} color={theme.primary} />
                  <Text style={[styles.settingText, { color: theme.text }]}>
                    Privacy Policy
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.settingItem, { backgroundColor: theme.card }]}
                onPress={handleTerms}
              >
                <View style={styles.settingLeft}>
                  <Ionicons name="document-text" size={24} color={theme.primary} />
                  <Text style={[styles.settingText, { color: theme.text }]}>
                    Terms of Use
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={[styles.section, { borderBottomColor: theme.border }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
              
              <TouchableOpacity
                style={[styles.settingItem, { backgroundColor: theme.card }]}
                onPress={handleAbout}
              >
                <View style={styles.settingLeft}>
                  <Ionicons name="information-circle" size={24} color={theme.primary} />
                  <Text style={[styles.settingText, { color: theme.text }]}>
                    About
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        icon={alertConfig.icon}
        onClose={() => setAlertVisible(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
  },
});
