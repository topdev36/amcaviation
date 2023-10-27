import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Contract } from '../entity/contract.entity';
import { Tx } from '../entity/tx.entity';
import basePayUrl from 'src/common';

@Injectable()
export class PayService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
    @InjectRepository(Tx)
    private txsRepository: Repository<Tx>,
  ) {}
  async findContractByQuoteID(quote_id: string) {
    return await this.contractsRepository.findOne({relations: ['txs'], where: {quote_id: quote_id}});
  }

  async findTx(id, txid){
    return await this.txsRepository.findOne({where: {quote_id: id.substring(0, 8), link: basePayUrl + id + "/" + txid}});
  }
}
