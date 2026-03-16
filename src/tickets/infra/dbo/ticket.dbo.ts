import { Schema, Types } from 'mongoose';

export interface TicketDocumentMongoDBO {
  _id?: Types.ObjectId;
  id: string;
  data: TicketDbo;
  version: number;
}

export interface TicketDbo {
  type: string;
  columnId: string;
  title: string;
  order: number;
  description?: string;
}

export const TICKET_MODEL_NAME = 'Ticket';
export const TICKET_COLLECTION_NAME = 'ticket';

export const TicketMongoSchema = new Schema<TicketDocumentMongoDBO>(
  {
    id: { type: String, required: true, unique: true, index: true },
    data: {
      type: { type: String, required: true },
      columnId: { type: String, required: true },
      title: { type: String, required: true },
      order: { type: Number, required: true },
      description: { type: String, required: false },
    },
    version: { type: Number, required: true, default: 1 },
  },
  {
    collection: TICKET_COLLECTION_NAME,
  },
);
