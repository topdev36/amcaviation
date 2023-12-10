import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Contract } from '../entity/contract.entity';
import { Tx } from '../entity/tx.entity';
import { GeneratePayLinkDto } from 'src/dto/generate-paylink';
import { DeleteContractsDto } from 'src/dto/delete-contract';
import { basePayUrl, urlPrefix } from 'src/common/common';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, firstValueFrom } from 'rxjs';
import { AUTOPAY_KEY } from 'src/common/keys';
const { XMLParser } = require('fast-xml-parser');

const crypto = require('crypto');
// import * as bcrypt from 'bcrypt';
const fs = require('fs');
const pdfParser = require('pdf-parse');

const addressStartPay = 'https://testpay.autopay.eu/payment';
const serviceID = '1000351';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
    @InjectRepository(Tx)
    private txsRepository: Repository<Tx>,
    private readonly httpService: HttpService,
  ) {}

  // async test() {
  //   let data = {
  //     amount: 1517,
  //     externalId: '99b09681-2fa8-4e0d-bf87-2aeeca2807b6', //'234567898654',
  //     description: 'Test transaction',
  //     currency: 'EUR',
  //     buyer: {
  //       email: 'jan.kowalski@melements.pl',
  //     },
  //   };
  //   let signature = crypto
  //     .createHmac('sha256', '14260cfa-9c78-4f38-850f-de5224c95d97')
  //     .update(JSON.stringify(data))
  //     .digest('base64');
  //   let header = {
  //     'Api-Key': '693f5aa4-4ebb-4673-96e6-9735f4fdedb7',
  //     'Signature': signature,
  //     'Idempotency-Key': '213asdfasdf2134asdfasdf2134334',
  //     'Content-Type': 'application/json',
  //   };

  //   let resp = await firstValueFrom(
  //     this.httpService
  //       .post(
  //         'https://api.sandbox.paynow.pl/v1/payments',
  //         data,
  //         {
  //           headers: header,
  //         },
  //       )
  //       .pipe(
  //         catchError((e) => {
  //           console.log(e);
  //           throw 'error';
  //         }),
  //       ),
  //   );
  //   return resp;
  // }

  async generateTxLink(amount, orderId, email, desc) {
    let data;
    if (email.indexOf('@') != -1)
      data = {
        ServiceID: serviceID,
        OrderID: orderId,
        Amount: amount,
        // Description: desc,
        GatewayID: '0',
        Currency: 'EUR',
        CustomerEmail: email,
        Language: 'EN',
      };
    else
      data = {
        ServiceID: serviceID,
        OrderID: orderId,
        Amount: amount,        
        GatewayID: '0',
        Currency: 'EUR',        
        Language: 'EN',
      };
    let dataToHash = Object.keys(data).map((key, index) => data[key]);
    dataToHash.push(AUTOPAY_KEY);
    // console.log(dataToHash,dataToHash.join('|'));

    let signature = crypto
      .createHash('sha256')
      .update(dataToHash.join('|'))
      .digest('hex');
    data['Hash'] = signature;

    let header = {
      BmHeader: 'pay-bm-continue-transaction-url',
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    let resp = await firstValueFrom(
      this.httpService
        .post(addressStartPay, data, {
          headers: header,
        })
        .pipe(
          catchError((e) => {
            console.log(e);
            throw 'error';
          }),
        ),
    );
    const parser = new XMLParser();
    let jObj = parser.parse(resp['data']);
    return jObj['transaction'];
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
    ret['date'] = ret['date'].slice(0, 8) + ' ' + ret['date'].slice(8);

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
      ret['creation'].indexOf(' UTC\n'),
    );

    ret['email'] = text.slice(text.indexOf(ptnEmail) + ptnEmail.length);
    ret['email'] = ret['email'].slice(
      ret['email'].indexOf(ptnEmail) + ptnEmail.length,
    );
    ret['email'] = ret['email'].slice(0, ret['email'].indexOf(ptnAircraft) - 1);
    ret['email'] = ret['email'].slice(ret['email'].lastIndexOf('\n') + 1);

    return ret;
  }

  async generatePayLink(dto: GeneratePayLinkDto) {
    let ret = {
      success: false,
    };
    let isNewContract = !(await this.findContractByQuoteID(dto.quote_id));
    if (!isNewContract) return ret;
    var newID = dto.quote_id + Date.now().toString();
    var newLink = urlPrefix + basePayUrl + '/#/' + newID;
    let contract = new Contract();
    contract['quote_id'] = dto.quote_id;
    contract['creation'] = dto.creation;
    contract['date'] = dto.date;
    contract['aircraft'] = dto.aircraft;
    contract['sum'] = dto.sum;
    contract['email'] = dto.email;
    contract['link'] = newLink;
    contract['filename'] = dto.file;
    this.addContract(contract, dto.txs, newID);
    ret['success'] = true;
    ret['link'] = newLink;
    return ret;
  }

  async addContract(contract: Contract, txs: [], newID) {
    let ret = await this.contractsRepository.save(contract);

    for (var index = 0; index < txs.length; index++) {
      let tx = txs[index];
      let transaction = new Tx();
      let orderId =
        contract.quote_id + '-' + (Date.now() % 1000000) + (index + 1);
      let desc =
        contract.quote_id +
        ' - Date: ' +
        contract.date +
        ' Aircraft: ' +
        contract.aircraft;

      let txLink = await this.generateTxLink(
        Number(tx).toFixed(2),
        orderId,
        contract.email,
        desc,
      );
      transaction.amount = tx;
      transaction.link = txLink['redirecturl'];
      transaction.status = 'Pending';
      transaction.quote_id = contract.quote_id;
      transaction.order_id = txLink['orderID'];
      transaction.contractId = ret.id;
      this.addTx(transaction);
    }
  }

  addTx(tx: Tx) {
    this.txsRepository.save(tx);
  }

  async findContractByQuoteID(quote_id: string) {
    return await this.contractsRepository.findOneBy({ quote_id: quote_id });
  }

  async getAllContracts() {
    let ret = await this.contractsRepository.find({ relations: ['txs'] });
    return ret;
  }

  async deleteContracts(data: DeleteContractsDto) {
    let ret = {
      success: false,
    };
    let quote_ids = data.quote_ids;

    let contractsToDelete = await this.contractsRepository.find({
      where: { quote_id: In(quote_ids) },
    });
    contractsToDelete.map((contract, index) => {
      try {
        fs.unlinkSync('apps/' + contract.filename);
      } catch (e) {}
      return 0;
    });
    await this.contractsRepository.delete({ quote_id: In(quote_ids) });
    await this.txsRepository.delete({ quote_id: In(quote_ids) });

    ret['numDeleted'] = quote_ids.length;
    ret.success = true;
    return ret;
  }
}
