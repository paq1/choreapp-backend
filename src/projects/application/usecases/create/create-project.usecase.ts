import { Inject, Injectable } from '@nestjs/common';
import { errAsync, ResultAsync } from 'neverthrow';
import { Errors, ErrorType } from '../../../../common/errors/errors';

import { randomUUID } from 'node:crypto';
import { ProjectEntity } from '../../../domain/entities/project.entity';
import {
  PROJECT_REPOSITORY,
  type ProjectRepository,
} from '../../repositories/project.repository';

export interface CreateProjectIn {
  title: string;
  description?: string;
}
export const CREATE_PROJECT_USE_CASE = Symbol('CREATE_PROJECT_USE_CASE');

export interface CreateProjectUseCase {
  create(project: CreateProjectIn): ResultAsync<ProjectEntity, Errors>;
}

@Injectable()
export class CreateProjectUseCaseHandler implements CreateProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
  ) {}

  create(project: CreateProjectIn): ResultAsync<ProjectEntity, Errors> {
    const title = project.title;
    return ResultAsync.fromSafePromise(
      this.projectRepository.projectAlreadyExists(title),
    ).andThen((exists) => {
      if (exists) {
        return errAsync<ProjectEntity, Errors>({
          type: ErrorType.FAILURE,
          status: 400,
          errorCode: '01CAERR',
          message: 'Project already exists',
        });
      }
      return this.createProject(project);
    });
  }

  private createProject(
    project: CreateProjectIn,
  ): ResultAsync<ProjectEntity, Errors> {
    const title = project.title;
    const description = project.description;
    const id = randomUUID().valueOf();

    const entityR = ProjectEntity.safeCreate({
      title,
      description,
    }).map((project) => {
      return {
        type: 'project',
        data: project,
        id: id,
        version: 1,
      };
    });

    return entityR.asyncMap((entity) => {
      return this.projectRepository
        .createOne(entity, id)
        .then(() => entity.data);
    });
  }
}
