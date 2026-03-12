import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ColumnsService } from '../services/columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { CreateColumnUseCase } from '../application/usecases/create/create-column.usecase';
import { CREATE_COLUMN_USE_CASE } from '../application/usecases/create/create-column.usecase';
import type { ErrorsHandlerService } from '../../common/errors/errors.handler';
import { ERROR_HANDLER_SERVICE } from '../../common/errors/errors.handler';

@Controller('columns')
export class ColumnsController {
  constructor(
    private readonly columnsService: ColumnsService,
    @Inject(CREATE_COLUMN_USE_CASE)
    private readonly createColumn: CreateColumnUseCase,
    @Inject(ERROR_HANDLER_SERVICE)
    private readonly errorHandler: ErrorsHandlerService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer une colonne' })
  @ApiBody({ type: CreateColumnDto })
  @ApiResponse({ status: 201, description: 'Colonne créée' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  async create(@Body() createColumnDto: CreateColumnDto) {
    console.log(createColumnDto);
    const res = await this.createColumn.create(createColumnDto);
    return this.errorHandler.unwrapAndHandleErrors(res);
  }

  @Get()
  findAll() {
    return this.columnsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.columnsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColumnDto: UpdateColumnDto) {
    return this.columnsService.update(+id, updateColumnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.columnsService.remove(+id);
  }
}
