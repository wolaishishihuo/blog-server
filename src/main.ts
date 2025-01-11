import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './helper/response.interceptor';
import { ResponseFailFilter } from './helper/responseFail.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true
        })
    );
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new ResponseFailFilter());
    await app.listen(3000);
}
bootstrap();
