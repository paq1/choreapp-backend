import { Column } from '../../domain/entities/column.entity';

export class CreateColumnDto {
  constructor(
    private _title: string,
    private _position: number,
    private _description?: string,
  ) {}
}
