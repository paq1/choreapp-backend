export interface Repository<DATA, ID> {
  fetchOne(id: ID): Promise<DATA>;
  fetchAll(): Promise<DATA[]>;
  createOne(data: DATA, id: ID): Promise<void>;
  updateOne(id: ID, data: DATA): Promise<DATA[]>;
  deleteOne(id: ID): Promise<DATA[]>;
}
