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
import { AccessGuard } from '../access/access.guard.js';
import {
  CreateShipmentDocDto,
  CreateShipmentDto,
  QueryShipmentDto,
  SendShipmentDocDto,
  UpdateShipmentDocDto,
  UpdateShipmentDto,
} from './dto.js';
import { ShipmentsService } from './shipments.service.js';

@Controller('shipments')
@UseGuards(AccessGuard)
export class ShipmentsController {
  constructor(private readonly service: ShipmentsService) {}

  @Get()
  list(@Req() req: any, @Query() query: QueryShipmentDto) {
    return this.service.list(req.accessUser, query);
  }

  @Get('report')
  report(@Req() req: any, @Query() query: QueryShipmentDto) {
    return this.service.getReport(req.accessUser, query);
  }

  @Get('documents')
  listDocuments(@Req() req: any, @Query('search') search?: string) {
    return this.service.listDocuments(req.accessUser, search);
  }

  @Get('documents/pending-indents')
  pendingDocIndents(@Req() req: any) {
    return this.service.getPendingDocIndents(req.accessUser);
  }

  @Get('documents/:indentNo')
  getDocumentByIndent(@Req() req: any, @Param('indentNo') indentNo: string) {
    return this.service.getDocumentByIndent(req.accessUser, indentNo);
  }

  @Post('documents')
  createDocument(@Req() req: any, @Body() dto: CreateShipmentDocDto) {
    return this.service.createDocument(req.accessUser, dto);
  }

  @Patch('documents/:indentNo')
  updateDocument(
    @Req() req: any,
    @Param('indentNo') indentNo: string,
    @Body() dto: UpdateShipmentDocDto,
  ) {
    return this.service.updateDocument(req.accessUser, indentNo, dto);
  }

  @Post('documents/:indentNo/send')
  sendDocument(
    @Req() req: any,
    @Param('indentNo') indentNo: string,
    @Body() dto: SendShipmentDocDto,
  ) {
    return this.service.sendDocument(req.accessUser, indentNo, dto);
  }

  @Delete('documents/:indentNo')
  removeDocument(@Req() req: any, @Param('indentNo') indentNo: string) {
    return this.service.removeDocument(req.accessUser, indentNo);
  }

  @Get(':no')
  getByNo(@Req() req: any, @Param('no') no: string) {
    return this.service.getByNo(req.accessUser, no);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateShipmentDto) {
    return this.service.create(req.accessUser, dto);
  }

  @Patch(':no')
  update(
    @Req() req: any,
    @Param('no') no: string,
    @Body() dto: UpdateShipmentDto,
  ) {
    return this.service.update(req.accessUser, no, dto);
  }

  @Delete(':no')
  remove(@Req() req: any, @Param('no') no: string) {
    return this.service.remove(req.accessUser, no);
  }
}
