import { ColumnEntity } from '../../../domain/entities/column.entity';
import { Injectable } from '@nestjs/common';
import { err, Result } from 'neverthrow';
import { Errors, ErrorType } from '../../../../common/errors/errors';

export interface CreateColumnIn {
  title: string;
  description?: string;
}
export const CREATE_COLUMN_USE_CASE = Symbol('CREATE_COLUMN_USE_CASE');

export interface CreateColumnUseCase {
  create(column: CreateColumnIn): Promise<Result<ColumnEntity, Errors>>;
}

@Injectable()
export class CreateColumnUseCaseHandler implements CreateColumnUseCase {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(_column: CreateColumnIn): Promise<Result<ColumnEntity, Errors>> {
    return Promise.resolve(
      err({
        type: ErrorType.FAILURE,
        code: 501,
        message: 'Pas encore code cette partie',
      }),
    );
  }
}
