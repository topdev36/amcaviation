import {
  Controller,
  Post,
  Res,
  Get,
  Query,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { PaystatService } from './paystat.service';
const { XMLParser } = require('fast-xml-parser');

@Controller('')
export class PaystatController {
  constructor(private paystatService: PaystatService) {}

  @Post('status')
  async statusPay(@Body() data, @Res() res) {
    let ret = await this.paystatService.processITN(data['transactions']);
    res.status(HttpStatus.OK).send(ret);
  }

  @Get('')
  async index(@Query() query, @Res() res) {
    let ret = await this.paystatService.checkStatusReturn(query);

    if (ret.success) res.redirect(ret['url']);
    else res.send('');
  }
}
