import "@typespec/http";
import "@typespec/rest";

using TypeSpec.Http;
using TypeSpec.Rest;

model Owner {
  id: string;
  name: string;
  email: string;
}

model EventType {
  id: string;
  name: string;
  description: string;
  durationMinutes: int32;
}

model Slot {
  startTime: string;
  eventTypeId: string;
  status: SlotStatus;
}

model AdminSlot {
  dayOfWeek: int32;
  startTime: string;
  endTime: string;
}

enum SlotStatus {
  available,
  booked,
}

model Booking {
  id: string;
  eventTypeId: string;
  slotTime: string;
  guestName: string;
  guestEmail: string;
  createdAt: string;
}

@error
model Error {
  code: string;
  message: string;
}

@tag("Guest")
interface GuestApi {
  @route("/api/event-types")
  @get
  getEventTypes(): EventType[];

  @route("/api/event-types/{eventTypeId}/slots")
  @get
  getSlots(
    @path eventTypeId: string,
    @query from: string,
    @query to: string
  ): Slot[];

  @route("/api/bookings")
  @post
  createBooking(@body booking: {
    eventTypeId: string;
    slotTime: string;
    guestName: string;
    guestEmail: string;
  }): Booking | Error;
}

@tag("Admin")
interface AdminApi {
  @route("/api/admin/event-types")
  @post
  createEventType(@body eventType: {
    id: string;
    name: string;
    description: string;
    durationMinutes: int32;
  }): EventType;

  @route("/api/admin/bookings")
  @get
  getUpcomingBookings(): Booking[];

  @route("/api/admin/slots")
  @get
  getSlots(): AdminSlot[];

  @route("/api/admin/slots")
  @post
  createSlots(@body slots: AdminSlot[]): AdminSlot[];
}