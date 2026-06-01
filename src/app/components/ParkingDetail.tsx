import { useState } from "react";
import { ArrowRight, Star, MapPin, Clock, Wifi, Shield, Zap, Car, Check, TrendingUp, AlertTriangle, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import type { BookingDraft, Parking, SearchRequest } from "../types/parking";

interface ParkingDetailProps {
  parking: Parking;
  onBack: () => void;
  searchParams: SearchRequest;
  onBook: (booking: BookingDraft) => void;
}

const TIME_SLOTS = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
const BUSY_SLOTS = ["08:00", "09:00", "12:00", "13:00", "17:00", "18:00"];
const UNAVAILABLE_SLOTS: string[] = [];

export default function ParkingDetail({ parking, searchParams, onBack, onBook }: ParkingDetailProps) {
  const [fromSlot, setFromSlot] = useState(searchParams.from || "10:00");
  const [toSlot, setToSlot] = useState(searchParams.to || "14:00");
  const [date, setDate] = useState(searchParams.date || new Date().toISOString().slice(0, 10));

  const fromIdx = TIME_SLOTS.indexOf(fromSlot);
  const toIdx = TIME_SLOTS.indexOf(toSlot);
  const hours = Math.max(0, toIdx - fromIdx);
  const isSurge = BUSY_SLOTS.includes(fromSlot) || parking.surgeMultiplier > 1;
  const effectivePrice = parking.price * (isSurge ? parking.surgeMultiplier : 1);
  const total = hours * effectivePrice;

  const AMENITIES = [
    { icon: <Wifi size={16} />, label: "اینترنت IoT", active: parking.type === "iot" },
    { icon: <Shield size={16} />, label: "دوربین امنیتی", active: true },
    { icon: <Zap size={16} />, label: "شارژ برقی", active: parking.hasEv },
    { icon: <Car size={16} />, label: "سرپوشیده", active: parking.covered },
    { icon: <Clock size={16} />, label: "۲۴ ساعته", active: true },
    { icon: <Check size={16} />, label: "شناسایی پلاک", active: parking.type === "iot" },
  ];

  return (
    <div dir="rtl" className="min-h-screen" style={{ background: "#060c1a", fontFamily: "'Vazirmatn', Tahoma, sans-serif" }}>
      {/* Hero image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={parking.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23070e1e'/%3E%3Cpath d='M120 260h560v70H120zM190 170h420l55 90H135z' fill='%231e3a5f'/%3E%3Ccircle cx='250' cy='330' r='38' fill='%233b82f6'/%3E%3Ccircle cx='550' cy='330' r='38' fill='%233b82f6'/%3E%3Ctext x='400' y='120' text-anchor='middle' fill='%2394a3b8' font-size='34' font-family='Arial'%3EParking%3C/text%3E%3C/svg%3E"}
          alt={parking.name}
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.55)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #060c1a 0%, transparent 50%)" }} />
        <button
          onClick={onBack}
          className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          style={{ background: "rgba(6,12,26,0.8)", border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0" }}
        >
          <ArrowRight size={16} />
          بازگشت
        </button>
        {/* Type badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: parking.type === "iot" ? "rgba(6,182,212,0.2)" : "rgba(168,85,247,0.2)", border: `1px solid ${parking.type === "iot" ? "rgba(6,182,212,0.4)" : "rgba(168,85,247,0.4)"}`, color: parking.type === "iot" ? "#22d3ee" : "#c084fc" }}>
          {parking.type === "iot" ? <Wifi size={14} /> : <Shield size={14} />}
          <span style={{ fontSize: "0.78rem" }}>{parking.type === "iot" ? "سیستم IoT هوشمند" : "مدیریت دستی"}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left - Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "6px" }}>{parking.name}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1" style={{ color: "#64748b", fontSize: "0.82rem" }}>
                  <MapPin size={13} />
                  <span>{parking.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={13} fill={s <= Math.round(parking.rating) ? "#f59e0b" : "none"} style={{ color: "#f59e0b" }} />
                  ))}
                  <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>{parking.rating} ({parking.reviews} نظر)</span>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="p-4 rounded-2xl" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>ظرفیت موجود</span>
                <span style={{ fontWeight: 700, color: parking.available > 5 ? "#3b82f6" : parking.available > 2 ? "#f59e0b" : "#ef4444", fontSize: "0.9rem" }}>
                  {parking.available} از {parking.total} جای خالی
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full" style={{ width: `${(parking.available / parking.total) * 100}%`, background: parking.available > 5 ? "#3b82f6" : parking.available > 2 ? "#f59e0b" : "#ef4444", transition: "width 0.5s" }} />
              </div>
            </div>

            {/* Surge warning */}
            {parking.surgeMultiplier > 1 && (
              <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}>
                <AlertTriangle size={18} style={{ color: "#f59e0b", marginTop: "2px", shrink: 0 }} />
                <div>
                  <div style={{ color: "#f59e0b", fontWeight: 600, fontSize: "0.88rem", marginBottom: "4px" }}>افزایش قیمت فعال است</div>
                  <div style={{ color: "#94a3b8", fontSize: "0.8rem", lineHeight: 1.6 }}>
                    به دلیل تقاضای بالا یا مراجعه دیرهنگام، قیمت ×{parking.surgeMultiplier} اعمال می‌شود.
                    برای ساعت‌های کم‌ترافیک تخفیف دریافت کنید.
                  </div>
                </div>
              </div>
            )}

            {/* Time slots */}
            <div>
              <h3 style={{ color: "#e2e8f0", fontWeight: 700, marginBottom: "12px", fontSize: "0.95rem" }}>انتخاب ساعت (امروز)</h3>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((slot) => {
                  const unavail = UNAVAILABLE_SLOTS.includes(slot);
                  const busy = BUSY_SLOTS.includes(slot);
                  const isFrom = slot === fromSlot;
                  const isTo = slot === toSlot;
                  const inRange = TIME_SLOTS.indexOf(slot) > TIME_SLOTS.indexOf(fromSlot) && TIME_SLOTS.indexOf(slot) < TIME_SLOTS.indexOf(toSlot);

                  return (
                    <button
                      key={slot}
                      disabled={unavail}
                      onClick={() => {
                        if (!fromSlot || (fromSlot && toSlot)) {
                          setFromSlot(slot);
                          setToSlot("");
                        } else {
                          if (TIME_SLOTS.indexOf(slot) > TIME_SLOTS.indexOf(fromSlot)) setToSlot(slot);
                          else { setFromSlot(slot); setToSlot(""); }
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: unavail ? "rgba(255,255,255,0.03)" : isFrom || isTo ? "#3b82f6" : inRange ? "rgba(59,130,246,0.15)" : busy ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${unavail ? "rgba(255,255,255,0.04)" : isFrom || isTo ? "#3b82f6" : inRange ? "rgba(59,130,246,0.3)" : busy ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.08)"}`,
                        color: unavail ? "#2d3748" : isFrom || isTo ? "white" : busy ? "#f59e0b" : "#94a3b8",
                        cursor: unavail ? "not-allowed" : "pointer",
                        textDecoration: unavail ? "line-through" : "none",
                      }}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-3" style={{ fontSize: "0.72rem", color: "#64748b" }}>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: "#3b82f6", display: "inline-block" }} />انتخاب شما</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", display: "inline-block" }} />ساعت شلوغ</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: "rgba(255,255,255,0.03)", display: "inline-block" }} />ناموجود</div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 style={{ color: "#e2e8f0", fontWeight: 700, marginBottom: "12px", fontSize: "0.95rem" }}>امکانات</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {AMENITIES.map((a) => (
                  <div key={a.label} className="flex flex-col items-center gap-2 p-3 rounded-xl" style={{ background: a.active ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${a.active ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.05)"}`, opacity: a.active ? 1 : 0.4 }}>
                    <span style={{ color: a.active ? "#3b82f6" : "#64748b" }}>{a.icon}</span>
                    <span style={{ fontSize: "0.65rem", color: a.active ? "#94a3b8" : "#475569", textAlign: "center" }}>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Booking Card */}
          <div className="md:col-span-1">
            <div className="sticky top-20 rounded-2xl p-5" style={{ background: "rgba(13,24,48,0.95)", border: "1px solid rgba(59,130,246,0.2)", boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}>
              <h3 style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: "16px", fontSize: "1rem" }}>رزرو پارکینگ</h3>

              <div className="space-y-3 mb-4">
                <div>
                  <label style={{ color: "#64748b", fontSize: "0.75rem", display: "block", marginBottom: "6px" }}>تاریخ</label>
                  <input value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0" }} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label style={{ color: "#64748b", fontSize: "0.75rem", display: "block", marginBottom: "6px" }}>از ساعت</label>
                    <select value={fromSlot} onChange={(e) => setFromSlot(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0" }}>
                      {TIME_SLOTS.filter(s => !UNAVAILABLE_SLOTS.includes(s)).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ color: "#64748b", fontSize: "0.75rem", display: "block", marginBottom: "6px" }}>تا ساعت</label>
                    <select value={toSlot} onChange={(e) => setToSlot(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0" }}>
                      {TIME_SLOTS.filter(s => !UNAVAILABLE_SLOTS.includes(s) && TIME_SLOTS.indexOf(s) > TIME_SLOTS.indexOf(fromSlot)).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="p-3 rounded-xl mb-4 space-y-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex justify-between" style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  <span>نرخ پایه هر ساعت</span>
                  <span>{parking.price.toLocaleString("fa-IR")} ت</span>
                </div>
                {isSurge && (
                  <div className="flex justify-between" style={{ fontSize: "0.8rem", color: "#f59e0b" }}>
                    <span className="flex items-center gap-1"><TrendingUp size={11} />ضریب اوج تقاضا</span>
                    <span>×{parking.surgeMultiplier}</span>
                  </div>
                )}
                <div className="flex justify-between" style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  <span>مدت زمان</span>
                  <span>{hours} ساعت</span>
                </div>
                <div className="border-t pt-2 flex justify-between" style={{ borderColor: "rgba(255,255,255,0.08)", fontSize: "0.95rem", fontWeight: 700, color: "#f1f5f9" }}>
                  <span>مجموع</span>
                  <span style={{ color: "#3b82f6" }}>{total.toLocaleString("fa-IR")} ت</span>
                </div>
              </div>

              <Button
                className="w-full h-12 text-base font-bold rounded-xl"
                style={{ background: hours > 0 ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "rgba(255,255,255,0.05)", color: hours > 0 ? "white" : "#64748b", cursor: hours > 0 ? "pointer" : "not-allowed" }}
                disabled={hours === 0}
                onClick={() => onBook({ parking, date, from: fromSlot, to: toSlot, total })}
              >
                {hours > 0 ? "ادامه و پرداخت" : "ساعت را انتخاب کنید"}
                {hours > 0 && <ChevronLeft size={18} className="mr-2" />}
              </Button>
              <p style={{ color: "#64748b", fontSize: "0.72rem", textAlign: "center", marginTop: "8px" }}>
                پرداخت امن — رزرو فوری
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
