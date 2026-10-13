import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

export function setupApp(app: INestApplication): void {
  // Enable CORS for Flutter Web, Mobile, Desktop, and Postman
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global API Prefix (excludes /health)
  app.setGlobalPrefix('api', {
    exclude: ['health', ''],
  });

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation Setup with CDN fallbacks for serverless environments
  const config = new DocumentBuilder()
    .setTitle('TaskFlow API')
    .setDescription(
      'Production-grade RESTful API for TaskFlow - Smart Team & Project Management full-stack application built with NestJS, Prisma, and PostgreSQL.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT access token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User registration, login, and profile retrieval')
    .addTag('Users', 'User profile management')
    .addTag('Projects', 'Project lifecycle and management')
    .addTag('Tasks', 'Task CRUD, Kanban status updates, filtering and sorting')
    .addTag('Dashboard', 'Aggregated team metrics, progress, and upcoming deadlines')
    .addTag('Health', 'Service health check and monitoring')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'TaskFlow API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js',
    ],
  });
}
