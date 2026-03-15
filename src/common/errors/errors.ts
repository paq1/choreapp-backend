export type Errors = Failure | Panic;

export enum ErrorType {
  FAILURE = 'FAILURE',
  PANIC = 'PANIC',
}

export type Failure = {
  type: ErrorType.FAILURE;
  errorCode?: string;
  status: number;
  message: string;
};

export type Panic = {
  type: ErrorType.PANIC;
  errorCode?: string;
  cause: unknown;
};
