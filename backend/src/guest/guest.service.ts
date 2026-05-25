import { Injectable } from "@nestjs/common";
import { EventType, Slot, SlotStatus, Booking } from "../entities";
import { CreateBookingDto } from "../dtos";

@Injectable()
export class GuestService {
  private readonly workdayStartHour = 9;
  private readonly workdayEndHour = 17;

  private eventTypes: EventType[] = [
    {
      id: "1",
      name: "Consultation",
      description: "30-minute consultation call",
      durationMinutes: 30,
    },
    {
      id: "2",
      name: "Demo",
      description: "Product demo session",
      durationMinutes: 60,
    },
  ];

  private bookings: Booking[] = [];

  getEventTypes(): EventType[] {
    return this.eventTypes;
  }

  getSlots(eventTypeId: string, from: string, to: string): Slot[] {
    console.log({ eventTypeId, from, to });

    const eventType = this.eventTypes.find((type) => type.id === eventTypeId);
    if (!eventType) {
      return [];
    }

    const fromDate = from ? new Date(from) : new Date();
    const now = new Date();
    const endOfCurrentMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999),
    );
    const toDate = to ? new Date(to) : endOfCurrentMonth;
    console.log({ fromDate, toDate });

    const slots: Slot[] = [];
    const currentDay = new Date(fromDate);
    currentDay.setUTCHours(0, 0, 0, 0);

    while (currentDay <= toDate) {
      const slotTime = new Date(currentDay);
      slotTime.setUTCHours(this.workdayStartHour, 0, 0, 0);

      const workdayEnd = new Date(currentDay);
      workdayEnd.setUTCHours(this.workdayEndHour, 0, 0, 0);

      while (slotTime < workdayEnd) {
        const slotEnd = new Date(
          slotTime.getTime() + eventType.durationMinutes * 60 * 1000,
        );

        if (slotEnd > workdayEnd) {
          break;
        }

        if (slotTime >= fromDate && slotTime <= toDate) {
          const startTime = slotTime.toISOString();
          const isBooked = this.bookings.some(
            (booking) =>
              booking.eventTypeId === eventTypeId &&
              booking.slotTime === startTime,
          );

          slots.push({
            startTime,
            eventTypeId,
            status: isBooked ? SlotStatus.Booked : SlotStatus.Available,
          });
        }

        slotTime.setUTCMinutes(
          slotTime.getUTCMinutes() + eventType.durationMinutes,
        );
      }

      currentDay.setUTCDate(currentDay.getUTCDate() + 1);
    }

    return slots;
  }

  createBooking(dto: CreateBookingDto): Booking {
    const booking: Booking = {
      id: crypto.randomUUID(),
      ...dto,
      createdAt: new Date().toISOString(),
    };
    this.bookings.push(booking);

    return booking;
  }
}
