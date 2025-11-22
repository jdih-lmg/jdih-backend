import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VisitorStat } from 'src/entities/visitor-stats.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class VisitorStatsService {
  constructor(@InjectRepository(VisitorStat) private visitorStatRepo: Repository<VisitorStat>) {}

  // rekam jejak kunjungan
  async recordVisit(ip: string, userAgent?: string) {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const existing = await this.visitorStatRepo.findOne({
      where: {
        ip_address: ip,
        visited_at: Between(startOfDay, endOfDay),
      },
    });

    if (!existing) {
      const visit = this.visitorStatRepo.create({ ip_address: ip, user_agent: userAgent });
      await this.visitorStatRepo.save(visit);

      return { recorded: true };
    }

    return { recorded: false };
  }

  // hitung total kunjungan
  async getTotalVisits(): Promise<number> {
    return this.visitorStatRepo.count();
  }

  // hitung kunjungan hari
  async getTodayVisits(): Promise<number> {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return this.visitorStatRepo.count({ where: { visited_at: Between(start, end) } });
  }

  // hitung kunjungan bulan
  async getMonthlyVisits(): Promise<number> {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    return this.visitorStatRepo.count({ where: { visited_at: Between(start, end) } });
  }

  // hitung kunjungan tahun
  async getYearlyVisits(): Promise<number> {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear() + 1, 0, 1);

    return this.visitorStatRepo.count({ where: { visited_at: Between(start, end) } });
  }

  // Statistik kunjungan per hari (7 hari terakhir)
  async getDailyStats(lastDays = 7) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.visitorStatRepo.query(
      `SELECT DATE(visited_at) as date, COUNT(*) as visits
         FROM visitor_stats
         WHERE visited_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
         GROUP BY DATE(visited_at)
         ORDER BY DATE(visited_at) ASC`,
      [lastDays],
    );
  }

  // Statistik kunjungan per bulan (12 bulan terakhir)
  async getMonthlyStats(lastMonths = 12) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.visitorStatRepo.query(
      `
      SELECT 
        DATE_FORMAT(visited_at, '%Y-%m') AS month,
        COUNT(*) AS visitors
      FROM visitor_stats
      WHERE visited_at >= DATE_SUB(LAST_DAY(CURDATE()), INTERVAL ? MONTH)
      GROUP BY DATE_FORMAT(visited_at, '%Y-%m')
      ORDER BY month ASC
      `,
      [lastMonths],
    );
  }

  // Statistik kunjungan per tahun (5 tahun terakhir)
  async getYearlyStats(lastYears = 5) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.visitorStatRepo.query(
      `
      SELECT 
        YEAR(visited_at) AS year,
        COUNT(*) AS visitors
      FROM visitor_stats
      WHERE visited_at >= DATE_SUB(CURDATE(), INTERVAL ? YEAR)
      GROUP BY YEAR(visited_at)
      ORDER BY year ASC
      `,
      [lastYears],
    );
  }
}
