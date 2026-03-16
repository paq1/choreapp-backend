import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeColumnTicketDto {
  @ApiProperty({ example: 'uuidv4' })
  @IsString()
  @IsNotEmpty()
  columnId: string;
}
