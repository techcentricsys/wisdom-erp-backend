import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { InquiryService } from './inquiry.service.js';
import {
  CancelInquiryDto,
  CreateInquiryDto,
  SupplierRateSheetDto,
  UpdateInquiryDto,
  UpdateSupplierRateSheetDto,
} from './dto/inquiry.dto.js';

@Controller('inquiries')
@UseGuards(JwtAuthGuard)
export class InquiryController {
  constructor(private readonly inquiries: InquiryService) {}

  @Get('options')
  options(@Req() req: any) {
    return this.inquiries.options(req.jwtUser.sub);
  }

  @Post('options/customers')
  createCustomer(@Body() body: any) {
    return this.inquiries.createCustomer(body);
  }

  @Patch('options/customers/:id')
  updateCustomer(@Param('id') id: string, @Body() body: any) {
    return this.inquiries.updateCustomer(id, body);
  }

  @Delete('options/customers/:id')
  deleteCustomer(@Param('id') id: string) {
    return this.inquiries.deleteCustomer(id);
  }

  @Post('options/suppliers')
  createSupplier(@Body() body: any) {
    return this.inquiries.createSupplier(body);
  }

  @Patch('options/suppliers/:id')
  updateSupplier(@Param('id') id: string, @Body() body: any) {
    return this.inquiries.updateSupplier(id, body);
  }

  @Delete('options/suppliers/:id')
  deleteSupplier(@Param('id') id: string) {
    return this.inquiries.deleteSupplier(id);
  }

  @Post('options/products')
  createProduct(@Body() body: any) {
    return this.inquiries.createProduct(body);
  }

  @Patch('options/products/:id')
  updateProduct(@Param('id') id: string, @Body() body: any) {
    return this.inquiries.updateProduct(id, body);
  }

  @Delete('options/products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.inquiries.deleteProduct(id);
  }

  @Get()
  list(@Req() req: any, @Query('status') status?: string, @Query('search') search?: string) {
    return this.inquiries.list(req.jwtUser.sub, { status, search });
  }

  @Post()
  create(@Req() req: any, @Body() body: CreateInquiryDto) {
    return this.inquiries.create(req.jwtUser.sub, body);
  }

  @Get(':inquiryNo/rates')
  listRateSheets(@Req() req: any, @Param('inquiryNo') inquiryNo: string) {
    return this.inquiries.listRateSheets(req.jwtUser.sub, inquiryNo);
  }

  @Post(':inquiryNo/rates')
  addRateSheet(
    @Req() req: any,
    @Param('inquiryNo') inquiryNo: string,
    @Body() body: SupplierRateSheetDto,
  ) {
    return this.inquiries.addRateSheet(req.jwtUser.sub, inquiryNo, body);
  }

  @Patch('rate-sheets/:id')
  updateRateSheet(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateSupplierRateSheetDto,
  ) {
    return this.inquiries.updateRateSheet(req.jwtUser.sub, id, body);
  }

  @Delete('rate-sheets/:id')
  deleteRateSheet(@Req() req: any, @Param('id') id: string) {
    return this.inquiries.deleteRateSheet(req.jwtUser.sub, id);
  }

  @Get(':inquiryNo')
  findOne(@Req() req: any, @Param('inquiryNo') inquiryNo: string) {
    return this.inquiries.findOne(req.jwtUser.sub, inquiryNo);
  }

  @Patch(':inquiryNo/cancel')
  cancel(
    @Req() req: any,
    @Param('inquiryNo') inquiryNo: string,
    @Body() body: CancelInquiryDto,
  ) {
    return this.inquiries.cancel(req.jwtUser.sub, inquiryNo, body.cancelReason);
  }

  @Patch(':inquiryNo')
  update(
    @Req() req: any,
    @Param('inquiryNo') inquiryNo: string,
    @Body() body: UpdateInquiryDto,
  ) {
    return this.inquiries.update(req.jwtUser.sub, inquiryNo, body);
  }

  @Delete(':inquiryNo')
  delete(@Req() req: any, @Param('inquiryNo') inquiryNo: string) {
    return this.inquiries.delete(req.jwtUser.sub, inquiryNo);
  }
}
