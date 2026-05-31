import { Module } from '@nestjs/common';
import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';
import { AdminModule } from '../admin/admin.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [AdminModule, StorageModule],
  controllers: [GuestController],
  providers: [GuestService],
})
export class GuestModule {}
