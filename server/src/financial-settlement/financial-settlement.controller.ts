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
  CreateCommissionReceiptDto,
  CreateDebitNoteDto,
  QuerySettlementDto,
  UpdateCommissionReceiptDto,
  UpdateDebitNoteDto,
} from './dto.js';
import { FinancialSettlementService } from './financial-settlement.service.js';

@Controller('financial-settlement')
@UseGuards(AccessGuard)
export class FinancialSettlementController {
  constructor(private readonly service: FinancialSettlementService) {}
  @Get('eligible-shipments') eligibleShipments(@Req() req: any) {
    return this.service.eligibleShipments(req.accessUser);
  }
  @Get('debit-notes') debitNotes(
    @Req() req: any,
    @Query() q: QuerySettlementDto,
  ) {
    return this.service.listDebitNotes(req.accessUser, q);
  }
  @Get('debit-notes/:id') debitNote(@Req() req: any, @Param('id') id: string) {
    return this.service.getDebitNote(req.accessUser, id);
  }
  @Post('debit-notes') createDebitNote(
    @Req() req: any,
    @Body() dto: CreateDebitNoteDto,
  ) {
    return this.service.createDebitNote(req.accessUser, dto);
  }
  @Patch('debit-notes/:id') updateDebitNote(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateDebitNoteDto,
  ) {
    return this.service.updateDebitNote(req.accessUser, id, dto);
  }
  @Delete('debit-notes/:id') deleteDebitNote(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return this.service.deleteDebitNote(req.accessUser, id);
  }
  @Get('commission-receipts') receipts(
    @Req() req: any,
    @Query() q: QuerySettlementDto,
  ) {
    return this.service.listReceipts(req.accessUser, q);
  }
  @Get('commission-receipts/:id') receipt(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return this.service.getReceipt(req.accessUser, id);
  }
  @Post('commission-receipts') createReceipt(
    @Req() req: any,
    @Body() dto: CreateCommissionReceiptDto,
  ) {
    return this.service.createReceipt(req.accessUser, dto);
  }
  @Patch('commission-receipts/:id') updateReceipt(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateCommissionReceiptDto,
  ) {
    return this.service.updateReceipt(req.accessUser, id, dto);
  }
  @Delete('commission-receipts/:id') deleteReceipt(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return this.service.deleteReceipt(req.accessUser, id);
  }
}
