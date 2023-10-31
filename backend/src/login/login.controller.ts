import {
    Controller,
    Get,
    Post,
    UploadedFile,
    UseInterceptors,
    Body,
    Req,
    Res
  } from '@nestjs/common';
  import { Request,Response } from 'express';

@Controller('')
export class LoginController {
    @Post("login")
    login(@Req() req: Request, @Res() res: Response){
        req.session['userId'] = 3;
        res.send({});
    }
}
