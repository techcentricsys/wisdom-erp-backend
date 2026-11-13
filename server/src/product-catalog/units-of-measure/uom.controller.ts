
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { UomService } from './uom.service.js';
import { CreateUomDto } from './dto/create-uom.dto.js';
import { UpdateUomDto } from './dto/update-uom.dto.js';

@Controller('units-of-measure')
export class UomController {
  constructor(
    private readonly uomService: UomService,
  ) {}

  @Post()
  create(@Body() dto: CreateUomDto) {
    return this.uomService.create(dto);
  }

  @Get()
  findAll() {
    return this.uomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.uomService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUomDto,
  ) {
    return this.uomService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.uomService.remove(id);
  }
}
