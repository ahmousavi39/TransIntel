# TransIntel - App Submission Checklist

## ✅ All placeholders have been removed!

Your app is now **TransIntel** everywhere with no placeholders remaining.

---

## 📋 Information Needed From You

To complete the app store submission, please provide the following:

### 1. **Contact Information**
- [x] **Support Email**: a.h.mousavi39official@gmail.com
- [x] **Privacy Email**: a.h.mousavi39official@gmail.com
- [x] **Marketing Website**: https://transintel.onrender.com

### 2. **Legal Information**
- [x] **Developer Name**: Amir Hossain Mousavi
- [x] **Company Address**: Hauptstr. 4, 61276 Weilrod, Germany
- [ ] **Tax Information**: For paid apps or in-app purchases

### 3. **App Store Assets** (REQUIRED)

#### **App Icon**
- [ ] **1024x1024px** icon (PNG, no transparency, no rounded corners)
- Current icon location: `frontend/assets/icon.png`
- Should be professional and recognizable at small sizes

#### **Screenshots** (REQUIRED for both iOS and Android)

**iOS Requirements:**
- [ ] 6.7" iPhone screenshots (1290x2796px) - at least 3-5 screenshots
- [ ] 6.5" iPhone screenshots (1284x2778px) - optional but recommended
- [ ] 12.9" iPad Pro screenshots (2048x2732px) - if supporting tablets

**Android Requirements:**
- [ ] Phone screenshots (1080x1920px minimum) - at least 2-8 screenshots
- [ ] 7" tablet screenshots (1024x600px) - optional
- [ ] 10" tablet screenshots (1280x800px) - optional

**Screenshot Ideas:**
1. Main translation screen with sample translation
2. Language selection interface
3. File upload feature in action
4. Alternative translations display
5. Settings/dark mode showcase

#### **Feature Graphic** (Android only)
- [ ] **1024x500px** banner image for Google Play Store

### 4. **App Store Descriptions**

#### **Short Description** (80 characters max)
Current suggestion: *"Translate 110+ languages with AI. Files, text, audio supported."*
- [ ] Approve or provide your own

#### **Full Description** (4000 characters max for iOS, 4000 for Android)
**Suggested Description:**

```
TransIntel - Intelligent Translation Powered by AI

Break down language barriers with TransIntel, the most advanced translation app featuring Google Gemini AI technology. Whether you're traveling, learning, or communicating globally, TransIntel makes translation effortless.

🌍 KEY FEATURES:

• 110+ LANGUAGES
Support for over 110 languages including English, Spanish, French, German, Chinese, Arabic, Japanese, Korean, and many more.

• AUTO-DETECT LANGUAGE
No need to manually select the source language - TransIntel automatically detects what you're translating.

• SMART ALTERNATIVES
Get multiple translation options with synonym suggestions to choose the most accurate meaning for your context.

• FILE TRANSLATION
Upload and translate text from:
  - Images (JPG, PNG)
  - PDF documents
  - Audio recordings
  - Text files

• RTL LANGUAGE SUPPORT
Full right-to-left support for Arabic, Hebrew, Persian, Urdu, and other RTL languages.

• OFFLINE LANGUAGE PREFERENCES
Your language selections are saved locally for quick access.

• BEAUTIFUL DARK MODE
Comfortable viewing with automatic light and dark theme support.

⚡ LIGHTNING FAST
Powered by Google Gemini AI for accurate, near-instant translations.

🎨 CLEAN INTERFACE
Simple, intuitive design that focuses on what matters - your translations.

🔒 PRIVACY FOCUSED
- No account required
- Translations are not stored
- Files are processed temporarily and immediately deleted
- Minimal data collection

Perfect for:
✓ Travelers needing quick translations
✓ Students learning new languages
✓ Business professionals communicating globally
✓ Anyone working with multilingual content

Download TransIntel now and start translating in 110+ languages!
```

- [ ] Approve or customize

#### **Keywords** (iOS - 100 characters max, comma-separated)
Suggested: *"translate,translator,translation,language,dictionary,interpreter,multilingual,AI,speech,text"*
- [ ] Approve or provide your own

### 5. **App Store Categories**
**Primary Category:**
- [ ] iOS: Productivity or Reference
- [ ] Android: Productivity or Tools

**Secondary Category (optional):**
- [ ] iOS: Education
- [ ] Android: Education

### 6. **Age Rating / Content Rating**
Based on your app's content:
- [ ] **iOS**: 4+ (No objectionable content)
- [ ] **Android**: Everyone (suitable for all ages)

### 7. **Privacy Information**

Your Privacy Policy is already complete at:
`https://transintel.onrender.com/policy.html`

**Data Collection Declaration:**
- [ ] Does NOT collect data (recommended to declare):
  - No account required
  - No user tracking
  - Temporary file processing only
  - Local storage only for preferences

### 8. **Google Gemini API Key**
- [ ] **IMPORTANT**: Make sure your Gemini API key is properly configured
- [ ] Current backend: `https://transintel.onrender.com`
- [ ] Verify backend is deployed and running
- [ ] Test all features before submission

### 9. **App Version Information**
Current version: **1.0.0**
- [ ] Confirm version number
- [ ] Create version release notes

**Suggested Release Notes (v1.0.0):**
```
🎉 Welcome to TransIntel!

First release features:
• Support for 110+ languages
• Auto language detection
• File translation (images, PDFs, audio)
• Multiple translation alternatives
• Right-to-left language support
• Dark mode
• Offline language preferences

Thank you for using TransIntel!
```

---

## 🎨 Current App Configuration

### Bundle Identifiers
- **iOS**: `com.ahmousavi.transintel`
- **Android**: `com.ahmousavi.transintel`

### App Name
- **Display Name**: TransIntel
- **Package Name**: transintel

### API Endpoint
- **Backend URL**: `https://transintel.onrender.com`

### Website URLs
- **Main**: `https://transintel.onrender.com`
- **Privacy Policy**: `https://transintel.onrender.com/policy.html`
- **Terms of Use**: `https://transintel.onrender.com/terms.html`

---

## 📱 Build & Submit Commands

### Build for iOS (requires Apple Developer account)
```bash
cd frontend
eas build --platform ios --profile production
```

### Build for Android
```bash
cd frontend
eas build --platform android --profile production
```

### Submit to App Store (after build completes)
```bash
eas submit --platform ios
eas submit --platform android
```

---

## ✅ Pre-Submission Checklist

Before submitting, verify:

- [ ] All features work correctly
- [ ] Backend is deployed and accessible
- [ ] Privacy policy and terms are accessible online
- [ ] All screenshots are prepared
- [ ] App icon is finalized
- [ ] No placeholder text remains in the app
- [ ] Test on both light and dark modes
- [ ] Test file uploads (images, PDFs, audio)
- [ ] Test all 110+ language selections
- [ ] Verify RTL languages display correctly
- [ ] Check internet connection error handling
- [ ] App version number is correct
- [ ] Bundle identifiers match your developer accounts

---

## 🎯 What's Already Done

✅ All code placeholders removed
✅ App name is TransIntel everywhere
✅ Privacy policy written and deployed
✅ Terms of use written and deployed
✅ Website landing page created
✅ Professional error messages implemented
✅ About section completed
✅ All user-facing text is finalized
✅ Package names updated
✅ App.json configured
✅ EAS build configuration ready

---

## 📞 Next Steps

1. **Provide the information requested above** (support emails, screenshots, etc.)
2. **Review and approve app store descriptions**
3. **Create app store accounts** (if not already done):
   - Apple Developer Program ($99/year): https://developer.apple.com/programs/
   - Google Play Console ($25 one-time): https://play.google.com/console
4. **Build the apps** using EAS Build commands
5. **Submit for review**

---

## 💡 Tips for Approval

### iOS App Store:
- Clearly describe what the app does
- Ensure all features work without crashes
- Provide demo account if needed (not required for TransIntel)
- Screenshots should show actual app content
- Review time: Usually 24-48 hours

### Google Play Store:
- Complete all required fields in Play Console
- Feature graphic is required
- Provide accurate content rating
- Review time: Usually a few hours to 1 day

---

**Questions?** Review this checklist and let me know what additional information you'd like to provide or modify.
