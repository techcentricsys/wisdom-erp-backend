import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { AccessModule } from './access/access.module.js';
import { MasterAccountsModule } from './master-accounts/master-accounts.module.js';

@Module({
  imports: [AuthModule, AccessModule, MasterAccountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}