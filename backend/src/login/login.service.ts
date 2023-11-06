import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async login(tokenID) {
    const clientID =
      '339776108293-rinl0ka6o8f89lnuqdjvp8trcalev72u.apps.googleusercontent.com';
    const client = new OAuth2Client(clientID);
    let ret = { success: false };
    try {
      const ticket = await client.verifyIdToken({
        idToken: tokenID,
        audience: clientID,
      });
      if (ticket) {
        var email = ticket.getPayload().email;
        let user = await this.usersRepository.findOneBy({ email: email });
        if (user) {
          ret['success'] = true;
          ret['userId'] = user.id;
          ret['secret'] = "";
          ret['qrcode'] = "";
          if(user.secret_2fa == ""){
            let obj2Fa = await this.generateTwoFactorAuthenticationSecret(user);
            ret['secret'] = obj2Fa.secret;
            ret['qrcode'] = await toDataURL(obj2Fa.otpauthUrl);
          }
        }
      }
    } catch (e) {console.log("err", e)}
    return ret;
  }

  async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(user.email, 'Sales AMC Aviation', secret);

    // await this.usersRepository.update({email: user.email}, {secret_2fa: secret});

    return {
      secret,
      otpauthUrl
    }
  }

  async verify2fa(code, userId, tmpSecret){
    var secret = tmpSecret;
    let user = await this.usersRepository.findOneBy({ id: userId });
    if(secret === "")
        secret = user.secret_2fa;
    let ret = {success: false};
    if(authenticator.verify({token: code, secret: secret})){
        if(user.secret_2fa === "")
            await this.usersRepository.update({id: userId}, {secret_2fa: secret, last_login_time: new Date()});
        ret['success'] = true;
    }
    return ret;
  }
}
