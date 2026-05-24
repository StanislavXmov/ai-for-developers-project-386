import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  eventTypeId: string;

  @IsString()
  @IsNotEmpty()
  slotTime: string;

  @IsString()
  @IsNotEmpty()
  guestName: string;

  @IsEmail()
  @IsNotEmpty()
  guestEmail: string;
}