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
  CreatePurchaseOrderDto,
  QueryPurchaseOrderDto,
  UpdatePurchaseOrderDto,
} from './dto.js';
import { PurchaseOrdersService } from './purchase-orders.service.js';

@Controller('purchase-orders')
@UseGuards(AccessGuard)
export class PurchaseOrdersController {
  constructor(private readonly service: PurchaseOrdersService) {}

  @Get('options')
  options(@Req() req: any) {
    return this.service.options(req.accessUser);
  }

  @Get('report')
  report(@Req() req: any, @Query() query: QueryPurchaseOrderDto) {
    return this.service.report(req.accessUser, query);
  }

  @Get()
  list(@Req() req: any, @Query() query: QueryPurchaseOrderDto) {
    return this.service.list(req.accessUser, query);
  }

  @Get(':no')
  get(@Req() req: any, @Param('no') no: string) {
    return this.service.get(req.accessUser, no);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreatePurchaseOrderDto) {
    return this.service.create(req.accessUser, dto);
  }

  @Patch(':no/cancel')
  cancel(@Req() req: any, @Param('no') no: string) {
    return this.service.cancel(req.accessUser, no);
  }

  @Patch(':no')
  update(
    @Req() req: any,
    @Param('no') no: string,
    @Body() dto: UpdatePurchaseOrderDto,
  ) {
    return this.service.update(req.accessUser, no, dto);
  }

  @Delete(':no')
  remove(@Req() req: any, @Param('no') no: string) {
    return this.service.remove(req.accessUser, no);
  }
}
