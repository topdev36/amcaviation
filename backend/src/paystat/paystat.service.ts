import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AUTOPAY_KEY } from 'src/common/keys';
import { Contract } from 'src/entity/contract.entity';
import { Tx } from 'src/entity/tx.entity';
const crypto = require('crypto');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

@Injectable()
export class PaystatService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,

    @InjectRepository(Tx)
    private txsRepository: Repository<Tx>,
  ) {}

  async processITN(txData) {
    let xmlData = Buffer.from(txData, 'base64').toString('ascii');
    // return xmlData;
    let xmlObj = new XMLParser().parse(xmlData)['transactionList'];

    let hash = xmlObj['hash'];
    let tx = xmlObj['transactions']['transaction'];

    let dataToHash = [xmlObj['serviceID']];
    Object.keys(tx).map((key, index) =>
      key == 'amount'
        ? dataToHash.push(Number(tx[key]).toFixed(2))
        : dataToHash.push(tx[key]),
    );
    dataToHash.push(AUTOPAY_KEY);

    let signature = crypto
      .createHash('sha256')
      .update(dataToHash.join('|'))
      .digest('hex');

    let respToITN = {
      confirmationList: {
        serviceID: xmlObj['serviceID'],
        transactionsConfirmations: {
          transactionConfirmed: {
            orderID: tx['orderID'],
            confirmation: 'NOTCONFIRMED',
          },
        },
      },
    };
    if (signature == hash) {
      if (tx['paymentStatus'] == 'SUCCESS')
        this.txsRepository.update(
          { order_id: tx['orderID'] },
          { status: 'Completed', paid_time: new Date() },
        );
      respToITN['confirmationList']['transactionsConfirmations'][
        'transactionConfirmed'
      ]['confirmation'] = 'CONFIRMED';
    }

    dataToHash = [
      xmlObj['serviceID'],
      tx['orderID'],
      respToITN['confirmationList']['transactionsConfirmations'][
        'transactionConfirmed'
      ]['confirmation'],
      AUTOPAY_KEY,
    ];

    signature = crypto
      .createHash('sha256')
      .update(dataToHash.join('|'))
      .digest('hex');
    respToITN['confirmationList']['hash'] = signature;

    const builder = new XMLBuilder();
    const xmlContent = builder.build(respToITN);
    return xmlContent;
  }

  async checkStatusReturn(data) {
    let dataToHash = [];
    let keys = Object.keys(data).map((key, index) => key);
    keys.forEach((key) => {
      if (key != 'Hash') dataToHash.push(data[key]);
    });
    dataToHash.push(AUTOPAY_KEY);

    let signature = crypto
      .createHash('sha256')
      .update(dataToHash.join('|'))
      .digest('hex');

    if (data['Hash'] == signature) {
      let ret = await this.txsRepository.findOne({relations: ['contract'], where: {
        order_id: data['OrderID'],
      }});
      if (ret) {
        return { success: true, url: ret.contract.link };
      } else {
        return { success: false };
      }
    } else {
      return { success: false };
    }
  }
}
