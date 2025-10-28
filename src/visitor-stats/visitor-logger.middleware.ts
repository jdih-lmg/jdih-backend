import { Injectable, NestMiddleware } from '@nestjs/common';
import { VisitorStatsService } from './visitor-stats.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class VisitorLoggerMiddleware implements NestMiddleware {
  constructor(private readonly visitorStatsService: VisitorStatsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'GET' && req.path === '/') {
      const ip =
        req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || '';
      const userAgent = req.headers['user-agent'];
      await this.visitorStatsService.recordVisit(ip, userAgent);
    }
    next();
  }
}
