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
  AssignCustomerDto,
  CreateMasterAccountDto,
  QueryMasterAccountDto,
  UpdateMasterAccountDto,
} from './dto.js';
import { MasterAccountsService } from './master-accounts.service.js';

@Controller('master-accounts')
@UseGuards(AccessGuard)
export class MasterAccountsController {
  constructor(private readonly service: MasterAccountsService) {}

  @Get()
  list(@Req() req: any, @Query() query: QueryMasterAccountDto) {
    return this.service.list(req.accessUser, query);
  }

  @Get('account-list')
  accountList(@Req() req: any, @Query() query: QueryMasterAccountDto) {
    return this.service.getAccountList(req.accessUser, query);
  }

  @Get('customer-assignments')
  listCustomerAssignments(@Req() req: any) {
    return this.service.listCustomerAssignments(req.accessUser);
  }

  @Patch(':id/assignment')
  assignCustomer(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: AssignCustomerDto,
  ) {
    return this.service.assignCustomer(req.accessUser, id, dto);
  }

  @Get(':id')
  getById(@Req() req: any, @Param('id') id: string) {
    return this.service.getById(req.accessUser, id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateMasterAccountDto) {
    return this.service.create(req.accessUser, dto);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateMasterAccountDto,
  ) {
    return this.service.update(req.accessUser, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.accessUser, id);
  }
}
