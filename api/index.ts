import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express, Request, Response } from 'express';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/app.setup';

const server: Express = express();
let isReady = false;
let initPromise: Promise<void> | null = null;
let initError: any = null;

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    setupApp(app);
    await app.init();
    isReady = true;
  } catch (err: any) {
    initError = err;
    console.error('NestJS Bootstrap Exception:', err);
    throw err;
  }
}

export default async function handler(req: Request, res: Response) {
  try {
    if (!isReady) {
      if (!initPromise) {
        initPromise = bootstrap();
      }
      await initPromise;
    }
    server(req, res);
  } catch (err: any) {
    res.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Serverless Function Bootstrap Failed',
      details: err?.message || String(err),
    });
  }
}
