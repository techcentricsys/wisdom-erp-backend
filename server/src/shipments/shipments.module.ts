import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { AccessGuard } from '../access/access.guard.js';
import { PrismaService } from '../database/prisma.service.js';
import { ShipmentsAccess } from './shipments.access.js';
import { ShipmentsController } from './shipments.controller.js';
import { ShipmentsService } from './shipments.service.js';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [ShipmentsController],
  providers: [
    ShipmentsService,
    ShipmentsAccess,
    PrismaService,
    AccessGuard,
  ],
  exports: [ShipmentsService],
})
export class ShipmentsModule {}
