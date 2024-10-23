import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrgService } from './org.service';
import { OrgController } from './org.controller';
import { Org } from './org.entity';
import { UserModule } from 'src/user/user.module';
import { PdfModule } from 'src/pdf/pdf.module';
import { VisualizationModule } from 'src/visualization/visuialization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Org]), 
    UserModule, PdfModule, 
    VisualizationModule],
  providers: [OrgService],
  controllers: [OrgController],
  exports: [TypeOrmModule], // Export TypeOrmModule to make OrgRepository available
})
export class OrgModule {}