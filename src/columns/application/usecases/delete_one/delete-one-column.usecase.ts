import { Inject, Injectable } from '@nestjs/common';
import type { ColumnRepository } from '../../repositories/column.repository';
import { COLUMN_REPOSITORY } from '../../repositories/column.repository';
import { ResultAsync } from 'neverthrow';
import { Errors } from '../../../../common/errors/errors';

export interface DeleteOneColumnUseCase {
  deleteOne(id: string): ResultAsync<void, Errors>;
}
export const DELETE_ONE_COLUMN_USECASE = Symbol('DELETE_ONE_COLUMN_USECASE');

@Injectable()
export class DeleteOneColumnUseCaseHandler implements DeleteOneColumnUseCase {
  constructor(
    @Inject(COLUMN_REPOSITORY)
    private readonly repo: ColumnRepository,
  ) {}

  deleteOne(id: string): ResultAsync<void, Errors> {
    // TODO : detele tout les tickets avec le column id "id"
    return this.repo.deleteOne(id);
  }
}
