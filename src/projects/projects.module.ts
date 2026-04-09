import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PROJECT_MODEL_NAME,
  ProjectMongoSchema,
} from './infra/dbo/project.dbo';
import {
  CREATE_PROJECT_USE_CASE,
  CreateProjectUseCaseHandler,
} from './application/usecases/create/create-project.usecase';
import { PROJECT_REPOSITORY } from './application/repositories/project.repository';
import { ProjectsController } from './ui/projects.controller';
import { MongoProjectRepository } from './infra/repositories/mongo.project.repository';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      {
        name: PROJECT_MODEL_NAME,
        schema: ProjectMongoSchema,
      },
    ]),
  ],
  controllers: [ProjectsController],
  providers: [
    {
      provide: CREATE_PROJECT_USE_CASE,
      useClass: CreateProjectUseCaseHandler,
    },
    {
      provide: PROJECT_REPOSITORY,
      useClass: MongoProjectRepository,
    },
  ],
  exports: [PROJECT_REPOSITORY],
})
export class ProjectsModule {}
