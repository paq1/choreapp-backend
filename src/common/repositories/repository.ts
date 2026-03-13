export interface Repository<DATA, ID> {
  fetchOne(id: ID): Promise<DATA | undefined>;
  fetchAll(): Promise<DATA[]>;
  createOne(data: DATA, id: ID): Promise<void>;
  updateOne(id: ID, data: DATA): Promise<void>;
  deleteOne(id: ID): Promise<void>;
}
