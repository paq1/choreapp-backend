import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ColumnsController } from './ui/columns.controller';
import { COLUMN_REPOSITORY } from './application/repositories/column.repository';
import {
  CREATE_COLUMN_USE_CASE,
  CreateColumnUseCaseHandler,
} from './application/usecases/create/create-column.usecase';
import {
  ERROR_HANDLER_SERVICE,
  ErrorsHandlerExceptionNest,
} from '../common/errors/errors.handler';
import { COLUMN_MODEL_NAME, ColumnMongoSchema } from './infra/dbo/column.dbo';
import { MongoColumnRepository } from './infra/repositories/mongo.column.repository';
import {
  NextColumnPositionService,
  POSITION_COMPUTER_SERVICE,
} from './application/services/position-computer.service';
import {
  DELETE_ONE_COLUMN_USECASE,
  DeleteOneColumnUseCaseHandler,
} from './application/usecases/delete_one/delete-one-column.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: COLUMN_MODEL_NAME,
        schema: ColumnMongoSchema,
      },
    ]),
  ],
  controllers: [ColumnsController],
  providers: [
    {
      provide: CREATE_COLUMN_USE_CASE,
      useClass: CreateColumnUseCaseHandler,
    },
    {
      provide: DELETE_ONE_COLUMN_USECASE,
      useClass: DeleteOneColumnUseCaseHandler,
    },
    {
      provide: ERROR_HANDLER_SERVICE,
      useClass: ErrorsHandlerExceptionNest,
    },
    {
      provide: POSITION_COMPUTER_SERVICE,
      useClass: NextColumnPositionService,
    },
    {
      provide: COLUMN_REPOSITORY,
      useClass: MongoColumnRepository,
    },
  ],
  exports: [COLUMN_REPOSITORY],
})
export class ColumnsModule {}
