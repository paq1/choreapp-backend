import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { err, ok, ResultAsync } from 'neverthrow';
import { Errors, ErrorType } from '../../../common/errors/errors';
import { fromPromiseToAsync } from '../../../common/netherthrow/helper';
import { IEntity } from '../../../common/entities/entities.model';
import { ProjectRepository } from '../../application/repositories/project.repository';
import {
  PROJECT_MODEL_NAME,
  ProjectDocumentMongoDBO,
} from '../dbo/project.dbo';
import { ProjectEntity } from '../../domain/entities/project.entity';

@Injectable()
export class MongoProjectRepository implements ProjectRepository {
  constructor(
    @InjectModel(PROJECT_MODEL_NAME)
    private readonly model: Model<ProjectDocumentMongoDBO>,
  ) {}

  projectAlreadyExists(name: string): Promise<boolean> {
    return this.model.exists({ 'data.title': name }).then((exists) => !!exists);
  }

  private toEntity(dbo: ProjectDocumentMongoDBO): IEntity<ProjectEntity> {
    return {
      id: dbo.id,
      type: dbo.data.type,
      data: {
        title: dbo.data.title,
        description: dbo.data.description,
      },
      version: dbo.version,
    };
  }

  private toDbo(
    data: IEntity<ProjectEntity>,
    id: string,
  ): ProjectDocumentMongoDBO {
    return {
      id,
      data: {
        type: data.type,
        title: data.data.title,
        description: data.data.description,
      },
      version: 1,
    };
  }

  createOne(data: IEntity<ProjectEntity>, id: string): Promise<void> {
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
          message: 'Project not found',
        });
      }
      return ok(undefined);
    });
    return fromPromiseToAsync(deleted);
  }

  fetchAll(): Promise<IEntity<ProjectEntity>[]> {
    return this.model
      .find()
      .limit(100) // TODO : gerer la pagination
      .lean()
      .then((docs) => docs.map((doc) => this.toEntity(doc)));
  }

  fetchOne(id: string): Promise<IEntity<ProjectEntity> | undefined> {
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

  updateOne(id: string, data: IEntity<ProjectEntity>): Promise<void> {
    return this.model
      .updateOne(
        { id },
        {
          $set: {
            data: {
              title: data.data.title,
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
