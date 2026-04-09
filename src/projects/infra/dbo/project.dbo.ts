import { Schema, Types } from 'mongoose';

export interface ProjectDocumentMongoDBO {
  _id?: Types.ObjectId;
  id: string;
  data: ProjectDbo;
  version: number;
}

export interface ProjectDbo {
  type: string;
  title: string;
  description?: string;
}

export const PROJECT_MODEL_NAME = 'Project';
export const PROJECT_COLLECTION_NAME = 'projects';

export const ProjectMongoSchema = new Schema<ProjectDocumentMongoDBO>(
  {
    id: { type: String, required: true, unique: true, index: true },
    data: {
      type: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: false },
    },
    version: { type: Number, required: true, default: 1 },
  },
  {
    collection: PROJECT_COLLECTION_NAME,
  },
);
