import { Module } from '@nestjs/common';
import { GuestModule } from './guest/guest.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [GuestModule, AdminModule],
})
export class AppModule {}