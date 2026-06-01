import { useState } from "react";
import { ArrowRight, CreditCard, Smartphone, Tag, Shield, Check, Loader2, MapPin, Clock, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import type { Parking } from "../types/parking";

interface PaymentViewProps {
  booking: { parking: Parking; date: string; from: string; to: string; total: number };
  onBack: () => void;
  onSuccess: () => Promise<void>;
}

const PAYMENT_METHODS = [
  { id: "card", label: "کارت بانکی", icon: <CreditCard size={18} />, desc: "ویزا، مسترکارت، شتاب" },
  { id: "wallet", label: "کیف پول", icon: <Smartphone size={18} />, desc: "پرداخت از اعتبار حساب کاربر" },
  { id: "installment", label: "پرداخت سازمانی", icon: <Tag size={18} />, desc: "برای قراردادهای ناوگان و سازمان‌ها" },
];

export default function PaymentView({ booking, onBack, onSuccess }: PaymentViewProps) {
  const [method, setMethod] = useState("card");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finalTotal = booking.total;

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ثبت پرداخت");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen py-8 px-4" style={{ background: "#060c1a", fontFamily: "'Vazirmatn', Tahoma, sans-serif" }}>
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-2 mb-6 text-sm" style={{ color: "#94a3b8" }}>
          <ArrowRight size={16} />
          بازگشت
        </button>

        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "6px" }}>پرداخت رزرو</h1>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "24px" }}>اطلاعات پرداخت را وارد کنید</p>

        {/* Booking Summary */}
        <div className="rounded-2xl p-5 mb-6" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(59,130,246,0.15)" }}>
          <h3 style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 600, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>خلاصه رزرو</h3>
          <div className="flex items-start gap-4">
            <img src={booking.parking.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 120'%3E%3Crect width='160' height='120' fill='%23070e1e'/%3E%3Ctext x='80' y='66' text-anchor='middle' fill='%2394a3b8' font-size='18' font-family='Arial'%3EP%3C/text%3E%3C/svg%3E"} alt={booking.parking.name} className="w-20 h-16 rounded-xl object-cover" style={{ filter: "brightness(0.7)" }} />
            <div className="flex-1">
              <div style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: "4px" }}>{booking.parking.name}</div>
              <div className="flex items-center gap-1 mb-1" style={{ color: "#64748b", fontSize: "0.78rem" }}>
                <MapPin size={11} />
                {booking.parking.address}
              </div>
              <div className="flex items-center gap-3" style={{ fontSize: "0.78rem" }}>
                <div className="flex items-center gap-1" style={{ color: "#94a3b8" }}>
                  <Clock size={11} />
                  {booking.date} — {booking.from} تا {booking.to}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          <h3 style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.9rem", marginBottom: "12px" }}>روش پرداخت</h3>
          {PAYMENT_METHODS.map((m) => (
            <div
              key={m.id}
              onClick={() => setMethod(m.id)}
              className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all"
              style={{
                background: method === m.id ? "rgba(59,130,246,0.1)" : "rgba(13,24,48,0.8)",
                border: `1px solid ${method === m.id ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: method === m.id ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.06)", color: method === m.id ? "#3b82f6" : "#64748b" }}>
                {m.icon}
              </div>
              <div className="flex-1">
                <div style={{ color: "#e2e8f0", fontSize: "0.88rem", fontWeight: 600 }}>{m.label}</div>
                <div style={{ color: "#64748b", fontSize: "0.75rem" }}>{m.desc}</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center`} style={{ borderColor: method === m.id ? "#3b82f6" : "rgba(255,255,255,0.2)", background: method === m.id ? "#3b82f6" : "transparent" }}>
                {method === m.id && <Check size={11} color="white" />}
              </div>
            </div>
          ))}
        </div>

        {/* Card form */}
        {method === "card" && (
          <div className="rounded-2xl p-5 mb-6 space-y-4" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div>
              <label style={{ color: "#64748b", fontSize: "0.75rem", display: "block", marginBottom: "6px" }}>شماره کارت</label>
              <input value={cardNum} onChange={(e) => setCardNum(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0", direction: "ltr", textAlign: "left", letterSpacing: "0.1em" }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={{ color: "#64748b", fontSize: "0.75rem", display: "block", marginBottom: "6px" }}>تاریخ انقضا</label>
                <input value={expiry} onChange={(e) => setExpiry(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0" }} />
              </div>
              <div>
                <label style={{ color: "#64748b", fontSize: "0.75rem", display: "block", marginBottom: "6px" }}>CVV2</label>
                <input value={cvv} onChange={(e) => setCvv(e.target.value)} type="password" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0" }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl p-4" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.24)", color: "#fca5a5" }}>
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span className="text-sm leading-7">{error}</span>
          </div>
        )}

        {/* Security note */}
        <div className="flex items-center gap-2 mb-4" style={{ color: "#64748b", fontSize: "0.75rem" }}>
          <Shield size={13} />
          <span>پرداخت با رمزنگاری SSL ۲۵۶ بیتی — اطلاعات کارت شما ذخیره نمی‌شود</span>
        </div>

        {/* Pay button */}
        <Button
          className="w-full h-14 rounded-2xl font-bold"
          style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", fontSize: "1rem", boxShadow: "0 8px 25px rgba(59,130,246,0.35)" }}
          onClick={handlePay}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <Loader2 size={20} className="animate-spin" />
              در حال پردازش...
            </div>
          ) : (
            `پرداخت ${finalTotal.toLocaleString("fa-IR")} تومان`
          )}
        </Button>
      </div>
    </div>
  );
}
