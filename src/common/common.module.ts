import { Module } from '@nestjs/common';
import {
  ERROR_HANDLER_SERVICE,
  ErrorsHandlerExceptionNest,
} from './errors/errors.handler';

@Module({
  providers: [
    {
      provide: ERROR_HANDLER_SERVICE,
      useClass: ErrorsHandlerExceptionNest,
    },
  ],
  exports: [ERROR_HANDLER_SERVICE],
})
export class CommonModule {}
