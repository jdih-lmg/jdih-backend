import { Module } from '@nestjs/common';
import { VisitorStatsService } from './visitor-stats.service';
import { VisitorStatsController } from './visitor-stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitorStat } from 'src/entities/visitor-stats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VisitorStat])],
  providers: [VisitorStatsService],
  controllers: [VisitorStatsController],
  exports: [VisitorStatsService],
})
export class VisitorStatsModule {}
