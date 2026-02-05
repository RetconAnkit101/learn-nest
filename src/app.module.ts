import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertyModule } from './property/property.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import dbConfig from './config/db.config';
import dbConfigproduction from './config/db.config.production';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true,
      expandVariables: true,
      load: [dbConfig, dbConfigproduction]
   }),
    PropertyModule,
    TypeOrmModule.forRootAsync({
      useFactory: 
       dbConfig
    }),
    UserModule, 
  ],
  controllers: [AppController],
  providers: [AppService, ],
})
export class AppModule {}
