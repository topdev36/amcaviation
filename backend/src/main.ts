import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import {baseSalesUrl, basePayUrl} from "src/common/common";
const cors = require("cors");

var corsOptions = {
	origin: [
		basePayUrl,
    baseSalesUrl,
		// "http://localhost:3001",
    // "http://localhost:3002",
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
      cookie: {secure: false, maxAge: 1800000},
    }),
  );
  await app.listen(8006);
}
bootstrap();
