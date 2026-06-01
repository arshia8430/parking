export type Parking = {
  id: string;
  name: string;
  address: string;
  price: number;
  surgeMultiplier: number;
  available: number;
  total: number;
  distanceKm: number;
  rating: number;
  reviews: number;
  type: "iot" | "manual";
  hasEv: boolean;
  covered: boolean;
  features: string[];
  imageUrl?: string;
  lat: number;
  lng: number;
};

export type ReservationStatus = "active" | "upcoming" | "completed" | "cancelled";

export type Reservation = {
  id: string;
  parking: Parking;
  date: string;
  from: string;
  to: string;
  total: number;
  status: ReservationStatus;
  qrToken?: string;
};

export type SearchRequest = {
  location: string;
  date: string;
  from: string;
  to: string;
  lat?: number;
  lng?: number;
};

export type BookingDraft = {
  parking: Parking;
  date: string;
  from: string;
  to: string;
  total: number;
};

export type PlatformStats = {
  activeParkings: number;
  verifiedOwners: number;
  successfulReservations: number;
  averageRating: number;
};
