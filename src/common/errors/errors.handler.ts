import { Result } from 'neverthrow';
import { Errors, ErrorType } from './errors';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';

export interface ErrorsHandlerService {
  unwrapAndHandleErrors<T>(result: Result<T, Errors>): T;
}

export const ERROR_HANDLER_SERVICE = Symbol('ERROR_HANDLER_SERVICE');

export class ErrorsHandlerExceptionNest implements ErrorsHandlerService {
  unwrapAndHandleErrors<T>(result: Result<T, Errors>): T {
    if (result.isOk()) {
      return result.value;
    }

    const err = result.error;

    switch (err.type) {
      case ErrorType.FAILURE:
        switch (err.status) {
          case 400:
            throw new BadRequestException({
              status: err.status,
              errorCode: err.errorCode,
              message: err.message,
            });
          case 404:
            throw new NotFoundException('Board not found');
          case 500:
            throw new InternalServerErrorException();
          case 501:
            throw new NotImplementedException(err.message);
          default:
            throw new InternalServerErrorException();
        }

      case ErrorType.PANIC:
      default:
        throw new InternalServerErrorException();
    }
  }
}
