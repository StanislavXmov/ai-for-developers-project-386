const API_BASE = "/api";

export const guestApi = {
  getEventTypes: async (): Promise<EventType[]> => {
    const res = await fetch(`${API_BASE}/event-types`);
    if (!res.ok) throw new Error("Failed to fetch event types");
    return res.json();
  },

  getSlots: async (
    eventTypeId: string,
    from: string,
    to: string,
  ): Promise<Slot[]> => {
    const params = new URLSearchParams({ from, to });
    const res = await fetch(
      `${API_BASE}/event-types/${eventTypeId}/slots?${params}`,
    );
    if (!res.ok) throw new Error("Failed to fetch slots");
    return res.json();
  },

  createBooking: async (request: CreateBookingRequest): Promise<Booking> => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error("Failed to create booking");
    return res.json();
  },
};

import type { EventType, Slot, CreateBookingRequest, Booking } from "../types/types";
