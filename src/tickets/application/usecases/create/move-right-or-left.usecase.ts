import { Inject, Injectable } from '@nestjs/common';
import { err, ok, okAsync, Result, ResultAsync } from 'neverthrow';
import { Errors, ErrorType } from '../../../../common/errors/errors';
import type { ChangeColumnTicketUseCase } from './change-column-ticket.usecase';
import { CHANGE_COLUMN_TICKET_USE_CASE } from './change-column-ticket.usecase';
import {
  TICKET_REPOSITORY,
  type TicketRepository,
} from '../../repositories/ticket.repository';
import {
  COLUMN_REPOSITORY,
  type ColumnRepository,
} from '../../../../columns/application/repositories/column.repository';
import { fromPromiseToAsync } from '../../../../common/netherthrow/helper';
import { IEntity } from '../../../../common/entities/entities.model';
import { ColumnEntity } from '../../../../columns/domain/entities/column.entity';

export enum Direction {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export interface MoveRightOrLeftIn {
  direction: Direction;
  ticketId: string;
}

export const MOVE_RIGHT_OR_LEFT_USE_CASE = Symbol(
  'MOVE_RIGHT_OR_LEFT_USE_CASE',
);

export interface MoveRightOrLeftUseCase {
  move(cmd: MoveRightOrLeftIn): ResultAsync<void, Errors>;
}

@Injectable()
export class MoveRightOrLeftUseCaseHandler implements MoveRightOrLeftUseCase {
  constructor(
    @Inject(CHANGE_COLUMN_TICKET_USE_CASE)
    private readonly changeColumnTicketUseCase: ChangeColumnTicketUseCase,
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(COLUMN_REPOSITORY)
    private readonly columnRepository: ColumnRepository,
  ) {}

  move(cmd: MoveRightOrLeftIn): ResultAsync<void, Errors> {
    const columnIdR = this.ticketRepository.fetchOne(cmd.ticketId).then((e) => {
      if (!e) {
        return err<string, Errors>({
          type: ErrorType.FAILURE,
          status: 400,
          errorCode: '01CAERR',
          message: 'Ticket not found',
        });
      } else {
        return ok<string, Errors>(e.data.columnId);
      }
    });
    return fromPromiseToAsync(columnIdR)
      .andThen((columnId) => {
        return fromPromiseToAsync(
          this.columnRepository
            .fetchAll()
            .then((columns) =>
              this.nextColumnId(columns, columnId, cmd.direction),
            ),
        );
      })
      .andThen((nextColumnId) => {
        if (!nextColumnId) {
          return okAsync();
        }

        return this.changeColumnTicketUseCase
          .change({
            ticketId: cmd.ticketId,
            columnId: nextColumnId,
          })
          .andThen(() => okAsync<void, Errors>());
      });
  }

  private nextColumnId(
    columns: IEntity<ColumnEntity>[],
    currentId: string,
    direction: Direction,
  ): Result<string | undefined, Errors> {
    const currentColumn: IEntity<ColumnEntity> | undefined = columns.find(
      (column) => column.id === currentId,
    );
    if (!currentColumn) {
      return err<string, Errors>({
        type: ErrorType.FAILURE,
        status: 400,
        errorCode: '01CAERR',
        message: 'Column not found',
      });
    }

    const columnsWithoutCurrent = columns.filter((c) => c.id !== currentId);

    if (direction === Direction.LEFT) {
      const leftColumns = columnsWithoutCurrent.filter(
        (c) => c.data.position < currentColumn.data.position,
      );
      if (leftColumns.length === 0) {
        return ok(undefined);
      } else {
        return ok(leftColumns[leftColumns.length - 1].id);
      }
    } else {
      const leftColumns = columnsWithoutCurrent.filter(
        (c) => c.data.position > currentColumn.data.position,
      );
      if (leftColumns.length === 0) {
        return ok(undefined);
      } else {
        return ok(leftColumns[0].id);
      }
    }
  }
}
