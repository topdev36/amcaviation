import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Contract } from '../entity/contract.entity';
import { Tx } from '../entity/tx.entity';
import { GeneratePayLinkDto } from 'src/dto/generate-paylink';
import { DeleteContractsDto } from 'src/dto/delete-contract';
import basePayUrl from 'src/common';
// import * as bcrypt from 'bcrypt';
const fs = require('fs');
const pdfParser = require('pdf-parse');

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
    @InjectRepository(Tx)
    private txsRepository: Repository<Tx>,
  ) {
  }

  async parseContractData(path) {
    const ptnSum = 'Total:€',
      ptnDate = 'KM\n',
      ptnAircraft = 'Aircraft:',
      ptnQuoteID = 'Reference #',
      ptnEmail = 'Email:',
      ptnCreation = '';
    let ret = {};
    let dataBuffer = fs.readFileSync(path);
    let parsedData = await pdfParser(dataBuffer);
    // console.log(parsedData);
    const text = parsedData.text;
    ret['sum'] = text.slice(text.indexOf(ptnSum) + ptnSum.length);
    ret['sum'] = ret['sum'].slice(0, ret['sum'].indexOf('\n'));
    ret['sum'] = ret['sum'].replace(',', '');
    ret['quote_id'] = text.slice(text.indexOf(ptnQuoteID) + ptnQuoteID.length);
    ret['quote_id'] = ret['quote_id'].slice(
      0,
      ret['quote_id'].search(/[^0-9]/),
    );
    ret['date'] = text.slice(text.indexOf(ptnDate) + ptnDate.length);
    ret['date'] = ret['date'].slice(0, ret['date'].search(/[a-zA-Z ]/));
    ret['aircraft'] = text.slice(
      text.indexOf(ptnAircraft) + ptnAircraft.length,
    );
    ret['aircraft'] = ret['aircraft'].slice(
      0,
      ret['aircraft'].indexOf(ret['quote_id']),
    );
    ret['creation'] = text.slice(
      text.indexOf(ptnAircraft) + ptnAircraft.length,
    );
    ret['creation'] = ret['creation'].slice(
      ret['creation'].indexOf(ret['quote_id']) + ret['quote_id'].length + 1,
      ret['creation'].indexOf('\n'),
    );

    ret['email'] = text.slice(text.indexOf(ptnEmail) + ptnEmail.length);
    ret['email'] = ret['email'].slice(
      ret['email'].indexOf(ptnEmail) + ptnEmail.length,
    );
    ret['email'] = ret['email'].slice(0, ret['email'].indexOf('\n'));

    fs.unlinkSync(path);
    return ret;
  }

  async generatePayLink(dto: GeneratePayLinkDto) {
    let ret = {
      success: false,
    };
    let isNewContract = !(await this.findContractByQuoteID(dto.quote_id));
    if (!isNewContract) return ret;
    // const salt = await bcrypt.genSalt();
    // let newHash = await bcrypt.hash(dto.quote_id, salt);
    // newHash = atob(newHash.slice(10, 25));
    var newID = dto.quote_id + Date.now();
    var newLink = basePayUrl + newID;
    let contract = new Contract();
    contract['quote_id'] = dto.quote_id;
    contract['creation'] = dto.creation;
    contract['date'] = dto.date;
    contract['aircraft'] = dto.aircraft;
    contract['sum'] = dto.sum;
    contract['email'] = dto.email;
    contract['link'] = newLink;
    this.addContract(contract, dto.txs);
    ret['success'] = true;
    ret['link'] = newLink;
    return ret;
  }

  async addContract(contract: Contract, txs: []) {
    let ret = await this.contractsRepository.save(contract);
    
    txs.map((tx, index) => {
        let transaction = new Tx();
        var newID = contract.quote_id + Date.now() + "/" + (index + 1);
        var newLink = basePayUrl + newID;
        transaction.amount = tx;
        transaction.link = newLink;
        transaction.status = "Pending";
        transaction.quote_id = contract.quote_id;
        transaction.contractId = ret.id;
        this.addTx(transaction);
    })
  }

  addTx(tx: Tx){
    this.txsRepository.save(tx);
  }

  async findContractByQuoteID(quote_id: string) {
    return await this.contractsRepository.findOneBy({ quote_id: quote_id });
  }

  async getAllContracts(){
    let ret = await this.contractsRepository.find({relations: ['txs']});    
    return ret;
  }

  async deleteContracts(data: DeleteContractsDto){
    let ret = {
        success: false
    }
    let quote_ids = data.quote_ids;
    
    await this.contractsRepository.delete({quote_id: In(quote_ids)});
    await this.txsRepository.delete({quote_id: In(quote_ids)});
    
    ret['numDeleted'] = quote_ids.length;
    ret.success = true;
    return ret;    
  }
}
