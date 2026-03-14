import { ResultAsync } from 'neverthrow';
import { Errors } from '../../../common/errors/errors';
import { ColumnRepository } from '../repositories/column.repository';

export interface CanComputeNextColumnPosition {
  computeNextPosition(addOffset?: number): ResultAsync<number, Errors>;
}
export const POSITION_COMPUTER_SERVICE = Symbol('POSITION_COMPUTER_SERVICE');

export class NextColumnPositionService implements CanComputeNextColumnPosition {
  static readonly DEFAULT_OFFSET: number = 10;

  constructor(private columnRepository: ColumnRepository) {}

  computeNextPosition(addOffset?: number): ResultAsync<number, Errors> {
    const offset = addOffset || NextColumnPositionService.DEFAULT_OFFSET;

    return ResultAsync.fromSafePromise(
      this.columnRepository.fetchHighestPosition().then((x) => x + offset),
    );
  }
}
