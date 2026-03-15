export interface IEntity<T> {
  id: string;
  type: string;
  data: T;
  version: number;
}
