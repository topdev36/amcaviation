import { Module } from '@nestjs/common';
import { PaystatService } from './paystat.service';
import { PaystatController } from './paystat.controller';
import { Contract} from '../entity/contract.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tx } from 'src/entity/tx.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, Tx])],
  providers: [PaystatService],
  controllers: [PaystatController]
})
export class PaystatModule {}
