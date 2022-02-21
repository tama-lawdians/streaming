import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';

@Module({
  providers: [ChatResolver, ChatService, PrismaService],
})
export class ChatModule {}
