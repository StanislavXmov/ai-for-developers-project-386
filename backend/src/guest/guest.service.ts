import { Injectable } from '@nestjs/common';
import { EventType, Slot, SlotStatus, Booking } from '../entities';
import { CreateBookingDto } from '../dtos';

@Injectable()
export class GuestService {
  private eventTypes: EventType[] = [
    {
      id: '1',
      name: 'Consultation',
      description: '30-minute consultation call',
      durationMinutes: 30,
    },
    {
      id: '2',
      name: 'Demo',
      description: 'Product demo session',
      durationMinutes: 60,
    },
  ];

  private slots: Slot[] = [
    { startTime: '2026-05-25T10:00:00Z', eventTypeId: '1', status: SlotStatus.Available },
    { startTime: '2026-05-25T11:00:00Z', eventTypeId: '1', status: SlotStatus.Available },
    { startTime: '2026-05-26T10:00:00Z', eventTypeId: '1', status: SlotStatus.Booked },
    { startTime: '2026-05-25T14:00:00Z', eventTypeId: '2', status: SlotStatus.Available },
  ];

  private bookings: Booking[] = [];

  getEventTypes(): EventType[] {
    return this.eventTypes;
  }

  getSlots(eventTypeId: string, from: string, to: string): Slot[] {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    return this.slots.filter(slot => {
      const slotDate = new Date(slot.startTime);
      return (
        slot.eventTypeId === eventTypeId &&
        slotDate >= fromDate &&
        slotDate <= toDate
      );
    });
  }

  createBooking(dto: CreateBookingDto): Booking {
    const booking: Booking = {
      id: crypto.randomUUID(),
      ...dto,
      createdAt: new Date().toISOString(),
    };
    this.bookings.push(booking);

    const slotIndex = this.slots.findIndex(
      s => s.eventTypeId === dto.eventTypeId && s.startTime === dto.slotTime,
    );
    if (slotIndex !== -1) {
      this.slots[slotIndex].status = SlotStatus.Booked;
    }

    return booking;
  }
}