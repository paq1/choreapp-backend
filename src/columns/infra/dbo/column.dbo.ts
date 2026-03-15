import { Schema, Types } from 'mongoose';

export interface ColumnDocumentMongoDBO {
  _id?: Types.ObjectId;
  id: string;
  data: ColumnDbo;
  version: number;
}

export interface ColumnDbo {
  type: string;
  title: string;
  position: number;
  description?: string;
}

export const COLUMN_MODEL_NAME = 'Column';
export const COLUMN_COLLECTION_NAME = 'columns';

export const ColumnMongoSchema = new Schema<ColumnDocumentMongoDBO>(
  {
    id: { type: String, required: true, unique: true, index: true },
    data: {
      type: { type: String, required: true },
      title: { type: String, required: true },
      position: { type: Number, required: true },
      description: { type: String, required: false },
    },
    version: { type: Number, required: true, default: 1 },
  },
  {
    collection: COLUMN_COLLECTION_NAME,
  },
);
