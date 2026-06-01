import { useState } from "react";
import { TrendingUp, Car, Clock, CheckCircle, XCircle, BarChart3, Users, Wifi, Shield, Bell, AlertTriangle, Settings, QrCode, Eye, ChevronRight } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "./ui/button";

const OCCUPANCY_DATA = [
  { time: "۰۶", value: 12 }, { time: "۰۷", value: 28 }, { time: "۰۸", value: 65 },
  { time: "۰۹", value: 82 }, { time: "۱۰", value: 75 }, { time: "۱۱", value: 70 },
  { time: "۱۲", value: 88 }, { time: "۱۳", value: 92 }, { time: "۱۴", value: 78 },
  { time: "۱۵", value: 55 }, { time: "۱۶", value: 45 }, { time: "۱۷", value: 72 },
  { time: "۱۸", value: 95 }, { time: "۱۹", value: 80 }, { time: "۲۰", value: 50 },
];

const REVENUE_DATA = [
  { day: "شن", revenue: 450000 }, { day: "یک", revenue: 620000 }, { day: "دو", revenue: 380000 },
  { day: "سه", revenue: 750000 }, { day: "چهار", revenue: 820000 }, { day: "پنج", revenue: 1100000 }, { day: "جمع", revenue: 980000 },
];

const ENTRY_LOG = [
  { id: 1, time: "۱۳:۴۵", plate: "۴۵ب۱۲۳ ت", driver: "علی رضایی", status: "entered", type: "iot" },
  { id: 2, time: "۱۳:۲۱", plate: "۷۸ج۴۵۶ ن", driver: "مریم کریمی", status: "exited", type: "iot" },
  { id: 3, time: "۱۳:۱۲", plate: "۲۳د۷۸۹ م", driver: "حسن محمدی", status: "pending", type: "manual" },
  { id: 4, time: "۱۲:۵۸", plate: "۹۰ه۰۱۲ ک", driver: "زهرا احمدی", status: "entered", type: "manual" },
  { id: 5, time: "۱۲:۴۴", plate: "۵۶و۳۴۵ ص", driver: "محمد تهرانی", status: "exited", type: "iot" },
];

const STATUS_LOG = {
  entered: { label: "ورود", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  exited: { label: "خروج", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  pending: { label: "در انتظار", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
};

const PARKINGS = [
  { id: 1, name: "پارکینگ آزادی", spaces: 20, occupied: 15, revenue: 2450000, type: "iot", status: "active" },
  { id: 2, name: "پارکینگ مرکزی", spaces: 35, occupied: 28, revenue: 3890000, type: "manual", status: "active" },
  { id: 3, name: "پارکینگ شعبه شمال", spaces: 15, occupied: 4, revenue: 980000, type: "iot", status: "maintenance" },
];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#0d1830", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "10px", padding: "8px 12px", fontSize: "0.75rem", color: "#e2e8f0" }}>
        <div style={{ color: "#64748b", marginBottom: "2px" }}>{label}</div>
        <div style={{ color: "#3b82f6", fontWeight: 700 }}>{payload[0].value?.toLocaleString("fa-IR")}</div>
      </div>
    );
  }
  return null;
}

export default function OwnerPortal({ onVerify }: { onVerify: () => void }) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "entries" | "settings">("dashboard");
  const [pendingAction, setPendingAction] = useState<{ [id: number]: "approved" | "rejected" | null }>({});

  const handleAction = (id: number, action: "approved" | "rejected") => {
    setPendingAction((prev) => ({ ...prev, [id]: action }));
  };

  return (
    <div dir="rtl" className="min-h-screen" style={{ background: "#060c1a", fontFamily: "'Vazirmatn', Tahoma, sans-serif" }}>
      {/* Header */}
      <div className="px-6 py-6" style={{ background: "rgba(7,14,32,0.95)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "2px" }}>پورتال مالکین</h1>
            <p style={{ color: "#64748b", fontSize: "0.8rem" }}>خوش آمدید، محمد رضایی</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell size={18} style={{ color: "#64748b", cursor: "pointer" }} />
              <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#ef4444", fontSize: "0.55rem", color: "white" }}>۳</div>
            </div>
            <Button
              onClick={onVerify}
              className="text-sm px-4 py-2 h-9 rounded-xl"
              style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b" }}
            >
              <AlertTriangle size={14} className="ml-1.5" />
              ثبت پارکینگ جدید
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[{ id: "dashboard", label: "داشبورد", icon: <BarChart3 size={15} /> }, { id: "entries", label: "ورود و خروج", icon: <Car size={15} /> }, { id: "settings", label: "تنظیمات", icon: <Settings size={15} /> }].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activeTab === t.id ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${activeTab === t.id ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.07)"}`,
                color: activeTab === t.id ? "#3b82f6" : "#64748b",
              }}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "درآمد امروز", value: "۷,۳۲۰,۰۰۰", sub: "تومان", color: "#10b981", icon: <TrendingUp size={18} /> },
                { label: "رزرو فعال", value: "۴۸", sub: "از ۷۰ جا", color: "#3b82f6", icon: <Car size={18} /> },
                { label: "کاربران امروز", value: "۳۶", sub: "نفر", color: "#a855f7", icon: <Users size={18} /> },
                { label: "درآمد این هفته", value: "۵,۰۰۰,۰۰۰+", sub: "تومان", color: "#f59e0b", icon: <BarChart3 size={18} /> },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-2xl" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span style={{ color: "#64748b", fontSize: "0.78rem" }}>{s.label}</span>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18`, color: s.color }}>{s.icon}</div>
                  </div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f1f5f9" }}>{s.value}</div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <h3 style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.9rem", marginBottom: "16px" }}>اشغال امروز (درصد)</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={OCCUPANCY_DATA}>
                    <defs>
                      <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#occGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="p-5 rounded-2xl" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <h3 style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.9rem", marginBottom: "16px" }}>درآمد هفتگی (تومان)</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Parking list */}
            <div className="p-5 rounded-2xl" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.9rem", marginBottom: "16px" }}>پارکینگ‌های من</h3>
              <div className="space-y-3">
                {PARKINGS.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: p.type === "iot" ? "rgba(6,182,212,0.12)" : "rgba(168,85,247,0.12)", color: p.type === "iot" ? "#22d3ee" : "#c084fc" }}>
                      {p.type === "iot" ? <Wifi size={16} /> : <Shield size={16} />}
                    </div>
                    <div className="flex-1">
                      <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: "0.88rem" }}>{p.name}</div>
                      <div style={{ color: "#64748b", fontSize: "0.75rem" }}>{p.occupied}/{p.spaces} پر | {p.revenue.toLocaleString("fa-IR")} ت درآمد امروز</div>
                    </div>
                    <div className="text-left">
                      <div className="px-2 py-0.5 rounded-full text-xs mb-1" style={{ background: p.status === "active" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)", color: p.status === "active" ? "#10b981" : "#f59e0b", border: `1px solid ${p.status === "active" ? "rgba(16,185,129,0.25)" : "rgba(245,158,11,0.25)"}` }}>
                        {p.status === "active" ? "فعال" : "تعمیر"}
                      </div>
                    </div>
                    <div className="w-24 hidden sm:block">
                      <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div className="h-full rounded-full" style={{ width: `${(p.occupied / p.spaces) * 100}%`, background: p.occupied / p.spaces > 0.8 ? "#ef4444" : "#10b981" }} />
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#64748b" }}>{Math.round((p.occupied / p.spaces) * 100)}٪ اشغال</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "entries" && (
          <div className="space-y-6">
            {/* Manual pending */}
            <div className="p-5 rounded-2xl" style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={16} style={{ color: "#f59e0b" }} />
                <h3 style={{ color: "#f59e0b", fontWeight: 700, fontSize: "0.9rem" }}>درخواست‌های در انتظار تأیید</h3>
                <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>۱</span>
              </div>
              {ENTRY_LOG.filter((e) => e.status === "pending").map((entry) => (
                <div key={entry.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div>
                    <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: "0.88rem", marginBottom: "2px" }}>{entry.driver}</div>
                    <div className="flex items-center gap-2" style={{ fontSize: "0.75rem" }}>
                      <span style={{ background: "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: "6px", color: "#e2e8f0", fontFamily: "monospace", direction: "ltr" }}>{entry.plate}</span>
                      <span style={{ color: "#64748b" }}>{entry.time}</span>
                      <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(168,85,247,0.12)", color: "#c084fc", fontSize: "0.7rem" }}>دستی</span>
                    </div>
                  </div>
                  <div className="flex-1" />
                  {pendingAction[entry.id] ? (
                    <div className="flex items-center gap-2" style={{ color: pendingAction[entry.id] === "approved" ? "#10b981" : "#ef4444", fontSize: "0.82rem" }}>
                      {pendingAction[entry.id] === "approved" ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      {pendingAction[entry.id] === "approved" ? "تأیید شد" : "رد شد"}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={() => handleAction(entry.id, "approved")} className="h-9 px-4 rounded-xl text-sm font-bold" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981" }}>
                        <CheckCircle size={14} className="ml-1.5" />
                        تأیید
                      </Button>
                      <Button onClick={() => handleAction(entry.id, "rejected")} className="h-9 px-4 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}>
                        <XCircle size={14} className="ml-1.5" />
                        رد
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Full log */}
            <div className="p-5 rounded-2xl" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.9rem", marginBottom: "16px" }}>گزارش ورود و خروج امروز</h3>
              <div className="space-y-2">
                {ENTRY_LOG.map((entry) => {
                  const st = STATUS_LOG[entry.status];
                  return (
                    <div key={entry.id} className="flex items-center gap-4 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
                      <div className="px-2 py-1 rounded-lg text-xs" style={{ background: st.bg, color: st.color, minWidth: "60px", textAlign: "center" }}>{st.label}</div>
                      <span style={{ color: "#94a3b8", fontSize: "0.8rem", fontFamily: "monospace", direction: "ltr" }}>{entry.plate}</span>
                      <span style={{ color: "#64748b", fontSize: "0.78rem" }}>{entry.driver}</span>
                      <div className="flex-1" />
                      <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: entry.type === "iot" ? "rgba(6,182,212,0.1)" : "rgba(168,85,247,0.1)", color: entry.type === "iot" ? "#22d3ee" : "#c084fc" }}>
                        {entry.type === "iot" ? "IoT" : "دستی"}
                      </span>
                      <span style={{ color: "#64748b", fontSize: "0.75rem" }}>{entry.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-lg space-y-4">
            {[
              { label: "تنظیمات قیمت‌گذاری پویا", desc: "افزایش خودکار قیمت هنگام تقاضای بالا", active: true },
              { label: "اعلان‌های SMS", desc: "ارسال پیام کوتاه برای هر ورود و خروج", active: false },
              { label: "تأیید خودکار IoT", desc: "باز شدن خودکار درب بدون نیاز به تأیید", active: true },
              { label: "گزارش روزانه", desc: "ارسال گزارش درآمد روزانه به ایمیل", active: true },
            ].map((setting) => (
              <div key={setting.label} className="flex items-center justify-between p-4 rounded-2xl" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div>
                  <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "0.88rem" }}>{setting.label}</div>
                  <div style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "2px" }}>{setting.desc}</div>
                </div>
                <div className="w-12 h-6 rounded-full relative cursor-pointer transition-colors" style={{ background: setting.active ? "#3b82f6" : "rgba(255,255,255,0.1)" }}>
                  <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: setting.active ? "translateX(24px)" : "translateX(2px)", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
