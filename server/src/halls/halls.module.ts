import { Module } from '@nestjs/common';
import { HallsService } from './halls.service';
import { HallsController } from './halls.controller';

@Module({
  controllers: [HallsController],
  providers: [HallsService],
})
export class HallsModule {}


