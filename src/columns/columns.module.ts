import { Module } from '@nestjs/common';
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

@Module({
  controllers: [ColumnsController],
  providers: [
    ColumnsService,
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
