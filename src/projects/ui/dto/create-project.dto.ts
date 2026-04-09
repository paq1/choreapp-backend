import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Todo' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'whatever' })
  @IsOptional()
  @IsString()
  description?: string;
}
