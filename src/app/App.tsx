import { useEffect, useState } from "react";
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
import type { BookingDraft, Parking, PlatformStats, Reservation, SearchRequest } from "./types/parking";

export type View = "home" | "map" | "detail" | "payment" | "qr" | "reservations" | "owner" | "owner-verify";

const EMPTY_STATS: PlatformStats = {
  activeParkings: 0,
  verifiedOwners: 0,
  successfulReservations: 0,
  averageRating: 0,
};

export default function App() {
  const [view, setView] = useState<View>("home");
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [stats, setStats] = useState<PlatformStats>(EMPTY_STATS);
  const [selectedParking, setSelectedParking] = useState<Parking | null>(null);
  const [currentBooking, setCurrentBooking] = useState<BookingDraft | null>(null);
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
  const [searchParams, setSearchParams] = useState<SearchRequest>({ location: "", date: "", from: "", to: "" });
  const [isLoadingParkings, setIsLoadingParkings] = useState(false);
  const [parkingsError, setParkingsError] = useState<string | null>(null);

  useEffect(() => {
    parkingApi.getStats().then(setStats).catch(() => setStats(EMPTY_STATS));
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
    try {
      const reservation = await parkingApi.createBooking(currentBooking);
      setCurrentReservation(reservation);
    } catch {
      setCurrentReservation({
        id: "در انتظار ثبت نهایی",
        parking: currentBooking.parking,
        date: currentBooking.date,
        from: currentBooking.from,
        to: currentBooking.to,
        total: currentBooking.total,
        status: "upcoming",
      });
    }
    setView("qr");
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen"
      style={{
        background: "#060c1a",
        fontFamily: "'Vazirmatn', 'Tahoma', sans-serif",
        color: "#e2e8f0",
      }}
    >
      {!["payment", "qr"].includes(view) && (
        <Header view={view} setView={setView} />
      )}

      {view === "home" && (
        <HeroSection stats={stats} onSearch={handleSearch} />
      )}

      {view === "map" && (
        <MapView
          parkings={parkings}
          isLoading={isLoadingParkings}
          error={parkingsError}
          searchParams={searchParams}
          onRetry={() => loadParkings(searchParams)}
          onSelect={handleSelectParking}
        />
      )}

      {view === "detail" && selectedParking && (
        <ParkingDetail
          parking={selectedParking}
          searchParams={searchParams}
          onBack={() => setView("map")}
          onBook={handleBook}
        />
      )}

      {view === "payment" && currentBooking && (
        <PaymentView
          booking={currentBooking}
          onBack={() => setView("detail")}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {view === "qr" && (currentReservation || currentBooking) && (
        <QRCodeDisplay
          booking={currentReservation ?? currentBooking!}
          onDone={() => setView("home")}
        />
      )}

      {view === "reservations" && (
        <MyReservations
          onShowQR={(r) => {
            setCurrentBooking({
              parking: r.parking,
              date: r.date,
              from: r.from,
              to: r.to,
              total: r.total,
            });
            setCurrentReservation(r);
            setView("qr");
          }}
        />
      )}

      {view === "owner" && (
        <OwnerPortal onVerify={() => setView("owner-verify")} />
      )}

      {view === "owner-verify" && (
        <OwnerVerification
          onBack={() => setView("owner")}
          onComplete={() => setView("owner")}
        />
      )}

      <Toaster />
    </div>
  );
}
