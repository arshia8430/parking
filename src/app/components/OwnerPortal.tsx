import { useEffect, useState } from "react";
import { AlertCircle, BarChart3, Bell, Car, CheckCircle, Loader2, RefreshCw, Settings, Shield, Wifi, XCircle } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "./ui/button";
import { parkingApi } from "../services/api";
import type { OwnerDashboard, OwnerEntryLog } from "../types/parking";

const TONE_COLORS = {
  blue: "#3b82f6",
  green: "#10b981",
  amber: "#f59e0b",
  slate: "#64748b",
};

const STATUS_LOG = {
  entered: { label: "ورود", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  exited: { label: "خروج", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  pending: { label: "در انتظار", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
};

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

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#94a3b8" }}>
      <AlertCircle className="mx-auto mb-3" style={{ color: "#1e3a5f" }} />
      <h3 className="mb-2 font-bold text-white">{title}</h3>
      <p className="text-sm leading-7">{description}</p>
    </div>
  );
}

export default function OwnerPortal({ onVerify }: { onVerify: () => void }) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "entries" | "settings">("dashboard");
  const [dashboard, setDashboard] = useState<OwnerDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{ [id: string]: "approved" | "rejected" | null }>({});

  const loadDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setDashboard(await parkingApi.getOwnerDashboard());
    } catch (err) {
      setDashboard(null);
      setError(err instanceof Error ? err.message : "خطا در دریافت داشبورد مالک");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const handleAction = (id: string, action: "approved" | "rejected") => {
    setPendingAction((prev) => ({ ...prev, [id]: action }));
  };

  const pendingEntries = (dashboard?.entries ?? []).filter((entry) => entry.status === "pending");

  return (
    <div dir="rtl" className="min-h-screen" style={{ background: "#060c1a", fontFamily: "'Vazirmatn', Tahoma, sans-serif" }}>
      <div className="px-6 py-6" style={{ background: "rgba(7,14,32,0.95)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "2px" }}>داشبورد مالک</h1>
            <p style={{ color: "#64748b", fontSize: "0.8rem" }}>اطلاعات این صفحه از API مالک دریافت می‌شود.</p>
          </div>
          <div className="flex items-center gap-3">
            <Bell size={18} style={{ color: "#64748b" }} />
            <Button onClick={onVerify} className="h-9 rounded-xl px-4 py-2 text-sm" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b" }}>
              ثبت پارکینگ جدید
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
          {[{ id: "dashboard", label: "داشبورد", icon: <BarChart3 size={15} /> }, { id: "entries", label: "ورود و خروج", icon: <Car size={15} /> }, { id: "settings", label: "تنظیمات", icon: <Settings size={15} /> }].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className="flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all" style={{ background: activeTab === tab.id ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${activeTab === tab.id ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.07)"}`, color: activeTab === tab.id ? "#3b82f6" : "#64748b" }}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)", color: "#94a3b8" }}>
            <Loader2 className="mx-auto mb-3 animate-spin" style={{ color: "#3b82f6" }} />
            در حال دریافت داشبورد مالک...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", color: "#fbbf24" }}>
            <AlertCircle className="mx-auto mb-3" />
            <p className="mb-4 text-sm leading-7">{error}</p>
            <Button onClick={loadDashboard} className="gap-2" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}><RefreshCw size={15} />تلاش مجدد</Button>
          </div>
        )}

        {!isLoading && !error && dashboard && activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {dashboard.metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl p-5" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: TONE_COLORS[metric.tone] }}>{typeof metric.value === "number" ? metric.value.toLocaleString("fa-IR") : metric.value}</div>
                  <div style={{ color: "#64748b", fontSize: "0.78rem", marginTop: "4px" }}>{metric.label}</div>
                </div>
              ))}
            </div>

            {dashboard.metrics.length === 0 && <EmptyState title="داده‌ای برای داشبورد وجود ندارد" description="پس از اتصال بک‌اند، شاخص‌های مالک در این بخش نمایش داده می‌شوند." />}

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl p-5" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <h3 style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.9rem", marginBottom: "16px" }}>نرخ اشغال</h3>
                {dashboard.occupancy.length ? (
                  <div className="h-56"><ResponsiveContainer width="100%" height="100%"><AreaChart data={dashboard.occupancy}><XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} /><Tooltip content={<CustomTooltip />} /><Area type="monotone" dataKey="value" stroke="#3b82f6" fill="rgba(59,130,246,0.18)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div>
                ) : <EmptyState title="نمودار اشغال خالی است" description="داده ساعتی اشغال از API مالک دریافت نشده است." />}
              </div>
              <div className="rounded-2xl p-5" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <h3 style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.9rem", marginBottom: "16px" }}>درآمد</h3>
                {dashboard.revenue.length ? (
                  <div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={dashboard.revenue}><XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} /><Tooltip content={<CustomTooltip />} /><Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
                ) : <EmptyState title="نمودار درآمد خالی است" description="داده درآمد از API مالک دریافت نشده است." />}
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.9rem", marginBottom: "16px" }}>پارکینگ‌های من</h3>
              <div className="space-y-3">
                {dashboard.parkings.map((parking) => (
                  <div key={parking.id} className="flex items-center gap-4 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: parking.type === "iot" ? "rgba(6,182,212,0.12)" : "rgba(168,85,247,0.12)", color: parking.type === "iot" ? "#22d3ee" : "#c084fc" }}>{parking.type === "iot" ? <Wifi size={16} /> : <Shield size={16} />}</div>
                    <div className="flex-1"><div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: "0.88rem" }}>{parking.name}</div><div style={{ color: "#64748b", fontSize: "0.75rem" }}>{parking.occupied.toLocaleString("fa-IR")}/{parking.spaces.toLocaleString("fa-IR")} پر | {parking.revenue.toLocaleString("fa-IR")} تومان</div></div>
                    <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: parking.status === "active" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)", color: parking.status === "active" ? "#10b981" : "#f59e0b", border: `1px solid ${parking.status === "active" ? "rgba(16,185,129,0.25)" : "rgba(245,158,11,0.25)"}` }}>{parking.status === "active" ? "فعال" : parking.status === "maintenance" ? "تعمیر" : "غیرفعال"}</span>
                  </div>
                ))}
              </div>
              {dashboard.parkings.length === 0 && <EmptyState title="پارکینگی ثبت نشده است" description="برای ثبت اولین پارکینگ از دکمه ثبت پارکینگ جدید استفاده کنید." />}
            </div>
          </div>
        )}

        {!isLoading && !error && dashboard && activeTab === "entries" && (
          <div className="space-y-6">
            <EntryList title="درخواست‌های در انتظار تأیید" entries={pendingEntries} pendingAction={pendingAction} onAction={handleAction} />
            <EntryList title="آخرین ورود و خروج‌ها" entries={dashboard.entries} pendingAction={pendingAction} onAction={handleAction} />
          </div>
        )}

        {!isLoading && !error && activeTab === "settings" && <EmptyState title="تنظیمات از API دریافت می‌شود" description="پس از آماده شدن endpoint تنظیمات، فرم‌های مربوط به مالک اینجا نمایش داده می‌شود." />}
      </div>
    </div>
  );
}

function EntryList({ title, entries, pendingAction, onAction }: { title: string; entries: OwnerEntryLog[]; pendingAction: { [id: string]: "approved" | "rejected" | null }; onAction: (id: string, action: "approved" | "rejected") => void }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <h3 style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.9rem", marginBottom: "16px" }}>{title}</h3>
      <div className="space-y-3">
        {entries.map((entry) => {
          const status = STATUS_LOG[entry.status];
          return (
            <div key={entry.id} className="flex flex-wrap items-center gap-4 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="min-w-0 flex-1">
                <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: "0.88rem", marginBottom: "2px" }}>{entry.driver || "راننده"}</div>
                <div className="flex flex-wrap items-center gap-2" style={{ fontSize: "0.75rem" }}>
                  {entry.plate && <span style={{ background: "rgba(255,255,255,0.08)", padding: "2px 8px", borderRadius: "6px", color: "#e2e8f0", fontFamily: "monospace", direction: "ltr" }}>{entry.plate}</span>}
                  <span style={{ color: "#64748b" }}>{entry.time}</span>
                  <span className="rounded-full px-2 py-0.5" style={{ background: status.bg, color: status.color, fontSize: "0.7rem" }}>{status.label}</span>
                </div>
              </div>
              {entry.status === "pending" && (pendingAction[entry.id] ? (
                <div className="flex items-center gap-2" style={{ color: pendingAction[entry.id] === "approved" ? "#10b981" : "#ef4444", fontSize: "0.82rem" }}>{pendingAction[entry.id] === "approved" ? <CheckCircle size={16} /> : <XCircle size={16} />}{pendingAction[entry.id] === "approved" ? "تأیید شد" : "رد شد"}</div>
              ) : (
                <div className="flex gap-2"><Button onClick={() => onAction(entry.id, "approved")} className="h-9 rounded-xl px-4 text-sm font-bold" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981" }}>تأیید</Button><Button onClick={() => onAction(entry.id, "rejected")} className="h-9 rounded-xl px-4 text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}>رد</Button></div>
              ))}
            </div>
          );
        })}
      </div>
      {entries.length === 0 && <EmptyState title="رکوردی وجود ندارد" description="وقتی داده‌ای از API برسد، در این لیست نمایش داده می‌شود." />}
    </div>
  );
}
