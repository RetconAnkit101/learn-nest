import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertyModule } from './property/property.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import dbConfig from './config/db.config';
import dbConfigproduction from './config/db.config.production';

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
    AuthModule, 
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
