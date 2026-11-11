import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { PrismaService } from '../database/prisma.service.js';
import { AccessController } from './access.controller.js';
import { AccessService } from './access.service.js';
import { AccessGuard, SuperAdminGuard } from './access.guard.js';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '8h' } })],
  controllers: [AccessController],
  providers: [AccessService, PrismaService, AccessGuard, SuperAdminGuard],
})
export class AccessModule {}
