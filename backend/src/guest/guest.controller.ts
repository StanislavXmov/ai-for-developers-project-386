import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { GuestService } from './guest.service';
import { CreateBookingDto } from '../dtos';
import { Booking, EventType, Slot } from '../entities';

@Controller('api')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Get('event-types')
  getEventTypes(): EventType[] {
    return this.guestService.getEventTypes();
  }

  @Get('event-types/:eventTypeId/slots')
  getSlots(
    @Param('eventTypeId') eventTypeId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ): Slot[] {
    return this.guestService.getSlots(eventTypeId, from, to);
  }

  @Post('bookings')
  createBooking(@Body() dto: CreateBookingDto): Booking {
    return this.guestService.createBooking(dto);
  }
}