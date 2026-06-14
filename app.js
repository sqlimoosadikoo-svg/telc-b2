/**
 * ═══════════════════════════════════════════════════════
 *  TELC B2 – منطق التطبيق الرئيسي
 *  يقرأ المحتوى من ملفات JSON في مجلد /data/
 * ═══════════════════════════════════════════════════════
 */

// ── قائمة الأقسام ─────────────────────────────────────
const SECTIONS = [
  {
    id: "exams",
    icon: "📝",
    de: "Prüfungen",
    title: "نماذج الامتحانات",
    desc: "32 نموذج امتحان كامل مع مفاتيح الإجابة — Leseverstehen، Hörverstehen، Schreiben",
    link: "#exams",
    dataFile: "data/exams.json"
  },
  {
    id: "reading",
    icon: "📖",
    de: "Leseverstehen",
    title: "القراءة والفهم",
    desc: "تمارين القراءة مع شرح أسلوب التفكير لكل نوع سؤال",
    link: "#reading",
    dataFile: "data/reading.json"
  },
  {
    id: "writing",
    icon: "✍️",
    de: "Schreiben",
    title: "الكتابة والتعبير",
    desc: "قوالب جاهزة للشكوى، الاقتراح، التعليق — مع حجج universal",
    link: "#writing",
    dataFile: "data/writing.json"
  },
  {
    id: "speaking",
    icon: "🎤",
    de: "Mündlicher Teil",
    title: "المحادثة الشفوية",
    desc: "38 موضوعاً × 8 مجموعات — Inhalt, Meinung, Erfahrung جاهزة للحفظ",
    link: "#speaking",
    dataFile: "data/speaking.json"
  },
  {
    id: "listening",
    icon: "🎧",
    de: "Hörverstehen",
    title: "الاستماع والفهم",
    desc: "استراتيجيات الاستماع + نصوص محادثات B2",
    link: "#listening",
    dataFile: "data/listening.json"
  },
  {
    id: "vocab",
    icon: "🧠",
    de: "Wortschatz",
    title: "المفردات والقواعد",
    desc: "بطاقات مفردات مرتبة حسب الموضوع مع الترجمة العربية",
    link: "#vocab",
    dataFile: "data/vocab.json"
  }
];

// ── بناء شبكة الأقسام ─────────────────────────────────
function buildSectionsGrid() {
  const container = document.getElementById("sections-container");
  if (!container) return;

  container.innerHTML = SECTIONS.map(sec => `
    <a href="${sec.link}" class="section-card">
      <span class="section-card-icon">${sec.icon}</span>
      <div class="section-card-de">${sec.de}</div>
      <div class="section-card-title">${sec.title}</div>
      <p class="section-card-desc">${sec.desc}</p>
    </a>
  `).join("");
}

// ── تحميل البيانات من JSON ─────────────────────────────
async function loadSectionData(sectionId, containerId) {
  const sec = SECTIONS.find(s => s.id === sectionId);
  if (!sec) return;

  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const res = await fetch(sec.dataFile);
    if (!res.ok) throw new Error("لم يتم العثور على الملف");
    const data = await res.json();
    renderSection(container, sectionId, data);
  } catch {
    container.innerHTML = `
      <div class="content-placeholder">
        <div style="text-align:center;color:var(--muted)">
          <div style="font-size:2rem;margin-bottom:0.75rem">📂</div>
          <div>لا يوجد محتوى بعد — أضف <code style="color:var(--gold)">${sec.dataFile}</code></div>
        </div>
      </div>`;
  }
}

// ── عرض المحتوى بحسب النوع ───────────────────────────
function renderSection(container, sectionId, data) {
  if (!data || !data.items) {
    container.innerHTML = `<div class="content-placeholder"><div class="loader">لا توجد بيانات</div></div>`;
    return;
  }

  if (sectionId === "speaking") {
    renderSpeakingCards(container, data);
  } else if (sectionId === "vocab") {
    renderVocabCards(container, data);
  } else {
    renderGenericList(container, data);
  }
}

// ── عرض بطاقات المحادثة ──────────────────────────────
function renderSpeakingCards(container, data) {
  const groups = {};
  data.items.forEach(item => {
    if (!groups[item.group]) groups[item.group] = [];
    groups[item.group].push(item);
  });

  const html = Object.entries(groups).map(([group, items]) => `
    <div style="margin-bottom:2rem">
      <div style="font-family:var(--mono);font-size:0.75rem;color:var(--gold);text-transform:uppercase;letter-spacing:2px;margin-bottom:1rem">${group}</div>
      <div class="cards-grid">
        ${items.map(item => `
          <div class="section-card" style="cursor:default">
            <div class="section-card-de">${item.topic_de || ""}</div>
            <div class="section-card-title">${item.topic_ar || ""}</div>
            <div style="margin-top:0.75rem;font-size:0.82rem;color:var(--muted);line-height:1.8">
              <div style="color:var(--gold);font-weight:700;font-size:0.75rem;margin-bottom:0.3rem">Inhalt</div>
              <div>${item.inhalt || ""}</div>
              ${item.meinung ? `<div style="margin-top:0.5rem;color:var(--gold);font-weight:700;font-size:0.75rem">Meinung</div><div>${item.meinung}</div>` : ""}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");

  container.innerHTML = `<div style="max-width:1100px;margin:0 auto">${html}</div>`;
}

// ── عرض بطاقات المفردات ──────────────────────────────
function renderVocabCards(container, data) {
  const html = `
    <div class="cards-grid" style="max-width:1100px;margin:0 auto">
      ${data.items.map(item => `
        <div class="section-card" style="cursor:default">
          <div style="font-family:var(--mono);font-size:1.05rem;font-weight:600;color:var(--gold);margin-bottom:0.25rem">${item.de}</div>
          <div style="font-size:0.85rem;color:var(--muted);margin-bottom:0.5rem;font-style:italic">${item.type || ""}</div>
          <div style="font-size:0.95rem;color:var(--white)">${item.ar}</div>
          ${item.example ? `<div style="margin-top:0.75rem;font-size:0.8rem;color:var(--muted);border-top:1px solid var(--border);padding-top:0.5rem;font-family:var(--mono)">${item.example}</div>` : ""}
        </div>
      `).join("")}
    </div>`;
  container.innerHTML = html;
}

// ── عرض قائمة عامة ───────────────────────────────────
function renderGenericList(container, data) {
  const html = `
    <div style="max-width:900px;margin:0 auto">
      ${data.items.map((item, i) => `
        <div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:1.5rem;margin-bottom:1rem">
          <div style="display:flex;align-items:center;gap:1rem;margin-bottom:0.75rem">
            <span style="font-family:var(--mono);font-size:0.75rem;color:var(--gold);background:rgba(201,168,76,0.1);padding:0.25rem 0.6rem;border-radius:6px">${String(i+1).padStart(2,"0")}</span>
            <div style="font-size:1rem;font-weight:700;color:var(--white)">${item.title || item.de || ""}</div>
          </div>
          ${item.desc ? `<div style="font-size:0.88rem;color:var(--muted);line-height:1.7">${item.desc}</div>` : ""}
        </div>
      `).join("")}
    </div>`;
  container.innerHTML = html;
}

// ── Mobile menu ───────────────────────────────────────
function toggleMobileMenu() {
  document.getElementById("nav-links").classList.toggle("open");
}

// ── Intersection Observer لتحميل المحتوى عند الظهور ──
function setupLazyLoad() {
  const sectionsToLoad = [
    { section: "reading",  container: "reading-content" },
    { section: "writing",  container: "writing-content" },
    { section: "speaking", container: "speaking-content" },
    { section: "vocab",    container: "vocab-content" },
  ];

  const loaded = new Set();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const match = sectionsToLoad.find(s => `${s.section}-content` === id);
        if (match && !loaded.has(id)) {
          loaded.add(id);
          loadSectionData(match.section, match.container);
        }
      }
    });
  }, { threshold: 0.1 });

  sectionsToLoad.forEach(s => {
    const el = document.getElementById(`${s.section}-content`);
    if (el) observer.observe(el);
  });
}

// ── Active nav link on scroll ─────────────────────────
function setupScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove("active"));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add("active");
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => obs.observe(sec));
}

// ── Init ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  buildSectionsGrid();
  setupLazyLoad();
  setupScrollSpy();

  // إغلاق القائمة عند النقر على رابط
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      document.getElementById("nav-links").classList.remove("open");
    });
  });
});
