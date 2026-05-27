import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateEventTypeDto, CreateAdminSlotDto } from '../dtos';
import { Booking, EventType, AdminSlot } from '../entities';

@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('bookings')
  getUpcomingBookings(): Booking[] {
    return this.adminService.getUpcomingBookings();
  }

  @Post('event-types')
  createEventType(@Body() dto: CreateEventTypeDto): EventType {
    return this.adminService.createEventType(dto);
  }

  @Get('slots')
  getSlots(): AdminSlot[] {
    return this.adminService.getSlots();
  }

  @Post('slots')
  createSlots(@Body() dtos: CreateAdminSlotDto[]): AdminSlot[] {
    return this.adminService.createSlots(dtos);
  }
}