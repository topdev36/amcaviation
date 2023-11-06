import { Injectable, NestMiddleware, Req } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  use(@Req() req: Request, res: Response, next: NextFunction) {
    // console.log(req.session.id);
    next();
    return;
    if(req.method == "GET"){
      next();
      return;
    }
    // next();
    // return;
    if (req.session['userId'] != undefined && req.session['verfied2FA']) next();
    else {      
      res.send({success: false, status: false});
    }
  }
}
