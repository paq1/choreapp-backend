import { ColumnEntity } from '../../../domain/entities/column.entity';
import { Inject, Injectable } from '@nestjs/common';
import { errAsync, ResultAsync } from 'neverthrow';
import { Errors, ErrorType } from '../../../../common/errors/errors';
import type { ColumnRepository } from '../../repositories/column.repository';
import { COLUMN_REPOSITORY } from '../../repositories/column.repository';
import { randomUUID } from 'node:crypto';
import type { CanComputeNextColumnPosition } from '../../services/position-computer.service';
import { POSITION_COMPUTER_SERVICE } from '../../services/position-computer.service';
import { toAsync } from '../../../../common/netherthrow/helper';

export interface CreateColumnIn {
  title: string;
  description?: string;
}
export const CREATE_COLUMN_USE_CASE = Symbol('CREATE_COLUMN_USE_CASE');

export interface CreateColumnUseCase {
  create(column: CreateColumnIn): ResultAsync<ColumnEntity, Errors>;
}

@Injectable()
export class CreateColumnUseCaseHandler implements CreateColumnUseCase {
  constructor(
    @Inject(COLUMN_REPOSITORY)
    private readonly columnRepository: ColumnRepository,
    @Inject(POSITION_COMPUTER_SERVICE)
    private readonly nextPositionComputer: CanComputeNextColumnPosition,
  ) {}

  create(column: CreateColumnIn): ResultAsync<ColumnEntity, Errors> {
    const title = column.title;
    return ResultAsync.fromSafePromise(
      this.columnRepository.columnAlreadyExists(title),
    ).andThen((exists) => {
      if (exists) {
        return errAsync<ColumnEntity, Errors>({
          type: ErrorType.FAILURE,
          status: 400,
          errorCode: '01CAERR',
          message: 'Column already exists',
        });
      }
      return this.createColumn(column);
    });
  }

  private createColumn(
    column: CreateColumnIn,
  ): ResultAsync<ColumnEntity, Errors> {
    const title = column.title;
    const description = column.description;
    const id = randomUUID().valueOf();

    return this.nextPositionComputer
      .computeNextPosition()
      .andThen((position) => {
        const entityR = ColumnEntity.safeCreate({
          id,
          title,
          position,
          description,
        });
        return toAsync(entityR);
      })
      .andThen((entity) => {
        const resEntity = this.columnRepository
          .createOne(entity, id)
          .then(() => entity);

        return ResultAsync.fromSafePromise<ColumnEntity, Errors>(resEntity);
      });
  }
}
