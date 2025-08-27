import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ShowtimesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { movieId: number; hallId: number; startsAt: Date }) {
    if (data.startsAt.getTime() < Date.now()) {
      throw new BadRequestException('No se pueden crear funciones en el pasado');
    }
    // Validate existence
    const [movie, hall] = await Promise.all([
      this.prisma.movie.findUnique({ where: { id: data.movieId } }),
      this.prisma.cinemaHall.findUnique({ where: { id: data.hallId } }),
    ]);
    if (!movie) throw new NotFoundException('Movie not found');
    if (!hall) throw new NotFoundException('Hall not found');

    return this.prisma.showtime.create({ data });
  }

  async findAll() {
    const showtimes = await this.prisma.showtime.findMany({ 
      include: { 
        hall: true, 
        movie: true,
        tickets: true 
      } 
    });

    // Add ticket count to each showtime
    return showtimes.map(showtime => ({
      ...showtime,
      ticketsSold: showtime.tickets.length,
      isSoldOut: showtime.tickets.length >= showtime.hall.capacity
    }));
  }

  async findOne(id: number) {
    const st = await this.prisma.showtime.findUnique({
      where: { id },
      include: { 
        hall: true, 
        movie: true,
        tickets: true 
      },
    });
    if (!st) throw new NotFoundException('Showtime not found');
    
    return {
      ...st,
      ticketsSold: st.tickets.length,
      isSoldOut: st.tickets.length >= st.hall.capacity
    };
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.showtime.delete({ where: { id } });
  }
}


