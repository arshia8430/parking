import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Car, Clock, Filter, Loader2, MapPin, Navigation, RefreshCw, Shield, Star, TrendingUp, Wifi, Zap } from "lucide-react";
import { Button } from "./ui/button";
import type { Parking, SearchRequest } from "../types/parking";

interface MapViewProps {
  parkings: Parking[];
  searchParams: SearchRequest;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelect: (p: Parking) => void;
}

type SortMode = "price" | "distance" | "rating" | "availability";

const TEHRAN_CENTER: [number, number] = [51.3347, 35.7219];
const NESHAN_MAP_KEY = import.meta.env.VITE_NESHAN_MAP_KEY || "";
const NESHAN_REACT_PACKAGE = "@neshan-maps-platform/mapbox-gl-react";
const NESHAN_MAPBOX_PACKAGE = "@neshan-maps-platform/mapbox-gl";

function formatPrice(p: number, surge: number) {
  return (p * surge).toLocaleString("fa-IR");
}

function getStatusColor(avail: number, total: number) {
  const pct = total ? avail / total : 0;
  if (pct > 0.5) return "#3b82f6";
  if (pct > 0.2) return "#f59e0b";
  return "#ef4444";
}

function NeshanMap({ parkings, selected, onSelect }: { parkings: Parking[]; selected: string | null; onSelect: (id: string) => void }) {
  const [MapComponent, setMapComponent] = useState<any>(null);
  const [MapTypes, setMapTypes] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    let mounted = true;
    void import(/* @vite-ignore */ NESHAN_REACT_PACKAGE)
      .then((module) => {
        if (!mounted) return;
        setMapComponent(() => module.MapComponent);
        setMapTypes(module.MapTypes);
      })
      .catch(() => {
        if (mounted) setLoadError("کتابخانه نقشه نشان نصب یا در دسترس نیست.");
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    let cancelled = false;
    void import(/* @vite-ignore */ NESHAN_MAPBOX_PACKAGE)
      .then((module) => {
        if (cancelled || !mapRef.current) return;
        const nmpMapbox = module.default ?? module;
        markersRef.current.forEach((marker) => marker.remove?.());
        markersRef.current = [];

        parkings.forEach((parking) => {
          const el = document.createElement("button");
          const color = getStatusColor(parking.available, parking.total);
          el.type = "button";
          el.className = "neshan-parking-marker";
          el.style.cssText = `width:${selected === parking.id ? 42 : 34}px;height:${selected === parking.id ? 42 : 34}px;border-radius:999px;border:2px solid ${color};background:#071226;color:white;box-shadow:0 12px 30px ${color}55;display:grid;place-items:center;font-weight:800;cursor:pointer;transition:all .2s;`;
          el.innerHTML = `<span style="width:22px;height:22px;border-radius:999px;background:${color};display:grid;place-items:center;font-size:12px">P</span>`;
          el.title = `${parking.name} - ${parking.available} جای خالی`;
          el.onclick = () => onSelect(parking.id);

          const marker = new nmpMapbox.Marker({ element: el, anchor: "center" })
            .setLngLat([parking.lng, parking.lat])
            .addTo(mapRef.current);
          markersRef.current.push(marker);
        });
      })
      .catch(() => setLoadError("امکان افزودن نشانگرهای نقشه وجود ندارد."));

    return () => {
      cancelled = true;
    };
  }, [onSelect, parkings, selected]);

  if (!NESHAN_MAP_KEY) {
    return (
      <div className="h-full w-full grid place-items-center p-6 text-center" style={{ background: "radial-gradient(circle at center, #10203d, #060c1a)", color: "#94a3b8" }}>
        <div className="max-w-md rounded-3xl p-6" style={{ background: "rgba(13,24,48,0.86)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <MapPin className="mx-auto mb-3" style={{ color: "#3b82f6" }} />
          <h3 className="mb-2 font-bold text-white">کلید نقشه نشان تنظیم نشده است</h3>
          <p className="text-sm leading-7">برای نمایش نقشه واقعی، مقدار <span dir="ltr">VITE_NESHAN_MAP_KEY</span> را در محیط فرانت‌اند تنظیم کنید.</p>
        </div>
      </div>
    );
  }

  if (loadError || !MapComponent) {
    return (
      <div className="h-full w-full grid place-items-center p-6" style={{ background: "#081225", color: "#94a3b8" }}>
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: "rgba(13,24,48,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {loadError ? <AlertCircle size={18} style={{ color: "#f59e0b" }} /> : <Loader2 size={18} className="animate-spin" style={{ color: "#3b82f6" }} />}
          <span>{loadError ?? "در حال بارگذاری نقشه نشان..."}</span>
        </div>
      </div>
    );
  }

  return (
    <MapComponent
      className="h-full w-full"
      mapSetter={(map: any) => { mapRef.current = map; }}
      options={{
        mapKey: NESHAN_MAP_KEY,
        mapType: MapTypes?.neshanRasterNight ?? "neshanRasterNight",
        poi: true,
        traffic: true,
        center: parkings[0] ? [parkings[0].lng, parkings[0].lat] : TEHRAN_CENTER,
        zoom: 13,
        mapTypeControllerStatus: { show: true, position: "bottom-left" },
      }}
    />
  );
}

export default function MapView({ parkings, searchParams, isLoading, error, onRetry, onSelect }: MapViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortMode>("distance");
  const [showMap, setShowMap] = useState(true);
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  const sorted = useMemo(() => {
    return parkings
      .filter((p) => !onlyAvailable || p.available > 0)
      .sort((a, b) => {
        if (sortBy === "price") return a.price * a.surgeMultiplier - b.price * b.surgeMultiplier;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "availability") return b.available / Math.max(b.total, 1) - a.available / Math.max(a.total, 1);
        return a.distanceKm - b.distanceKm;
      });
  }, [onlyAvailable, parkings, sortBy]);

  const handleSelect = (p: Parking) => {
    setSelectedId(p.id);
    onSelect(p);
  };

  return (
    <div dir="rtl" className="flex flex-col md:flex-row" style={{ height: "calc(100vh - 64px)", fontFamily: "'Vazirmatn', Tahoma, sans-serif" }}>
      <div className={`${showMap ? "hidden md:flex" : "flex"} flex-col w-full md:w-96 lg:w-[440px] shrink-0`} style={{ background: "#070e1e", borderLeft: "1px solid rgba(255,255,255,0.06)", overflowY: "auto" }}>
        <div className="p-4 sticky top-0 z-10" style={{ background: "#070e1e", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span style={{ color: "#e2e8f0", fontWeight: 800 }}>پارکینگ‌های نزدیک</span>
              <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>{sorted.length.toLocaleString("fa-IR")} مورد</span>
            </div>
            <p className="truncate" style={{ color: "#64748b", fontSize: "0.75rem" }}>{searchParams.location || "جستجو بدون محدوده متنی"} · {searchParams.date || "امروز"} · {searchParams.from || "--"} تا {searchParams.to || "--"}</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} style={{ color: "#64748b" }} />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortMode)} className="flex-1 text-sm outline-none rounded-lg px-2 py-2" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}>
              <option value="distance">نزدیک‌ترین</option>
              <option value="price">ارزان‌ترین</option>
              <option value="rating">بهترین امتیاز</option>
              <option value="availability">بیشترین ظرفیت</option>
            </select>
            <button onClick={() => setOnlyAvailable(!onlyAvailable)} className="px-3 py-2 rounded-lg text-xs" style={{ background: onlyAvailable ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)", color: onlyAvailable ? "#34d399" : "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}>
              فقط موجود
            </button>
          </div>
          <button className="md:hidden w-full mt-3 py-2 rounded-xl text-sm" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#93c5fd" }} onClick={() => setShowMap(true)}>
            نمایش روی نقشه
          </button>
        </div>

        <div className="flex-1 p-4 space-y-3">
          {isLoading && Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-40 rounded-2xl animate-pulse" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.06)" }} />
          ))}

          {!isLoading && error && (
            <div className="rounded-2xl p-5 text-center" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", color: "#fbbf24" }}>
              <AlertCircle className="mx-auto mb-3" />
              <p className="mb-4 text-sm leading-7">{error}</p>
              <Button onClick={onRetry} className="gap-2" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}><RefreshCw size={15} />تلاش مجدد</Button>
            </div>
          )}

          {!isLoading && !error && sorted.length === 0 && (
            <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(13,24,48,0.8)", border: "1px solid rgba(255,255,255,0.07)", color: "#94a3b8" }}>
              <Car className="mx-auto mb-3" style={{ color: "#1e3a5f" }} />
              <h3 className="mb-2 font-bold text-white">پارکینگی پیدا نشد</h3>
              <p className="text-sm leading-7">محدوده، تاریخ یا ساعت جستجو را تغییر دهید.</p>
            </div>
          )}

          {!isLoading && !error && sorted.map((p) => (
            <div key={p.id} onClick={() => handleSelect(p)} className="rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5" style={{ background: selectedId === p.id ? "rgba(59,130,246,0.12)" : "rgba(13,24,48,0.8)", border: selectedId === p.id ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(255,255,255,0.06)", boxShadow: selectedId === p.id ? "0 0 0 2px rgba(59,130,246,0.15)" : "none" }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "0.95rem" }}>{p.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: p.type === "iot" ? "rgba(6,182,212,0.12)" : "rgba(168,85,247,0.12)", color: p.type === "iot" ? "#22d3ee" : "#c084fc", border: `1px solid ${p.type === "iot" ? "rgba(6,182,212,0.25)" : "rgba(168,85,247,0.25)"}` }}>
                      {p.type === "iot" ? <span className="flex items-center gap-1"><Wifi size={9} />IoT</span> : <span className="flex items-center gap-1"><Shield size={9} />دستی</span>}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: "#64748b", fontSize: "0.75rem" }}><MapPin size={11} /><span>{p.address}</span></div>
                </div>
                <div className="text-left shrink-0">
                  {p.surgeMultiplier > 1 && <div className="flex items-center gap-1 mb-1" style={{ color: "#f59e0b", fontSize: "0.7rem" }}><TrendingUp size={10} /><span>شناور</span></div>}
                  <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "1rem", textAlign: "left" }}>{formatPrice(p.price, p.surgeMultiplier)}<span style={{ fontSize: "0.7rem", fontWeight: 400, color: "#64748b" }}> تومان/ساعت</span></div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-3" style={{ fontSize: "0.75rem", color: "#64748b" }}>
                <div className="flex items-center gap-1"><Navigation size={11} />{p.distanceKm.toLocaleString("fa-IR")} کیلومتر</div>
                <div className="flex items-center gap-1"><Star size={11} style={{ color: "#f59e0b" }} /><span style={{ color: "#94a3b8" }}>{p.rating.toLocaleString("fa-IR")}</span><span>({p.reviews.toLocaleString("fa-IR")})</span></div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between mb-1" style={{ fontSize: "0.72rem" }}>
                  <span style={{ color: "#94a3b8" }}>{p.available.toLocaleString("fa-IR")} جای خالی از {p.total.toLocaleString("fa-IR")}</span>
                  <span style={{ color: getStatusColor(p.available, p.total) }}>{Math.round((p.available / Math.max(p.total, 1)) * 100).toLocaleString("fa-IR")}٪ آزاد</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}><div className="h-full rounded-full transition-all" style={{ width: `${(p.available / Math.max(p.total, 1)) * 100}%`, background: getStatusColor(p.available, p.total) }} /></div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {p.covered && <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}>سرپوشیده</span>}
                {p.hasEv && <span className="px-2 py-0.5 rounded-full text-xs flex items-center gap-1" style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}><Zap size={10} />شارژ EV</span>}
                {p.features.slice(0, 2).map((f) => <span key={f} className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}>{f}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${showMap ? "flex" : "hidden md:flex"} flex-1 relative flex-col`}>
        <button className="md:hidden absolute top-3 right-3 z-10 px-4 py-2 rounded-xl text-sm" style={{ background: "rgba(7,14,32,0.9)", border: "1px solid rgba(255,255,255,0.12)", color: "#94a3b8" }} onClick={() => setShowMap(false)}>نمایش لیست</button>
        <NeshanMap parkings={parkings} selected={selectedId} onSelect={(id) => { const p = parkings.find((x) => x.id === id); if (p) handleSelect(p); }} />
        <div className="absolute bottom-4 left-4 flex flex-col gap-1 p-3 rounded-xl" style={{ background: "rgba(7,14,32,0.9)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.7rem", color: "#94a3b8" }}>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#3b82f6" }} />موجود</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#f59e0b" }} />کمتر از ۳۰٪</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />تقریبا پر</div>
        </div>
      </div>
    </div>
  );
}
