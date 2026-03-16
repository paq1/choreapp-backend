import { Inject, Injectable } from '@nestjs/common';
import { err, ok, ResultAsync } from 'neverthrow';
import { Errors, ErrorType } from '../../../../common/errors/errors';
import { fromPromiseToAsync } from '../../../../common/netherthrow/helper';
import { TicketEntity } from '../../../entities/ticket.entity';
import type { TicketRepository } from '../../repositories/ticket.repository';
import { TICKET_REPOSITORY } from '../../repositories/ticket.repository';
import type { ColumnRepository } from '../../../../columns/application/repositories/column.repository';
import { COLUMN_REPOSITORY } from '../../../../columns/application/repositories/column.repository';
import { IEntity } from '../../../../common/entities/entities.model';

export interface ChangeColumnTicketIn {
  ticketId: string;
  columnId: string;
}
export const CHANGE_COLUMN_TICKET_USE_CASE = Symbol(
  'CHANGE_COLUMN_TICKET_USE_CASE',
);

export interface ChangeColumnTicketUseCase {
  change(ticket: ChangeColumnTicketIn): ResultAsync<TicketEntity, Errors>;
}

@Injectable()
export class ChangeColumnTicketUseCaseHandler implements ChangeColumnTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(COLUMN_REPOSITORY)
    private readonly columnRepository: ColumnRepository,
  ) {}

  change(ticket: ChangeColumnTicketIn): ResultAsync<TicketEntity, Errors> {
    const c: ResultAsync<TicketEntity, Errors> = fromPromiseToAsync<
      IEntity<TicketEntity>,
      Errors
    >(
      this.ticketRepository.fetchOne(ticket.ticketId).then((e) => {
        if (e !== undefined) {
          return ok(e);
        }
        return err({
          type: ErrorType.FAILURE,
          status: 400,
          errorCode: '01CAERR',
          message: 'Ticket not found',
        });
      }),
    )
      .andThen(() => {
        return fromPromiseToAsync<undefined, Errors>(
          this.columnRepository
            .columnAlreadyExistsFromId(ticket.columnId)
            .then((exists) => {
              if (!exists) {
                return err({
                  type: ErrorType.FAILURE,
                  status: 400,
                  errorCode: '01CAERR',
                  message: 'Column not found',
                });
              }
              return ok(undefined);
            }),
        );
      })
      .andThen(() => {
        return fromPromiseToAsync<undefined, Errors>(
          this.ticketRepository
            .updateColumnId(ticket.ticketId, ticket.columnId)
            .then(() => ok(undefined)),
        );
      })
      .andThen(() =>
        fromPromiseToAsync<TicketEntity, Errors>(
          this.ticketRepository.fetchOne(ticket.ticketId).then((e) => {
            if (e !== undefined) {
              return ok(e.data);
            }
            return err({
              type: ErrorType.FAILURE,
              status: 400,
              errorCode: '01CAERR',
              message: 'Ticket not found',
            });
          }),
        ),
      );
    return c;
  }
}
