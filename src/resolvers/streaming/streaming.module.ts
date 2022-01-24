import { Module } from '@nestjs/common';
import { StreamingResolver } from './streaming.resolver';
import { StreamingService } from './streaming.service';
import { StreamingController } from './streaming.controller';

@Module({
  providers: [StreamingResolver, StreamingService],
  controllers: [StreamingController]
})
export class StreamingModule {}
