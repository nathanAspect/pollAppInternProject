import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { jwtModule } from '../modules.config';
import { PollsController } from './polls.contoller';
import { PollsGateway } from './polls.gateway';
import { PollsRepository } from './polls.repository';
import { PollsService } from './polls.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ConfigModule, PrismaModule, jwtModule],
  controllers: [PollsController],
  providers: [PollsService, PollsRepository, PollsGateway],
})
export class PollsModule {}
