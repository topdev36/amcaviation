import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesController } from './sales.controller';
import { Contract} from '../entity/contract.entity';
import { Tx} from '../entity/tx.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, Tx]), HttpModule],
  providers: [SalesService],
  controllers: [SalesController]
})
export class SalesModule {}
