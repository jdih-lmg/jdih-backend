import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

export interface HealthStatus {
  status: 'ok' | 'degraded';
  uptime: number;
  timestamp: string;
  checks: {
    database: 'up' | 'down' | 'unknown';
  };
}

@Injectable()
export class HealthService {
  constructor(private readonly dataSource: DataSource) {}

  async check(): Promise<HealthStatus> {
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

    const result: HealthStatus = {
      status: db.status === 'up' ? 'ok' : 'degraded',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      checks: {
        database: db.status,
      },
    };
    return result;
  }
}
