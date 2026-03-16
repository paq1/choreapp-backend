import { Inject, Injectable } from '@nestjs/common';
import { errAsync, ok, okAsync, ResultAsync } from 'neverthrow';
import { Errors, ErrorType } from '../../../../common/errors/errors';
import { randomUUID } from 'node:crypto';
import {
  fromPromiseToAsync,
  toAsync,
} from '../../../../common/netherthrow/helper';
import { TicketEntity } from '../../../entities/ticket.entity';
import type { TicketRepository } from '../../repositories/ticket.repository';
import { TICKET_REPOSITORY } from '../../repositories/ticket.repository';
import type { ColumnRepository } from '../../../../columns/application/repositories/column.repository';
import { COLUMN_REPOSITORY } from '../../../../columns/application/repositories/column.repository';

export interface CreateTicketIn {
  title: string;
  columnId: string;
  description?: string;
}
export const CREATE_TICKET_USE_CASE = Symbol('CREATE_TICKET_USE_CASE');

export interface CreateTicketUseCase {
  create(ticket: CreateTicketIn): ResultAsync<TicketEntity, Errors>;
}

@Injectable()
export class CreateTicketUseCaseHandler implements CreateTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(COLUMN_REPOSITORY)
    private readonly columnRepository: ColumnRepository,
  ) {}

  create(ticket: CreateTicketIn): ResultAsync<TicketEntity, Errors> {
    return fromPromiseToAsync(
      this.columnRepository
        .fetchOne(ticket.columnId)
        .then((e) => e !== undefined)
        .then((e) => ok(e)),
    ).andThen((exists) => {
      if (!exists) {
        return errAsync<TicketEntity, Errors>({
          type: ErrorType.FAILURE,
          status: 400,
          errorCode: '01CAERR',
          message: 'Column not found',
        });
      } else {
        return this.createTicket(ticket);
      }
    });
  }

  private createTicket(
    ticket: CreateTicketIn,
  ): ResultAsync<TicketEntity, Errors> {
    const title = ticket.title;
    const description = ticket.description;
    const columnId = ticket.columnId;
    const id = randomUUID().valueOf();

    return okAsync(1) // TODO : compute next order
      .andThen((order) => {
        const entityR = TicketEntity.safeCreate({
          title,
          order,
          columnId,
          description,
        });
        return toAsync(entityR);
      })
      .andThen((ticket) => {
        const entity = {
          type: 'ticket',
          data: ticket,
          id: id,
          version: 1,
        };
        const resEntity = this.ticketRepository
          .createOne(entity, id)
          .then(() => ticket);

        return ResultAsync.fromSafePromise<TicketEntity, Errors>(resEntity);
      });
  }
}
