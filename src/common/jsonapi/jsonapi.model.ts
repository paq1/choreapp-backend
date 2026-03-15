import { IEntity } from '../entities/entities.model';

export function toJsonApiSingle<T>(entity: IEntity<T>): JsonApiSingle<T> {
  return {
    data: {
      type: entity.type,
      id: entity.id,
      attributes: entity.data,
    },
  };
}

export function toJsonApiMany<T>(entities: IEntity<T>[]): JsonApiMany<T> {
  const data = entities.map((entity) => {
    return {
      type: entity.type,
      id: entity.id,
      attributes: entity.data,
    };
  });
  return { data: data };
}

export interface JsonApiSingle<T> {
  data: JsonApiData<T>;
}

export interface JsonApiMany<T> {
  data: JsonApiData<T>[];
}

export interface JsonApiData<T> {
  type: string;
  id: string;
  attributes: T;
}
