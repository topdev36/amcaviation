import { Controller, Post, Req, Request } from '@nestjs/common';
const { XMLParser } = require("fast-xml-parser");

@Controller('')
export class PaystatController {
    @Post('status')
    statusPay(@Req() req: Request){
        console.log(req);
    }
}
