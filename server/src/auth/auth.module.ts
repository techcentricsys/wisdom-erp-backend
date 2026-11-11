import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../database/prisma.service.js';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './guards/roles.guard.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import 'dotenv/config';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, RolesGuard, JwtAuthGuard],
  exports: [JwtModule, PrismaService, RolesGuard, JwtAuthGuard],
})
export class AuthModule {}
