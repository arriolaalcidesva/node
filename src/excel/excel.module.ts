import { Module } from '@nestjs/common';
import { ExcelService } from './services/excel.service';
import { ExcelController } from './controllers/excel.controller';

@Module({
  providers: [ExcelService],
  controllers: [ExcelController]
})
export class ExcelModule {}
