import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.MovieCreateInput) {
    return this.prisma.movie.create({ data });
  }

  findAll() {
    return this.prisma.movie.findMany();
  }

  async findOne(id: number) {
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async update(id: number, data: Prisma.MovieUpdateInput) {
    await this.findOne(id);
    return this.prisma.movie.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.movie.delete({ where: { id } });
  }
}


