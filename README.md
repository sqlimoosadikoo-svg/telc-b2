# TELC B2 – منصة التحضير الذكي

## 🚀 رفع المشروع على GitHub Pages (خطوة بخطوة)

### الخطوة 1: إنشاء Repository
```
1. سجّل دخول على github.com
2. اضغط "New repository"
3. اسم الـ repo: telc-b2  (أو أي اسم تريده)
4. اختر: Public
5. اضغط "Create repository"
```

### الخطوة 2: رفع الملفات
```bash
# في Terminal أو Git Bash:
git init
git add .
git commit -m "Initial commit – TELC B2 Platform"
git remote add origin https://github.com/USERNAME/telc-b2.git
git push -u origin main
```

### الخطوة 3: تفعيل GitHub Pages
```
1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: main / root
4. Save
5. رابط موقعك: https://USERNAME.github.io/telc-b2/
```

---

## 🔑 إضافة أكواد تفعيل جديدة

### توليد الـ Hash لكود جديد:
1. افتح الموقع في المتصفح
2. افتح Developer Tools (F12) → Console
3. اكتب:
```javascript
generateHash("MYCODE-1234-XXXX").then(h => console.log(h))
```
4. انسخ الـ hash الناتج
5. أضفه في ملف `js/codes.js`:

```javascript
const ACCESS_CODES = {
  "HASH_هنا": "2025-08-31",  // تاريخ الانتهاء
};
```

### أمثلة على صيغ الأكواد:
```
TELC-2025-ABCD
B2DE-XK7P-2025
ARBI-0001-GOLD
```

---

## 📁 هيكل الملفات

```
telc-b2/
│
├── index.html              ← الصفحة الرئيسية + شاشة القفل
├── css/
│   ├── lock.css            ← تصميم شاشة القفل
│   └── main.css            ← تصميم التطبيق الرئيسي
├── js/
│   ├── codes.js            ← نظام الأكواد والتحقق
│   └── app.js              ← منطق التطبيق وتحميل المحتوى
└── data/
    ├── speaking.json       ← مواضيع المحادثة (38 موضوع)
    ├── vocab.json          ← المفردات
    ├── reading.json        ← تمارين القراءة (أضفها لاحقاً)
    ├── writing.json        ← قوالب الكتابة (أضفها لاحقاً)
    └── listening.json      ← تمارين الاستماع (أضفها لاحقاً)
```

---

## 📝 إضافة محتوى JSON

### قالب reading.json:
```json
{
  "section": "reading",
  "items": [
    {
      "title": "Modelltest 01 – Leseverstehen Teil 1",
      "desc": "موضوع: الصحة والغذاء — الإجابات: A, B, C, A, D"
    }
  ]
}
```

### قالب writing.json:
```json
{
  "section": "writing",
  "items": [
    {
      "title": "قالب رسالة الشكوى – Beschwerde",
      "desc": "Sehr geehrte Damen und Herren, ich wende mich an Sie, um..."
    }
  ]
}
```

---

## 🛡️ ملاحظات الأمان

- الأكواد مخزنة كـ SHA-256 hashes — لا يمكن قراءتها مباشرة من الكود
- الجلسة تنتهي عند إغلاق المتصفح (sessionStorage)
- لا يمكن الوصول للمحتوى بدون كود صحيح
- لمزيد من الأمان: استخدم Netlify Functions أو Cloudflare Workers للتحقق server-side

---

## 💡 التطوير المستقبلي

- [ ] إضافة نظام quiz تفاعلي للقراءة
- [ ] مشغّل صوت للاستماع
- [ ] تتبع التقدم (localStorage)
- [ ] لوحة Admin لإدارة الأكواد (Netlify + Airtable)
