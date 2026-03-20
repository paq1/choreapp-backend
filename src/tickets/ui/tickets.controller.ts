import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
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
import type { ChangeColumnTicketUseCase } from '../application/usecases/create/change-column-ticket.usecase';
import { CHANGE_COLUMN_TICKET_USE_CASE } from '../application/usecases/create/change-column-ticket.usecase';
import {
  ChangeColumnTicketDto,
  MoveTicketDto,
} from './dto/change-column-ticket.dto';
import type { MoveRightOrLeftUseCase } from '../application/usecases/create/move-right-or-left.usecase';
import { MOVE_RIGHT_OR_LEFT_USE_CASE } from '../application/usecases/create/move-right-or-left.usecase';

@Controller('tickets')
export class TicketsController {
  private readonly logger = new Logger(TicketsController.name);

  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketsRepository: TicketRepository,
    @Inject(CREATE_TICKET_USE_CASE)
    private readonly createTicket: CreateTicketUseCase,
    @Inject(CHANGE_COLUMN_TICKET_USE_CASE)
    private readonly changeColumnTicket: ChangeColumnTicketUseCase,
    @Inject(MOVE_RIGHT_OR_LEFT_USE_CASE)
    private readonly moveRightOrLeft: MoveRightOrLeftUseCase,
    @Inject(ERROR_HANDLER_SERVICE)
    private readonly errorHandler: ErrorsHandlerService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer un ticket dans une colonne' })
  @ApiBody({ type: CreateTicketDto })
  @ApiResponse({ status: 201, description: 'Ticket créée' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  async create(@Body() createTicketDto: CreateTicketDto) {
    this.logger.log(`demande de creation de ticket [${createTicketDto.title}]`);
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

  @Patch(':id/command/change-column')
  @ApiOperation({ summary: 'Change le ticket de colonne' })
  async changeColumn(
    @Param('id') id: string,
    @Body() updateTicketDto: ChangeColumnTicketDto,
  ) {
    const updated = await this.changeColumnTicket.change({
      columnId: updateTicketDto.columnId,
      ticketId: id,
    });
    return this.errorHandler.unwrapAndHandleErrors(updated);
  }

  @Patch(':id/command/move-left-or-right')
  @ApiOperation({ summary: 'Bouge le ticket vers la gauche' })
  async moveLeftOrRight(@Param('id') id: string, @Body() cmd: MoveTicketDto) {
    const updated = await this.moveRightOrLeft.move({
      direction: cmd.direction,
      ticketId: id,
    });
    return this.errorHandler.unwrapAndHandleErrors(updated);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un ticekt' })
  @ApiResponse({ status: 204, description: 'Ticket supprimé' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async remove(@Param('id') id: string) {
    const res = await this.ticketsRepository.deleteOne(id);
    return this.errorHandler.unwrapAndHandleErrors(res);
  }
}
