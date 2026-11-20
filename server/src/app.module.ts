import { Module } from '@nestjs/common';
import { AccessModule } from './access/access.module.js';
import { AuthModule } from './auth/auth.module.js';
import { FinancialSettlementModule } from './financial-settlement/financial-settlement.module.js';
import { IndentsModule } from './indents/indents.module.js';
import { InquiryModule } from './modules/inquiry/inquiry.module.js';
import { MasterAccountsModule } from './master-accounts/master-accounts.module.js';
import { OffersModule } from './offers/offers.module.js';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module.js';
import { ShipmentsModule } from './shipments/shipments.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

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
    FinancialSettlementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
