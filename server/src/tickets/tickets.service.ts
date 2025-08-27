import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async purchase(showtimeId: number) {
    return this.prisma.$transaction(async (tx) => {
      const showtime = await tx.showtime.findUnique({
        where: { id: showtimeId },
        include: { hall: true },
      });
      if (!showtime) throw new NotFoundException('Showtime not found');

      const count = await tx.ticket.count({ where: { showtimeId } });
      if (count >= showtime.hall.capacity) {
        throw new BadRequestException('Capacidad de la sala alcanzada');
      }
      return tx.ticket.create({ data: { showtimeId } });
    });
  }
}


