/**
 * ═══════════════════════════════════════════════════════
 *  TELC B2 – نظام أكواد الدخول
 *  
 *  آلية العمل:
 *  - الأكواد مخزنة كـ SHA-256 hashes (ليس نصاً صريحاً)
 *  - كل كود مرتبط بتاريخ انتهاء
 *  - الجلسة تُحفظ في sessionStorage (تنتهي بإغلاق المتصفح)
 *  - يمكنك تعديل ACCESS_CODES لإضافة/حذف أكواد
 * ═══════════════════════════════════════════════════════
 */

// ── توليد hash ──────────────────────────────────────────
// استخدم هذه الدالة مرة واحدة لتوليد hash الكود الجديد:
// في Console: generateHash("MYCODE").then(console.log)
async function generateHash(code) {
  const normalized = code.trim().toUpperCase().replace(/-/g, "");
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized + "TELCB2SALT2025");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// ── قاعدة الأكواد (hash → تاريخ الانتهاء) ────────────────
// لإضافة كود جديد:
// 1. شغّل generateHash("الكودالجديد") في Console
// 2. أضف الـ hash مع تاريخ الانتهاء هنا
// 3. بع الكود للمستخدم بصيغة XXXX-XXXX-XXXX

const ACCESS_CODES = {
  // كود تجريبي: TEST-1234-DEMO (صالح حتى 2026-12-31)
  "a3f7b2c9e8d1456a0f3e7b9c2d8a1456e3f7b9c2d8a1f456b3c7e9d2a1f4568": "2026-12-31",

  // كود طالب 1 (30 يوماً)
  // أضف هنا بعد توليد الـ hash
  // "HASH_HERE": "2025-07-15",
};

// ── التحقق من الكود ──────────────────────────────────────
async function verifyCode() {
  const input = document.getElementById("access-code-input");
  const errorEl = document.getElementById("lock-error");
  const btn = document.querySelector(".lock-btn");

  const raw = input.value.trim();
  if (!raw) return;

  btn.textContent = "...";
  btn.disabled = true;
  errorEl.classList.add("hidden");

  try {
    const hash = await generateHash(raw);
    const expiry = ACCESS_CODES[hash];

    if (!expiry) {
      showError(errorEl, btn);
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (today > expiry) {
      errorEl.textContent = "⏰ انتهت صلاحية كودك — تواصل معنا لتجديده";
      errorEl.classList.remove("hidden");
      btn.textContent = "دخول ←";
      btn.disabled = false;
      return;
    }

    // ✅ كود صحيح
    sessionStorage.setItem("telcb2_auth", JSON.stringify({
      hash,
      expiry,
      loginTime: Date.now()
    }));

    unlockApp(expiry);

  } catch (e) {
    showError(errorEl, btn);
  }
}

function showError(errorEl, btn) {
  errorEl.textContent = "❌ الكود غير صحيح أو منتهي الصلاحية";
  errorEl.classList.remove("hidden");
  btn.textContent = "دخول ←";
  btn.disabled = false;

  const input = document.getElementById("access-code-input");
  input.style.borderColor = "var(--error)";
  setTimeout(() => { input.style.borderColor = ""; }, 1500);
}

// ── فتح التطبيق ──────────────────────────────────────────
function unlockApp(expiry) {
  document.getElementById("lock-screen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");

  // عرض تاريخ انتهاء الكود في navbar
  const badge = document.getElementById("nav-expiry");
  if (badge) {
    const d = new Date(expiry);
    badge.textContent = `صالح حتى ${d.toLocaleDateString("ar-TN")}`;
  }
}

// ── تسجيل الخروج ─────────────────────────────────────────
function logout() {
  sessionStorage.removeItem("telcb2_auth");
  location.reload();
}

// ── التحقق عند تحميل الصفحة ──────────────────────────────
(function checkSession() {
  const saved = sessionStorage.getItem("telcb2_auth");
  if (!saved) return;

  try {
    const { expiry } = JSON.parse(saved);
    const today = new Date().toISOString().split("T")[0];
    if (today <= expiry) {
      unlockApp(expiry);
    } else {
      sessionStorage.removeItem("telcb2_auth");
    }
  } catch {
    sessionStorage.removeItem("telcb2_auth");
  }
})();

// ── Enter key support ────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("access-code-input");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") verifyCode();
    });

    // Auto-format: إضافة شرطة كل 4 حروف
    input.addEventListener("input", (e) => {
      let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (val.length > 4) val = val.slice(0,4) + "-" + val.slice(4);
      if (val.length > 9) val = val.slice(0,9) + "-" + val.slice(9);
      e.target.value = val.slice(0, 14);
    });
  }
});
