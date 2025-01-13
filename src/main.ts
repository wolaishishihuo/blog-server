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
            // 只验证请求体中的属性，不验证请求头和路径参数
            whitelist: true,
            // 将请求体中的属性转换为相应的类型
            transform: true
        })
    );
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new ResponseFailFilter());
    await app.listen(3000);
}
bootstrap();
