import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService) {
    const defaultNeonUrl =
      'postgresql://neondb_owner:npg_BHQsvqgr9m4J@ep-tiny-hill-b46ck3o1-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&connect_timeout=45&pool_timeout=45';

    const envUrl =
      configService.get<string>('DATABASE_URL') || process.env.DATABASE_URL;

    const databaseUrl =
      envUrl && envUrl.trim().length > 0 && !envUrl.includes('localhost:5432')
        ? envUrl
        : defaultNeonUrl;

    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Connected to PostgreSQL successfully');
    } catch (err: any) {
      this.logger.warn(`Deferred PostgreSQL connection: ${err.message}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
