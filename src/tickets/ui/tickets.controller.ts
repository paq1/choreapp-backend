import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import type { TicketRepository } from '../application/repositories/ticket.repository';
import { TICKET_REPOSITORY } from '../application/repositories/ticket.repository';
import type { CreateTicketUseCase } from '../application/usecases/create/create-ticket.usecase';
import { CREATE_TICKET_USE_CASE } from '../application/usecases/create/create-ticket.usecase';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  ERROR_HANDLER_SERVICE,
  type ErrorsHandlerService,
} from '../../common/errors/errors.handler';
import {
  toJsonApiMany,
  toJsonApiSingle,
} from '../../common/jsonapi/jsonapi.model';

@Controller('tickets')
export class TicketsController {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketsRepository: TicketRepository,
    @Inject(CREATE_TICKET_USE_CASE)
    private readonly createTicket: CreateTicketUseCase,
    @Inject(ERROR_HANDLER_SERVICE)
    private readonly errorHandler: ErrorsHandlerService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer un ticket dans une colonne' })
  @ApiBody({ type: CreateTicketDto })
  @ApiResponse({ status: 201, description: 'Ticket créée' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  async create(@Body() createTicketDto: CreateTicketDto) {
    const created = await this.createTicket.create(createTicketDto);
    return this.errorHandler.unwrapAndHandleErrors(created);
  }

  @Get()
  @ApiOperation({ summary: 'Recupere tout les ticket' })
  findAll() {
    return this.ticketsRepository
      .fetchAll()
      .then((entity) => toJsonApiMany(entity));
  }

  @Get(':id')
  @ApiOperation({ summary: "Recupere le ticket avec l'id métier" })
  findOne(@Param('id') id: string) {
    return this.ticketsRepository
      .fetchOne(id)
      .then((maybeEntity) => (maybeEntity ? toJsonApiSingle(maybeEntity) : {}));
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
  //   return this.ticketsService.update(+id, updateTicketDto);
  // }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un ticekt' })
  @ApiResponse({ status: 204, description: 'Ticket supprimé' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async remove(@Param('id') id: string) {
    const res = await this.ticketsRepository.deleteOne(id);
    return this.errorHandler.unwrapAndHandleErrors(res);
  }
}
