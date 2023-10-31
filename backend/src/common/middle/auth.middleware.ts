import { Injectable, NestMiddleware, Req } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  use(@Req() req: Request, res: Response, next: NextFunction) {
    next();
    return;
    if (req.session['userId'] != undefined) next();
    else {      
      res.send({});
    }
  }
}
