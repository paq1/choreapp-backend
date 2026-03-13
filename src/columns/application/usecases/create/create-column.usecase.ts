import { ColumnEntity } from '../../../domain/entities/column.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Result, ResultAsync } from 'neverthrow';
import { Errors } from '../../../../common/errors/errors';
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(_column: CreateColumnIn): ResultAsync<ColumnEntity, Errors> {
    void this.columnRepository;

    const title = _column.title;
    const description = _column.description;
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
