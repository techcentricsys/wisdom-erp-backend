import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto.js';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto.js';
import { ManufacturerService } from './manufacturer.service.js';

@Controller('manufacturers')
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Post()
  create(@Body() dto: CreateManufacturerDto) {
    return this.manufacturerService.create(dto);
  }

  @Get()
  findAll() {
    return this.manufacturerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.manufacturerService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateManufacturerDto) {
    return this.manufacturerService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.manufacturerService.remove(id);
  }
}
