import { err, ok, Result } from 'neverthrow';
import { Errors, ErrorType } from '../../../common/errors/errors';

export class ColumnEntity {
  private constructor(
    public readonly _id: string,
    public readonly _title: string,
    public readonly _position: number,
    public readonly _description?: string,
  ) {}

  static safeCreate(props: ColumnProps): Result<ColumnEntity, Errors> {
    if (!ColumnEntity.isvalid(props)) {
      return err({
        type: ErrorType.FAILURE,
        code: 400,
        message: 'Invalid column props',
      });
    }
    return ok(
      new ColumnEntity(
        props.id,
        props.title,
        props.position,
        props.description,
      ),
    );
  }

  static isvalid(props: ColumnProps): boolean {
    return props.title.length > 0 && (props.description?.length || 0) > 0;
  }
}

interface ColumnProps {
  id: string;
  title: string;
  position: number;
  description?: string;
}
