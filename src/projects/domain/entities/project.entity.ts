import { err, ok, Result } from 'neverthrow';
import { Errors, ErrorType } from '../../../common/errors/errors';

export class ProjectEntity {
  private constructor(
    public readonly title: string,
    public readonly description?: string,
  ) {}

  static safeCreate(props: ProjectProps): Result<ProjectEntity, Errors> {
    if (!ProjectEntity.isValid(props)) {
      return err({
        type: ErrorType.FAILURE,
        status: 400,
        message: 'Invalid project props',
      });
    }
    return ok(new ProjectEntity(props.title, props.description));
  }

  static isValid(props: ProjectProps): boolean {
    if (props.description) {
      return props.title.length > 0 && props.description.length > 0;
    }
    return props.title.length > 0;
  }
}

interface ProjectProps {
  title: string;
  description?: string;
}
