import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

const PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());

  const swaggerOptions = new DocumentBuilder()
    .setTitle('JS-REST-API')
    .setDescription(
      'This is a API with Users and Articles created with Express.js. You can find more about it [here](https://github.com/waterseeker/js-rest-api).',
    )
    .setVersion('1.0.0')
    .addTag('user', 'Operations about user')
    .addTag('authentication', 'User authentication operations')
    .addTag('logout', 'User logout')
    .addTag('articles', 'Operations about articles')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(PORT);
}
bootstrap();
