import { useState } from "react";
import { Car, Menu, X, MapPin, Calendar, User, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

type View = "home" | "map" | "detail" | "payment" | "qr" | "reservations" | "owner" | "owner-verify";

interface HeaderProps {
  view: View;
  setView: (v: View) => void;
}

export default function Header({ view, setView }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "خانه", view: "home" as View },
    { label: "یافتن پارکینگ", view: "map" as View },
    { label: "رزروهای من", view: "reservations" as View },
    { label: "پورتال مالکین", view: "owner" as View },
  ];

  return (
    <header className="sticky top-0 z-50 w-full" style={{ background: "rgba(6,12,26,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => setView("home")} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}>
              <Car size={18} className="text-white" />
            </div>
            <span className="font-bold text-white" style={{ fontSize: "1.05rem", letterSpacing: "-0.01em" }}>پارک‌یار</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className="px-4 py-2 rounded-lg text-sm transition-all duration-200"
                style={{
                  color: view === item.view ? "#3b82f6" : "#94a3b8",
                  background: view === item.view ? "rgba(59,130,246,0.1)" : "transparent",
                  fontWeight: view === item.view ? 600 : 400,
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
              style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <User size={15} />
              <span>ورود / ثبت‌نام</span>
            </button>
            <Button
              onClick={() => setView("map")}
              className="hidden md:flex text-sm px-4 py-2 h-9"
              style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}
            >
              رزرو پارکینگ
            </Button>
            <button
              className="md:hidden p-2 rounded-lg"
              style={{ color: "#94a3b8" }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 space-y-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => { setView(item.view); setMenuOpen(false); }}
              className="w-full text-right px-4 py-3 rounded-lg text-sm block"
              style={{
                color: view === item.view ? "#3b82f6" : "#94a3b8",
                background: view === item.view ? "rgba(59,130,246,0.1)" : "transparent",
              }}
            >
              {item.label}
            </button>
          ))}
          <Button
            onClick={() => { setView("map"); setMenuOpen(false); }}
            className="w-full mt-2"
            style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}
          >
            رزرو پارکینگ
          </Button>
        </div>
      )}
    </header>
  );
}
