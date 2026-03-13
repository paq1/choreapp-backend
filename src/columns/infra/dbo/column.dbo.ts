export interface ColumnDocumentMongoDBO {
  _id?: string; // je sais pas le type
  id: string;
  data: ColumnDbo;
  version: number;
}

export interface ColumnDbo {
  title: string;
  position: number;
  description?: string;
}