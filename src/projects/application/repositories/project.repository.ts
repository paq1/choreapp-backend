import { Repository } from '../../../common/repositories/repository';
import { IEntity } from '../../../common/entities/entities.model';
import { ProjectEntity } from '../../domain/entities/project.entity';

export interface ProjectRepository extends Repository<
  IEntity<ProjectEntity>,
  string
> {
  projectAlreadyExists(name: string): Promise<boolean>;
}

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');
