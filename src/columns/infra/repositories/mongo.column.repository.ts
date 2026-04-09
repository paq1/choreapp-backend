import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ColumnRepository } from '../../application/repositories/column.repository';
import { ColumnEntity } from '../../domain/entities/column.entity';
import { COLUMN_MODEL_NAME, ColumnDocumentMongoDBO } from '../dbo/column.dbo';
import { err, ok, ResultAsync } from 'neverthrow';
import { Errors, ErrorType } from '../../../common/errors/errors';
import { fromPromiseToAsync } from '../../../common/netherthrow/helper';
import { IEntity } from '../../../common/entities/entities.model';

@Injectable()
export class MongoColumnRepository implements ColumnRepository {
  constructor(
    @InjectModel(COLUMN_MODEL_NAME)
    private readonly model: Model<ColumnDocumentMongoDBO>,
  ) {}

  columnAlreadyExistsFromId(id: string): Promise<boolean> {
    return this.model.exists({ id: id }).then((exists) => !!exists);
  }

  fetchHighestPosition(): Promise<number> {
    return this.model
      .findOne({})
      .sort({ 'data.position': -1 })
      .lean()
      .then((doc) => (doc ? this.toEntity(doc).data.position : 0));
  }

  columnAlreadyExists(name: string, projectId?: string): Promise<boolean> {
    // TODO : check si OK
    const andFilter = projectId
      ? [{ 'data.title': name }, { 'data.projectId': projectId }]
      : [{ 'data.title': name }];
    return this.model
      .exists({
        $and: andFilter,
      })
      .then((exists) => !!exists);
  }

  private toEntity(dbo: ColumnDocumentMongoDBO): IEntity<ColumnEntity> {
    return {
      id: dbo.id,
      type: dbo.data.type,
      data: {
        title: dbo.data.title,
        position: dbo.data.position,
        description: dbo.data.description,
        projectId: dbo.data.projectId,
      },
      version: dbo.version,
    };
  }

  private toDbo(
    data: IEntity<ColumnEntity>,
    id: string,
  ): ColumnDocumentMongoDBO {
    return {
      id,
      data: {
        type: data.type,
        title: data.data.title,
        position: data.data.position,
        description: data.data.description,
        projectId: data.data.projectId,
      },
      version: 1,
    };
  }

  createOne(data: IEntity<ColumnEntity>, id: string): Promise<void> {
    const dbo = this.toDbo(data, id);

    return this.model.create(dbo).then(() => undefined);
  }

  deleteOne(id: string): ResultAsync<void, Errors> {
    const deleted = this.model.deleteOne({ id: id }).then((deleteResult) => {
      if (deleteResult.deletedCount === 0) {
        return err<void, Errors>({
          type: ErrorType.FAILURE,
          status: 404,
          errorCode: '01CAERR',
          message: 'Column not found',
        });
      }
      return ok(undefined);
    });
    return fromPromiseToAsync(deleted);
  }

  fetchAll(): Promise<IEntity<ColumnEntity>[]> {
    return this.model
      .find()
      .limit(100) // TODO : gerer la pagination
      .lean()
      .then((docs) => docs.map((doc) => this.toEntity(doc)));
  }

  fetchOne(id: string): Promise<IEntity<ColumnEntity> | undefined> {
    return this.model
      .findOne({ id: id })
      .lean()
      .then((doc) => {
        if (!doc) {
          return undefined;
        }
        return this.toEntity(doc);
      });
  }

  updateOne(id: string, data: IEntity<ColumnEntity>): Promise<void> {
    return this.model
      .updateOne(
        { id },
        {
          $set: {
            data: {
              title: data.data.title,
              position: data.data.position,
              description: data.data.description,
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
