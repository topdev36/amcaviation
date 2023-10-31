import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import {domain} from "src/common/common";
const cors = require("cors");

var corsOptions = {
	origin: [
		"http://" + domain + ":3001",
    "http://" + domain + ":3002",
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
      cookie: {secure: false}
    }),
  );
  await app.listen(8006);
}
bootstrap();
