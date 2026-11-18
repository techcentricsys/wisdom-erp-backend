import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { AccessGuard } from '../access/access.guard.js';
import { PrismaService } from '../database/prisma.service.js';
import { SamplesAccess } from './samples.access.js';
import { SamplesController } from './samples.controller.js';
import { SamplesService } from './samples.service.js';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [SamplesController],
  providers: [
    SamplesService,
    SamplesAccess,
    PrismaService,
    AccessGuard,
  ],
  exports: [SamplesService],
})
export class SamplesModule {}
