/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Req } from '@nestjs/common';
import { VisitorStatsService } from './visitor-stats.service';
import type { Request } from 'express';

@Controller('visitor-stats')
export class VisitorStatsController {
  constructor(private readonly visitorStatsService: VisitorStatsService) {}

  // rekam kunjungan
  @Get()
  async recordVisit(@Req() req: Request) {
    const ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      req.socket.remoteAddress ||
      'unknown';

    const userAgent = req.headers['user-agent'] || 'unknown';

    const result = await this.visitorStatsService.recordVisit(ip, userAgent);

    return {
      success: true,
      message: result.recorded ? 'Kunjungan berhasil dicatat' : 'Kunjungan hari ini sudah tercatat',
    };
  }

  // dapatkan statistik kunjungan
  @Get('summary')
  async getSummary() {
    const [today, month, year, total] = await Promise.all([
      this.visitorStatsService.getTodayVisits(),
      this.visitorStatsService.getMonthlyVisits(),
      this.visitorStatsService.getYearlyVisits(),
      this.visitorStatsService.getTotalVisits(),
    ]);

    return {
      message: 'Statistik kunjungan berhasil diambil',
      success: true,
      data: {
        today,
        month,
        year,
        total,
      },
    };
  }

  // statistik harian, bulanan, dan tahunan (untuk grafik)
  @Get('chart-data')
  async getChartData() {
    const [daily, monthly, yearly] = await Promise.all([
      this.visitorStatsService.getDailyStats(7),
      this.visitorStatsService.getMonthlyStats(12),
      this.visitorStatsService.getYearlyStats(5),
    ]);

    return {
      message: 'Data grafik kunjungan berhasil diambil',
      success: true,
      data: {
        daily,
        monthly,
        yearly,
      },
    };
  }
}
