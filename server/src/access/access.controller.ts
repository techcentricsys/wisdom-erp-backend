

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  
} from '@nestjs/common';

import { AccessService } from './access.service.js';
import { AccessGuard, SuperAdminGuard } from './access.guard.js';


import {
  AccessLoginDto,
  AccessRegisterDto,
  ChangePasswordDto,
  CreateRoleDto,
  CreateUserDto,
  SavePermissionsDto,
  UpdateUserDto,
} from './dto.js';

@Controller('access')
export class AccessController {
  constructor(private readonly svc: AccessService) {}

  @Post('login')
  login(@Body() b: AccessLoginDto) {
    return this.svc.login(b);
  }

  @Post('register')
  register(@Body() b: AccessRegisterDto) {
    return this.svc.register(b);
  }

  @UseGuards(AccessGuard)
  @Get('me')
  me(@Req() req: any) {
    return this.svc.me(req.accessUser);
  }

  @UseGuards(AccessGuard)
  @Post('change-password')
  changePassword(
    @Req() req: any,
    @Body() b: ChangePasswordDto,
  ) {
    return this.svc.changePassword(req.accessUser, b);
  }

  @UseGuards(AccessGuard, SuperAdminGuard)
  @Get('users')
  users() {
    return this.svc.listUsers();
  }

  @UseGuards(AccessGuard, SuperAdminGuard)
  @Post('users')
  createUser(@Body() b: CreateUserDto) {
    return this.svc.createUser(b);
  }

  @UseGuards(AccessGuard, SuperAdminGuard)
  @Patch('users/:id')
  updateUser(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() b: UpdateUserDto,
  ) {
    return this.svc.updateUser(req.accessUser, id, b);
  }

  @UseGuards(AccessGuard, SuperAdminGuard)
  @Get('roles')
  roles() {
    return this.svc.listRoles();
  }

  @UseGuards(AccessGuard, SuperAdminGuard)
  @Post('roles')
  createRole(@Body() b: CreateRoleDto) {
    return this.svc.createRole(b);
  }

  @UseGuards(AccessGuard, SuperAdminGuard)
  @Put('roles/:id/permissions')
  save(
    @Param('id', ParseIntPipe) id: number,
    @Body() b: SavePermissionsDto,
  ) {
    return this.svc.savePermissions(id, b.permissions);
  }

  @UseGuards(AccessGuard, SuperAdminGuard)
  @Delete('roles/:id')
  del(@Param('id', ParseIntPipe) id: number) {
    return this.svc.deleteRole(id);
  }
}
