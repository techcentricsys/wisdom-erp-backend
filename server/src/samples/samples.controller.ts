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
  CreateSampleIssueDto,
  CreateSampleReceiveDto,
  QuerySampleDto,
  UpdateSampleIssueDto,
  UpdateSampleReceiveDto,
} from './dto.js';
import { SamplesService } from './samples.service.js';

@Controller('samples')
@UseGuards(AccessGuard)
export class SamplesController {
  constructor(private readonly service: SamplesService) {}

  @Get('receives')
  listReceives(@Req() req: any, @Query() query: QuerySampleDto) {
    return this.service.listReceives(req.accessUser, query);
  }

  @Get('receives/:no')
  getReceiveByNo(@Req() req: any, @Param('no') no: string) {
    return this.service.getReceiveByNo(req.accessUser, no);
  }

  @Post('receives')
  createReceive(@Req() req: any, @Body() dto: CreateSampleReceiveDto) {
    return this.service.createReceive(req.accessUser, dto);
  }

  @Patch('receives/:no')
  updateReceive(
    @Req() req: any,
    @Param('no') no: string,
    @Body() dto: UpdateSampleReceiveDto,
  ) {
    return this.service.updateReceive(req.accessUser, no, dto);
  }

  @Delete('receives/:no')
  removeReceive(@Req() req: any, @Param('no') no: string) {
    return this.service.removeReceive(req.accessUser, no);
  }

  @Get('issues')
  listIssues(@Req() req: any, @Query() query: QuerySampleDto) {
    return this.service.listIssues(req.accessUser, query);
  }

  @Get('issues/:no')
  getIssueByNo(@Req() req: any, @Param('no') no: string) {
    return this.service.getIssueByNo(req.accessUser, no);
  }

  @Post('issues')
  createIssue(@Req() req: any, @Body() dto: CreateSampleIssueDto) {
    return this.service.createIssue(req.accessUser, dto);
  }

  @Patch('issues/:no')
  updateIssue(
    @Req() req: any,
    @Param('no') no: string,
    @Body() dto: UpdateSampleIssueDto,
  ) {
    return this.service.updateIssue(req.accessUser, no, dto);
  }

  @Delete('issues/:no')
  removeIssue(@Req() req: any, @Param('no') no: string) {
    return this.service.removeIssue(req.accessUser, no);
  }

  @Get('reports/receives')
  receiveReport(@Req() req: any, @Query() query: QuerySampleDto) {
    return this.service.getReceiveReport(req.accessUser, query);
  }

  @Get('reports/issues')
  issueReport(@Req() req: any, @Query() query: QuerySampleDto) {
    return this.service.getIssueReport(req.accessUser, query);
  }

  @Get('reports/stock')
  stockReport(@Req() req: any, @Query() query: QuerySampleDto) {
    return this.service.getStockReport(req.accessUser, query);
  }
}
