import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { ApiTags } from '@nestjs/swagger';
import { IsDateString, IsInt, IsPositive } from 'class-validator';

class CreateShowtimeDto {
  @IsInt()
  @IsPositive()
  movieId!: number;

  @IsInt()
  @IsPositive()
  hallId!: number;

  @IsDateString()
  startsAt!: string;
}

@ApiTags('showtimes')
@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  create(@Body() dto: CreateShowtimeDto) {
    return this.showtimesService.create({
      movieId: dto.movieId,
      hallId: dto.hallId,
      startsAt: new Date(dto.startsAt),
    });
  }

  @Get()
  findAll() {
    return this.showtimesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.showtimesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.showtimesService.remove(id);
  }
}


