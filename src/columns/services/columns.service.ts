import { Injectable } from '@nestjs/common';
import { UpdateColumnDto } from '../ui/dto/update-column.dto';

// TODO retirer ce service
@Injectable()
export class ColumnsService {
  findAll() {
    return `This action returns all columns`;
  }

  findOne(id: number) {
    return `This action returns a #${id} column`;
  }

  update(id: number, updateColumnDto: UpdateColumnDto) {
    return `This action updates a #${id} column`;
  }
}
