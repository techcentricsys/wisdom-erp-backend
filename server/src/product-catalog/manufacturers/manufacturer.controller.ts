
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

import { ManufacturerService } from './manufacturer.service.js';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto.js';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto.js';

@Controller('manufacturers')
export class ManufacturerController {
  constructor(
    private readonly manufacturerService: ManufacturerService,
  ) {}

  @Post()
  create(@Body() dto: CreateManufacturerDto) {
    return this.manufacturerService.create(dto);
  }

  @Get()
  findAll() {
    return this.manufacturerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.manufacturerService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateManufacturerDto,
  ) {
    return this.manufacturerService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.manufacturerService.remove(id);
  }
}
