export enum SlotStatus {
  Available = 'available',
  Booked = 'booked',
}

export interface Booking {
  id: string;
  eventTypeId: string;
  slotTime: string;
  guestName: string;
  guestEmail: string;
  createdAt: string;
}

export interface Error {
  code: string;
  message: string;
}

export interface EventType {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
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