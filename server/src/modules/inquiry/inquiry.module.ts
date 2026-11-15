import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { PrismaService } from '../../database/prisma.service.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { InquiryController } from './inquiry.controller.js';
import { InquiryService } from './inquiry.service.js';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
  controllers: [InquiryController],
  providers: [InquiryService, PrismaService, JwtAuthGuard],
})
export class InquiryModule {}
