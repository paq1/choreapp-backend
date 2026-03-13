import { ColumnRepository } from '../../application/repositories/column.repository';
import { ColumnEntity } from '../../domain/entities/column.entity';
import { Promise } from 'mongoose';

export class MongoColumnRepository implements ColumnRepository<
  ColumnEntity,
  string
> {
  createOne(data: ColumnEntity, id: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  deleteOne(id: string): Promise<ColumnEntity[]> {
    return Promise.resolve([]);
  }

  fetchAll(): Promise<ColumnEntity[]> {
    return Promise.resolve([]);
  }

  fetchOne(id: string): Promise<ColumnEntity> {
    return Promise.resolve(undefined);
  }

  updateOne(id: string, data: ColumnEntity): Promise<ColumnEntity[]> {
    return Promise.resolve([]);
  }
}
