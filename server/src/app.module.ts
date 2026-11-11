import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { PermissionsModule } from './modules/permissions/permissions.module.js';

@Module({
  imports: [AuthModule, PermissionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
