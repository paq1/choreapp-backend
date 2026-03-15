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
            throw new BadRequestException(this.fromErrToErrorView(err));
          case 404:
            throw new NotFoundException(this.fromErrToErrorView(err));
          case 500:
            throw new InternalServerErrorException(
              this.fromErrToErrorView(err),
            );
          case 501:
            throw new NotImplementedException(this.fromErrToErrorView(err));
          default:
            throw new InternalServerErrorException(
              this.fromErrToErrorView(err),
            );
        }

      case ErrorType.PANIC:
      default:
        throw new InternalServerErrorException();
    }
  }

  private fromErrToErrorView(err: Errors): any {
    switch (err.type) {
      case ErrorType.FAILURE:
        return {
          status: err.status,
          errorCode: err.errorCode,
          message: err.message,
        };
      default:
        return {
          status: 500,
          errorCode: err.errorCode,
        };
    }
  }
}
