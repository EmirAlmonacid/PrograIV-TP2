import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

let app: INestApplication;

async function createApp(): Promise<INestApplication> {
    if (!app) {

    app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: [
        'http://localhost:4200',
        'https://progra-iv-tp-2-front-woad.vercel.app'
        ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type'],
    });

    await app.init();
    }

    return app;
}

export default async function handler(req: any, res: any) {
    const app = await createApp();

    const server = app.getHttpAdapter().getInstance();

    return server(req, res);
}