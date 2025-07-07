import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Credifit_API')
    .setDescription('API para simulação de empréstimos')
    .setVersion('1.0')
    .addServer(`http://localhost:${process.env.PORT ?? 3000}`, 'Servidor Local')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000).then(() => {
    console.log(
      `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
    );
    console.log(
      `Swagger is running on: http://localhost:${process.env.PORT ?? 3000}/api`,
    );
  });
}

void bootstrap();
