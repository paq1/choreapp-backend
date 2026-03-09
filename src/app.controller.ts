import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello/:id')
  getHello(@Param('id') id: string, @Query('test') test: string): string {
    console.log(id);
    console.log(test);
    return this.appService.getHello();
  }
}
