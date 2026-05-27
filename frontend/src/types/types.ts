export type SlotStatus = "available" | "booked";

export interface Error {
  code: string;
  message: string;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
}

export interface Slot {
  startTime: string;
  eventTypeId: string;
  status: SlotStatus;
}

export interface EventType {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
}

export interface AdminSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Booking {
  id: string;
  eventTypeId: string;
  slotTime: string;
  guestName: string;
  guestEmail: string;
  createdAt: string;
}

export interface CreateBookingRequest {
  eventTypeId: string;
  slotTime: string;
  guestName: string;
  guestEmail: string;
}

export interface CreateEventTypeRequest {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
}

export interface GetSlotsParams {
  eventTypeId: string;
  from: string;
  to: string;
}

export type AdminApi = {
  getUpcomingBookings: () => Promise<Booking[]>;
  createEventType: (request: CreateEventTypeRequest) => Promise<EventType>;
  getSlots: () => Promise<AdminSlot[]>;
  createSlots: (slots: AdminSlot[]) => Promise<AdminSlot[]>;
};

export type GuestApi = {
  getEventTypes: () => Promise<EventType[]>;
  getSlots: (params: GetSlotsParams) => Promise<Slot[]>;
  createBooking: (request: CreateBookingRequest) => Promise<Booking>;
};
