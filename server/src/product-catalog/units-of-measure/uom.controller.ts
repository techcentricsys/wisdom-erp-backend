import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUomDto } from './dto/create-uom.dto.js';
import { UpdateUomDto } from './dto/update-uom.dto.js';
import { UomService } from './uom.service.js';

@Controller('units-of-measure')
export class UomController {
  constructor(private readonly uomService: UomService) {}

  @Post()
  create(@Body() dto: CreateUomDto) {
    return this.uomService.create(dto);
  }

  @Get()
  findAll() {
    return this.uomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uomService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUomDto) {
    return this.uomService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uomService.remove(id);
  }
}
