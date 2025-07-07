# ⚡ حل سريع لمشكلة عدم ظهور GitHub Actions

## 🚨 المشكلة: لا تظهر Actions في GitHub

### 🎯 **الحل السريع (30 ثانية)**

```bash
# 1. تشغيل السكريبت التلقائي
./setup-github-actions.sh

# أو يدوياً:
git add .
git commit -m "Setup GitHub Actions"
git push origin main
```

### ✅ **تحقق من النجاح**
1. اذهب إلى مستودعك على GitHub
2. اضغط تبويب **"Actions"**
3. يجب أن ترى:
   - ✅ **"Build Sperm Analyzer AI APK"**
   - ✅ **"Test GitHub Actions"**

---

## 🔧 **إذا لم يعمل الحل السريع**

### الخطوة 1: تأكد من الملفات
```bash
ls -la .github/workflows/
# يجب أن ترى: build.yml, test.yml
```

### الخطوة 2: تفعيل Actions
1. GitHub → مستودعك → **Settings**
2. **Actions** → **General**
3. اختر **"Allow all actions and reusable workflows"**
4. اختر **"Read and write permissions"**

### الخطوة 3: إعادة رفع
```bash
git add .github/
git commit -m "Add GitHub Actions workflows"
git push --force origin main
```

### الخطوة 4: انتظار
⏱️ **انتظر 1-2 دقيقة** - GitHub تحتاج وقت لمعالجة الملفات

---

## 🎮 **تشغيل يدوي للاختبار**

1. GitHub → **Actions** → **"Test GitHub Actions"**
2. اضغط **"Run workflow"**
3. اختر فرع **main**
4. اضغط **"Run workflow"**

إذا عمل هذا، فسيعمل البناء الكامل أيضاً!

---

## 🆘 **إذا فشل كل شيء**

### إنشاء workflow بسيط:
```bash
mkdir -p .github/workflows
cat > .github/workflows/simple.yml << 'EOF'
name: Simple Test
on: [push, workflow_dispatch]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - run: echo "GitHub Actions يعمل! 🎉"
EOF

git add .github/workflows/simple.yml
git commit -m "Add simple workflow"
git push
```

### تحقق من Repository Settings:
1. **Settings** → **Actions** → **General**
2. تأكد من **"Allow GitHub Actions to create and approve pull requests"**
3. في **Fork pull request workflows** اختر **"Require approval for first-time contributors"**

---

## 📞 **المساعدة الفورية**

### إذا استمرت المشكلة، أرسل هذه المعلومات:

```bash
echo "=== معلومات التشخيص ==="
echo "Repository URL:"
git config --get remote.origin.url

echo "Current branch:"
git branch --show-current

echo "Git status:"
git status --porcelain

echo "Workflows files:"
find .github -name "*.yml" 2>/dev/null || echo "No workflows found"

echo "Git remotes:"
git remote -v
```

---

<div align="center">

**🎯 الهدف: رؤية تبويب Actions في GitHub مع workflows جاهزة**

**⏱️ الوقت المتوقع: 2-5 دقائق**

[📚 دليل مفصل](GITHUB_ACTIONS_TROUBLESHOOTING.md) | [🔙 README](README.md)

</div>