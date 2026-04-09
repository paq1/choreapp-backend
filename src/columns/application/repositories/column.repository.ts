import { Repository } from '../../../common/repositories/repository';
import { ColumnEntity } from '../../domain/entities/column.entity';
import { IEntity } from '../../../common/entities/entities.model';

export interface ColumnRepository extends Repository<
  IEntity<ColumnEntity>,
  string
> {
  columnAlreadyExists(name: string, projectId?: string): Promise<boolean>;
  columnAlreadyExistsFromId(id: string): Promise<boolean>;
  fetchHighestPosition(): Promise<number>;
  fetchAllWithFilter(projectId?: string): Promise<IEntity<ColumnEntity>[]>;
}

export const COLUMN_REPOSITORY = Symbol('COLUMN_REPOSITORY');
