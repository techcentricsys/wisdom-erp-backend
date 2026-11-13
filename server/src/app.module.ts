import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { AccessModule } from './access/access.module.js';
import { MasterAccountsModule } from './master-accounts/master-accounts.module.js';
import { OffersModule } from './offers/offers.module.js';

@Module({
  imports: [AuthModule, AccessModule, MasterAccountsModule, OffersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}