import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { err, ok, ResultAsync } from 'neverthrow';
import { Errors, ErrorType } from '../../../common/errors/errors';
import { fromPromiseToAsync } from '../../../common/netherthrow/helper';
import { IEntity } from '../../../common/entities/entities.model';
import { TicketEntity } from '../../entities/ticket.entity';
import { TICKET_MODEL_NAME, TicketDocumentMongoDBO } from '../dbo/ticket.dbo';
import { TicketRepository } from '../../application/repositories/ticket.repository';

@Injectable()
export class MongoTicketRepository implements TicketRepository {
  constructor(
    @InjectModel(TICKET_MODEL_NAME)
    private readonly model: Model<TicketDocumentMongoDBO>,
  ) {}

  updateColumnId(id: string, columnId: string): Promise<void> {
    return this.model
      .updateOne({ id }, { $set: { 'data.columnId': columnId } })
      .then(() => undefined);
  }

  fetchHighestPosition(): Promise<number> {
    return this.model
      .findOne({})
      .sort({ 'data.order': -1 })
      .lean()
      .then((doc) => (doc ? this.toEntity(doc).data.order : 0));
  }

  private toEntity(dbo: TicketDocumentMongoDBO): IEntity<TicketEntity> {
    return {
      id: dbo.id,
      type: dbo.data.type,
      data: {
        columnId: dbo.data.columnId,
        title: dbo.data.title,
        order: dbo.data.order,
        description: dbo.data.description,
        priority: dbo.data.priority || TicketEntity.DEFAULT_PRIORITY,
      },
      version: dbo.version,
    };
  }

  private toDbo(
    data: IEntity<TicketEntity>,
    id: string,
  ): TicketDocumentMongoDBO {
    return {
      id,
      data: {
        type: data.type,
        columnId: data.data.columnId,
        title: data.data.title,
        order: data.data.order,
        description: data.data.description,
        priority: data.data.priority,
      },
      version: 1,
    };
  }

  createOne(data: IEntity<TicketEntity>, id: string): Promise<void> {
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
          message: 'TicketEntity found',
        });
      }
      return ok(undefined);
    });
    return fromPromiseToAsync(deleted);
  }

  fetchAll(): Promise<IEntity<TicketEntity>[]> {
    return this.model
      .find()
      .sort({ 'data.priority': -1 })
      .limit(100) // TODO : gerer la pagination
      .lean()
      .then((docs) => docs.map((doc) => this.toEntity(doc)));
  }

  fetchOne(id: string): Promise<IEntity<TicketEntity> | undefined> {
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

  updateOne(id: string, data: IEntity<TicketEntity>): Promise<void> {
    return this.model
      .updateOne(
        { id },
        {
          $set: {
            data: {
              title: data.data.title,
              order: data.data.order,
              description: data.data.description,
              priority: data.data.priority,
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
