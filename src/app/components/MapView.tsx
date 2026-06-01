import { useState } from "react";
import { MapPin, Star, Zap, Shield, Filter, Clock, TrendingUp, ChevronLeft, Wifi, Car } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export type Parking = {
  id: number;
  name: string;
  address: string;
  price: number;
  surgeMultiplier: number;
  available: number;
  total: number;
  distance: string;
  rating: number;
  reviews: number;
  type: "iot" | "manual";
  hasEv: boolean;
  covered: boolean;
  features: string[];
  mapX: number;
  mapY: number;
  imageUrl: string;
};

interface MapViewProps {
  parkings: Parking[];
  onSelect: (p: Parking) => void;
}

function formatPrice(p: number, surge: number) {
  return (p * surge).toLocaleString("fa-IR");
}

function getStatusColor(avail: number, total: number) {
  const pct = avail / total;
  if (pct > 0.5) return "#3b82f6";
  if (pct > 0.2) return "#f59e0b";
  return "#ef4444";
}

function CityMap({ parkings, selected, onSelect }: { parkings: Parking[]; selected: number | null; onSelect: (id: number) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: "#0a1628" }}>
      <svg viewBox="0 0 900 620" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        {/* Background */}
        <rect width="900" height="620" fill="#070e20" />

        {/* Grid dots */}
        <defs>
          <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.7" fill="rgba(59,130,246,0.12)" />
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-sm">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="900" height="620" fill="url(#dots)" />

        {/* Major roads - horizontal */}
        <rect x="0" y="95" width="900" height="16" rx="0" fill="#13233d" />
        <rect x="0" y="97" width="900" height="1.5" fill="rgba(59,130,246,0.15)" />
        <rect x="0" y="109" width="900" height="1.5" fill="rgba(59,130,246,0.15)" />

        <rect x="0" y="230" width="900" height="14" fill="#13233d" />
        <rect x="0" y="232" width="900" height="1" fill="rgba(59,130,246,0.12)" />
        <rect x="0" y="242" width="900" height="1" fill="rgba(59,130,246,0.12)" />

        <rect x="0" y="360" width="900" height="16" fill="#13233d" />
        <rect x="0" y="362" width="900" height="1.5" fill="rgba(59,130,246,0.15)" />
        <rect x="0" y="374" width="900" height="1.5" fill="rgba(59,130,246,0.15)" />

        <rect x="0" y="490" width="900" height="14" fill="#13233d" />
        <rect x="0" y="492" width="900" height="1" fill="rgba(59,130,246,0.1)" />

        {/* Major roads - vertical */}
        <rect x="95" y="0" width="14" height="620" fill="#13233d" />
        <rect x="97" y="0" width="1" height="620" fill="rgba(59,130,246,0.12)" />

        <rect x="240" y="0" width="16" height="620" fill="#13233d" />
        <rect x="242" y="0" width="1.5" height="620" fill="rgba(59,130,246,0.15)" />
        <rect x="254" y="0" width="1.5" height="620" fill="rgba(59,130,246,0.15)" />

        <rect x="420" y="0" width="14" height="620" fill="#13233d" />
        <rect x="422" y="0" width="1" height="620" fill="rgba(59,130,246,0.12)" />

        <rect x="600" y="0" width="16" height="620" fill="#13233d" />
        <rect x="602" y="0" width="1.5" height="620" fill="rgba(59,130,246,0.15)" />
        <rect x="614" y="0" width="1.5" height="620" fill="rgba(59,130,246,0.15)" />

        <rect x="770" y="0" width="12" height="620" fill="#13233d" />
        <rect x="772" y="0" width="1" height="620" fill="rgba(59,130,246,0.1)" />

        {/* Building blocks */}
        <rect x="15" y="15" width="70" height="70" rx="3" fill="#0e1c35" />
        <rect x="15" y="120" width="70" height="100" rx="3" fill="#0e1c35" />
        <rect x="15" y="250" width="70" height="100" rx="3" fill="#0e1c35" />
        <rect x="15" y="390" width="70" height="90" rx="3" fill="#0e1c35" />

        <rect x="120" y="15" width="110" height="70" rx="3" fill="#0e1c35" />
        <rect x="120" y="120" width="110" height="100" rx="3" fill="#111e38" />
        <rect x="120" y="250" width="110" height="100" rx="3" fill="#0e1c35" />
        <rect x="120" y="390" width="110" height="90" rx="3" fill="#111e38" />

        <rect x="270" y="15" width="140" height="70" rx="3" fill="#111e38" />
        <rect x="270" y="120" width="140" height="100" rx="3" fill="#0e1c35" />
        <rect x="270" y="250" width="140" height="100" rx="3" fill="#111e38" />
        <rect x="270" y="390" width="140" height="90" rx="3" fill="#0e1c35" />
        <rect x="270" y="510" width="140" height="95" rx="3" fill="#111e38" />

        <rect x="445" y="15" width="145" height="70" rx="3" fill="#0e1c35" />
        <rect x="445" y="120" width="145" height="100" rx="3" fill="#111e38" />
        <rect x="445" y="250" width="145" height="100" rx="3" fill="#0e1c35" />
        <rect x="445" y="390" width="145" height="90" rx="3" fill="#111e38" />
        <rect x="445" y="510" width="145" height="95" rx="3" fill="#0e1c35" />

        <rect x="630" y="15" width="130" height="70" rx="3" fill="#111e38" />
        <rect x="630" y="120" width="130" height="100" rx="3" fill="#0e1c35" />
        <rect x="630" y="250" width="130" height="100" rx="3" fill="#111e38" />
        <rect x="630" y="390" width="130" height="90" rx="3" fill="#0e1c35" />

        <rect x="790" y="15" width="95" height="70" rx="3" fill="#0e1c35" />
        <rect x="790" y="120" width="95" height="100" rx="3" fill="#111e38" />
        <rect x="790" y="250" width="95" height="100" rx="3" fill="#0e1c35" />
        <rect x="790" y="390" width="95" height="90" rx="3" fill="#111e38" />

        {/* Street labels */}
        <text x="248" y="91" textAnchor="middle" fill="rgba(148,163,184,0.4)" fontSize="8" fontFamily="Vazirmatn, Tahoma">خیابان آزادی</text>
        <text x="428" y="226" textAnchor="middle" fill="rgba(148,163,184,0.4)" fontSize="8" fontFamily="Vazirmatn, Tahoma">بلوار کشاورز</text>
        <text x="608" y="356" textAnchor="middle" fill="rgba(148,163,184,0.4)" fontSize="8" fontFamily="Vazirmatn, Tahoma">خیابان ولیعصر</text>
        <text x="248" y="486" textAnchor="middle" fill="rgba(148,163,184,0.4)" fontSize="8" fontFamily="Vazirmatn, Tahoma">خیابان امیرآباد</text>

        {/* Park area */}
        <rect x="446" y="251" width="143" height="98" rx="4" fill="rgba(16,185,129,0.05)" />
        <text x="518" y="305" textAnchor="middle" fill="rgba(16,185,129,0.3)" fontSize="9" fontFamily="Vazirmatn, Tahoma">پارک</text>

        {/* Roundabout */}
        <circle cx="248" cy="363" r="20" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="10" />
        <circle cx="248" cy="363" r="8" fill="#111e38" />

        {/* Parking markers */}
        {parkings.map((p) => {
          const color = getStatusColor(p.available, p.total);
          const isSelected = selected === p.id;
          const isHovered = hovered === p.id;
          const scale = isSelected ? 1.3 : isHovered ? 1.15 : 1;

          return (
            <g key={p.id} transform={`translate(${p.mapX}, ${p.mapY})`} style={{ cursor: "pointer" }} onClick={() => onSelect(p.id)} onMouseEnter={() => setHovered(p.id)} onMouseLeave={() => setHovered(null)}>
              {/* Pulse ring for available */}
              {p.available > 5 && (
                <circle r="22" fill="none" stroke={color} strokeWidth="1" opacity="0.3">
                  <animate attributeName="r" values="16;26;16" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Marker bg */}
              <circle r={16 * scale} fill={`${color}22`} stroke={color} strokeWidth={isSelected ? 2 : 1.5} filter="url(#glow-sm)" />
              {/* Icon bg */}
              <circle r={10 * scale} fill={color} />
              <text textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={8 * scale} fontWeight="bold" fontFamily="monospace">P</text>

              {/* Price tag */}
              {(isHovered || isSelected) && (
                <g>
                  <rect x="-45" y="-38" width="90" height="24" rx="6" fill="#0d1830" stroke={color} strokeWidth="1" />
                  <text x="0" y="-22" textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="9" fontFamily="Vazirmatn, Tahoma" fontWeight="600">
                    {p.name} — {formatPrice(p.price, p.surgeMultiplier)} ت
                  </text>
                </g>
              )}
              {/* Surge badge */}
              {p.surgeMultiplier > 1 && (
                <g transform={`translate(12, -12)`}>
                  <circle r="7" fill="#f59e0b" />
                  <text textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="7" fontWeight="bold">!</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1 p-3 rounded-xl" style={{ background: "rgba(7,14,32,0.9)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.7rem", color: "#94a3b8" }}>
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#3b82f6" }} />موجود</div>
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#f59e0b" }} />کمتر از ۳۰٪</div>
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />تقریبا پر</div>
      </div>
    </div>
  );
}

export default function MapView({ parkings, onSelect }: MapViewProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "distance" | "rating">("distance");
  const [showMap, setShowMap] = useState(true);

  const sorted = [...parkings].sort((a, b) => {
    if (sortBy === "price") return a.price * a.surgeMultiplier - b.price * b.surgeMultiplier;
    if (sortBy === "rating") return b.rating - a.rating;
    return parseFloat(a.distance) - parseFloat(b.distance);
  });

  const handleSelect = (p: Parking) => {
    setSelectedId(p.id);
    onSelect(p);
  };

  return (
    <div dir="rtl" className="flex flex-col md:flex-row" style={{ height: "calc(100vh - 64px)", fontFamily: "'Vazirmatn', Tahoma, sans-serif" }}>
      {/* Left Panel */}
      <div className={`${showMap ? "hidden md:flex" : "flex"} flex-col w-full md:w-96 lg:w-[420px] shrink-0`} style={{ background: "#070e1e", borderLeft: "1px solid rgba(255,255,255,0.06)", overflowY: "auto" }}>
        {/* Header */}
        <div className="p-4 sticky top-0 z-10" style={{ background: "#070e1e", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>{parkings.length} پارکینگ یافت شد</span>
            <div className="flex items-center gap-2">
              <Filter size={14} style={{ color: "#64748b" }} />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="text-sm outline-none rounded-lg px-2 py-1" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}>
                <option value="distance">نزدیک‌ترین</option>
                <option value="price">ارزان‌ترین</option>
                <option value="rating">بهترین امتیاز</option>
              </select>
            </div>
          </div>
          <button className="md:hidden w-full py-2 rounded-xl text-sm" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#93c5fd" }} onClick={() => setShowMap(true)}>
            نمایش روی نقشه
          </button>
        </div>

        {/* Parking List */}
        <div className="flex-1 p-4 space-y-3">
          {sorted.map((p) => (
            <div
              key={p.id}
              onClick={() => handleSelect(p)}
              className="rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: selectedId === p.id ? "rgba(59,130,246,0.12)" : "rgba(13,24,48,0.8)",
                border: selectedId === p.id ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(255,255,255,0.06)",
                boxShadow: selectedId === p.id ? "0 0 0 2px rgba(59,130,246,0.15)" : "none",
              }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "0.9rem" }}>{p.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: p.type === "iot" ? "rgba(6,182,212,0.12)" : "rgba(168,85,247,0.12)", color: p.type === "iot" ? "#22d3ee" : "#c084fc", border: `1px solid ${p.type === "iot" ? "rgba(6,182,212,0.25)" : "rgba(168,85,247,0.25)"}` }}>
                      {p.type === "iot" ? <span className="flex items-center gap-1"><Wifi size={9} />IoT</span> : <span className="flex items-center gap-1"><Shield size={9} />دستی</span>}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: "#64748b", fontSize: "0.75rem" }}>
                    <MapPin size={11} />
                    <span>{p.address}</span>
                  </div>
                </div>
                <div className="text-left shrink-0">
                  {p.surgeMultiplier > 1 && (
                    <div className="flex items-center gap-1 mb-1" style={{ color: "#f59e0b", fontSize: "0.7rem" }}>
                      <TrendingUp size={10} />
                      <span>افزایش قیمت</span>
                    </div>
                  )}
                  <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "1rem", textAlign: "left" }}>
                    {(p.price * p.surgeMultiplier).toLocaleString("fa-IR")}
                    <span style={{ fontSize: "0.7rem", fontWeight: 400, color: "#64748b" }}> تومان/ساعت</span>
                  </div>
                  {p.surgeMultiplier > 1 && (
                    <div style={{ textDecoration: "line-through", color: "#64748b", fontSize: "0.75rem", textAlign: "left" }}>
                      {p.price.toLocaleString("fa-IR")}
                    </div>
                  )}
                </div>
              </div>

              {/* Middle row */}
              <div className="flex items-center gap-3 mb-3" style={{ fontSize: "0.75rem", color: "#64748b" }}>
                <div className="flex items-center gap-1"><Clock size={11} />{p.distance} کیلومتر</div>
                <div className="flex items-center gap-1"><Star size={11} style={{ color: "#f59e0b" }} /><span style={{ color: "#94a3b8" }}>{p.rating}</span><span>({p.reviews})</span></div>
              </div>

              {/* Availability bar */}
              <div className="mb-3">
                <div className="flex justify-between mb-1" style={{ fontSize: "0.72rem" }}>
                  <span style={{ color: "#94a3b8" }}>{p.available} جای خالی از {p.total}</span>
                  <span style={{ color: getStatusColor(p.available, p.total) }}>{Math.round((p.available / p.total) * 100)}٪ آزاد</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(p.available / p.total) * 100}%`, background: getStatusColor(p.available, p.total) }} />
                </div>
              </div>

              {/* Features */}
              <div className="flex items-center gap-2 flex-wrap">
                {p.covered && <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}>سرپوشیده</span>}
                {p.hasEv && <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}>شارژ EV</span>}
                {p.features.slice(0, 2).map((f) => (
                  <span key={f} className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}>{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Panel */}
      <div className={`${showMap ? "flex" : "hidden md:flex"} flex-1 relative flex-col`}>
        <button className="md:hidden absolute top-3 right-3 z-10 px-4 py-2 rounded-xl text-sm" style={{ background: "rgba(7,14,32,0.9)", border: "1px solid rgba(255,255,255,0.12)", color: "#94a3b8" }} onClick={() => setShowMap(false)}>
          نمایش لیست
        </button>
        <CityMap parkings={parkings} selected={selectedId} onSelect={(id) => {
          const p = parkings.find((x) => x.id === id);
          if (p) handleSelect(p);
        }} />
      </div>
    </div>
  );
}
