import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  static counts: Record<string, number> = {};

  use(req: Request, _res: Response, next: NextFunction) {
    const key = `${req.method} ${req.path}`;
    MetricsMiddleware.counts[key] = (MetricsMiddleware.counts[key] || 0) + 1;
    next();
  }
}
