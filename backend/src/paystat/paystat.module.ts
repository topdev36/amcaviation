import { Module } from '@nestjs/common';
import { PaystatService } from './paystat.service';
import { PaystatController } from './paystat.controller';

@Module({
  providers: [PaystatService],
  controllers: [PaystatController]
})
export class PaystatModule {}
