import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://progra-iv-tp-2-front-ph64b5nib-emiralmonacid-7158s-projects.vercel.app'
    ],
  });

  await app.listen(3000);

  console.log('Servidor iniciado en puerto 3000');
}

bootstrap();