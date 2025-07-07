# 🔬 Sperm Analyzer AI - محلل الحيوانات المنوية

[![Build APK](https://github.com/username/sperm-analyzer-ai/actions/workflows/build.yml/badge.svg)](https://github.com/username/sperm-analyzer-ai/actions/workflows/build.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Arabic Support](https://img.shields.io/badge/Arabic-Supported-green.svg)](https://github.com/username/sperm-analyzer-ai)
[![Offline AI](https://img.shields.io/badge/AI-Offline%20Capable-blue.svg)](https://github.com/username/sperm-analyzer-ai)

> **🚀 Real AI-Powered Sperm Analysis Application with Full Arabic Support**  
> **تطبيق تحليل الحيوانات المنوية بالذكاء الاصطناعي مع دعم كامل للعربية**

## 📱 Download APK (تحميل التطبيق)

### Automatic Builds (البناء التلقائي):
1. **GitHub Actions**: Every push automatically builds APK
2. **Releases**: Check [Releases](https://github.com/username/sperm-analyzer-ai/releases) for latest APK
3. **Artifacts**: Download from [Actions](https://github.com/username/sperm-analyzer-ai/actions) tab

### Manual Build (البناء اليدوي):
```bash
# Clone repository
git clone https://github.com/username/sperm-analyzer-ai.git
cd sperm-analyzer-ai

# Install dependencies
npm install

# Build APK
npm run apk:release
```

### 🚨 إذا لم تظهر GitHub Actions:
- 📋 **[حل سريع](QUICK_SETUP.md)** - حل في 30 ثانية
- 🔧 **[دليل تفصيلي](GITHUB_ACTIONS_TROUBLESHOOTING.md)** - حلول شاملة
- ⚡ **تشغيل تلقائي**: `./setup-github-actions.sh`

## ✨ Features (المميزات)

### 🧠 AI Analysis (التحليل بالذكاء الاصطناعي)
- ✅ **Real TensorFlow.js Model** - نموذج TensorFlow.js حقيقي
- ✅ **Offline Processing** - معالجة بدون إنترنت  
- ✅ **Sperm Detection & Counting** - كشف وعد الحيوانات المنوية
- ✅ **Motility Analysis** - تحليل الحركة
- ✅ **Morphology Assessment** - تقييم الشكل
- ✅ **WHO Standards Compliance** - امتثال لمعايير منظمة الصحة العالمية

### 📊 Visualization (التصور المرئي)
- ✅ **Dedicated Chart Page** - صفحة مخصصة للرسوم البيانية
- ✅ **Line, Bar & Pie Charts** - خطوط وأعمدة ودوائر
- ✅ **Export Charts as PNG** - تصدير الرسوم كصور
- ✅ **Real-time Data Updates** - تحديث البيانات في الوقت الفعلي

### 🌐 Internationalization (التدويل)
- ✅ **Full Arabic Support** - دعم كامل للعربية
- ✅ **RTL Layout** - تخطيط من اليمين لليسار
- ✅ **Arabic-Indic Numerals** - الأرقام العربية الهندية
- ✅ **200+ Translation Keys** - أكثر من 200 مفتاح ترجمة

### 🎨 Design (التصميم)
- ✅ **Dark Blue Professional Theme** - تصميم أزرق داكن احترافي
- ✅ **Material Design** - تصميم Material
- ✅ **Smooth Animations** - حركات ناعمة
- ✅ **Responsive UI** - واجهة متجاوبة

## 🛠️ GitHub Actions Setup (إعداد GitHub Actions)

### 1. Fork Repository
```bash
# Fork this repository to your GitHub account
# Go to: https://github.com/original-repo/sperm-analyzer-ai
# Click "Fork" button
```

### 2. Enable Actions
1. Go to your forked repository
2. Click "Actions" tab
3. Click "I understand my workflows, go ahead and enable them"

### 3. Automatic Building
- **Push to main/master**: Automatically builds APK
- **Create Release**: Builds and attaches APK to release
- **Pull Request**: Builds APK for testing

### 4. Download Built APK
1. Go to "Actions" tab
2. Click on latest successful build
3. Download "release-apk" artifact
4. Extract and install APK

## 📋 Requirements (المتطلبات)

### Development (التطوير):
- **Node.js**: 18+
- **Java JDK**: 17
- **Android SDK**: 33
- **React Native CLI**: Latest

### Runtime (التشغيل):
- **Android**: 5.0+ (API 21)
- **RAM**: 2GB minimum
- **Storage**: 500MB

## 🚀 Installation Guide (دليل التثبيت)

### For Users (للمستخدمين):
1. **Download APK** from [Releases](https://github.com/username/sperm-analyzer-ai/releases)
2. **Enable Unknown Sources** in Android settings
3. **Install APK** and launch app
4. **Select Language** (English/Arabic)
5. **Start Analysis** with camera or gallery

### For Developers (للمطورين):
```bash
# Clone repository
git clone https://github.com/username/sperm-analyzer-ai.git
cd sperm-analyzer-ai

# Install dependencies  
npm install

# Setup Android environment
npm run github:setup

# Start development
npm run dev

# Build APK
npm run apk:release
```

## 📊 Project Structure (هيكل المشروع)

```
sperm-analyzer-ai/
├── 📱 src/                     # React Native App
│   ├── 🖥️ screens/            # App Screens  
│   │   ├── GraphScreen.js      # Chart Visualization
│   │   ├── AnalyzeScreen.js    # AI Analysis
│   │   └── ResultsScreen.js    # Results Display
│   ├── 🧠 services/           # AI & API Services
│   │   ├── offlineAIService.js # TensorFlow.js AI
│   │   └── apiService.js       # Backend API
│   ├── 🎨 components/         # Reusable Components
│   ├── 🌐 utils/i18n.js       # Arabic/English i18n
│   └── 🔧 context/            # State Management
├── 🤖 backend/                # FastAPI Backend
│   ├── main.py                # API Server
│   ├── models/sperm_analyzer.py # YOLOv8 Model
│   └── utils/                 # Utilities
├── 📱 android/                # Android Config
│   ├── app/build.gradle       # Build Settings
│   └── app/src/main/          # Android Source
├── ⚙️ .github/workflows/      # CI/CD
│   └── build.yml              # APK Build Action
└── 📋 docs/                   # Documentation
```

## 🔧 Configuration (التكوين)

### Environment Variables (.env):
```bash
# Backend API (Optional - works offline)
API_BASE_URL=http://localhost:8000

# AI Model Settings
AI_MODEL_PATH=./models/sperm_detector.json
ENABLE_OFFLINE_AI=true

# Language Settings  
DEFAULT_LANGUAGE=en
ENABLE_RTL=true
```

### GitHub Secrets (Optional):
- `ANDROID_KEYSTORE`: Base64 encoded keystore
- `KEYSTORE_PASSWORD`: Keystore password
- `KEY_ALIAS`: Key alias
- `KEY_PASSWORD`: Key password

## 📈 Build Status (حالة البناء)

| Platform | Status | Download |
|----------|--------|----------|
| Android (Debug) | ✅ Built automatically | [Download](https://github.com/username/sperm-analyzer-ai/actions) |
| Android (Release) | ✅ Built automatically | [Download](https://github.com/username/sperm-analyzer-ai/releases) |
| iOS | 🔄 Coming soon | - |

## 🧪 Testing (الاختبار)

### Automated Testing:
```bash
# Run tests
npm test

# Run linting
npm run lint

# Check build
npm run build:android:debug
```

### Manual Testing Checklist:
- [ ] Camera capture works
- [ ] Gallery selection works  
- [ ] AI analysis completes
- [ ] Charts display correctly
- [ ] Arabic/English switching
- [ ] Export functionality
- [ ] Offline operation

## 🛡️ Security & Privacy (الأمان والخصوصية)

### Data Protection:
- ✅ **Local Processing**: All AI runs on device
- ✅ **No Cloud Upload**: Images never leave device
- ✅ **Secure Storage**: Encrypted local storage
- ✅ **No Tracking**: No analytics or tracking

### Permissions:
- **Camera**: For capturing sperm samples
- **Storage**: For saving results and images
- **Internet**: Optional for updates only

## 🤝 Contributing (المساهمة)

### How to Contribute:
1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

### Development Guidelines:
- Follow React Native best practices
- Add Arabic translations for new features
- Test on real Android devices
- Update documentation

## 📄 License (الترخيص)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**يخضع هذا المشروع لترخيص MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.**

## 📞 Support (الدعم)

### Get Help:
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/username/sperm-analyzer-ai/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/username/sperm-analyzer-ai/discussions)
- 📧 **Email**: support@spermanalyzer.ai

### Quick Links:
- 📱 **Download APK**: [Latest Release](https://github.com/username/sperm-analyzer-ai/releases/latest)
- 📊 **Build Status**: [GitHub Actions](https://github.com/username/sperm-analyzer-ai/actions)
- 📚 **Documentation**: [Wiki](https://github.com/username/sperm-analyzer-ai/wiki)

---

<div align="center">

**🔬 Made with ❤️ for Medical Research**  
**صُنع بـ ❤️ للبحث الطبي**

[⭐ Star this repo](https://github.com/username/sperm-analyzer-ai) | [🍴 Fork it](https://github.com/username/sperm-analyzer-ai/fork) | [🐛 Report bug](https://github.com/username/sperm-analyzer-ai/issues)

</div>
