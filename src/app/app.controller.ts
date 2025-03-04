import {Controller, Get, Res} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  api(@Res() res: Response) {
    const html = this.appService.describeAPI();
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
