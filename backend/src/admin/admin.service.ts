import { Injectable } from '@nestjs/common';
import { Booking, EventType, AdminSlot } from '../entities';
import { CreateEventTypeDto, CreateAdminSlotDto } from '../dtos';
import { JsonStorageService } from '../storage/json-storage.service';

@Injectable()
export class AdminService {
  constructor(private readonly storage: JsonStorageService) {}

  getUpcomingBookings(): Booking[] {
    const now = new Date();
    return this.storage.getBookings().filter(b => new Date(b.slotTime) > now);
  }

  createEventType(dto: CreateEventTypeDto): EventType {
    const eventType: EventType = {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      durationMinutes: dto.durationMinutes,
    };
    return this.storage.addEventType(eventType);
  }

  getSlots(): AdminSlot[] {
    return this.storage.getAdminSlots();
  }

  createSlots(dtos: CreateAdminSlotDto[]): AdminSlot[] {
    const adminSlots = dtos.map(dto => ({
      dayOfWeek: dto.dayOfWeek,
      startTime: dto.startTime,
      endTime: dto.endTime,
    }));
    return this.storage.replaceAdminSlots(adminSlots);
  }

  getAdminSlotForDay(dayOfWeek: number): AdminSlot | undefined {
    return this.storage.getAdminSlots().find(slot => slot.dayOfWeek === dayOfWeek);
  }
}
