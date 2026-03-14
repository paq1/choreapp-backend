import { errAsync, okAsync, Result } from 'neverthrow';

export function toAsync<T, E>(r: Result<T, E>) {
  return r.match(
    (v) => okAsync<T, E>(v),
    (e) => errAsync<T, E>(e),
  );
}
