import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TICKET_REPOSITORY } from '../application/repositories/ticket.repository';
import type { CreateTicketUseCase } from '../application/usecases/create/create-ticket.usecase';
import { CREATE_TICKET_USE_CASE } from '../application/usecases/create/create-ticket.usecase';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateColumnDto } from '../../columns/ui/dto/create-column.dto';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    @Inject(TICKET_REPOSITORY)
    private readonly ticketsRepository: TicketsService,
    @Inject(CREATE_TICKET_USE_CASE)
    private readonly createTicket: CreateTicketUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer un ticket dans une colonne' })
  @ApiBody({ type: CreateTicketDto })
  @ApiResponse({ status: 201, description: 'Ticket créée' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  async create(@Body() createTicketDto: CreateTicketDto) {
    const created = await this.createTicket.create(createTicketDto);

    return this.createTicket.create(createTicketDto);
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
