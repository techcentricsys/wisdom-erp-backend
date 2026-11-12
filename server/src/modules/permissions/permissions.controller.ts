import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { PermissionsService } from './permissions.service.js';

@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionsController {
  constructor(private readonly permissions: PermissionsService) {}

  @Get('me')
  myPermissions(@Req() request: any) {
    return this.permissions.myPermissions(request.jwtUser.sub);
  }

  @Get('roles')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  listRoles() { return this.permissions.listRoles(); }

  @Post('roles')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  createRole(@Body('name') name: string) { return this.permissions.createRole(name); }

  @Delete('roles/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  deleteRole(@Param('id') id: string) { return this.permissions.deleteRole(id); }

  @Get('permissions')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  listPermissions() { return this.permissions.listPermissions(); }

  @Post('permissions')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  createPermission(@Body('code') code: string) { return this.permissions.createPermission(code); }

  @Get('users')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  listUsers(@Req() request: any) { return this.permissions.listUsers(request.jwtUser.sub); }

  @Post('users')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  createUser(@Req() request: any, @Body() payload: any) {
    return this.permissions.createUser(request.jwtUser.sub, payload);
  }

  @Patch('users/:userId')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateUser(@Req() request: any, @Param('userId') userId: string, @Body() payload: any) {
    return this.permissions.updateUser(request.jwtUser.sub, userId, payload);
  }

  @Delete('users/:userId')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  deleteUser(@Req() request: any, @Param('userId') userId: string) {
    return this.permissions.deleteUser(request.jwtUser.sub, userId);
  }
  @Get('roles/:id/permissions')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  getRolePermissions(@Param('id') id: string) { return this.permissions.getRolePermissions(id); }

  @Put('roles/:id/permissions')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  replaceRolePermissions(@Param('id') id: string, @Body('permissionIds') ids: string[]) {
    return this.permissions.replaceRolePermissions(id, ids);
  }

  @Put('users/:userId/roles/:roleId')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  assignRole(@Req() request: any, @Param('userId') userId: string, @Param('roleId') roleId: string) {
    return this.permissions.assignRole(request.jwtUser.sub, userId, roleId);
  }
}
