import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({ example: 'Todo' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'uuidv4' })
  @IsString()
  @IsNotEmpty()
  columnId: string;

  @ApiProperty({ example: 'whatever' })
  @IsOptional()
  @IsString()
  description?: string;
}
