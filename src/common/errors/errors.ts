export type Errors = Failure | Panic;

export enum ErrorType {
  FAILURE = 'FAILURE',
  PANIC = 'PANIC',
}

export type Failure = {
  type: ErrorType.FAILURE;
  code: number;
  message: string;
};

export type Panic = {
  type: ErrorType.PANIC;
  cause: unknown;
};
