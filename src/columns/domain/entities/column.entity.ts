import { err, ok, Result } from 'neverthrow';
import { TodoError } from '../errors/column.errors';

export class ColumnEntity {
  private constructor(
    public readonly _id: string,
    public readonly _title: string,
    public readonly _position: number,
    public readonly _description?: string,
  ) {}

  create(props: ColumnProps): Result<ColumnEntity, TodoError> {
    if (!ColumnEntity.isvalid(props)) {
      return err({ type: 'VALIDATION_ERROR', message: 'Invalid column props' });
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
