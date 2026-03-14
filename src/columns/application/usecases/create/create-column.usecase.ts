import { ColumnEntity } from '../../../domain/entities/column.entity';
import { Inject, Injectable } from '@nestjs/common';
import { err, Result, ResultAsync } from 'neverthrow';
import { Errors, ErrorType } from '../../../../common/errors/errors';
import type { ColumnRepository } from '../../repositories/column.repository';
import { COLUMN_REPOSITORY } from '../../repositories/column.repository';
import { randomUUID } from 'node:crypto';

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
    private readonly columnRepository: ColumnRepository<ColumnEntity, string>,
  ) {}

  create(column: CreateColumnIn): ResultAsync<ColumnEntity, Errors> {
    const title = column.title;
    return ResultAsync.fromSafePromise(
      this.columnRepository.columnAlreadyExists(title),
    ).andThen((exists) => {
      if (exists) {
        return err<ColumnEntity, Errors>({
          type: ErrorType.FAILURE,
          code: 400,
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
    const entityR = ColumnEntity.create({
      id,
      title,
      position: 1, // todo calculer la position
      description,
    });
    const res: Result<Promise<ColumnEntity>, Errors> = entityR.map(
      async (entity) => {
        await this.columnRepository.createOne(entity, id);
        return entity;
      },
    );
    return res.asyncMap((x) => x);
  }
}
