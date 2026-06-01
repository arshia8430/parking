import { useState } from "react";
import { Search, MapPin, Clock, Calendar, ChevronLeft, Shield, Zap, Smartphone, Star, QrCode, Wifi } from "lucide-react";
import { Button } from "./ui/button";

import type { PlatformStats, SearchRequest } from "../types/parking";

interface HeroSectionProps {
  stats: PlatformStats;
  onSearch: (query: SearchRequest) => void;
}

function formatStat(value: number, suffix = "") {
  return `${value.toLocaleString("fa-IR")}${suffix}`;
}

const FEATURES = [
  {
    icon: <Zap size={22} className="text-yellow-400" />,
    title: "ورود هوشمند IoT",
    desc: "باز شدن خودکار درب با اسکن QR کد توسط دوربین‌های هوشمند",
    color: "rgba(234,179,8,0.1)",
    border: "rgba(234,179,8,0.2)",
  },
  {
    icon: <Shield size={22} className="text-emerald-400" />,
    title: "امنیت کامل",
    desc: "تأیید هویت راننده و شناسایی پلاک خودرو در هر ورود و خروج",
    color: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.2)",
  },
  {
    icon: <QrCode size={22} className="text-blue-400" />,
    title: "QR کد یکبار مصرف",
    desc: "کد مخصوص با اعتبار ۵ دقیقه برای ورود و خروج جداگانه",
    color: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.2)",
  },
  {
    icon: <Smartphone size={22} className="text-purple-400" />,
    title: "پرداخت آنلاین",
    desc: "پرداخت امن با کارت بانکی، کیف پول یا درگاه پرداخت",
    color: "rgba(168,85,247,0.1)",
    border: "rgba(168,85,247,0.2)",
  },
];

const HOW_IT_WORKS = [
  { step: "۱", title: "جستجو کنید", desc: "مکان و ساعت مورد نظر را وارد کنید", icon: <Search size={20} /> },
  { step: "۲", title: "انتخاب کنید", desc: "پارکینگ مناسب را روی نقشه پیدا کنید", icon: <MapPin size={20} /> },
  { step: "۳", title: "پرداخت کنید", desc: "مبلغ رزرو را آنلاین پرداخت نمایید", icon: <Star size={20} /> },
  { step: "۴", title: "پارک کنید", desc: "با QR کد وارد پارکینگ شوید", icon: <QrCode size={20} /> },
];

export default function HeroSection({ stats, onSearch }: HeroSectionProps) {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [from, setFrom] = useState("08:00");
  const [to, setTo] = useState("12:00");

  const statItems = [
    { value: formatStat(stats.activeParkings), label: "پارکینگ فعال" },
    { value: formatStat(stats.verifiedOwners), label: "مالک تأییدشده" },
    { value: formatStat(stats.successfulReservations), label: "رزرو موفق" },
    { value: stats.averageRating ? stats.averageRating.toLocaleString("fa-IR") : "—", label: "امتیاز کاربران" },
  ];

  return (
    <div dir="rtl" style={{ fontFamily: "'Vazirmatn', Tahoma, sans-serif" }}>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: "92vh", background: "linear-gradient(160deg, #060c1a 0%, #0a1628 50%, #060c1a 100%)" }}>
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "-15%", left: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)" }} />
          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", color: "#93c5fd" }}>
            <Wifi size={14} />
            <span style={{ fontSize: "0.8rem" }}>سیستم هوشمند پارکینگ با اینترنت اشیاء</span>
          </div>

          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.2, color: "#f1f5f9", maxWidth: "700px", marginBottom: "1.5rem" }}>
            پارکینگ هوشمند را{" "}
            <span style={{ background: "linear-gradient(90deg, #3b82f6, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              تجربه کنید
            </span>
          </h1>

          <p style={{ fontSize: "1.05rem", color: "#94a3b8", maxWidth: "520px", lineHeight: 1.8, marginBottom: "2.5rem" }}>
            رزرو آنلاین پارکینگ، ورود با QR کد، شناسایی پلاک خودرو — همه در یک پلتفرم امن و هوشمند
          </p>

          {/* Search Card */}
          <div className="w-full max-w-3xl rounded-2xl p-5 sm:p-6" style={{ background: "rgba(13,24,48,0.95)", border: "1px solid rgba(59,130,246,0.2)", boxShadow: "0 25px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.05)" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="lg:col-span-2">
                <label style={{ fontSize: "0.75rem", color: "#64748b", display: "block", marginBottom: "6px" }}>موقعیت مکانی</label>
                <div className="relative">
                  <MapPin size={16} className="absolute top-1/2 -translate-y-1/2" style={{ right: "12px", color: "#3b82f6" }} />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                    style={{ paddingRight: "36px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0" }}
                    placeholder="مثلاً تهران، میدان آزادی"
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#64748b", display: "block", marginBottom: "6px" }}>تاریخ</label>
                <div className="relative">
                  <Calendar size={16} className="absolute top-1/2 -translate-y-1/2" style={{ right: "12px", color: "#94a3b8" }} />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ paddingRight: "36px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0" }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#64748b", display: "block", marginBottom: "6px" }}>ساعت (از – تا)</label>
                <div className="flex items-center gap-2">
                  <input type="time" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-xl px-3 py-3 text-sm text-center outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0" }} />
                  <span style={{ color: "#64748b", fontSize: "0.8rem" }}>تا</span>
                  <input type="time" value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-xl px-3 py-3 text-sm text-center outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0" }} />
                </div>
              </div>
            </div>
            <Button
              className="w-full mt-4 h-12 text-base font-bold rounded-xl"
              style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", boxShadow: "0 8px 25px rgba(59,130,246,0.35)" }}
              onClick={() => onSearch({ location, date, from, to })}
            >
              <Search size={18} className="ml-2" />
              جستجوی پارکینگ
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 w-full max-w-2xl">
            {statItems.map((s) => (
              <div key={s.label} className="text-center">
                <div style={{ fontSize: "1.7rem", fontWeight: 800, color: "#f1f5f9", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "4px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4" style={{ background: "#070e1e" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.4rem)", fontWeight: 800, color: "#f1f5f9", marginBottom: "0.75rem" }}>چرا پارک‌یار؟</h2>
            <p style={{ color: "#64748b", fontSize: "0.95rem" }}>فناوری روز دنیا در خدمت امنیت و راحتی شما</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1" style={{ background: f.color, border: `1px solid ${f.border}` }}>
                <div className="mb-4">{f.icon}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#e2e8f0", marginBottom: "8px" }}>{f.title}</h3>
                <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4" style={{ background: "#060c1a" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.4rem)", fontWeight: 800, color: "#f1f5f9", marginBottom: "0.75rem" }}>چطور کار می‌کند؟</h2>
            <p style={{ color: "#64748b", fontSize: "0.95rem" }}>در ۴ قدم ساده پارکینگ رزرو کنید</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative text-center">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)" }} />
                )}
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center relative" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
                  <span style={{ color: "#3b82f6" }}>{step.icon}</span>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#3b82f6", fontSize: "0.7rem", fontWeight: 800, color: "white" }}>
                    {step.step}
                  </div>
                </div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#e2e8f0", marginBottom: "6px" }}>{step.title}</h3>
                <p style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scenarios */}
      <section className="py-16 px-4" style={{ background: "#070e1e" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center mb-10" style={{ fontSize: "clamp(1.3rem, 2.5vw, 2rem)", fontWeight: 800, color: "#f1f5f9" }}>دو روش مدیریت پارکینگ</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl" style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(6,182,212,0.15)" }}>
                  <Wifi size={20} style={{ color: "#06b6d4" }} />
                </div>
                <h3 style={{ fontWeight: 700, color: "#e2e8f0", fontSize: "1rem" }}>سناریو IoT هوشمند</h3>
              </div>
              <ul className="space-y-2" style={{ color: "#94a3b8", fontSize: "0.83rem" }}>
                <li className="flex items-start gap-2"><span style={{ color: "#06b6d4" }}>✓</span> اسکن خودکار QR کد توسط دوربین</li>
                <li className="flex items-start gap-2"><span style={{ color: "#06b6d4" }}>✓</span> شناسایی پلاک خودرو با هوش مصنوعی</li>
                <li className="flex items-start gap-2"><span style={{ color: "#06b6d4" }}>✓</span> باز شدن خودکار درب پارکینگ</li>
                <li className="flex items-start gap-2"><span style={{ color: "#06b6d4" }}>✓</span> ثبت لحظه‌ای ورود و خروج</li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl" style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.2)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(168,85,247,0.15)" }}>
                  <Shield size={20} style={{ color: "#a855f7" }} />
                </div>
                <h3 style={{ fontWeight: 700, color: "#e2e8f0", fontSize: "1rem" }}>سناریو مدیریت دستی</h3>
              </div>
              <ul className="space-y-2" style={{ color: "#94a3b8", fontSize: "0.83rem" }}>
                <li className="flex items-start gap-2"><span style={{ color: "#a855f7" }}>✓</span> تأیید ورود توسط نگهبان یا مالک</li>
                <li className="flex items-start gap-2"><span style={{ color: "#a855f7" }}>✓</span> اعلان آنی به اپراتور در برنامه</li>
                <li className="flex items-start gap-2"><span style={{ color: "#a855f7" }}>✓</span> تأیید یا رد درخواست ورود با یک کلیک</li>
                <li className="flex items-start gap-2"><span style={{ color: "#a855f7" }}>✓</span> ثبت دستی زمان ورود و خروج</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(6,182,212,0.06) 100%)", borderTop: "1px solid rgba(59,130,246,0.12)" }}>
        <div className="max-w-xl mx-auto text-center">
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#f1f5f9", marginBottom: "1rem" }}>مالک پارکینگ هستید؟</h2>
          <p style={{ color: "#94a3b8", marginBottom: "1.5rem", fontSize: "0.9rem", lineHeight: 1.8 }}>
            پارکینگ خود را در پلتفرم ثبت کنید و با هوشمندسازی آن درآمد بیشتری کسب نمایید
          </p>
          <Button className="h-12 px-8 text-base font-bold rounded-xl" style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", boxShadow: "0 8px 25px rgba(59,130,246,0.3)" }}>
            ثبت پارکینگ
            <ChevronLeft size={18} className="mr-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
