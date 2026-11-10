import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('roles')
  listRoles() {
    return this.permissionsService.listRoles();
  }

  @Post('roles')
  createRole(@Body('name') name: string) {
    return this.permissionsService.createRole(name);
  }

  @Delete('roles/:id')
  deleteRole(@Param('id') id: string) {
    return this.permissionsService.deleteRole(id);
  }

  @Get('permissions')
  listPermissions() {
    return this.permissionsService.listPermissions();
  }

  @Post('permissions')
  createPermission(@Body('code') code: string) {
    return this.permissionsService.createPermission(code);
  }

  @Get('users')
  listUsers(
    @CurrentUser('companyId') companyId: string,
    @Query('userType') userType?: string,
  ) {
    return this.permissionsService.listUsers(companyId, userType);
  }

  @Post('users')
  createUser(
    @CurrentUser('companyId') companyId: string,
    @Body() payload: CreateUserDto,
  ) {
    return this.permissionsService.createUser(companyId, payload);
  }

  @Patch('users/:id')
  updateUser(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body() payload: { firstName: string; lastName: string; email: string; roleId: string; phone?: string; kind?: string; userType?: string; password?: string },
  ) {
    return this.permissionsService.updateUser(companyId, id, payload);
  }

  @Patch('users/:id/status')
  updateUserStatus(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.permissionsService.updateUserStatus(companyId, id, isActive);
  }

  @Delete('users/:id')
  deleteUser(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.permissionsService.deleteUser(companyId, id);
  }

  @Get('roles/:id/permissions')
  getRolePermissions(@Param('id') id: string) {
    return this.permissionsService.getRolePermissions(id);
  }

  @Put('roles/:id/permissions')
  replaceRolePermissions(@Param('id') id: string, @Body('permissionIds') permissionIds: string[]) {
    return this.permissionsService.replaceRolePermissions(id, permissionIds);
  }

  @Put('users/:userId/roles/:roleId')
  assignRole(
    @CurrentUser('companyId') companyId: string,
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.permissionsService.assignRole(companyId, userId, roleId);
  }
}
