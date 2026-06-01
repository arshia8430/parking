import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import MapView from "./components/MapView";
import ParkingDetail from "./components/ParkingDetail";
import PaymentView from "./components/PaymentView";
import QRCodeDisplay from "./components/QRCodeDisplay";
import MyReservations from "./components/MyReservations";
import OwnerPortal from "./components/OwnerPortal";
import OwnerVerification from "./components/OwnerVerification";
import { parkingApi } from "./services/api";
import type { AuthUser, BookingDraft, Parking, Reservation, SearchRequest } from "./types/parking";

export type View = "home" | "map" | "detail" | "payment" | "qr" | "reservations" | "owner" | "owner-verify";

function getRoleLanding(user: AuthUser): View {
  if (user.role === "owner" || user.role === "admin") return "owner";
  return "reservations";
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [selectedParking, setSelectedParking] = useState<Parking | null>(null);
  const [currentBooking, setCurrentBooking] = useState<BookingDraft | null>(null);
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
  const [searchParams, setSearchParams] = useState<SearchRequest>({ location: "", date: "", from: "", to: "" });
  const [isLoadingParkings, setIsLoadingParkings] = useState(false);
  const [parkingsError, setParkingsError] = useState<string | null>(null);

  useEffect(() => {
    setIsAuthLoading(true);
    parkingApi.getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setIsAuthLoading(false));
  }, []);

  const loadParkings = async (params: SearchRequest) => {
    setIsLoadingParkings(true);
    setParkingsError(null);
    try {
      const data = await parkingApi.searchParkings(params);
      setParkings(data);
    } catch (error) {
      setParkings([]);
      setParkingsError(error instanceof Error ? error.message : "خطا در دریافت لیست پارکینگ‌ها");
    } finally {
      setIsLoadingParkings(false);
    }
  };

  const handleSearch = (query: SearchRequest) => {
    setSearchParams(query);
    setView("map");
    void loadParkings(query);
  };

  const handleSelectParking = (p: Parking) => {
    setSelectedParking(p);
    setView("detail");
  };

  const handleBook = (booking: BookingDraft) => {
    setCurrentBooking(booking);
    setView("payment");
  };

  const handlePaymentSuccess = async () => {
    if (!currentBooking) return;
    const reservation = await parkingApi.createBooking(currentBooking);
    setCurrentReservation(reservation);
    setView("qr");
  };

  const handleAccountClick = async () => {
    if (user) {
      setView(getRoleLanding(user));
      return;
    }

    setIsAuthLoading(true);
    try {
      const currentUser = await parkingApi.getCurrentUser();
      if (!currentUser) {
        toast.error("برای ورود، ابتدا باید در سرویس احراز هویت بک‌اند نشست فعال داشته باشید.");
        return;
      }
      setUser(currentUser);
      setView(getRoleLanding(currentUser));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در دریافت وضعیت ورود");
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen" style={{ background: "#060c1a", fontFamily: "'Vazirmatn', 'Tahoma', sans-serif", color: "#e2e8f0" }}>
      {!["payment", "qr"].includes(view) && (
        <Header view={view} user={user} isAuthLoading={isAuthLoading} setView={setView} onAccountClick={handleAccountClick} />
      )}

      {view === "home" && <HeroSection onSearch={handleSearch} />}

      {view === "map" && (
        <MapView parkings={parkings} isLoading={isLoadingParkings} error={parkingsError} searchParams={searchParams} onRetry={() => loadParkings(searchParams)} onSelect={handleSelectParking} />
      )}

      {view === "detail" && selectedParking && (
        <ParkingDetail parking={selectedParking} searchParams={searchParams} onBack={() => setView("map")} onBook={handleBook} />
      )}

      {view === "payment" && currentBooking && (
        <PaymentView booking={currentBooking} onBack={() => setView("detail")} onSuccess={handlePaymentSuccess} />
      )}

      {view === "qr" && currentReservation && (
        <QRCodeDisplay booking={currentReservation} onDone={() => setView("home")} />
      )}

      {view === "reservations" && user?.role === "driver" && (
        <MyReservations onShowQR={(r) => { setCurrentReservation(r); setView("qr"); }} />
      )}

      {view === "reservations" && user && user.role !== "driver" && <OwnerPortal onVerify={() => setView("owner-verify")} />}

      {view === "owner" && user && (user.role === "owner" || user.role === "admin") && (
        <OwnerPortal onVerify={() => setView("owner-verify")} />
      )}

      {view === "owner-verify" && user && (user.role === "owner" || user.role === "admin") && (
        <OwnerVerification onBack={() => setView("owner")} onComplete={() => setView("owner")} />
      )}

      <Toaster />
    </div>
  );
}
