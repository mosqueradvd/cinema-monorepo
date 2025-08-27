import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MoviesModule } from './movies/movies.module';
import { HallsModule } from './halls/halls.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [PrismaModule, MoviesModule, HallsModule, ShowtimesModule, TicketsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
