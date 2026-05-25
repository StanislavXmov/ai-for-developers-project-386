const API_BASE = "http://localhost:3000/api";

export const guestApi = {
  getEventTypes: async (): Promise<EventType[]> => {
    const res = await fetch(`${API_BASE}/event-types`);
    if (!res.ok) throw new Error("Failed to fetch event types");
    return res.json();
  },
};

import type { EventType } from "../types/types";
