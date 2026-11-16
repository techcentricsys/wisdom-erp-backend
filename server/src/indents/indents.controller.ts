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
  CreateIndentDto,
  QueryIndentDto,
  UpdateIndentDto,
} from './dto.js';
import { IndentsService } from './indents.service.js';

@Controller('indents')
@UseGuards(AccessGuard)
export class IndentsController {
  constructor(private readonly service: IndentsService) {}

  @Get()
  list(@Req() req: any, @Query() query: QueryIndentDto) {
    return this.service.list(req.accessUser, query);
  }

  @Get('report')
  report(@Req() req: any, @Query() query: QueryIndentDto) {
    return this.service.getReport(req.accessUser, query);
  }

  @Get(':no')
  getByNo(@Req() req: any, @Param('no') no: string) {
    return this.service.getByNo(req.accessUser, no);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateIndentDto) {
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
    @Body() dto: UpdateIndentDto,
  ) {
    return this.service.update(req.accessUser, no, dto);
  }

  @Delete(':no')
  remove(@Req() req: any, @Param('no') no: string) {
    return this.service.remove(req.accessUser, no);
  }
}
