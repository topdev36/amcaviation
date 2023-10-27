import {
    Controller,
    Get,
    Post,
    UploadedFile,
    UseInterceptors,
    Body,
  } from '@nestjs/common';

import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GeneratePayLinkDto } from '../dto/generate-paylink';
import { DeleteContractsDto } from 'src/dto/delete-contract';
import { SalesService } from './sales.service';
const path = require('path');

const pdfFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(pdf)$/)) {
    return callback(null, false);
  }
  callback(null, true);
};

const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = path.extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Post('uploadFile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: pdfFileFilter,
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<Object> {
    var ret = {
      success: false,
    };
    if (file != undefined) {
      ret['data'] = await this.salesService.parseContractData(file.path);      
      ret['success'] = true;
    }
    return ret;
  }

  @Post('generateLink')
  async generatePaymentLink(@Body() dto: GeneratePayLinkDto) {  
    let ret = await this.salesService.generatePayLink(dto);
    return ret;
  }

  @Post('getAllContracts')
  async getAllContracts() {    
    let ret = await this.salesService.getAllContracts();
    return ret;
  }

  @Post('deleteContracts')
  async deleteContracts(@Body() data: DeleteContractsDto){
    let ret = await this.salesService.deleteContracts(data);
    return ret;
  }
}
