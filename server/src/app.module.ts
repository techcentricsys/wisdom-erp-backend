import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { AccessModule } from './access/access.module.js';
import { MasterAccountsModule } from './master-accounts/master-accounts.module.js';
import { InquiryModule } from './modules/inquiry/inquiry.module.js';
import { OffersModule } from './offers/offers.module.js';
import { IndentsModule } from './indents/indents.module.js';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module.js';
import { ShipmentsModule } from './shipments/shipments.module.js';
import { SetupMastersModule } from './setup-masters/setup-masters.module.js';

@Module({
  imports: [
    AuthModule,
    AccessModule,
    MasterAccountsModule,
    InquiryModule,
    OffersModule,
    IndentsModule,
    PurchaseOrdersModule,
    ShipmentsModule,
    SetupMastersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
