import { Module } from '@nestjs/common';
import { TapsService } from './taps.service';
import { TapsGateway } from './taps.gateway';

@Module({
  providers: [TapsGateway, TapsService],
})
export class TapsModule {}
