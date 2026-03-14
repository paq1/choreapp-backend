import { Repository } from '../../../common/repositories/repository';
import { ColumnEntity } from '../../domain/entities/column.entity';

export interface ColumnRepository extends Repository<ColumnEntity, string> {
  columnAlreadyExists(name: string): Promise<boolean>;
  fetchHighestPosition(): Promise<number>;
}

export const COLUMN_REPOSITORY = Symbol('COLUMN_REPOSITORY');
