import { Body, Controller, Get, Param } from '@nestjs/common';
import { ExcelService } from '../services/excel.service';

@Controller('excel')
export class ExcelController {
    constructor(private readonly excelService: ExcelService){}

    @Get('getExcelFromJSON/:filename')
    public async getExcelFromJSONList(
        @Param('filename') filename: string,
        @Body() body: any,
    ){
      try {
        return this.excelService.getExcelFromJSONList(filename, body);
      } catch (error: any) {
        console.log('Error: ', error);
        throw new Error(error?.message);
      }
    }
}
