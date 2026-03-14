import { Inject, Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';
import { Errors } from '../../../common/errors/errors';
import type { ColumnRepository } from '../repositories/column.repository';
import { COLUMN_REPOSITORY } from '../repositories/column.repository';

export interface CanComputeNextColumnPosition {
  computeNextPosition(addOffset?: number): ResultAsync<number, Errors>;
}
export const POSITION_COMPUTER_SERVICE = Symbol('POSITION_COMPUTER_SERVICE');

@Injectable()
export class NextColumnPositionService implements CanComputeNextColumnPosition {
  static readonly DEFAULT_OFFSET: number = 10;

  constructor(
    @Inject(COLUMN_REPOSITORY)
    private readonly columnRepository: ColumnRepository,
  ) {}

  computeNextPosition(addOffset?: number): ResultAsync<number, Errors> {
    const offset = addOffset || NextColumnPositionService.DEFAULT_OFFSET;

    return ResultAsync.fromSafePromise(
      this.columnRepository.fetchHighestPosition().then((x) => x + offset),
    );
  }
}
