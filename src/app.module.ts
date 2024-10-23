import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfModule } from './pdf/pdf.module';
import { OrgController } from './org/org.controller';
import { OrgService } from './org/org.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user/user.service';
import { VisualizationService } from './visualization/visualization.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles/roles.guard';
import { AuthGuard } from './auth/auth.guard';
import { OrgModule } from './org/org.module';
import { UserModule } from './user/user.module';
import { VisualizationModule } from './visualization/visuialization.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'pdf_craft_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    OrgModule,
    PdfModule,
    UserModule,
    VisualizationModule
  ],
  controllers: [AppController, OrgController],
  providers: [
    AppService, 
    OrgService, 
    UserService, 
    VisualizationService
  ],
})
export class AppModule {}
