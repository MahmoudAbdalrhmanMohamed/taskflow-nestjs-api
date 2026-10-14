import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';

@ApiTags('Root')
@Controller()
export class AppController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Root welcome endpoint' })
  getRoot() {
    return {
      name: 'TaskFlow API',
      version: '1.0.0',
      status: 'online',
      documentation: '/api/docs',
      health: '/health',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('health/env')
  @ApiOperation({ summary: 'Database environment verification' })
  checkEnv() {
    const dbUrl = process.env.DATABASE_URL;
    let dbHost = 'NOT_SET';
    if (dbUrl) {
      try {
        const parsed = new URL(dbUrl);
        dbHost = parsed.host;
      } catch {
        dbHost = 'SET_BUT_UNPARSABLE';
      }
    }
    return {
      hasDatabaseUrl: Boolean(dbUrl),
      dbHost,
      nodeEnv: process.env.NODE_ENV || 'development',
      hasJwtSecret: Boolean(process.env.JWT_SECRET),
    };
  }
}
