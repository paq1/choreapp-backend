import { errAsync, okAsync, Result, ResultAsync } from 'neverthrow';

export function toAsync<T, E>(r: Result<T, E>): ResultAsync<T, E> {
  return r.match(
    (v) => okAsync<T, E>(v),
    (e) => errAsync<T, E>(e),
  );
}

export function fromPromiseToAsync<T, E>(
  r: Promise<Result<T, E>>,
): ResultAsync<T, E> {
  return ResultAsync.fromSafePromise(r).andThen((pr) => pr);
}
