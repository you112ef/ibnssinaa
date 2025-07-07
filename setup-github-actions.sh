#!/bin/bash

# 🚀 إعداد GitHub Actions تلقائياً
# Automatic GitHub Actions Setup

echo "🔬 محلل الحيوانات المنوية - إعداد GitHub Actions"
echo "=================================================="

# ألوان للنص
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# التحقق من وجود git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git غير مثبت. يرجى تثبيت Git أولاً.${NC}"
    exit 1
fi

echo -e "${BLUE}🔍 التحقق من حالة المشروع...${NC}"

# التحقق من أننا في مجلد git
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ هذا ليس مجلد git. تشغيل git init...${NC}"
    git init
    echo -e "${GREEN}✅ تم إنشاء مستودع git جديد${NC}"
fi

# التحقق من وجود remote origin
if ! git remote | grep -q "origin"; then
    echo -e "${YELLOW}⚠️  لم يتم العثور على remote origin${NC}"
    read -p "🔗 أدخل رابط مستودع GitHub (مثال: https://github.com/username/repo.git): " repo_url
    git remote add origin "$repo_url"
    echo -e "${GREEN}✅ تم إضافة remote origin${NC}"
fi

echo -e "${BLUE}📁 التحقق من مجلد .github/workflows...${NC}"

# إنشاء مجلد workflows إذا لم يكن موجوداً
mkdir -p .github/workflows

echo -e "${GREEN}✅ مجلد workflows جاهز${NC}"

# التحقق من وجود ملفات workflow
echo -e "${BLUE}📄 التحقق من ملفات workflow...${NC}"

workflows_exist=false
if [ -f ".github/workflows/build.yml" ]; then
    echo -e "${GREEN}✅ build.yml موجود${NC}"
    workflows_exist=true
fi

if [ -f ".github/workflows/test.yml" ]; then
    echo -e "${GREEN}✅ test.yml موجود${NC}"
    workflows_exist=true
fi

if [ "$workflows_exist" = false ]; then
    echo -e "${RED}❌ لا توجد ملفات workflow${NC}"
    echo -e "${YELLOW}📝 يرجى التأكد من وجود الملفات في .github/workflows/${NC}"
    exit 1
fi

# التحقق من الفرع الحالي
current_branch=$(git branch --show-current)
echo -e "${BLUE}🌿 الفرع الحالي: ${current_branch}${NC}"

if [ "$current_branch" != "main" ] && [ "$current_branch" != "master" ]; then
    echo -e "${YELLOW}⚠️  يُنصح بالعمل على فرع main أو master${NC}"
    read -p "🔄 هل تريد إنشاء/الانتقال إلى فرع main؟ (y/n): " create_main
    if [ "$create_main" = "y" ] || [ "$create_main" = "Y" ]; then
        git checkout -b main 2>/dev/null || git checkout main
        echo -e "${GREEN}✅ تم الانتقال إلى فرع main${NC}"
    fi
fi

echo -e "${BLUE}📦 إضافة جميع الملفات...${NC}"

# إضافة جميع الملفات
git add .

# التحقق من وجود تغييرات
if git diff --staged --quiet; then
    echo -e "${YELLOW}⚠️  لا توجد تغييرات جديدة لإضافتها${NC}"
else
    echo -e "${GREEN}✅ تم إضافة الملفات الجديدة${NC}"
fi

# عمل commit
echo -e "${BLUE}💾 عمل commit...${NC}"
commit_message="🚀 Setup GitHub Actions for Sperm Analyzer AI

- Add complete GitHub Actions workflow
- Include automatic APK building
- Add Arabic/English documentation
- Setup testing and deployment pipeline"

git commit -m "$commit_message" || echo -e "${YELLOW}⚠️  لا توجد تغييرات جديدة للـ commit${NC}"

# رفع إلى GitHub
echo -e "${BLUE}⬆️  رفع إلى GitHub...${NC}"

current_branch=$(git branch --show-current)
git push -u origin "$current_branch"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ تم رفع الملفات بنجاح إلى GitHub${NC}"
else
    echo -e "${RED}❌ فشل في رفع الملفات. تحقق من:${NC}"
    echo -e "${YELLOW}  - صحة رابط المستودع${NC}"
    echo -e "${YELLOW}  - صلاحياتك للكتابة في المستودع${NC}"
    echo -e "${YELLOW}  - اتصالك بالإنترنت${NC}"
    exit 1
fi

# معلومات إضافية
repo_url=$(git config --get remote.origin.url)
echo ""
echo -e "${GREEN}🎉 تم إعداد GitHub Actions بنجاح!${NC}"
echo ""
echo -e "${BLUE}📋 الخطوات التالية:${NC}"
echo "1. اذهب إلى: ${repo_url}"
echo "2. اضغط على تبويب 'Actions'"
echo "3. اضغط 'I understand my workflows, go ahead and enable them' إذا ظهرت"
echo "4. انتظر 1-2 دقيقة حتى تظهر workflows"
echo "5. اضغط 'Run workflow' لتشغيل البناء يدوياً"
echo ""
echo -e "${YELLOW}⏱️  ملاحظة: قد تحتاج GitHub Actions إلى 1-2 دقيقة لتظهر${NC}"
echo ""
echo -e "${GREEN}🔗 روابط مفيدة:${NC}"
echo "Actions: ${repo_url//.git//actions}"
echo "Settings: ${repo_url//.git//settings/actions}"
echo ""
echo -e "${BLUE}📚 للمساعدة، راجع: GITHUB_ACTIONS_TROUBLESHOOTING.md${NC}"
echo ""
echo -e "${GREEN}✨ بناء سعيد! Happy Building!${NC}"