import { Injectable } from '@nestjs/common';
import { Booking, EventType } from '../entities';
import { CreateEventTypeDto } from '../dtos';

@Injectable()
export class AdminService {
  private eventTypes: EventType[] = [];
  private bookings: Booking[] = [];

  getUpcomingBookings(): Booking[] {
    const now = new Date();
    return this.bookings.filter(b => new Date(b.slotTime) > now);
  }

  createEventType(dto: CreateEventTypeDto): EventType {
    const eventType: EventType = {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      durationMinutes: dto.durationMinutes,
    };
    this.eventTypes.push(eventType);
    return eventType;
  }
}