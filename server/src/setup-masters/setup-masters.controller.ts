import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessGuard } from '../access/access.guard.js';
import {
  CreateSetupMasterDto,
  QuerySetupMasterDto,
  SaveMailSetupDto,
  UpdateSetupMasterDto,
} from './dto.js';
import { SetupMastersService } from './setup-masters.service.js';

@Controller('setup-masters')
@UseGuards(AccessGuard)
export class SetupMastersController {
  constructor(private readonly service: SetupMastersService) {}

  @Get()
  list(@Req() req: any, @Query() query: QuerySetupMasterDto) {
    return this.service.list(req.accessUser, query);
  }

  @Get('all')
  getAllGrouped() {
    return this.service.getAllGrouped();
  }

  @Get('mail')
  getMailSetup(@Req() req: any) {
    return this.service.getMailSetup(req.accessUser);
  }

  @Put('mail')
  saveMailSetup(@Req() req: any, @Body() dto: SaveMailSetupDto) {
    return this.service.saveMailSetup(req.accessUser, dto);
  }

  @Post('mail/test')
  testMailSetup(@Req() req: any, @Body() dto: SaveMailSetupDto) {
    return this.service.testMailSetup(req.accessUser, dto);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateSetupMasterDto) {
    return this.service.create(req.accessUser, dto);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateSetupMasterDto,
  ) {
    return this.service.update(req.accessUser, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.accessUser, id);
  }
}
