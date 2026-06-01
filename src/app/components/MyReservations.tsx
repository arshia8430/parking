import { useEffect, useMemo, useState } from "react";
import { QrCode, MapPin, Clock, ChevronDown, Calendar, X, CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { parkingApi } from "../services/api";
import type { Reservation } from "../types/parking";

interface MyReservationsProps {
  onShowQR: (r: Reservation) => void;
}

const STATUS_CONFIG = {
  active: { label: "فعال", color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", icon: <CheckCircle size={13} /> },
  upcoming: { label: "آینده", color: "#3b82f6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.25)", icon: <Clock size={13} /> },
  completed: { label: "پایان‌یافته", color: "#64748b", bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.2)", icon: <CheckCircle size={13} /> },
  cancelled: { label: "لغو شده", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", icon: <XCircle size={13} /> },
};

export default function MyReservations({ onShowQR }: MyReservationsProps) {
  const [filter, setFilter] = useState<"all" | "active" | "upcoming" | "completed" | "cancelled">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReservations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setReservations(await parkingApi.getReservations());
    } catch (err) {
      setReservations([]);
      setError(err instanceof Error ? err.message : "خطا در دریافت رزروها");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadReservations();
  }, []);

  const filtered = useMemo(() => filter === "all" ? reservations : reservations.filter((r) => r.status === filter), [filter, reservations]);

  const counts = useMemo(() => ({
    all: reservations.length,
    active: reservations.filter((r) => r.status === "active").length,
    upcoming: reservations.filter((r) => r.status === "upcoming").length,
    completed: reservations.filter((r) => r.status === "completed").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
  }), [reservations]);

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
            { label: "کل رزرو", value: reservations.length, color: "#3b82f6" },
            { label: "رزرو فعال", value: counts.active, color: "#10b981" },
            { label: "تکمیل‌شده", value: counts.completed, color: "#64748b" },
            { label: "مجموع پرداخت", value: `${(reservations.filter(r => r.status !== "cancelled").reduce((sum, r) => sum + r.total, 0) / 10000).toFixed(0)}۰ هزار`, color: "#f59e0b" },
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

        {isLoading && (
          <div className="rounded-2xl p-6 flex items-center justify-center gap-3" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)", color: "#94a3b8" }}>
            <Loader2 size={18} className="animate-spin" style={{ color: "#3b82f6" }} />
            در حال دریافت رزروها...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", color: "#fbbf24" }}>
            <AlertCircle className="mx-auto mb-3" />
            <p className="mb-4 text-sm leading-7">{error}</p>
            <Button onClick={loadReservations} className="gap-2" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}><RefreshCw size={15} />تلاش مجدد</Button>
          </div>
        )}

        {/* Reservations list */}
        {!isLoading && !error && <div className="space-y-3">
          {filtered.map((res) => {
            const st = STATUS_CONFIG[res.status];
            const isExpanded = expandedId === res.id;
            return (
              <div key={res.id} className="rounded-2xl overflow-hidden" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)", transition: "border-color 0.2s" }}>
                {/* Main row */}
                <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : res.id)}>
                  <img src={res.parking.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 120'%3E%3Crect width='160' height='120' fill='%23070e1e'/%3E%3Ctext x='80' y='66' text-anchor='middle' fill='%2394a3b8' font-size='18' font-family='Arial'%3EP%3C/text%3E%3C/svg%3E"} alt={res.parking.name} className="w-16 h-14 rounded-xl object-cover shrink-0" style={{ filter: "brightness(0.65)" }} />
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
        </div>}

        {!isLoading && !error && filtered.length === 0 && (
          <div className="text-center py-16">
            <AlertCircle size={40} className="mx-auto mb-4" style={{ color: "#1e3a5f" }} />
            <div style={{ color: "#64748b" }}>رزروی در این دسته‌بندی وجود ندارد</div>
          </div>
        )}
      </div>
    </div>
  );
}
