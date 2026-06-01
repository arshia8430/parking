import { useState } from "react";
import { QrCode, MapPin, Clock, ChevronDown, Calendar, X, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import type { Parking } from "./MapView";

interface Reservation {
  id: string;
  parking: Parking;
  date: string;
  from: string;
  to: string;
  total: number;
  status: "active" | "upcoming" | "completed" | "cancelled";
}

interface MyReservationsProps {
  parkings: Parking[];
  onShowQR: (r: Reservation) => void;
}

const STATUS_CONFIG = {
  active: { label: "فعال", color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", icon: <CheckCircle size={13} /> },
  upcoming: { label: "آینده", color: "#3b82f6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.25)", icon: <Clock size={13} /> },
  completed: { label: "پایان‌یافته", color: "#64748b", bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.2)", icon: <CheckCircle size={13} /> },
  cancelled: { label: "لغو شده", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", icon: <XCircle size={13} /> },
};

export default function MyReservations({ parkings, onShowQR }: MyReservationsProps) {
  const [filter, setFilter] = useState<"all" | "active" | "upcoming" | "completed" | "cancelled">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const RESERVATIONS: Reservation[] = [
    { id: "RES-001", parking: parkings[0], date: "۱۴۰۳/۱۰/۱۵", from: "۰۹:۰۰", to: "۱۳:۰۰", total: 100000, status: "active" },
    { id: "RES-002", parking: parkings[1], date: "۱۴۰۳/۱۰/۱۷", from: "۱۰:۰۰", to: "۱۴:۰۰", total: 140000, status: "upcoming" },
    { id: "RES-003", parking: parkings[2], date: "۱۴۰۳/۱۰/۱۲", from: "۰۸:۰۰", to: "۱۲:۰۰", total: 88000, status: "completed" },
    { id: "RES-004", parking: parkings[3], date: "۱۴۰۳/۱۰/۱۰", from: "۱۲:۰۰", to: "۱۶:۰۰", total: 135000, status: "completed" },
    { id: "RES-005", parking: parkings[4], date: "۱۴۰۳/۱۰/۰۸", from: "۱۸:۰۰", to: "۲۰:۰۰", total: 56000, status: "cancelled" },
  ];

  const filtered = filter === "all" ? RESERVATIONS : RESERVATIONS.filter((r) => r.status === filter);

  const counts = {
    all: RESERVATIONS.length,
    active: RESERVATIONS.filter((r) => r.status === "active").length,
    upcoming: RESERVATIONS.filter((r) => r.status === "upcoming").length,
    completed: RESERVATIONS.filter((r) => r.status === "completed").length,
    cancelled: RESERVATIONS.filter((r) => r.status === "cancelled").length,
  };

  return (
    <div dir="rtl" className="min-h-screen py-8 px-4" style={{ background: "#060c1a", fontFamily: "'Vazirmatn', Tahoma, sans-serif" }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "6px" }}>رزروهای من</h1>
          <p style={{ color: "#64748b", fontSize: "0.85rem" }}>تاریخچه و وضعیت رزروهای پارکینگ شما</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "کل رزرو", value: RESERVATIONS.length, color: "#3b82f6" },
            { label: "رزرو فعال", value: counts.active, color: "#10b981" },
            { label: "تکمیل‌شده", value: counts.completed, color: "#64748b" },
            { label: "مجموع پرداخت", value: `${(RESERVATIONS.filter(r => r.status !== "cancelled").reduce((s, r) => s + r.total, 0) / 10000).toFixed(0)}۰ هزار`, color: "#f59e0b" },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-2xl" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: "1.3rem", fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: "none" }}>
          {(["all", "active", "upcoming", "completed", "cancelled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: filter === f ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${filter === f ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.07)"}`,
                color: filter === f ? "#3b82f6" : "#64748b",
              }}
            >
              {f === "all" ? "همه" : STATUS_CONFIG[f].label}
              <span className="mr-2 px-1.5 py-0.5 rounded-md text-xs" style={{ background: "rgba(255,255,255,0.07)", color: "#64748b" }}>{counts[f]}</span>
            </button>
          ))}
        </div>

        {/* Reservations list */}
        <div className="space-y-3">
          {filtered.map((res) => {
            const st = STATUS_CONFIG[res.status];
            const isExpanded = expandedId === res.id;
            return (
              <div key={res.id} className="rounded-2xl overflow-hidden" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)", transition: "border-color 0.2s" }}>
                {/* Main row */}
                <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : res.id)}>
                  <img src={res.parking.imageUrl} alt={res.parking.name} className="w-16 h-14 rounded-xl object-cover shrink-0" style={{ filter: "brightness(0.65)" }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "0.9rem" }}>{res.parking.name}</span>
                      <span className="px-2 py-0.5 rounded-full flex items-center gap-1 text-xs" style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.color }}>
                        {st.icon}{st.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap" style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      <span className="flex items-center gap-1"><Calendar size={11} />{res.date}</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{res.from} – {res.to}</span>
                    </div>
                  </div>
                  <div className="text-left shrink-0 flex items-center gap-3">
                    <div style={{ textAlign: "left" }}>
                      <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "0.9rem" }}>{res.total.toLocaleString("fa-IR")}</div>
                      <div style={{ color: "#64748b", fontSize: "0.7rem" }}>تومان</div>
                    </div>
                    <ChevronDown size={16} style={{ color: "#64748b", transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div className="px-4 pb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="pt-4 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2" style={{ fontSize: "0.78rem", color: "#64748b" }}>
                        <MapPin size={12} />
                        {res.parking.address}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#475569" }}>شناسه: {res.id}</div>
                    </div>
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {(res.status === "active" || res.status === "upcoming") && (
                        <Button
                          className="flex items-center gap-2 px-4 py-2 h-9 rounded-xl text-sm font-bold"
                          style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}
                          onClick={() => onShowQR(res)}
                        >
                          <QrCode size={15} />
                          نمایش QR کد
                        </Button>
                      )}
                      {res.status === "completed" && (
                        <Button variant="outline" className="flex items-center gap-2 px-4 py-2 h-9 rounded-xl text-sm" style={{ border: "1px solid rgba(59,130,246,0.3)", color: "#3b82f6", background: "rgba(59,130,246,0.06)" }}>
                          رزرو مجدد
                        </Button>
                      )}
                      {(res.status === "upcoming") && (
                        <Button variant="outline" className="flex items-center gap-2 px-4 py-2 h-9 rounded-xl text-sm" style={{ border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", background: "rgba(239,68,68,0.06)" }}>
                          <X size={14} />
                          لغو رزرو
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <AlertCircle size={40} className="mx-auto mb-4" style={{ color: "#1e3a5f" }} />
            <div style={{ color: "#64748b" }}>رزروی در این دسته‌بندی وجود ندارد</div>
          </div>
        )}
      </div>
    </div>
  );
}
