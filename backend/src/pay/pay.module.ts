import { Module } from '@nestjs/common';
import { PayController } from './pay.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayService } from './pay.service';
import { Contract} from '../entity/contract.entity';
import { Tx} from '../entity/tx.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, Tx])],
  controllers: [PayController],
  providers: [PayService]
})
export class PayModule {}
