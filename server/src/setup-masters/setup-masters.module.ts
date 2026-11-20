import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { AccessGuard } from '../access/access.guard.js';
import { PrismaService } from '../database/prisma.service.js';
import { SetupMastersAccess } from './setup-masters.access.js';
import { SetupMastersController } from './setup-masters.controller.js';
import { SetupMastersService } from './setup-masters.service.js';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [SetupMastersController],
  providers: [
    SetupMastersService,
    SetupMastersAccess,
    PrismaService,
    AccessGuard,
  ],
  exports: [SetupMastersService],
})
export class SetupMastersModule {}
