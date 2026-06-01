import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, QrCode, RefreshCw, Car } from "lucide-react";
import { Button } from "./ui/button";
import type { Parking } from "./MapView";

interface QRCodeDisplayProps {
  booking: { parking: Parking; date: string; from: string; to: string; total: number };
  onDone: () => void;
}

function QRSvg({ value, size = 180 }: { value: string; size?: number }) {
  const cells = 25;
  const cellSize = size / cells;

  function hashCode(s: string) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
    return h >>> 0;
  }

  const isFinderPattern = (r: number, c: number) =>
    (r < 8 && c < 8) || (r < 8 && c >= cells - 8) || (r >= cells - 8 && c < 8);

  const isTiming = (r: number, c: number) =>
    (r === 6 && c >= 8 && c < cells - 8) || (c === 6 && r >= 8 && r < cells - 8);

  function inFinder(r: number, c: number): boolean {
    const patterns: [number, number][] = [[0, 0], [0, cells - 7], [cells - 7, 0]];
    for (const [pr, pc] of patterns) {
      if (r >= pr && r < pr + 7 && c >= pc && c < pc + 7) return true;
    }
    return false;
  }

  function finderVal(r: number, c: number): boolean {
    const patterns: [number, number][] = [[0, 0], [0, cells - 7], [cells - 7, 0]];
    for (const [pr, pc] of patterns) {
      if (r >= pr && r < pr + 7 && c >= pc && c < pc + 7) {
        const lr = r - pr; const lc = c - pc;
        return lr === 0 || lr === 6 || lc === 0 || lc === 6 || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4);
      }
    }
    return false;
  }

  const hash = hashCode(value);
  const cells2d: boolean[][] = Array.from({ length: cells }, (_, r) =>
    Array.from({ length: cells }, (_, c) => {
      if (inFinder(r, c)) return finderVal(r, c);
      if (isTiming(r, c)) return (r + c) % 2 === 0;
      const pos = r * cells + c;
      return ((hash * (pos + 1) * 7) ^ (pos * 13 + hash)) % 100 < 48;
    })
  );

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: "10px" }}>
      <rect width={size} height={size} fill="white" rx="8" />
      {cells2d.map((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize + 0.5}
              y={r * cellSize + 0.5}
              width={cellSize - 0.5}
              height={cellSize - 0.5}
              fill="#0a1628"
            />
          ) : null
        )
      )}
    </svg>
  );
}

function CountdownTimer({ seconds, label, onExpired }: { seconds: number; label: string; onExpired?: () => void }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) { onExpired?.(); return; }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const pct = (remaining / seconds) * 100;
  const color = remaining > 120 ? "#3b82f6" : remaining > 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="text-center">
      <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "6px" }}>{label}</div>
      <div className="relative w-16 h-16 mx-auto mb-1">
        <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
          <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
          <circle cx="32" cy="32" r="28" fill="none" stroke={color} strokeWidth="4" strokeDasharray={`${2 * Math.PI * 28}`} strokeDashoffset={`${2 * Math.PI * 28 * (1 - pct / 100)}`} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{ color, fontWeight: 800, fontSize: "0.9rem" }}>
            {m}:{s.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
      {remaining <= 60 && (
        <div style={{ color: "#ef4444", fontSize: "0.72rem" }}>کد در حال انقضاست!</div>
      )}
    </div>
  );
}

export default function QRCodeDisplay({ booking, onDone }: QRCodeDisplayProps) {
  const [phase, setPhase] = useState<"entry" | "parked" | "exit" | "done">("entry");
  const [entryExpired, setEntryExpired] = useState(false);

  const entryCode = `PARK-ENTRY-${booking.parking.id}-${Date.now()}`;
  const exitCode = `PARK-EXIT-${booking.parking.id}-${Date.now() + 1}`;

  return (
    <div dir="rtl" className="min-h-screen py-8 px-4" style={{ background: "#060c1a", fontFamily: "'Vazirmatn', Tahoma, sans-serif" }}>
      <div className="max-w-lg mx-auto">

        {/* Success header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)", border: "2px solid rgba(16,185,129,0.3)" }}>
            <CheckCircle size={30} style={{ color: "#10b981" }} />
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "6px" }}>رزرو با موفقیت ثبت شد!</h1>
          <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
            {booking.parking.name} — {booking.date} از {booking.from} تا {booking.to}
          </p>
        </div>

        {/* Phase indicator */}
        <div className="flex items-center gap-0 mb-8">
          {[{ id: "entry", label: "ورود" }, { id: "parked", label: "داخل" }, { id: "exit", label: "خروج" }, { id: "done", label: "پایان" }].map((p, i) => (
            <div key={p.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1 flex-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: phase === p.id ? "#3b82f6" : ["entry", "parked", "exit", "done"].indexOf(phase) > i ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)", border: `2px solid ${phase === p.id ? "#3b82f6" : ["entry", "parked", "exit", "done"].indexOf(phase) > i ? "#10b981" : "rgba(255,255,255,0.1)"}`, color: phase === p.id ? "white" : ["entry", "parked", "exit", "done"].indexOf(phase) > i ? "#10b981" : "#64748b" }}>
                  {["entry", "parked", "exit", "done"].indexOf(phase) > i ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: "0.68rem", color: phase === p.id ? "#3b82f6" : "#64748b" }}>{p.label}</span>
              </div>
              {i < 3 && <div className="h-px flex-1 mb-4" style={{ background: ["entry", "parked", "exit", "done"].indexOf(phase) > i ? "#10b981" : "rgba(255,255,255,0.06)", maxWidth: "30px" }} />}
            </div>
          ))}
        </div>

        {/* QR Code Card */}
        {phase === "entry" && (
          <div className="rounded-3xl p-6 mb-6 text-center" style={{ background: "rgba(13,24,48,0.95)", border: "1px solid rgba(59,130,246,0.25)", boxShadow: "0 0 40px rgba(59,130,246,0.1)" }}>
            <div className="flex items-center justify-center gap-2 mb-2" style={{ color: "#3b82f6", fontSize: "0.85rem", fontWeight: 600 }}>
              <QrCode size={16} />
              QR کد ورود
            </div>
            <p style={{ color: "#64748b", fontSize: "0.75rem", marginBottom: "20px" }}>این کد را جلوی دوربین پارکینگ نگه دارید</p>

            <div className="flex justify-center mb-4 relative">
              <div style={{ padding: "12px", background: "white", borderRadius: "16px", boxShadow: "0 0 30px rgba(59,130,246,0.2)" }}>
                {entryExpired ? (
                  <div className="w-44 h-44 flex items-center justify-center rounded-xl" style={{ background: "#f8fafc" }}>
                    <div className="text-center">
                      <AlertTriangle size={32} style={{ color: "#ef4444", margin: "0 auto 8px" }} />
                      <div style={{ fontSize: "0.75rem", color: "#ef4444" }}>منقضی شد</div>
                    </div>
                  </div>
                ) : (
                  <QRSvg value={entryCode} size={175} />
                )}
              </div>
            </div>

            {!entryExpired ? (
              <CountdownTimer seconds={300} label="اعتبار کد ورود" onExpired={() => setEntryExpired(true)} />
            ) : (
              <Button className="mx-auto flex items-center gap-2 mt-2" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }} onClick={() => setEntryExpired(false)}>
                <RefreshCw size={14} />
                درخواست کد جدید (۵,۰۰۰ تومان جریمه)
              </Button>
            )}

            <div className="mt-4 p-3 rounded-xl" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.12)" }}>
              <ul className="space-y-1.5 text-right" style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                <li className="flex items-start gap-2"><span style={{ color: "#3b82f6" }}>•</span>این کد فقط یک‌بار قابل استفاده است</li>
                <li className="flex items-start gap-2"><span style={{ color: "#3b82f6" }}>•</span>اعتبار ۵ دقیقه — پس از انقضا کد جدید درخواست دهید</li>
                <li className="flex items-start gap-2"><span style={{ color: "#3b82f6" }}>•</span>پس از اسکن، ۱۰ دقیقه برای پارک خودرو دارید</li>
              </ul>
            </div>

            <Button
              className="w-full mt-4 h-11 rounded-xl font-bold"
              style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}
              onClick={() => setPhase("parked")}
            >
              <Car size={16} className="ml-2" />
              وارد پارکینگ شدم
            </Button>
          </div>
        )}

        {phase === "parked" && (
          <div className="rounded-3xl p-6 mb-6 text-center" style={{ background: "rgba(13,24,48,0.95)", border: "1px solid rgba(16,185,129,0.25)" }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(16,185,129,0.12)" }}>
              <Car size={28} style={{ color: "#10b981" }} />
            </div>
            <h3 style={{ color: "#f1f5f9", fontWeight: 700, marginBottom: "8px" }}>خودرو پارک شد</h3>
            <p style={{ color: "#64748b", fontSize: "0.82rem", marginBottom: "20px" }}>
              رزرو تا ساعت {booking.to} معتبر است. برای خروج QR کد خروج را نشان دهید.
            </p>
            <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}>
              <div style={{ color: "#34d399", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px" }}>وقت رزرو شما</div>
              <div style={{ color: "#f1f5f9", fontSize: "1.1rem", fontWeight: 700 }}>{booking.from} — {booking.to}</div>
            </div>
            <Button className="w-full h-11 rounded-xl font-bold" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }} onClick={() => setPhase("exit")}>
              آماده خروج هستم
            </Button>
          </div>
        )}

        {phase === "exit" && (
          <div className="rounded-3xl p-6 mb-6 text-center" style={{ background: "rgba(13,24,48,0.95)", border: "1px solid rgba(245,158,11,0.25)" }}>
            <div className="flex items-center justify-center gap-2 mb-2" style={{ color: "#f59e0b", fontSize: "0.85rem", fontWeight: 600 }}>
              <QrCode size={16} />
              QR کد خروج
            </div>
            <p style={{ color: "#64748b", fontSize: "0.75rem", marginBottom: "20px" }}>این کد را جلوی دوربین خروج نگه دارید</p>

            <div className="flex justify-center mb-4">
              <div style={{ padding: "12px", background: "white", borderRadius: "16px", boxShadow: "0 0 30px rgba(245,158,11,0.15)" }}>
                <QRSvg value={exitCode} size={175} />
              </div>
            </div>

            <CountdownTimer seconds={300} label="اعتبار کد خروج" onExpired={() => {}} />

            <div className="mt-4 p-3 rounded-xl mb-4" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}>
              <ul className="space-y-1.5 text-right" style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                <li className="flex items-start gap-2"><span style={{ color: "#f59e0b" }}>⚠</span>ظرف ۵ دقیقه از ساختمان خارج شوید</li>
                <li className="flex items-start gap-2"><span style={{ color: "#f59e0b" }}>⚠</span>تأخیر بیشتر از ۱۰ دقیقه شامل جریمه می‌شود</li>
              </ul>
            </div>

            <Button className="w-full h-11 rounded-xl font-bold" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }} onClick={() => setPhase("done")}>
              از پارکینگ خارج شدم
            </Button>
          </div>
        )}

        {phase === "done" && (
          <div className="rounded-3xl p-8 mb-6 text-center" style={{ background: "rgba(13,24,48,0.95)", border: "1px solid rgba(16,185,129,0.25)" }}>
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(16,185,129,0.12)" }}>
              <CheckCircle size={40} style={{ color: "#10b981" }} />
            </div>
            <h2 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: "1.3rem", marginBottom: "8px" }}>پارک با موفقیت انجام شد!</h2>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "24px" }}>از استفاده از پارک‌یار ممنونیم</p>
            <Button className="w-full h-11 rounded-xl font-bold" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }} onClick={onDone}>
              بازگشت به خانه
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
