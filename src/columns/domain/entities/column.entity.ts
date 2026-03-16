import { err, ok, Result } from 'neverthrow';
import { Errors, ErrorType } from '../../../common/errors/errors';

export class ColumnEntity {
  private constructor(
    public readonly title: string,
    public readonly position: number,
    public readonly description?: string,
  ) {}

  static safeCreate(props: ColumnProps): Result<ColumnEntity, Errors> {
    if (!ColumnEntity.isvalid(props)) {
      return err({
        type: ErrorType.FAILURE,
        status: 400,
        message: 'Invalid column props',
      });
    }
    return ok(new ColumnEntity(props.title, props.position, props.description));
  }

  static isvalid(props: ColumnProps): boolean {
    return props.title.length > 0 && (props.description?.length || 0) > 0;
  }
}

interface ColumnProps {
  title: string;
  position: number;
  description?: string;
}
