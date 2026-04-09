import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateColumnDto {
  @ApiProperty({ example: 'Todo' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'whatever' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'whatever' })
  @IsOptional()
  @IsString()
  projectId?: string;
}
