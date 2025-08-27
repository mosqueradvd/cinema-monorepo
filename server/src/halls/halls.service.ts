import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class HallsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.CinemaHallCreateInput) {
    return this.prisma.cinemaHall.create({ data });
  }

  findAll() {
    return this.prisma.cinemaHall.findMany();
  }

  async findOne(id: number) {
    const hall = await this.prisma.cinemaHall.findUnique({ where: { id } });
    if (!hall) throw new NotFoundException('Hall not found');
    return hall;
  }

  async update(id: number, data: Prisma.CinemaHallUpdateInput) {
    await this.findOne(id);
    return this.prisma.cinemaHall.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cinemaHall.delete({ where: { id } });
  }
}


