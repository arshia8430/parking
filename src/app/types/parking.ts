export type UserRole = "driver" | "owner" | "admin";

export type AuthUser = {
  id: string;
  name?: string;
  phone?: string;
  role: UserRole;
};

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

export type OwnerMetric = {
  label: string;
  value: number | string;
  tone: "blue" | "green" | "amber" | "slate";
};

export type OwnerParking = {
  id: string;
  name: string;
  spaces: number;
  occupied: number;
  revenue: number;
  type: "iot" | "manual";
  status: "active" | "maintenance" | "inactive";
};

export type OwnerEntryLog = {
  id: string;
  time: string;
  plate?: string;
  driver?: string;
  status: "entered" | "exited" | "pending";
  type: "iot" | "manual";
};

export type OwnerChartPoint = {
  label: string;
  value: number;
};

export type OwnerDashboard = {
  metrics: OwnerMetric[];
  occupancy: OwnerChartPoint[];
  revenue: OwnerChartPoint[];
  parkings: OwnerParking[];
  entries: OwnerEntryLog[];
};
