import { Injectable } from "@nestjs/common";
import { EventType, Slot, SlotStatus, Booking } from "../entities";
import { CreateBookingDto } from "../dtos";
import { AdminService } from "../admin/admin.service";
import { JsonStorageService } from "../storage/json-storage.service";

@Injectable()
export class GuestService {
  constructor(
    private readonly adminService: AdminService,
    private readonly storage: JsonStorageService,
  ) {}

  getEventTypes(): EventType[] {
    return this.storage.getEventTypes();
  }

  getSlots(eventTypeId: string, from: string, to: string): Slot[] {
    console.log({ eventTypeId, from, to });

    const eventType = this.storage
      .getEventTypes()
      .find((type) => type.id === eventTypeId);
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
    currentDay.setHours(0, 0, 0, 0);

    while (currentDay <= toDate) {
      const dayOfWeek = currentDay.getDay();
      const adminSlot = this.adminService.getAdminSlotForDay(dayOfWeek);

      if (!adminSlot) {
        currentDay.setDate(currentDay.getDate() + 1);
        continue;
      }

      const [startHour, startMinute] = adminSlot.startTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = adminSlot.endTime.split(":").map(Number);

      const slotTime = new Date(currentDay);
      slotTime.setHours(startHour, startMinute, 0, 0);

      const workdayEnd = new Date(currentDay);
      workdayEnd.setHours(endHour, endMinute, 0, 0);

      while (slotTime < workdayEnd) {
        const slotEnd = new Date(
          slotTime.getTime() + eventType.durationMinutes * 60 * 1000,
        );

        if (slotEnd > workdayEnd) {
          break;
        }

        if (slotTime >= fromDate && slotTime <= toDate) {
          const startTime = slotTime.toISOString();
          const isBooked = this.storage.getBookings().some(
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

        slotTime.setMinutes(slotTime.getMinutes() + eventType.durationMinutes);
      }

      currentDay.setDate(currentDay.getDate() + 1);
    }

    return slots;
  }

  createBooking(dto: CreateBookingDto): Booking {
    const booking: Booking = {
      id: crypto.randomUUID(),
      ...dto,
      createdAt: new Date().toISOString(),
    };

    return this.storage.addBooking(booking);
  }
}
