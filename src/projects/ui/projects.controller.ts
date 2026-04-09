import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { ErrorsHandlerService } from '../../common/errors/errors.handler';
import { ERROR_HANDLER_SERVICE } from '../../common/errors/errors.handler';
import {
  toJsonApiMany,
  toJsonApiSingle,
} from '../../common/jsonapi/jsonapi.model';
import {
  PROJECT_REPOSITORY,
  type ProjectRepository,
} from '../application/repositories/project.repository';
import {
  CREATE_PROJECT_USE_CASE,
  type CreateProjectUseCase,
} from '../application/usecases/create/create-project.usecase';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(CREATE_PROJECT_USE_CASE)
    private readonly createProject: CreateProjectUseCase,
    @Inject(ERROR_HANDLER_SERVICE)
    private readonly errorHandler: ErrorsHandlerService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer une projet' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({ status: 201, description: 'Project créée' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  async create(@Body() createProjectDto: CreateProjectDto) {
    const res = await this.createProject.create(createProjectDto);
    return this.errorHandler.unwrapAndHandleErrors(res);
  }

  @Get()
  @ApiOperation({ summary: 'Recupere toutes les projets' })
  findAll() {
    return this.projectRepository.fetchAll().then((x) => toJsonApiMany(x));
  }

  @Get(':id')
  @ApiOperation({ summary: "Recupere la projet avec l'id métier" })
  findOne(@Param('id') id: string) {
    return this.projectRepository
      .fetchOne(id)
      .then((x) => (x ? toJsonApiSingle(x) : {}));
  }
}
