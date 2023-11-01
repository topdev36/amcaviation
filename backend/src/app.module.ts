import { Module, NestModule, MiddlewareConsumer  } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalesModule } from './sales/sales.module';
import { PayModule } from './pay/pay.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract} from './entity/contract.entity';
import { Tx} from './entity/tx.entity';
import { AuthMiddleWare } from './common/middle/auth.middleware';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LoginModule } from './login/login.module';
import { User } from './entity/user.entity';

@Module({
  imports: [
    SalesModule,    
    PayModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'test',
      entities: [Contract, Tx, User],
      // synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: "files",
    }),
    LoginModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleWare)
      .forRoutes('sales');
  }
}
