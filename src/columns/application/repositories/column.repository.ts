import { Repository } from '../../../common/repositories/repository';

export type ColumnRepository<DATA, ID> = Repository<DATA, ID>;

export const COLUMN_REPOSITORY = Symbol('COLUMN_REPOSITORY');
