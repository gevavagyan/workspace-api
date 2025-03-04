import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

interface EnvironmentVariables {
  CLIENT_ORIGIN: string;
  PORT: number;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService<EnvironmentVariables>>(ConfigService);

  const clientOrigin = configService.get<string>('CLIENT_ORIGIN', { infer: true });
  console.log(clientOrigin);

  app.use(cookieParser());

  app.enableCors({
    origin: clientOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(configService.get<number>('PORT', { infer: true }) || 3000);
}

bootstrap();
