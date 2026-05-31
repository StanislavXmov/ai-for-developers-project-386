import type { AdminSlot } from "../types/types";

const API_BASE = "/api";

export const adminApi = {
  getSlots: async (): Promise<AdminSlot[]> => {
    const res = await fetch(`${API_BASE}/admin/slots`);
    if (!res.ok) throw new Error("Failed to fetch admin slots");
    return res.json();
  },

  createSlots: async (slots: AdminSlot[]): Promise<AdminSlot[]> => {
    const res = await fetch(`${API_BASE}/admin/slots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slots),
    });
    if (!res.ok) throw new Error("Failed to create admin slots");
    return res.json();
  },

  getUpcomingBookings: async () => {
    const res = await fetch(`${API_BASE}/admin/bookings`);
    if (!res.ok) throw new Error("Failed to fetch bookings");
    return res.json();
  },

  createEventType: async (eventType: {
    id: string;
    name: string;
    description: string;
    durationMinutes: number;
  }) => {
    const res = await fetch(`${API_BASE}/admin/event-types`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventType),
    });
    if (!res.ok) throw new Error("Failed to create event type");
    return res.json();
  },
};
