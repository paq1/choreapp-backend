import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketsController } from './ui/tickets.controller';
import { MongoTicketRepository } from './infra/repositories/mongo.ticket.repository';
import { TICKET_REPOSITORY } from './application/repositories/ticket.repository';
import {
  CREATE_TICKET_USE_CASE,
  CreateTicketUseCaseHandler,
} from './application/usecases/create/create-ticket.usecase';
import { ColumnsModule } from '../columns/columns.module';
import { TICKET_MODEL_NAME, TicketMongoSchema } from './infra/dbo/ticket.dbo';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    CommonModule,
    ColumnsModule,
    MongooseModule.forFeature([
      {
        name: TICKET_MODEL_NAME,
        schema: TicketMongoSchema,
      },
    ]),
  ],
  controllers: [TicketsController],
  providers: [
    {
      provide: CREATE_TICKET_USE_CASE,
      useClass: CreateTicketUseCaseHandler,
    },
    {
      provide: TICKET_REPOSITORY,
      useClass: MongoTicketRepository,
    },
  ],
})
export class TicketsModule {}
