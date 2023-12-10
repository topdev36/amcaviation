import { Controller, Post, Body } from '@nestjs/common';
import { PayService } from './pay.service';

@Controller('pay')
export class PayController {
    constructor(private payService: PayService){}

    @Post('getContract')
    getContract(@Body() data) {
        return this.payService.findContractUniqueID(data.quote_id);
    }

    @Post('signContract')
    signContract(@Body() data){
        return this.payService.signContract(data.id, data.name);
    }
}
