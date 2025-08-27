import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { HallsService } from './halls.service';
import { ApiTags } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Min } from 'class-validator';

class CreateHallDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsInt()
  @IsPositive()
  @Min(1)
  capacity!: number;
}

class UpdateHallDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  @IsPositive()
  @Min(1)
  capacity?: number;
}

@ApiTags('halls')
@Controller('halls')
export class HallsController {
  constructor(private readonly hallsService: HallsService) {}

  @Post()
  create(@Body() dto: CreateHallDto) {
    return this.hallsService.create(dto);
  }

  @Get()
  findAll() {
    return this.hallsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hallsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHallDto) {
    return this.hallsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hallsService.remove(id);
  }
}


