import { err, ok, Result } from 'neverthrow';
import { Errors, ErrorType } from '../../common/errors/errors';

export class TicketEntity {
  static DEFAULT_PRIORITY: number = 1;

  private constructor(
    public readonly title: string,
    public readonly order: number,
    public readonly columnId: string,
    public readonly priority: number,
    public readonly description?: string,
  ) {}

  static safeCreate(props: TicketProps): Result<TicketEntity, Errors> {
    if (!TicketEntity.isvalid(props)) {
      return err({
        type: ErrorType.FAILURE,
        status: 400,
        message: 'Invalid ticket props',
      });
    }
    return ok(
      new TicketEntity(
        props.title,
        props.order,
        props.columnId,
        props.priority,
        props.description,
      ),
    );
  }

  static isvalid(props: TicketProps): boolean {
    if (props.description) {
      return props.title.length > 0 && (props.description?.length || 0) > 0;
    }
    return props.title.length > 0;
  }
}

interface TicketProps {
  title: string;
  order: number;
  columnId: string;
  description?: string;
  priority: number;
}
