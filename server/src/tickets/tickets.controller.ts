import { Body, Controller, Post } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { ApiTags } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

class PurchaseTicketDto {
  @IsInt()
  @IsPositive()
  showtimeId!: number;
}

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('purchase')
  purchase(@Body() dto: PurchaseTicketDto) {
    return this.ticketsService.purchase(dto.showtimeId);
  }
}


