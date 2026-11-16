import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { AccessGuard } from '../access/access.guard.js';
import { PrismaService } from '../database/prisma.service.js';
import { IndentsAccess } from './indents.access.js';
import { IndentsController } from './indents.controller.js';
import { IndentsService } from './indents.service.js';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [IndentsController],
  providers: [
    IndentsService,
    IndentsAccess,
    PrismaService,
    AccessGuard,
  ],
  exports: [IndentsService],
})
export class IndentsModule {}
