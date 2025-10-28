import { Module } from '@nestjs/common';
import { VisitorStatsService } from './visitor-stats.service';
import { VisitorStatsController } from './visitor-stats.controller';

@Module({
  providers: [VisitorStatsService],
  controllers: [VisitorStatsController]
})
export class VisitorStatsModule {}
