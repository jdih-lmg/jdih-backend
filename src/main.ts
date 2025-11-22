import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix('api');

  app.useGlobalFilters(new AllExceptionFilter());

  const uploadsDir = join(__dirname, '..', process.env.UPLOADS_PATH || 'uploads');

  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads/',
    setHeaders: (res: Response, path: string) => {
      if (path.endsWith('.pdf')) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      }
    },
  });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log(`✅ Server berjalan di http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
});
