import { useState } from "react";
import { Car, LayoutDashboard, Loader2, LogIn, Menu, Search, X } from "lucide-react";
import { Button } from "./ui/button";
import type { View } from "../App";
import type { AuthUser } from "../types/parking";

interface HeaderProps {
  view: View;
  user: AuthUser | null;
  isAuthLoading: boolean;
  setView: (v: View) => void;
  onAccountClick: () => void;
}

export default function Header({ view, user, isAuthLoading, setView, onAccountClick }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const dashboardLabel = user?.role === "owner" || user?.role === "admin" ? "داشبورد مالک" : "رزروهای من";
  const dashboardView: View = user?.role === "owner" || user?.role === "admin" ? "owner" : "reservations";

  const goToDashboard = () => {
    if (user) setView(dashboardView);
    else onAccountClick();
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full" style={{ background: "rgba(6,12,26,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <button onClick={() => setView("home")} className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}>
              <Car size={18} className="text-white" />
            </div>
            <span className="font-bold text-white" style={{ fontSize: "1.05rem", letterSpacing: "-0.01em" }}>پارک‌یار</span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            <button onClick={() => setView("home")} className="rounded-lg px-4 py-2 text-sm transition-all" style={{ color: view === "home" ? "#3b82f6" : "#94a3b8", background: view === "home" ? "rgba(59,130,246,0.1)" : "transparent", fontWeight: view === "home" ? 600 : 400 }}>
              جستجو
            </button>
            {user && (
              <button onClick={goToDashboard} className="rounded-lg px-4 py-2 text-sm transition-all" style={{ color: view === dashboardView ? "#3b82f6" : "#94a3b8", background: view === dashboardView ? "rgba(59,130,246,0.1)" : "transparent", fontWeight: view === dashboardView ? 600 : 400 }}>
                {dashboardLabel}
              </button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all md:flex" style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }} onClick={onAccountClick} disabled={isAuthLoading}>
              {isAuthLoading ? <Loader2 size={15} className="animate-spin" /> : user ? <LayoutDashboard size={15} /> : <LogIn size={15} />}
              <span>{user ? dashboardLabel : "ورود"}</span>
            </button>
            <Button onClick={() => setView("home")} className="hidden h-9 px-4 py-2 text-sm md:flex" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
              <Search size={15} className="ml-1.5" />
              شروع جستجو
            </Button>
            <button className="rounded-lg p-2 md:hidden" style={{ color: "#94a3b8" }} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="space-y-1 px-4 pb-4 pt-2 md:hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={() => { setView("home"); setMenuOpen(false); }} className="block w-full rounded-lg px-4 py-3 text-right text-sm" style={{ color: view === "home" ? "#3b82f6" : "#94a3b8", background: view === "home" ? "rgba(59,130,246,0.1)" : "transparent" }}>
            جستجو
          </button>
          {user && (
            <button onClick={goToDashboard} className="block w-full rounded-lg px-4 py-3 text-right text-sm" style={{ color: view === dashboardView ? "#3b82f6" : "#94a3b8", background: view === dashboardView ? "rgba(59,130,246,0.1)" : "transparent" }}>
              {dashboardLabel}
            </button>
          )}
          <Button onClick={() => { onAccountClick(); setMenuOpen(false); }} className="mt-2 w-full" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }} disabled={isAuthLoading}>
            {user ? dashboardLabel : "ورود"}
          </Button>
        </div>
      )}
    </header>
  );
}
