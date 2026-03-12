import { err, ok, Result } from 'neverthrow';
import { TodoError } from '../errors/column.errors';

export class ColumnEntity {
  private constructor(
    public readonly id: string | null,
    private _title: string,
    private _position: number,
    private _description?: string,
  ) {}

  create(props: ColumnProps): Result<ColumnEntity, TodoError> {
    if (!ColumnEntity.isvalid(props)) {
      return err({ type: 'VALIDATION_ERROR', message: 'Invalid column props' });
    }
    return ok(
      new ColumnEntity(null, props.title, props.position, props.description),
    );
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
