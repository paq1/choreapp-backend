import { Repository } from '../../../common/repositories/repository';
import { IEntity } from '../../../common/entities/entities.model';
import { TicketEntity } from '../../entities/ticket.entity';

export interface TicketRepository extends Repository<
  IEntity<TicketEntity>,
  string
> {
  fetchHighestPosition(): Promise<number>;
  updateColumnId(id: string, columnId: string): Promise<void>;
  fetchAllWithFilter(projectId?: string): Promise<IEntity<TicketEntity>[]>;
}

export const TICKET_REPOSITORY = Symbol('TICKET_REPOSITORY');
