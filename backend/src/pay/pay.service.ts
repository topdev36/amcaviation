import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Contract } from '../entity/contract.entity';
import { Tx } from '../entity/tx.entity';
import {basePayUrl} from 'src/common/common';

@Injectable()
export class PayService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
    @InjectRepository(Tx)
    private txsRepository: Repository<Tx>,
  ) {}
  async findContractUniqueID(id: string) {
    return await this.contractsRepository.findOne({relations: ['txs'], where: {link: basePayUrl + id}});
  }

  findTx(id, txid){
    return this.txsRepository.findOne({where: {quote_id: id.substring(0, 8), link: basePayUrl + id + "/" + txid}});
  }

  async signContract(id, name){
    let ret = {
        success: false
    };
    let contract = await this.contractsRepository.findOne({where: {link: basePayUrl + id, signed_by: "", signed_time: null}});
    
    if(contract != null){
        let time = new Date();
        await this.contractsRepository.update({link: basePayUrl + id}, {signed_by: name, signed_time: time});

        ret['success'] = true;
        ret['signed_by'] = name;
        ret['signed_time'] = time;
    }
    return ret;
  }
}
