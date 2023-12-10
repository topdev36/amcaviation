import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
const cors = require('cors');

var corsOptions = {
  origin: [
    'http://localhost:3001',
    'http://localhost:3002',
    'https://195.182.23.215',
    // 'https://195.182.23.216',
    // 'https://195.182.23.217',
    // 'https://195.182.23.218',
    // 'https://195.182.23.219',
    // 'https://195.182.23.220',
    // 'https://195.182.23.221',
    // 'https://195.182.23.222',
    // 'https://195.182.23.223',
    // 'https://195.182.23.224',
    // 'https://195.182.23.225',
    // 'https://195.182.23.226',
    // 'https://195.182.23.227',
    // 'https://195.182.23.228',
    // 'https://195.182.23.229',    
    // 'https://195.182.23.230',
    // 'https://195.182.23.231',
    // 'https://195.182.23.232',
    // 'https://195.182.23.233',
    // 'https://195.182.23.234',
    // 'https://195.182.23.235',
    // 'https://195.182.23.236',
    // 'https://195.182.23.237',
    // 'https://195.182.23.238',
    // 'https://195.182.23.239',
    // 'https://195.182.23.240',
    // 'https://195.182.23.241',
    // 'https://195.182.23.242',
    // 'https://195.182.23.243',
    // 'https://195.182.23.244',
    // 'https://195.182.23.245',
    // 'https://195.182.23.246',
    // 'https://195.182.23.247',
    // 'https://195.182.23.248',
    'https://195.182.23.249'
  ],
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors();
  app.use(cors(corsOptions));
  app.use(
    session({
      secret: '1234567890abcdeusdffweradfweradfewrasdfasdfasdfqwerwe',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false, maxAge: 1800000 },
    }),
  );
  await app.listen(8006);
}
bootstrap();
