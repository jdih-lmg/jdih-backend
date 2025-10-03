import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { AllExceptionFilter } from './common/filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Register global error filter sederhana
  app.useGlobalFilters(new AllExceptionFilter());

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log(`Server berjalan di http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
});
