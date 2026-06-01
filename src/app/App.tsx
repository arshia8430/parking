import { useState } from "react";
import { Toaster } from "./components/ui/sonner";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import MapView from "./components/MapView";
import type { Parking } from "./components/MapView";
import ParkingDetail from "./components/ParkingDetail";
import PaymentView from "./components/PaymentView";
import QRCodeDisplay from "./components/QRCodeDisplay";
import MyReservations from "./components/MyReservations";
import OwnerPortal from "./components/OwnerPortal";
import OwnerVerification from "./components/OwnerVerification";

export type View = "home" | "map" | "detail" | "payment" | "qr" | "reservations" | "owner" | "owner-verify";

const PARKINGS: Parking[] = [
  {
    id: 1,
    name: "پارکینگ مجتمع آزادی",
    address: "خیابان آزادی، پلاک ۴۵",
    price: 25000,
    surgeMultiplier: 1,
    available: 8,
    total: 20,
    distance: "۰.۳",
    rating: 4.7,
    reviews: 142,
    type: "iot",
    hasEv: true,
    covered: true,
    features: ["دوربین ۲۴ ساعته", "روشنایی کامل"],
    mapX: 145,
    mapY: 163,
    imageUrl: "https://images.unsplash.com/photo-1548343361-02248be15911?w=600&h=300&fit=crop&auto=format",
  },
  {
    id: 2,
    name: "پارکینگ مرکزی بهشت",
    address: "بلوار کشاورز، نرسیده به میدان",
    price: 30000,
    surgeMultiplier: 1.5,
    available: 4,
    total: 35,
    distance: "۰.۷",
    rating: 4.5,
    reviews: 89,
    type: "manual",
    hasEv: false,
    covered: true,
    features: ["نگهبان ۲۴ ساعته", "ورود با QR"],
    mapX: 340,
    mapY: 163,
    imageUrl: "https://images.unsplash.com/photo-1619335680796-54f13b88c6ba?w=600&h=300&fit=crop&auto=format",
  },
  {
    id: 3,
    name: "پارکینگ پارک ملی",
    address: "خیابان ولیعصر، روبروی پارک",
    price: 22000,
    surgeMultiplier: 1,
    available: 12,
    total: 25,
    distance: "۱.۱",
    rating: 4.3,
    reviews: 215,
    type: "iot",
    hasEv: true,
    covered: false,
    features: ["شارژر خودرو برقی", "باز روباز"],
    mapX: 510,
    mapY: 295,
    imageUrl: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&h=300&fit=crop&auto=format",
  },
  {
    id: 4,
    name: "پارکینگ تجریش پلاس",
    address: "خیابان شریعتی، تقاطع جردن",
    price: 40000,
    surgeMultiplier: 2,
    available: 2,
    total: 15,
    distance: "۱.۶",
    rating: 4.8,
    reviews: 67,
    type: "iot",
    hasEv: true,
    covered: true,
    features: ["VIP", "شارژ سریع EV"],
    mapX: 695,
    mapY: 163,
    imageUrl: "https://images.unsplash.com/photo-1569872011373-0070303cd859?w=600&h=300&fit=crop&auto=format",
  },
  {
    id: 5,
    name: "پارکینگ امیرآباد مرکزی",
    address: "خیابان امیرآباد، کوچه دوم",
    price: 18000,
    surgeMultiplier: 1,
    available: 14,
    total: 20,
    distance: "۰.۹",
    rating: 4.1,
    reviews: 103,
    type: "manual",
    hasEv: false,
    covered: false,
    features: ["ارزان‌قیمت", "نزدیک مترو"],
    mapX: 340,
    mapY: 430,
    imageUrl: "https://images.unsplash.com/photo-1593280405106-e438ebe93f5b?w=600&h=300&fit=crop&auto=format",
  },
  {
    id: 6,
    name: "پارکینگ سعادت‌آباد",
    address: "سعادت‌آباد، میدان کاج",
    price: 28000,
    surgeMultiplier: 1,
    available: 9,
    total: 18,
    distance: "۲.۲",
    rating: 4.6,
    reviews: 178,
    type: "iot",
    hasEv: false,
    covered: true,
    features: ["سرپوشیده", "امنیت بالا"],
    mapX: 695,
    mapY: 430,
    imageUrl: "https://images.unsplash.com/photo-1724274876097-103bb600debb?w=600&h=300&fit=crop&auto=format",
  },
];

export default function App() {
  const [view, setView] = useState<View>("home");
  const [selectedParking, setSelectedParking] = useState<Parking | null>(null);
  const [currentBooking, setCurrentBooking] = useState<{ parking: Parking; date: string; from: string; to: string; total: number } | null>(null);

  const handleSelectParking = (p: Parking) => {
    setSelectedParking(p);
    setView("detail");
  };

  const handleBook = (booking: typeof currentBooking) => {
    setCurrentBooking(booking);
    setView("payment");
  };

  const handlePaymentSuccess = () => {
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
      {/* Header always visible except full-screen flows */}
      {!["payment", "qr"].includes(view) && (
        <Header view={view} setView={setView} />
      )}

      {/* Views */}
      {view === "home" && (
        <HeroSection
          onSearch={() => setView("map")}
        />
      )}

      {view === "map" && (
        <MapView parkings={PARKINGS} onSelect={handleSelectParking} />
      )}

      {view === "detail" && selectedParking && (
        <ParkingDetail
          parking={selectedParking}
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

      {view === "qr" && currentBooking && (
        <QRCodeDisplay
          booking={currentBooking}
          onDone={() => setView("home")}
        />
      )}

      {view === "reservations" && (
        <MyReservations
          parkings={PARKINGS}
          onShowQR={(r) => {
            setCurrentBooking({
              parking: r.parking,
              date: r.date,
              from: r.from,
              to: r.to,
              total: r.total,
            });
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
