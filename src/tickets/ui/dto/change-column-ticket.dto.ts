import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Direction } from '../../application/usecases/create/move-right-or-left.usecase';

export class ChangeColumnTicketDto {
  @ApiProperty({ example: 'uuidv4' })
  @IsString()
  @IsNotEmpty()
  columnId: string;
}

export class MoveTicketDto {
  @ApiProperty({ example: 'LEFT' })
  @IsString()
  @IsNotEmpty()
  direction: Direction;
}
