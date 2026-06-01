import { useMemo, useState } from "react";
import { Calendar, ChevronLeft, Clock, LocateFixed, MapPin, Search } from "lucide-react";
import { Button } from "./ui/button";
import type { SearchRequest } from "../types/parking";

interface HeroSectionProps {
  onSearch: (query: SearchRequest) => void;
}

const TIME_OPTIONS = Array.from({ length: 17 }, (_, index) => `${String(index + 6).padStart(2, "0")}:00`);

function formatWeekday(date: Date) {
  return new Intl.DateTimeFormat("fa-IR", { weekday: "short" }).format(date);
}

function formatDay(date: Date) {
  return new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "short" }).format(date);
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const dateOptions = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      return { value: toIsoDate(date), label: index === 0 ? "امروز" : index === 1 ? "فردا" : formatWeekday(date), caption: formatDay(date) };
    });
  }, []);

  const [location, setLocation] = useState("");
  const [date, setDate] = useState(dateOptions[0].value);
  const [from, setFrom] = useState("08:00");
  const [to, setTo] = useState("12:00");
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "denied" | "ready">("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const endOptions = TIME_OPTIONS.filter((time) => time > from);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus("denied");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocation("موقعیت فعلی من");
        setGeoStatus("ready");
      },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const submitSearch = () => {
    onSearch({ location, date, from, to, lat: coords?.lat, lng: coords?.lng });
  };

  return (
    <main dir="rtl" className="min-h-[calc(100vh-64px)] overflow-hidden" style={{ fontFamily: "'Vazirmatn', Tahoma, sans-serif", background: "linear-gradient(160deg, #060c1a 0%, #0a1628 55%, #060c1a 100%)" }}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div style={{ position: "absolute", top: "-18%", right: "-8%", width: "620px", height: "620px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-8%", width: "540px", height: "540px", borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)" }} />
      </div>

      <section className="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-5xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2" style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", color: "#93c5fd" }}>
          <Search size={15} />
          <span className="text-xs sm:text-sm">پارکینگ مناسب را با چند کلیک پیدا کنید</span>
        </div>

        <h1 className="mb-4 max-w-3xl font-extrabold" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1.18, color: "#f1f5f9" }}>
          رزرو پارکینگ، سریع و بدون حدس و خطا
        </h1>
        <p className="mb-8 max-w-xl leading-8" style={{ color: "#94a3b8" }}>
          محدوده، روز و بازه زمانی را انتخاب کنید؛ لیست و نقشه فقط با داده‌های زنده سرویس نمایش داده می‌شود.
        </p>

        <div className="w-full rounded-[28px] p-4 text-right sm:p-5" style={{ background: "rgba(13,24,48,0.96)", border: "1px solid rgba(59,130,246,0.22)", boxShadow: "0 28px 70px rgba(0,0,0,0.42)" }}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="min-w-0 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm font-bold" style={{ color: "#e2e8f0" }}>
                  <MapPin size={16} style={{ color: "#3b82f6" }} />
                  محدوده جستجو
                </label>
                <button type="button" onClick={useCurrentLocation} className="shrink-0 rounded-xl px-3 py-2 text-xs" style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.24)", color: "#93c5fd" }}>
                  <span className="inline-flex items-center gap-1"><LocateFixed size={13} />{geoStatus === "loading" ? "در حال دریافت..." : "موقعیت من"}</span>
                </button>
              </div>
              <input
                value={location}
                onChange={(event) => { setLocation(event.target.value); setCoords(null); }}
                className="w-full min-w-0 rounded-2xl px-4 py-3 text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#e2e8f0" }}
                placeholder="نام خیابان، محله یا مقصد"
              />
              {geoStatus === "denied" && <p className="mt-2 text-xs" style={{ color: "#f59e0b" }}>دسترسی موقعیت فعال نشد؛ می‌توانید مقصد را تایپ کنید.</p>}
            </div>

            <div className="min-w-0 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="mb-3 flex items-center gap-2 text-sm font-bold" style={{ color: "#e2e8f0" }}>
                <Calendar size={16} style={{ color: "#3b82f6" }} />
                روز رزرو
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {dateOptions.slice(0, 4).map((item) => (
                  <button key={item.value} type="button" onClick={() => setDate(item.value)} className="rounded-2xl px-3 py-3 text-center transition" style={{ background: date === item.value ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${date === item.value ? "rgba(59,130,246,0.45)" : "rgba(255,255,255,0.08)"}`, color: date === item.value ? "#bfdbfe" : "#94a3b8" }}>
                    <div className="text-sm font-bold">{item.label}</div>
                    <div className="mt-1 text-[11px]">{item.caption}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold" style={{ color: "#e2e8f0" }}>
              <Clock size={16} style={{ color: "#3b82f6" }} />
              ساعت ورود و خروج را انتخاب کنید
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="min-w-0">
                <div className="mb-2 text-xs" style={{ color: "#64748b" }}>ورود</div>
                <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
                  {TIME_OPTIONS.slice(0, -1).map((time) => (
                    <button key={time} type="button" onClick={() => { setFrom(time); if (to <= time) setTo(TIME_OPTIONS[Math.min(TIME_OPTIONS.indexOf(time) + 1, TIME_OPTIONS.length - 1)]); }} className="shrink-0 rounded-xl px-4 py-2 text-sm font-semibold" style={{ background: from === time ? "rgba(59,130,246,0.22)" : "rgba(255,255,255,0.05)", border: `1px solid ${from === time ? "rgba(59,130,246,0.45)" : "rgba(255,255,255,0.08)"}`, color: from === time ? "#bfdbfe" : "#94a3b8" }}>
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              <div className="min-w-0">
                <div className="mb-2 text-xs" style={{ color: "#64748b" }}>خروج</div>
                <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
                  {endOptions.map((time) => (
                    <button key={time} type="button" onClick={() => setTo(time)} className="shrink-0 rounded-xl px-4 py-2 text-sm font-semibold" style={{ background: to === time ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${to === time ? "rgba(16,185,129,0.42)" : "rgba(255,255,255,0.08)"}`, color: to === time ? "#bbf7d0" : "#94a3b8" }}>
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Button className="mt-4 h-13 w-full rounded-2xl text-base font-bold" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", boxShadow: "0 10px 28px rgba(59,130,246,0.34)" }} onClick={submitSearch}>
            جستجوی پارکینگ
            <ChevronLeft size={20} className="mr-2" />
          </Button>
        </div>
      </section>
    </main>
  );
}
