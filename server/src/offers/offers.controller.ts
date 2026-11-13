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
  CreateOfferDto,
  DenyOfferDto,
  QueryOfferDto,
  UpdateOfferApprovalDto,
  UpdateOfferDto,
} from './dto.js';
import { OffersService } from './offers.service.js';

@Controller('offers')
@UseGuards(AccessGuard)
export class OffersController {
  constructor(private readonly service: OffersService) {}

  @Get()
  list(@Req() req: any, @Query() query: QueryOfferDto) {
    return this.service.list(req.accessUser, query);
  }

  @Get('status-list')
  statusList(@Req() req: any, @Query() query: QueryOfferDto) {
    return this.service.getStatusList(req.accessUser, query);
  }

  @Get(':no')
  getByNo(@Req() req: any, @Param('no') no: string) {
    return this.service.getByNo(req.accessUser, no);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateOfferDto) {
    return this.service.create(req.accessUser, dto);
  }

  @Patch(':no/deny')
  deny(
    @Req() req: any,
    @Param('no') no: string,
    @Body() dto: DenyOfferDto,
  ) {
    return this.service.deny(req.accessUser, no, dto);
  }

  @Patch(':no/approval')
  updateApproval(
    @Req() req: any,
    @Param('no') no: string,
    @Body() dto: UpdateOfferApprovalDto,
  ) {
    return this.service.updateApproval(req.accessUser, no, dto);
  }

  @Patch(':no')
  update(
    @Req() req: any,
    @Param('no') no: string,
    @Body() dto: UpdateOfferDto,
  ) {
    return this.service.update(req.accessUser, no, dto);
  }

  @Delete(':no')
  remove(@Req() req: any, @Param('no') no: string) {
    return this.service.remove(req.accessUser, no);
  }
}
