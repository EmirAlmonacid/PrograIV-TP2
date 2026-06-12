import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    // Carga las variables de entorno de forma global
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Conexión a MongoDB usando la variable DATABASE_URL
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
    }),

    CloudinaryModule,
    UsuariosModule,
    AuthModule,
    PublicacionesModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}