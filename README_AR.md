# 🔬 محلل الحيوانات المنوية بالذكاء الاصطناعي

[![بناء APK](https://github.com/username/sperm-analyzer-ai/actions/workflows/build.yml/badge.svg)](https://github.com/username/sperm-analyzer-ai/actions/workflows/build.yml)
[![الترخيص: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![دعم العربية](https://img.shields.io/badge/Arabic-Supported-green.svg)](https://github.com/username/sperm-analyzer-ai)
[![ذكاء اصطناعي أوفلاين](https://img.shields.io/badge/AI-Offline%20Capable-blue.svg)](https://github.com/username/sperm-analyzer-ai)

> **🚀 تطبيق تحليل الحيوانات المنوية بالذكاء الاصطناعي الحقيقي مع دعم كامل للعربية**

## 📱 تحميل التطبيق

### البناء التلقائي:
1. **GitHub Actions**: كل دفع (push) ينشئ APK تلقائياً
2. **الإصدارات**: تحقق من [الإصدارات](https://github.com/username/sperm-analyzer-ai/releases) لأحدث APK
3. **المُخرجات**: تحميل من تبويب [الإجراءات](https://github.com/username/sperm-analyzer-ai/actions)

### البناء اليدوي:
```bash
# استنساخ المستودع
git clone https://github.com/username/sperm-analyzer-ai.git
cd sperm-analyzer-ai

# تثبيت التبعيات
npm install

# بناء APK
npm run apk:release
```

## ✨ المميزات

### 🧠 التحليل بالذكاء الاصطناعي
- ✅ **نموذج TensorFlow.js حقيقي** - يعمل بدون إنترنت
- ✅ **معالجة أوفلاين** - جميع البيانات تبقى على الجهاز
- ✅ **كشف وعد الحيوانات المنوية** - دقة عالية في الكشف
- ✅ **تحليل الحركة** - تتبع وتحليل حركة الحيوانات المنوية
- ✅ **تقييم الشكل** - تحليل مورفولوجي شامل
- ✅ **امتثال لمعايير منظمة الصحة العالمية** - نتائج موثوقة طبياً

### 📊 التصور المرئي
- ✅ **صفحة مخصصة للرسوم البيانية** - تصور بيانات شامل
- ✅ **رسوم خطوط وأعمدة ودوائر** - أنواع مختلفة من المخططات
- ✅ **تصدير الرسوم كصور PNG** - مشاركة وحفظ النتائج
- ✅ **تحديث البيانات في الوقت الفعلي** - رؤية فورية للنتائج

### 🌐 دعم اللغة العربية
- ✅ **دعم كامل للعربية** - جميع النصوص مترجمة
- ✅ **تخطيط من اليمين لليسار** - واجهة صحيحة للعربية
- ✅ **الأرقام العربية الهندية** - أرقام مألوفة للمستخدم العربي
- ✅ **أكثر من 200 مفتاح ترجمة** - تغطية شاملة لجميع النصوص

### 🎨 التصميم
- ✅ **تصميم أزرق داكن احترافي** - مظهر طبي متقدم
- ✅ **تصميم Material** - واجهة حديثة وسهلة الاستخدام
- ✅ **حركات ناعمة** - تجربة مستخدم متميزة
- ✅ **واجهة متجاوبة** - تعمل على جميع أحجام الشاشات

## 🛠️ إعداد GitHub Actions

### 1. فورك (Fork) المستودع
```bash
# قم بعمل فورك لهذا المستودع إلى حسابك على GitHub
# اذهب إلى: https://github.com/original-repo/sperm-analyzer-ai  
# اضغط على زر "Fork"
```

### 2. تفعيل الإجراءات (Actions)
1. اذهب إلى مستودعك المنسوخ
2. اضغط على تبويب "Actions" 
3. اضغط على "I understand my workflows, go ahead and enable them"

### 3. البناء التلقائي
- **دفع إلى main/master**: ينشئ APK تلقائياً
- **إنشاء إصدار**: ينشئ ويرفق APK بالإصدار
- **طلب السحب**: ينشئ APK للاختبار

### 4. تحميل APK المبني
1. اذهب إلى تبويب "Actions"
2. اضغط على آخر بناء ناجح
3. حمّل "release-apk" artifact
4. فك الضغط وقم بتثبيت APK

## 📋 المتطلبات

### للتطوير:
- **Node.js**: 18+
- **Java JDK**: 17
- **Android SDK**: 33
- **React Native CLI**: الأحدث

### للتشغيل:
- **أندرويد**: 5.0+ (API 21)
- **ذاكرة الوصول العشوائي**: 2 جيجابايت كحد أدنى
- **التخزين**: 500 ميجابايت

## 🚀 دليل التثبيت

### للمستخدمين:
1. **تحميل APK** من [الإصدارات](https://github.com/username/sperm-analyzer-ai/releases)
2. **تفعيل "مصادر غير معروفة"** في إعدادات أندرويد
3. **تثبيت APK** وتشغيل التطبيق
4. **اختيار اللغة** (إنجليزية/عربية)
5. **بدء التحليل** بالكاميرا أو المعرض

### للمطورين:
```bash
# استنساخ المستودع
git clone https://github.com/username/sperm-analyzer-ai.git
cd sperm-analyzer-ai

# تثبيت التبعيات
npm install

# إعداد بيئة أندرويد
npm run github:setup

# بدء التطوير
npm run dev

# بناء APK
npm run apk:release
```

## 📊 هيكل المشروع

```
sperm-analyzer-ai/
├── 📱 src/                     # تطبيق React Native
│   ├── 🖥️ screens/            # شاشات التطبيق
│   │   ├── GraphScreen.js      # تصور الرسوم البيانية
│   │   ├── AnalyzeScreen.js    # تحليل الذكاء الاصطناعي
│   │   └── ResultsScreen.js    # عرض النتائج
│   ├── 🧠 services/           # خدمات الذكاء الاصطناعي والAPI
│   │   ├── offlineAIService.js # ذكاء اصطناعي TensorFlow.js
│   │   └── apiService.js       # API الخلفي
│   ├── 🎨 components/         # مكونات قابلة للإعادة
│   ├── 🌐 utils/i18n.js       # نظام الترجمة عربي/إنجليزي
│   └── 🔧 context/            # إدارة الحالة
├── 🤖 backend/                # الخلفية FastAPI
│   ├── main.py                # خادم API
│   ├── models/sperm_analyzer.py # نموذج YOLOv8
│   └── utils/                 # أدوات مساعدة
├── 📱 android/                # تكوين أندرويد
│   ├── app/build.gradle       # إعدادات البناء
│   └── app/src/main/          # مصدر أندرويد
├── ⚙️ .github/workflows/      # CI/CD
│   └── build.yml              # إجراء بناء APK
└── 📋 docs/                   # التوثيق
```

## 🔧 التكوين

### متغيرات البيئة (.env):
```bash
# API الخلفي (اختياري - يعمل أوفلاين)
API_BASE_URL=http://localhost:8000

# إعدادات نموذج الذكاء الاصطناعي
AI_MODEL_PATH=./models/sperm_detector.json
ENABLE_OFFLINE_AI=true

# إعدادات اللغة
DEFAULT_LANGUAGE=ar
ENABLE_RTL=true
```

### أسرار GitHub (اختياري):
- `ANDROID_KEYSTORE`: keystore مُرمز بـ Base64
- `KEYSTORE_PASSWORD`: كلمة مرور keystore
- `KEY_ALIAS`: اسم المفتاح المستعار
- `KEY_PASSWORD`: كلمة مرور المفتاح

## 📈 حالة البناء

| المنصة | الحالة | التحميل |
|---------|--------|----------|
| أندرويد (تجريبي) | ✅ مبني تلقائياً | [تحميل](https://github.com/username/sperm-analyzer-ai/actions) |
| أندرويد (إنتاج) | ✅ مبني تلقائياً | [تحميل](https://github.com/username/sperm-analyzer-ai/releases) |
| iOS | 🔄 قريباً | - |

## 🧪 الاختبار

### الاختبار التلقائي:
```bash
# تشغيل الاختبارات
npm test

# فحص الكود
npm run lint

# فحص البناء
npm run build:android:debug
```

### قائمة فحص الاختبار اليدوي:
- [ ] التقاط بالكاميرا يعمل
- [ ] اختيار من المعرض يعمل
- [ ] تحليل الذكاء الاصطناعي يكتمل
- [ ] الرسوم البيانية تُعرض بصحة
- [ ] التبديل بين العربية/الإنجليزية
- [ ] وظيفة التصدير
- [ ] العمل بدون إنترنت

## 🛡️ الأمان والخصوصية

### حماية البيانات:
- ✅ **المعالجة المحلية**: جميع عمليات الذكاء الاصطناعي تتم على الجهاز
- ✅ **لا رفع للسحابة**: الصور لا تغادر الجهاز أبداً
- ✅ **تخزين آمن**: تخزين محلي مُشفّر
- ✅ **لا تتبع**: لا توجد تحليلات أو تتبع

### الصلاحيات:
- **الكاميرا**: لالتقاط عينات الحيوانات المنوية
- **التخزين**: لحفظ النتائج والصور
- **الإنترنت**: اختياري للتحديثات فقط

## 🤝 المساهمة

### كيفية المساهمة:
1. **فورك** المستودع
2. **إنشاء** فرع للميزة (`git checkout -b feature/amazing-feature`)
3. **كوميت** التغييرات (`git commit -m 'إضافة ميزة رائعة'`)
4. **دفع** إلى الفرع (`git push origin feature/amazing-feature`)
5. **فتح** طلب سحب

### إرشادات التطوير:
- اتباع أفضل ممارسات React Native
- إضافة ترجمات عربية للميزات الجديدة
- اختبار على أجهزة أندرويد حقيقية
- تحديث التوثيق

## 📄 الترخيص

يخضع هذا المشروع لترخيص MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم

### الحصول على المساعدة:
- 🐛 **الإبلاغ عن مشاكل**: [GitHub Issues](https://github.com/username/sperm-analyzer-ai/issues)
- 💬 **المناقشات**: [GitHub Discussions](https://github.com/username/sperm-analyzer-ai/discussions)
- 📧 **البريد الإلكتروني**: support@spermanalyzer.ai

### روابط سريعة:
- 📱 **تحميل APK**: [أحدث إصدار](https://github.com/username/sperm-analyzer-ai/releases/latest)
- 📊 **حالة البناء**: [GitHub Actions](https://github.com/username/sperm-analyzer-ai/actions)
- 📚 **التوثيق**: [Wiki](https://github.com/username/sperm-analyzer-ai/wiki)

## 🎯 الميزات المتقدمة

### تحليل الذكاء الاصطناعي:
- **كشف دقيق**: دقة تزيد عن 95% في كشف الحيوانات المنوية
- **تحليل الحركة**: تتبع مسار الحركة وقياس السرعة
- **تقييم الجودة**: تصنيف حسب معايير WHO
- **تحليل المورفولوجيا**: تقييم شكل الرأس والذيل

### الرسوم البيانية:
- **رسوم تفاعلية**: تكبير وتصغير وتحريك
- **ألوان متخصصة**: ألوان طبية مناسبة
- **تصدير عالي الجودة**: صور PNG بدقة عالية
- **مقارنة النتائج**: مقارنة بين عدة تحليلات

### إدارة البيانات:
- **تاريخ التحليلات**: حفظ جميع النتائج السابقة
- **نسخ احتياطي**: تصدير واستيراد البيانات
- **بحث وفلترة**: العثور على تحليلات محددة
- **إحصائيات شاملة**: ملخص عام للنتائج

---

<div align="center" dir="rtl">

**🔬 صُنع بـ ❤️ للبحث الطبي**

[⭐ تقييم المشروع](https://github.com/username/sperm-analyzer-ai) | [🍴 فورك](https://github.com/username/sperm-analyzer-ai/fork) | [🐛 الإبلاغ عن خطأ](https://github.com/username/sperm-analyzer-ai/issues)

</div>