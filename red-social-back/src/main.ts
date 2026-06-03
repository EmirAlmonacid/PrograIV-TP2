import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';

let app: INestApplication;

async function createApp(): Promise<INestApplication> {
  if (!app) {
    app = await NestFactory.create(AppModule);

    app.enableCors();

    await app.init();
  }

  return app;
}

export default async function handler(req: any, res: any) {
  const app = await createApp();

  const server = app.getHttpAdapter().getInstance();

  return server(req, res);
}