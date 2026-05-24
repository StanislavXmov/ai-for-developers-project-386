import { IsString, IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateEventTypeDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  durationMinutes: number;
}