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
import { LoginService } from './login.service';

@Controller('')
export class LoginController {
    constructor(private loginService: LoginService) {}
    @Post("login")
    async login(@Body() data, @Req() request: Request){
        let ret = await this.loginService.login(data.tokenId);;
        if(ret.success){
            request.session['userId'] = ret['userId'];
            request.session['secret'] = ret['secret'];
            request.session['verfied2FA'] = false;
        }
        console.log(request.session.id, request.session);
        return ret;
    }

    @Post("verify2fa")
    async verify2FA(@Body() data, @Req() request: Request){
        console.log(request.session);
        if(!request.session['userId'])
            return {success: false};
        let ret = await this.loginService.verify2fa(data.code, request.session['userId'], request.session['secret']);
        if(ret.success)
            request.session['verfied2FA'] = true;
        return ret;
    }
}
