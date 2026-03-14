import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ColumnRepository } from '../../application/repositories/column.repository';
import { ColumnEntity } from '../../domain/entities/column.entity';
import { COLUMN_MODEL_NAME, ColumnDocumentMongoDBO } from '../dbo/column.dbo';

@Injectable()
export class MongoColumnRepository implements ColumnRepository {
  constructor(
    @InjectModel(COLUMN_MODEL_NAME)
    private readonly model: Model<ColumnDocumentMongoDBO>,
  ) {}

  fetchHighestPosition(): Promise<number> {
    return this.model
      .findOne({})
      .sort({ 'data.position': -1 })
      .lean()
      .then((doc) => (doc ? this.toEntity(doc)._position : 0));
  }

  columnAlreadyExists(name: string): Promise<boolean> {
    return this.model.exists({ 'data.title': name }).then((exists) => !!exists);
  }

  private toEntity(dbo: ColumnDocumentMongoDBO): ColumnEntity {
    return {
      _id: dbo.id,
      _title: dbo.data.title,
      _position: dbo.data.position,
      _description: dbo.data.description,
    } as ColumnEntity;
  }

  private toDbo(data: ColumnEntity, id: string): ColumnDocumentMongoDBO {
    return {
      id,
      data: {
        title: data._title,
        position: data._position,
        description: data._description,
      },
      version: 1,
    };
  }

  createOne(data: ColumnEntity, id: string): Promise<void> {
    return this.model.create(this.toDbo(data, id)).then(() => undefined);
  }

  deleteOne(id: string): Promise<void> {
    return this.model.deleteOne({ id }).then(() => {
      return;
    });
  }

  fetchAll(): Promise<ColumnEntity[]> {
    return this.model
      .find()
      .lean()
      .then((docs) => docs.map((doc) => this.toEntity(doc)));
  }

  fetchOne(id: string): Promise<ColumnEntity | undefined> {
    return this.model
      .findOne({ id })
      .lean()
      .then((doc) => {
        if (!doc) {
          return undefined;
        }
        return this.toEntity(doc);
      });
  }

  updateOne(id: string, data: ColumnEntity): Promise<void> {
    return this.model
      .updateOne(
        { id },
        {
          $set: {
            data: {
              title: data._title,
              position: data._position,
              description: data._description,
            },
          },
          $inc: { version: 1 },
        },
      )
      .then(() => {
        return;
      });
  }
}
