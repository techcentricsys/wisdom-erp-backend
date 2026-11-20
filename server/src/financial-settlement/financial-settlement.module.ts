import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { AccessGuard } from '../access/access.guard.js';
import { PrismaService } from '../database/prisma.service.js';
import { IndentsModule } from '../indents/indents.module.js';
import { FinancialSettlementController } from './financial-settlement.controller.js';
import { FinancialSettlementService } from './financial-settlement.service.js';

@Module({
  imports: [
    IndentsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [FinancialSettlementController],
  providers: [FinancialSettlementService, PrismaService, AccessGuard],
})
export class FinancialSettlementModule {}
