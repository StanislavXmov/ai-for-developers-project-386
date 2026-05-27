import { Injectable } from '@nestjs/common';
import { Booking, EventType, AdminSlot } from '../entities';
import { CreateEventTypeDto, CreateAdminSlotDto } from '../dtos';

@Injectable()
export class AdminService {
  private eventTypes: EventType[] = [];
  private bookings: Booking[] = [];
  private adminSlots: AdminSlot[] = [];

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

  getSlots(): AdminSlot[] {
    return this.adminSlots;
  }

  createSlots(dtos: CreateAdminSlotDto[]): AdminSlot[] {
    this.adminSlots = dtos.map(dto => ({
      dayOfWeek: dto.dayOfWeek,
      startTime: dto.startTime,
      endTime: dto.endTime,
    }));
    return this.adminSlots;
  }

  getAdminSlotForDay(dayOfWeek: number): AdminSlot | undefined {
    return this.adminSlots.find(slot => slot.dayOfWeek === dayOfWeek);
  }
}