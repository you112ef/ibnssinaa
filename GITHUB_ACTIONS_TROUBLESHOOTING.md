# 🔧 حل مشكلة عدم ظهور GitHub Actions

## 🚨 إذا لم تظهر Actions في GitHub

### 1️⃣ **تحقق من رفع الملفات إلى GitHub**

```bash
# تأكد من أنك في مجلد المشروع
cd sperm-analyzer-ai

# تحقق من حالة git
git status

# إضافة جميع الملفات
git add .

# عمل commit
git commit -m "Add GitHub Actions workflow"

# رفع إلى GitHub
git push origin main
```

### 2️⃣ **تحقق من مجلد .github**

```bash
# تحقق من وجود المجلد
ls -la .github/workflows/

# يجب أن تشاهد:
# build.yml
# test.yml
```

### 3️⃣ **تفعيل GitHub Actions**

1. اذهب إلى مستودعك على GitHub
2. اضغط على تبويب **"Actions"**
3. إذا رأيت رسالة تقول "Workflows aren't being run on this forked repository"
4. اضغط **"I understand my workflows, go ahead and enable them"**

### 4️⃣ **تشغيل يدوي للتأكد**

1. في تبويب **Actions**
2. اختر **"Test GitHub Actions"** من القائمة الجانبية  
3. اضغط **"Run workflow"**
4. اختر الفرع **main**
5. اضغط **"Run workflow"**

### 5️⃣ **إذا لم تظهر بعد - تحقق من الصيغة**

```bash
# تحقق من صيغة YAML
cat .github/workflows/build.yml | head -10

# يجب أن يبدأ مثل هذا:
# name: Build Sperm Analyzer AI APK
# 
# on:
#   push:
#     branches: [ main, master, develop ]
```

### 6️⃣ **إنشاء workflow بسيط للاختبار**

إذا لم يعمل شيء، أنشئ ملف جديد:

```bash
# إنشاء workflow بسيط
mkdir -p .github/workflows
cat > .github/workflows/hello.yml << 'EOF'
name: Hello World

on:
  push:
  workflow_dispatch:

jobs:
  hello:
    runs-on: ubuntu-latest
    steps:
    - name: Say hello
      run: echo "مرحبا! GitHub Actions يعمل الآن 🎉"
EOF

# رفع الملف
git add .github/workflows/hello.yml
git commit -m "Add simple hello workflow"
git push
```

### 7️⃣ **تحقق من الصلاحيات**

1. اذهب إلى **Settings** → **Actions** → **General**
2. تأكد من أن **"Allow all actions and reusable workflows"** مُختار
3. في **Workflow permissions** اختر **"Read and write permissions"**

### 8️⃣ **تحقق من الفرع الصحيح**

```bash
# تحقق من الفرع الحالي
git branch

# إذا لم تكن في main، انتقل إليه
git checkout main

# أو إنشاء فرع main جديد
git checkout -b main
git push -u origin main
```

### 9️⃣ **إعادة إنشاء المستودع (الحل الأخير)**

```bash
# 1. إنشاء مستودع جديد على GitHub
# 2. استنساخ المشروع محلياً
git clone https://github.com/your-username/new-repo-name.git
cd new-repo-name

# 3. نسخ ملفات المشروع
cp -r /path/to/sperm-analyzer-ai/* .

# 4. رفع الملفات
git add .
git commit -m "Initial commit with GitHub Actions"
git push origin main
```

---

## ✅ **خطوات التحقق من النجاح**

### بعد رفع الملفات، تحقق من:

1. **وجود تبويب Actions** في GitHub
2. **ظهور workflows** في القائمة
3. **إمكانية تشغيل manual trigger**

### إذا ظهرت Actions:

```bash
# تشغيل البناء الكامل
git commit --allow-empty -m "Trigger GitHub Actions build"
git push
```

---

## 🎯 **ما يجب أن تراه**

### في تبويب Actions:
- ✅ **"Build Sperm Analyzer AI APK"** workflow
- ✅ **"Test GitHub Actions"** workflow  
- ✅ زر **"Run workflow"** للتشغيل اليدوي

### بعد تشغيل Build:
- ✅ خطوات البناء تظهر باللون الأخضر
- ✅ **Artifacts** جاهزة للتحميل
- ✅ APK files متوفرة

---

## 🆘 **إذا فشل كل شيء**

### تواصل معي مع هذه المعلومات:

```bash
# شارك هذه المعلومات:

echo "Git status:"
git status

echo "Git remote:"
git remote -v

echo "Current branch:"
git branch

echo "GitHub Actions files:"
find .github -name "*.yml" -o -name "*.yaml" 2>/dev/null

echo "Repository URL:"
git config --get remote.origin.url
```

### أو جرب هذا الأمر السحري:

```bash
# الحل الشامل
git add .
git commit -m "Fix GitHub Actions setup"
git push --force origin main
sleep 30  # انتظر 30 ثانية
echo "🎉 تحقق من GitHub Actions الآن!"
```

---

<div align="center">

**💡 نصيحة: GitHub Actions قد تحتاج 1-2 دقيقة لتظهر بعد رفع الملفات**

[🔙 العودة للدليل الرئيسي](README.md)

</div>