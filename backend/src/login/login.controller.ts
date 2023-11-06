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
        return ret;
    }

    @Post("logout")
    logout(@Req() request){
        request.session['userId'] = undefined;
        return {success: true};
    }

    @Post("verify2fa")
    async verify2FA(@Body() data, @Req() request: Request){
        if(!request.session['userId'])
            return {success: false};
        let ret = await this.loginService.verify2fa(data.code, request.session['userId'], request.session['secret']);
        if(ret.success)
            request.session['verfied2FA'] = true;
        return ret;
    }
}
