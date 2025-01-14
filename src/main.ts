import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './helper/response.interceptor';
import { ResponseFailFilter } from './helper/responseFail.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // 启用跨域
    app.enableCors();
    // 全局管道
    app.useGlobalPipes(
        new ValidationPipe({
            // 只验证请求体中的属性，不验证请求头和路径参数
            whitelist: true,
            // 将请求体中的属性转换为相应的类型
            transform: true
        })
    );
    // 全局拦截器
    app.useGlobalInterceptors(new ResponseInterceptor());
    // 全局过滤器
    app.useGlobalFilters(new ResponseFailFilter());

    // 启用swagger
    const config = new DocumentBuilder()
        .setTitle('vue3App API')
        .setDescription('API 文档')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true
        },
        customSiteTitle: 'Vue3App API Documentation'
    });

    // 启动服务
    await app.listen(3000);
}
bootstrap();
