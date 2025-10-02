import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(private readonly dataSource: DataSource) {}

  async check() {
    const db = {
      status: 'unknown' as 'up' | 'down' | 'unknown',
    };
    try {
      // Simple query to ensure DB connection is alive
      await this.dataSource.query('SELECT 1');
      db.status = 'up';
    } catch {
      db.status = 'down';
    }

    return {
      status: db.status === 'up' ? 'ok' : 'degraded',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      checks: {
        database: db.status,
      },
    };
  }
}
