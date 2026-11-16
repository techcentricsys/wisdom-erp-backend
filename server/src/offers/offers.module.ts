import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { AccessGuard } from '../access/access.guard.js';
import { PrismaService } from '../database/prisma.service.js';
import { OffersAccess } from './offers.access.js';
import { OffersController } from './offers.controller.js';
import { OffersService } from './offers.service.js';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [OffersController],
  providers: [
    OffersService,
    OffersAccess,
    PrismaService,
    AccessGuard,
  ],
  exports: [OffersService],
})
export class OffersModule {}
