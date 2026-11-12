import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { AccessGuard } from '../access/access.guard.js';
import { PrismaService } from '../database/prisma.service.js';
import { MasterAccountsAccess } from './master-accounts.access.js';
import { MasterAccountsController } from './master-accounts.controller.js';
import { MasterAccountsService } from './master-accounts.service.js';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [MasterAccountsController],
  providers: [
    MasterAccountsService,
    MasterAccountsAccess,
    PrismaService,
    AccessGuard,
  ],
  exports: [MasterAccountsService],
})
export class MasterAccountsModule {}
