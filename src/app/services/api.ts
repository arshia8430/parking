import type { AuthUser, BookingDraft, OwnerChartPoint, OwnerDashboard, OwnerEntryLog, OwnerMetric, OwnerParking, Parking, Reservation, SearchRequest } from "../types/parking";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError("VITE_API_BASE_URL تنظیم نشده است.", 0);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(`درخواست با خطای ${response.status} مواجه شد.`, response.status);
  }

  return response.json() as Promise<T>;
}

function toNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeParking(item: any): Parking {
  return {
    id: String(item.id ?? item.parkingId ?? ""),
    name: String(item.name ?? item.title ?? ""),
    address: String(item.address ?? ""),
    price: toNumber(item.price ?? item.hourlyPrice ?? item.pricePerHour),
    surgeMultiplier: toNumber(item.surgeMultiplier ?? item.dynamicPricingMultiplier, 1),
    available: toNumber(item.available ?? item.availableSpots ?? item.freeSpots),
    total: toNumber(item.total ?? item.totalSpots ?? item.capacity),
    distanceKm: toNumber(item.distanceKm ?? item.distance),
    rating: toNumber(item.rating),
    reviews: toNumber(item.reviews ?? item.reviewCount),
    type: item.type === "manual" ? "manual" : "iot",
    hasEv: Boolean(item.hasEv ?? item.evCharger ?? item.has_ev),
    covered: Boolean(item.covered ?? item.isCovered),
    features: Array.isArray(item.features) ? item.features.map(String) : [],
    imageUrl: item.imageUrl ?? item.image_url ?? item.coverImage,
    lat: toNumber(item.lat ?? item.latitude ?? item.location?.lat),
    lng: toNumber(item.lng ?? item.longitude ?? item.location?.lng),
  };
}

function normalizeReservation(item: any): Reservation {
  return {
    id: String(item.id ?? item.reservationId ?? ""),
    parking: normalizeParking(item.parking ?? item.parkingLot ?? {}),
    date: String(item.date ?? item.startsAt?.slice?.(0, 10) ?? ""),
    from: String(item.from ?? item.startTime ?? item.startsAt?.slice?.(11, 16) ?? ""),
    to: String(item.to ?? item.endTime ?? item.endsAt?.slice?.(11, 16) ?? ""),
    total: toNumber(item.total ?? item.amount ?? item.payableAmount),
    status: ["active", "upcoming", "completed", "cancelled"].includes(item.status) ? item.status : "upcoming",
    qrToken: item.qrToken ?? item.qr_token,
  };
}

function normalizeUser(item: any): AuthUser {
  return {
    id: String(item.id ?? item.userId ?? ""),
    name: item.name ?? item.fullName,
    phone: item.phone ?? item.mobile,
    role: item.role === "owner" || item.role === "admin" ? item.role : "driver",
  };
}

function normalizeMetric(item: any): OwnerMetric {
  return {
    label: String(item.label ?? item.title ?? ""),
    value: item.value ?? 0,
    tone: ["blue", "green", "amber", "slate"].includes(item.tone) ? item.tone : "slate",
  };
}

function normalizeChartPoint(item: any): OwnerChartPoint {
  return { label: String(item.label ?? item.time ?? item.day ?? ""), value: toNumber(item.value ?? item.revenue ?? item.occupancy) };
}

function normalizeOwnerParking(item: any): OwnerParking {
  return {
    id: String(item.id ?? item.parkingId ?? ""),
    name: String(item.name ?? item.title ?? ""),
    spaces: toNumber(item.spaces ?? item.capacity ?? item.total),
    occupied: toNumber(item.occupied ?? item.occupiedSpots),
    revenue: toNumber(item.revenue ?? item.todayRevenue),
    type: item.type === "manual" ? "manual" : "iot",
    status: ["active", "maintenance", "inactive"].includes(item.status) ? item.status : "inactive",
  };
}

function normalizeEntry(item: any): OwnerEntryLog {
  return {
    id: String(item.id ?? item.entryId ?? ""),
    time: String(item.time ?? item.createdAt?.slice?.(11, 16) ?? ""),
    plate: item.plate ?? item.plateNumber,
    driver: item.driver ?? item.driverName,
    status: ["entered", "exited", "pending"].includes(item.status) ? item.status : "pending",
    type: item.type === "manual" ? "manual" : "iot",
  };
}

export const parkingApi = {
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const data = await request<any>("/auth/me");
      return data ? normalizeUser(data.user ?? data) : null;
    } catch (error) {
      if (error instanceof ApiError && (error.status === 0 || error.status === 401 || error.status === 403)) return null;
      throw error;
    }
  },

  async searchParkings(params: SearchRequest): Promise<Parking[]> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") query.set(key, String(value));
    });
    const data = await request<any[]>(`/parkings?${query.toString()}`);
    return data.map(normalizeParking);
  },

  async getReservations(): Promise<Reservation[]> {
    const data = await request<any[]>("/reservations");
    return data.map(normalizeReservation);
  },

  async createBooking(booking: BookingDraft): Promise<Reservation> {
    const data = await request<any>("/reservations", {
      method: "POST",
      body: JSON.stringify({
        parkingId: booking.parking.id,
        date: booking.date,
        from: booking.from,
        to: booking.to,
        total: booking.total,
      }),
    });
    return normalizeReservation(data);
  },

  async getOwnerDashboard(): Promise<OwnerDashboard> {
    const data = await request<any>("/owner/dashboard");
    return {
      metrics: Array.isArray(data.metrics) ? data.metrics.map(normalizeMetric) : [],
      occupancy: Array.isArray(data.occupancy) ? data.occupancy.map(normalizeChartPoint) : [],
      revenue: Array.isArray(data.revenue) ? data.revenue.map(normalizeChartPoint) : [],
      parkings: Array.isArray(data.parkings) ? data.parkings.map(normalizeOwnerParking) : [],
      entries: Array.isArray(data.entries) ? data.entries.map(normalizeEntry) : [],
    };
  },
};

export { ApiError };
