"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sparkles, Languages, Trophy, Calculator, Users, Route, BookOpen,
  ArrowRight, ChevronDown, Bot, MessageCircle, Star, Instagram, Linkedin,
  LayoutDashboard, ClipboardList, Award, Settings, Bell, Flame, Send,
  CheckCircle2, Circle, TrendingUp, User, Mail, Calendar, BarChart3, Menu, X,
  GraduationCap, Wallet, CalendarClock, Video, Heart
} from "lucide-react";

// ============================================================
// DESIGN TOKENS
// ============================================================
const c = {
  primary: "#4F8EF7",
  primaryDark: "#3A6FD1",
  primaryTint: "#EAF1FE",
  secondary: "#3FA873",
  secondaryDark: "#1F6E48",
  secondaryTint: "#E6F4EC",
  accent: "#FFD166",
  accentDark: "#966616",
  accentTint: "#FFF7E6",
  bg: "#FAFBFD",
  ink: "#0B1220",
  text: "#111827",
  textMuted: "#6B7280",
  border: "#E7EAF1",
};
const radius = { sm: "14px", md: "20px", lg: "28px", pill: "999px" };
const font = "'Montserrat', ui-sans-serif, system-ui, sans-serif";

// ============================================================
// GOOGLE SHEETS — replace with your own Apps Script Web App URL.
// See google-sheets-setup.md for the 5-minute setup guide.
// ============================================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw1-ZvTRkllBFl85rCyswvfVS4hMiyLH_HtOTam5Ui0Zzyep-jyfpm6dvdzKlBZv-ImqQ/exec";

async function submitToWaitlist({ firstName, lastName, email, phone, role }) {
  // Apps Script web apps don't return CORS headers, so we send the request
  // "fire and forget" with mode: "no-cors". We can't read the response back,
  // but the row still lands in the Google Sheet.
  await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ firstName, lastName, email, phone, role, submittedAt: new Date().toISOString() }),
  });
}

// ============================================================
// SCROLL REVEAL — lightweight IntersectionObserver wrapper
// ============================================================
const Reveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// ============================================================
// SHARED UI
// ============================================================
const Eyebrow = ({ children }) => (
  <span className="inline-flex items-center text-xs font-bold px-3 py-1.5 mb-5"
    style={{ background: c.primaryTint, color: c.primaryDark, borderRadius: radius.pill }}>
    {children}
  </span>
);

const Btn = ({ variant = "primary", children, onDark, small }) => {
  const styles = {
    primary: { background: c.primary, color: "#fff" },
    secondary: onDark
      ? { background: "rgba(255,255,255,0.08)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.25)" }
      : { background: "#fff", color: c.text, border: `1.5px solid ${c.border}` },
  };
  return (
    <button
      className={`inline-flex items-center gap-2 font-semibold ${small ? "px-4 py-2 text-sm" : "px-6 py-3 text-[15px]"}`}
      style={{ ...styles[variant], borderRadius: radius.pill, transition: "transform 0.15s ease, box-shadow 0.15s ease" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(79,142,247,0.25)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {children}
    </button>
  );
};

const HoverCard = ({ children, style }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...style,
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hover ? "0 16px 32px rgba(17,24,39,0.08)" : "0 1px 2px rgba(17,24,39,0.04)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {children}
    </div>
  );
};

const SidebarNav = ({ items, active }) => (
  <div className="hidden md:flex w-52 shrink-0 p-5 flex-col gap-1" style={{ borderRight: `1px solid ${c.border}` }}>
    <p className="text-lg font-extrabold mb-6 px-1" style={{ color: c.text }}>Upwise</p>
    {items.map((n) => (
      <div key={n.t} className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold"
        style={{ borderRadius: radius.sm, background: n.t === active ? c.primaryTint : "transparent", color: n.t === active ? c.primaryDark : c.textMuted }}>
        <n.icon size={16} /> {n.t}
      </div>
    ))}
  </div>
);

// ============================================================
// JOIN MODAL — collects name, surname, email, phone
// ============================================================
const JoinModal = ({ open, role, onClose }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [localRole, setLocalRole] = useState(role || "parent");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (open) {
      setSent(false); setFirstName(""); setLastName(""); setEmail(""); setPhone("");
      setLocalRole(role || "parent"); setError("");
    }
  }, [open, role]);
  if (!open) return null;
  const canSubmit = firstName && lastName && email && phone;

  const handleSubmit = async () => {
    if (!canSubmit) { setError("Заповніть, будь ласка, усі поля."); return; }
    setLoading(true);
    setError("");
    try {
      await submitToWaitlist({ firstName, lastName, email, phone, role: localRole });
      setSent(true);
    } catch (err) {
      setError("Не вдалось надіслати. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = { border: `1.5px solid ${c.border}`, borderRadius: radius.sm };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(11,18,32,0.5)", backdropFilter: "blur(2px)" }}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm p-7 max-h-[90vh] overflow-y-auto" style={{ background: "#fff", borderRadius: radius.lg, position: "relative" }}>
        <button onClick={onClose} className="absolute top-4 right-4" aria-label="Закрити">
          <X size={18} color={c.textMuted} />
        </button>

        {sent ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center" style={{ background: c.secondaryTint, borderRadius: "999px" }}>
              <CheckCircle2 size={24} color={c.secondaryDark} />
            </div>
            <p className="text-lg font-extrabold mb-2" style={{ color: c.text }}>Дякуємо, {firstName}!</p>
            <p className="text-sm" style={{ color: c.textMuted }}>Ми напишемо на {email}, щойно Upwise відкриється у вашому місті.</p>
          </div>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: c.primary }}>🇪🇺 Європа</p>
            <p className="text-xl font-extrabold mb-5" style={{ color: c.text }}>
              {localRole === "teacher" ? "Реєстрація вчителя" : "Приєднатись до списку очікування"}
            </p>

            <div className="flex gap-2 mb-4 p-1" style={{ background: c.bg, borderRadius: radius.pill }}>
              {[["parent", "Я батько"], ["teacher", "Я вчитель"]].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setLocalRole(key)}
                  className="flex-1 text-xs font-semibold py-2"
                  style={{ borderRadius: radius.pill, background: localRole === key ? "#fff" : "transparent", color: localRole === key ? c.text : c.textMuted, boxShadow: localRole === key ? "0 1px 2px rgba(17,24,39,0.08)" : "none" }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ім'я" className="px-4 py-3 text-sm outline-none" style={fieldStyle} />
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Прізвище" className="px-4 py-3 text-sm outline-none" style={fieldStyle} />
            </div>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="ваша@пошта.com" className="w-full px-4 py-3 text-sm outline-none mb-2" style={fieldStyle} />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="+380 XX XXX XX XX" className="w-full px-4 py-3 text-sm outline-none mb-3" style={fieldStyle} />

            {error && <p className="text-xs mb-3" style={{ color: "#C0392B" }}>{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full font-semibold px-6 py-3 text-[15px]"
              style={{ background: c.primary, color: "#fff", borderRadius: radius.pill, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Надсилаємо..." : localRole === "teacher" ? "Подати заявку" : "Приєднатись"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================
// NAV
// ============================================================
const NAV_LINKS = [
  { label: "Вчителі", id: "teachers" },
  { label: "Можливості", id: "solution" },
  { label: "Як це працює", id: "how-it-works" },
  { label: "Про нас", id: "founder" },
  { label: "Питання", id: "faq" },
];

const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Nav = ({ onJoin }) => {
  const [open, setOpen] = useState(false);
  const goTo = (id) => { setOpen(false); scrollToId(id); };
  return (
    <nav className="sticky top-0 z-20 px-6 py-4" style={{ background: "rgba(250,251,253,0.85)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${c.border}` }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
       <img
          src="/logo.jpeg"
          alt="Upwise"
          className="h-8 cursor-pointer shrink-0"
          onClick={() => scrollToId("top")}/>
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium" style={{ color: c.textMuted }}>
          {NAV_LINKS.map((l) => (
            <span key={l.id} className="cursor-pointer hover:opacity-70" style={{ transition: "opacity 0.15s" }} onClick={() => goTo(l.id)}>
              {l.label}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block" onClick={onJoin}><Btn variant="primary" small>Приєднатись</Btn></div>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Меню">
            {open ? <X size={22} color={c.text} /> : <Menu size={22} color={c.text} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden flex flex-col gap-4 pt-5 pb-2">
          {NAV_LINKS.map((l) => (
            <span key={l.id} className="text-sm font-medium cursor-pointer" style={{ color: c.textMuted }} onClick={() => goTo(l.id)}>
              {l.label}
            </span>
          ))}
          <div onClick={onJoin}><Btn variant="primary" small>Приєднатись</Btn></div>
        </div>
      )}
    </nav>
  );
};

// ============================================================
// HERO — teacher-led, AI as support
// ============================================================
const Hero = ({ onJoin }) => (
  <section id="top" className="relative px-6 pt-14 pb-20 max-w-6xl mx-auto overflow-hidden">
    <div
      aria-hidden
      className="absolute pointer-events-none"
      style={{ top: -120, right: -120, width: 420, height: 420, borderRadius: "999px", background: "radial-gradient(circle, rgba(79,142,247,0.16), transparent 70%)" }}
    />
    <div className="grid md:grid-cols-2 gap-12 items-center relative">
      <Reveal>
        <Eyebrow>🇺🇦 Підтримка українських родин у Європі</Eyebrow>
        <h1 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-6" style={{ color: c.text }}>
          Справжні вчителі допомагають дітям впевнено почати нове життя в Європі
        </h1>
        <p className="text-lg leading-relaxed mb-8" style={{ color: c.textMuted, maxWidth: 480 }}>
          Upwise поєднує живі уроки з досвідченими вчителями та ШІ-підтримку щодня, щоб українські діти швидше й впевненіше адаптувались до школи за кордоном.
        </p>
        <div className="flex flex-wrap gap-4">
          <div onClick={onJoin}><Btn variant="primary">Приєднатись до списку очікування <ArrowRight size={16} /></Btn></div>
          <div onClick={() => scrollToId("platform-preview")}><Btn variant="secondary">Дивитись демо</Btn></div>
        </div>
      </Reveal>

      <Reveal delay={150}>
        <div className="relative">
          <HoverCard style={{ background: "#fff", borderRadius: radius.lg, border: `1px solid ${c.border}`, padding: 20 }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: c.secondaryTint, color: c.secondaryDark }}>СМ</div>
                <div>
                  <p className="text-sm font-bold" style={{ color: c.text }}>Соломія</p>
                  <p className="text-xs" style={{ color: c.textMuted }}>7-й клас</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1" style={{ background: c.accentTint, color: c.accentDark, borderRadius: radius.pill }}>
                <Flame size={12} /> 12 днів поспіль
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3" style={{ background: c.primaryTint, borderRadius: radius.sm }}>
                <p className="text-xs font-semibold mb-1" style={{ color: c.primaryDark }}>Сьогодні о 17:00</p>
                <p className="text-sm font-bold" style={{ color: c.text }}>Урок з вчителькою Мариною</p>
              </div>
              <div className="p-3" style={{ background: c.secondaryTint, borderRadius: radius.sm }}>
                <p className="text-xs font-semibold mb-1" style={{ color: c.secondaryDark }}>Прогрес тижня</p>
                <p className="text-sm font-bold" style={{ color: c.text }}>+18%</p>
              </div>
            </div>
            <div className="p-3 flex items-center gap-3" style={{ border: `1px solid ${c.border}`, borderRadius: radius.sm }}>
              <Bot size={18} color={c.primaryDark} />
              <p className="text-xs" style={{ color: c.textMuted }}>ШІ-асистент готовий допомогти з домашнім завданням між уроками</p>
            </div>
          </HoverCard>
          <div className="absolute -top-4 -left-6 hidden md:flex items-center gap-2 px-3 py-2 text-xs font-semibold animate-float"
            style={{ background: "#fff", border: `1px solid ${c.border}`, borderRadius: radius.pill, boxShadow: "0 8px 24px rgba(17,24,39,0.08)", color: c.text }}>
            <GraduationCap size={14} color={c.secondaryDark} /> Жива вчителька
          </div>
          <div className="absolute -bottom-5 -right-4 hidden md:flex items-center gap-2 px-3 py-2 text-xs font-semibold"
            style={{ background: "#fff", border: `1px solid ${c.border}`, borderRadius: radius.pill, boxShadow: "0 8px 24px rgba(17,24,39,0.08)", color: c.text }}>
            <Trophy size={14} color={c.accentDark} /> Прогрес
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

// ============================================================
// PROBLEM
// ============================================================
const Problem = () => (
  <section className="px-6 py-20" style={{ background: "#fff" }}>
    <div className="max-w-5xl mx-auto text-center">
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight" style={{ color: c.text }}>
          Переїзд до іншої країни змінює все.<br />Школа не має ставати ще одним викликом.
        </h2>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-5 mt-14 text-left">
        {[
          { t: "Мовний бар'єр", d: "Дитині складно розуміти вчителя й однокласників з перших тижнів." },
          { t: "Адаптація до школи", d: "Нова система освіти, нові правила, незнайомі очікування." },
          { t: "Стрес для батьків", d: "Важко допомогти з домашнім завданням, якого самі не розумієте." },
        ].map((x, i) => (
          <Reveal key={x.t} delay={i * 100}>
            <HoverCard style={{ background: c.bg, borderRadius: radius.lg, border: `1px solid ${c.border}`, padding: 24 }}>
              <p className="font-bold text-[15px] mb-2" style={{ color: c.text }}>{x.t}</p>
              <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>{x.d}</p>
            </HoverCard>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

// ============================================================
// TEACHERS — primary section, right after the problem
// ============================================================
const Teachers = ({ onJoinTeacher }) => {
  const perks = [
    { icon: CalendarClock, t: "Гнучкий графік", d: "Берете стільки уроків, скільки зручно — жодних мінімальних годин." },
    { icon: Video, t: "Уроки онлайн", d: "Проводите заняття прямо на платформі, без сторонніх сервісів." },
    { icon: Wallet, t: "Оплата за урок", d: "Прозора ставка за кожне заняття, виплати щотижня." },
  ];
  return (
    <section id="teachers" className="px-6 py-20 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <Reveal>
          <Eyebrow><GraduationCap size={14} style={{ display: "inline", marginRight: 4, verticalAlign: -2 }} />Живі вчителі — серце Upwise</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-5" style={{ color: c.text }}>
            Справжні вчителі проводять уроки. ШІ — лише допомагає між ними.
          </h2>
          <p className="text-[15px] leading-relaxed mb-8" style={{ color: c.textMuted, maxWidth: 460 }}>
            У кожної дитини є вчитель, який веде живі заняття, знає її прогрес і підтримує особисто. Хочете навчати українських дітей і заробляти на цьому? Реєструйтесь, підтвердьте кваліфікацію і почніть проводити уроки вже цього місяця.
          </p>
          <div onClick={onJoinTeacher}><Btn variant="primary">Стати вчителем Upwise <ArrowRight size={16} /></Btn></div>
        </Reveal>

        <div className="flex flex-col gap-3">
          {perks.map((p, i) => (
            <Reveal key={p.t} delay={i * 100}>
              <HoverCard style={{ background: "#fff", borderRadius: radius.lg, border: `1px solid ${c.border}`, padding: 20 }}>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 shrink-0 flex items-center justify-center" style={{ background: c.secondaryTint, borderRadius: radius.sm }}>
                    <p.icon size={20} color={c.secondaryDark} />
                  </div>
                  <div>
                    <p className="font-bold text-[15px]" style={{ color: c.text }}>{p.t}</p>
                    <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>{p.d}</p>
                  </div>
                </div>
              </HoverCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// SOLUTION — teachers listed first, AI tutor further down
// ============================================================
const Solution = () => {
  const items = [
    { icon: GraduationCap, t: "Живі уроки з вчителями", d: "Кваліфіковані вчителі проводять заняття й знають прогрес кожної дитини особисто." },
    { icon: Users, t: "Кабінет батьків", d: "Прозорий прогрес дитини й поради, як підтримати вдома." },
    { icon: Languages, t: "Мовна практика", d: "Щоденні короткі уроки на основі реальних шкільних ситуацій." },
    { icon: Calculator, t: "Математика", d: "Практика у звичному й новому форматі одночасно." },
    { icon: Route, t: "Персональний план", d: "Вчитель і ШІ разом будують індивідуальний шлях адаптації для дитини." },
    { icon: Bot, t: "ШІ-репетитор", d: "Завжди поруч між уроками, щоб пояснити домашнє завдання простою мовою." },
  ];
  return (
    <section id="solution" className="px-6 py-20 max-w-6xl mx-auto">
      <Reveal><h2 className="text-3xl md:text-4xl font-extrabold text-center mb-14" style={{ color: c.text }}>Все, що потрібно родині, в одному місці</h2></Reveal>
      <div className="grid md:grid-cols-3 gap-5">
        {items.map((x, i) => (
          <Reveal key={x.t} delay={(i % 3) * 100}>
            <HoverCard style={{ background: "#fff", borderRadius: radius.lg, border: `1px solid ${c.border}`, padding: 24 }}>
              <div className="w-11 h-11 flex items-center justify-center mb-4" style={{ background: c.primaryTint, borderRadius: radius.sm }}>
                <x.icon size={20} color={c.primaryDark} />
              </div>
              <p className="font-bold text-[15px] mb-1" style={{ color: c.text }}>{x.t}</p>
              <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>{x.d}</p>
            </HoverCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

// ============================================================
// HOW IT WORKS
// ============================================================
const HowItWorks = () => {
  const steps = ["Переїзд", "Реєстрація", "Знайомство з вчителем", "Навчання", "Впевненість"];
  return (
    <section id="how-it-works" className="px-6 py-20" style={{ background: "#fff" }}>
      <div className="max-w-3xl mx-auto text-center">
        <Reveal><h2 className="text-3xl md:text-4xl font-extrabold mb-14" style={{ color: c.text }}>Як це працює</h2></Reveal>
        <div className="flex flex-col gap-0">
          {steps.map((s, i) => (
            <Reveal key={s} delay={i * 80}>
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: i === steps.length - 1 ? c.secondaryTint : c.primaryTint, color: i === steps.length - 1 ? c.secondaryDark : c.primaryDark }}>
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && <div style={{ width: 2, height: 40, background: c.border }} />}
                </div>
                <p className="text-lg font-semibold pt-1 text-left" style={{ color: c.text }}>{s}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// PLATFORM PREVIEW (dashboard mockup embedded)
// ============================================================
const PlatformPreview = () => {
  const nav = [
    { icon: LayoutDashboard, t: "Дашборд" }, { icon: BookOpen, t: "Уроки" },
    { icon: ClipboardList, t: "Домашнє завдання" }, { icon: MessageCircle, t: "ШІ-чат" },
    { icon: Award, t: "Прогрес" }, { icon: Settings, t: "Налаштування" },
  ];
  const lessons = [
    { t: "Урок з вчителькою: мова школи", tag: "Вчитель", done: true },
    { t: "Математика: дроби", tag: "Вчитель", done: true },
    { t: "Розмовна практика з ШІ", tag: "ШІ", done: false },
  ];
  return (
    <section id="platform-preview" className="px-6 py-20 max-w-6xl mx-auto">
      <Reveal><h2 className="text-3xl md:text-4xl font-extrabold text-center mb-14" style={{ color: c.text }}>Продукт, яким користуються щодня</h2></Reveal>
      <Reveal delay={100}>
        <div className="flex" style={{ background: "#fff", borderRadius: radius.lg, border: `1px solid ${c.border}`, boxShadow: "0 20px 60px rgba(17,24,39,0.06)", overflow: "hidden" }}>
          <SidebarNav items={nav} active="Дашборд" />
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="font-bold text-lg" style={{ color: c.text }}>Завдання на сьогодні</p>
              <Bell size={18} color={c.textMuted} />
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-4" style={{ background: c.bg, borderRadius: radius.sm }}>
                <div className="flex items-center gap-2 mb-1"><TrendingUp size={14} color={c.primaryDark} /><p className="text-[11px]" style={{ color: c.textMuted }}>Прогрес</p></div>
                <p className="text-xl font-extrabold" style={{ color: c.text }}>+18%</p>
              </div>
              <div className="p-4" style={{ background: c.bg, borderRadius: radius.sm }}>
                <p className="text-[11px] mb-1" style={{ color: c.textMuted }}>Уроків завершено</p>
                <p className="text-xl font-extrabold" style={{ color: c.text }}>4/5</p>
              </div>
              <div className="p-4" style={{ background: c.bg, borderRadius: radius.sm }}>
                <div className="flex items-center gap-2 mb-1"><Flame size={14} color={c.accentDark} /><p className="text-[11px]" style={{ color: c.textMuted }}>Серія</p></div>
                <p className="text-xl font-extrabold" style={{ color: c.text }}>12</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              {lessons.map((l) => (
                <div key={l.t} className="flex items-center justify-between p-3" style={{ border: `1px solid ${c.border}`, borderRadius: radius.sm }}>
                  <div className="flex items-center gap-3">
                    {l.done ? <CheckCircle2 size={18} color={c.secondary} /> : <Circle size={18} color={c.textMuted} />}
                    <div>
                      <p className="text-sm font-semibold" style={{ color: c.text }}>{l.t}</p>
                      <p className="text-[11px]" style={{ color: c.textMuted }}>{l.tag}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 flex items-center gap-3" style={{ background: c.primaryTint, borderRadius: radius.sm }}>
              <Bot size={18} color={c.primaryDark} />
              <p className="text-sm" style={{ color: c.primaryDark }}>"Домашнє з математики готове до перевірки" — ШІ-асистент</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

// ============================================================
// AI SECTION (dark) — supporting role, comes after teachers/product
// ============================================================
const AiSection = () => {
  const quickReplies = ["Перекласти", "Пояснити", "Допомога з домашнім", "Практика мови"];
  const [picked, setPicked] = useState(null);
  return (
    <section className="px-6 py-20" style={{ background: c.ink }}>
      <div className="max-w-3xl mx-auto text-center">
        <Eyebrow>Між уроками з вчителем</Eyebrow>
        <Reveal><h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-white">ШІ-помічник, який завжди поруч</h2></Reveal>
        <Reveal delay={100}>
          <div className="text-left p-6 mb-8" style={{ background: "#151E30", borderRadius: radius.lg, border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex justify-end mb-4">
              <div className="px-4 py-2.5 max-w-[70%] text-sm" style={{ background: c.primary, color: "#fff", borderRadius: "16px 16px 4px 16px" }}>
                Я не розумію це домашнє завдання.
              </div>
            </div>
            <div className="flex justify-start">
              <div className="px-4 py-2.5 max-w-[70%] text-sm" style={{ background: "rgba(255,255,255,0.06)", color: "#E5E7EB", borderRadius: "16px 16px 16px 4px" }}>
                {picked ? `Добре, ось "${picked}" 🙂` : "Без проблем. Розберемо це разом, крок за кроком."}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {quickReplies.map((b) => (
              <div key={b} onClick={() => setPicked(b)} style={{ cursor: "pointer" }}>
                <Btn variant="secondary" onDark small>{b}</Btn>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ============================================================
// FOUNDER — personal credibility, 50+ students, no explicit list
// ============================================================
const Founder = () => (
  <section id="founder" className="px-6 py-20" style={{ background: "#fff" }}>
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <Reveal>
     <div className="relative w-full aspect-square" style={{ backgroundImage: "url('/founder.png')", backgroundSize: "cover", backgroundPosition: "center", borderRadius: radius.lg }}>
          <div className="absolute -bottom-5 -right-5 px-5 py-4 flex items-center gap-3"
            style={{ background: "#fff", borderRadius: radius.md, border: `1px solid ${c.border}`, boxShadow: "0 16px 32px rgba(17,24,39,0.1)" }}>
            <div className="w-10 h-10 flex items-center justify-center" style={{ background: c.secondaryTint, borderRadius: "999px" }}>
              <Heart size={18} color={c.secondaryDark} />
            </div>
            <div>
              <p className="text-lg font-extrabold leading-none" style={{ color: c.text }}>50+</p>
              <p className="text-[11px] leading-none mt-1" style={{ color: c.textMuted }}>учнів навчалось зі мною</p>
            </div>
          </div>
        </div>
      </Reveal>
      <Reveal delay={100}>
        <h2 className="text-2xl md:text-3xl font-extrabold mb-5" style={{ color: c.text }}>"Я сама пройшла цей шлях"</h2>
        <p className="text-[15px] leading-relaxed mb-4" style={{ color: c.textMuted }}>
          Переїхавши до Європи, я на власні очі побачила, наскільки складною є адаптація до школи для дітей-іммігрантів.
        </p>
        <p className="text-[15px] leading-relaxed mb-4" style={{ color: c.textMuted }}>
          Ще до Upwise я роками особисто викладала дітям і дорослим — і бачила, як правильна підтримка змінює все: нова мова стає зрозумілою, нова школа — не такою страшною.
        </p>
        <p className="text-[15px] leading-relaxed font-semibold" style={{ color: c.text }}>Тому я створила Upwise — щоб цей досвід отримала кожна українська родина.</p>
      </Reveal>
    </div>
  </section>
);

// ============================================================
// TESTIMONIALS
// ============================================================
const Testimonials = () => {
  const items = [
    { n: "Олена К.", role: "Мама", t: "Донька почала сама просити додаткову практику замість того, щоб уникати домашнього." },
    { n: "Ігор П.", role: "Тато", t: "Нарешті я розумію, як синові йдуть справи в школі, хоча сам мову ще вчу." },
    { n: "Наталія Р.", role: "Мама", t: "Найбільше вразило, наскільки швидко зникла тривога перед школою." },
  ];
  return (
    <section className="px-6 py-20 max-w-6xl mx-auto">
      <Reveal><h2 className="text-3xl md:text-4xl font-extrabold text-center mb-14" style={{ color: c.text }}>Що кажуть батьки</h2></Reveal>
      <div className="grid md:grid-cols-3 gap-5">
        {items.map((x, i) => (
          <Reveal key={x.n} delay={i * 100}>
            <HoverCard style={{ background: "#fff", borderRadius: radius.lg, border: `1px solid ${c.border}`, padding: 24 }}>
              <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} size={14} fill={c.accent} color={c.accent} />)}</div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: c.text }}>"{x.t}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: c.secondaryTint, color: c.secondaryDark }}>
                  {x.n.split(" ").map((w) => w[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: c.text }}>{x.n}</p>
                  <p className="text-xs" style={{ color: c.textMuted }}>{x.role}, Європа</p>
                </div>
              </div>
            </HoverCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

// ============================================================
// FAQ
// ============================================================
const FAQ = () => {
  const [open, setOpen] = useState(0);
  const items = [
    { q: "Чи безкоштовний Upwise?", a: "Приєднання до списку очікування безкоштовне. Деталі цін ми повідомимо перед запуском." },
    { q: "Хто веде уроки — люди чи ШІ?", a: "Основні заняття веде справжній вчитель. ШІ-асистент лише допомагає з домашнім завданням між уроками." },
    { q: "Для якого віку дітей це підходить?", a: "Для дітей 6–16 років, з адаптованим контентом під кожен віковий етап." },
    { q: "Чи бачать батьки прогрес дитини?", a: "Так, кабінет батьків показує прогрес, уроки та рекомендації в реальному часі." },
  ];
  return (
    <section id="faq" className="px-6 py-20" style={{ background: "#fff" }}>
      <div className="max-w-2xl mx-auto">
        <Reveal><h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12" style={{ color: c.text }}>Питання й відповіді</h2></Reveal>
        {items.map((it, i) => (
          <Reveal key={it.q} delay={i * 60}>
            <div className="border-b py-5" style={{ borderColor: c.border }}>
              <button className="w-full flex items-center justify-between text-left" onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="font-semibold text-[15px]" style={{ color: c.text }}>{it.q}</span>
                <ChevronDown size={18} style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: c.textMuted }} />
              </button>
              {open === i && <p className="text-sm mt-3 leading-relaxed" style={{ color: c.textMuted }}>{it.a}</p>}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

// ============================================================
// FINAL CTA
// ============================================================
const FinalCta = ({ onJoin }) => (
  <section id="cta" className="px-6 py-24" style={{ background: c.primaryTint }}>
    <div className="max-w-2xl mx-auto text-center">
      <Reveal>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: c.text }}>Подаруйте дитині впевненість у новій країні</h2>
        <p className="text-[15px] mb-8" style={{ color: c.textMuted }}>Приєднуйтесь до списку очікування — ми повідомимо, щойно відкриємо доступ.</p>
        <div className="flex justify-center" onClick={onJoin}>
          <Btn variant="primary">Приєднатись до списку очікування <ArrowRight size={16} /></Btn>
        </div>
      </Reveal>
    </div>
  </section>
);

// ============================================================
// FOOTER
// ============================================================
const Footer = () => (
  <footer className="px-6 py-12" style={{ background: "#fff", borderTop: `1px solid ${c.border}` }}>
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <span className="text-lg font-extrabold" style={{ color: c.text }}>Upwise</span>
      <div className="flex flex-wrap justify-center gap-6 text-sm font-medium" style={{ color: c.textMuted }}>
        <span className="cursor-pointer hover:opacity-70" onClick={() => scrollToId("teachers")}>Для вчителів</span>
        <span className="cursor-pointer hover:opacity-70" onClick={() => scrollToId("founder")}>Про нас</span>
        <span className="cursor-pointer hover:opacity-70" onClick={() => scrollToId("how-it-works")}>Як це працює</span>
        <span>Конфіденційність</span><span>Умови використання</span>
      </div>
    <div className="flex gap-4">
  <a href="https://www.instagram.com/upwise.eu?igsh=MWIxNnJ4a3huejYwZw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
    <Instagram size={18} color={c.textMuted} />
  </a>
  <a href="https://t.me/olichikqe" target="_blank" rel="noopener noreferrer">
    <Send size={18} color={c.textMuted} />
  </a>
</div>
    </div>
  </footer>
);

// ============================================================
// PAGE
// ============================================================
export default function UpwiseLandingFinal() {
  const [modal, setModal] = useState({ open: false, role: "parent" });
  const openParentModal = () => setModal({ open: true, role: "parent" });
  const openTeacherModal = () => setModal({ open: true, role: "teacher" });
  const closeModal = () => setModal((m) => ({ ...m, open: false }));

  return (
    <div style={{ background: c.bg, fontFamily: font }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
        @keyframes floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-float { animation: floaty 3.5s ease-in-out infinite; }
      `}</style>
      <Nav onJoin={openParentModal} />
      <Hero onJoin={openParentModal} />
      <Problem />
      <Teachers onJoinTeacher={openTeacherModal} />
      <Solution />
      <HowItWorks />
      <PlatformPreview />
      <AiSection />
      <Founder />
      <Testimonials />
      <FAQ />
      <FinalCta onJoin={openParentModal} />
      <Footer />
      <JoinModal open={modal.open} role={modal.role} onClose={closeModal} />
    </div>
  );
}
