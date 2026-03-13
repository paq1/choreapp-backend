import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ColumnsService } from './services/columns.service';
import { ColumnsController } from './ui/columns.controller';
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
    ColumnsService,
    MongoColumnRepository,
    {
      provide: CREATE_COLUMN_USE_CASE,
      useClass: CreateColumnUseCaseHandler,
    },
    {
      provide: ERROR_HANDLER_SERVICE,
      useClass: ErrorsHandlerExceptionNest,
    },
  ],
})
export class ColumnsModule {}
