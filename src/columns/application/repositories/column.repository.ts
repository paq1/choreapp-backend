import { Repository } from '../../../common/repositories/repository';

export interface ColumnRepository<DATA, ID> extends Repository<DATA, ID> {
  columnAlreadyExists(name: string): Promise<boolean>;
}

export const COLUMN_REPOSITORY = Symbol('COLUMN_REPOSITORY');
