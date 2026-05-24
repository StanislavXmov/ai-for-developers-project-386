import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateEventTypeDto } from '../dtos';
import { Booking, EventType } from '../entities';

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
}