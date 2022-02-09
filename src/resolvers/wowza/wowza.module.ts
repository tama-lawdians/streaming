import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WowzaResolver } from './wowza.resolver';
import { WowzaService } from './wowza.service';

@Module({
  imports: [HttpModule],
  providers: [WowzaResolver, WowzaService],
})
export class WowzaModule {}
