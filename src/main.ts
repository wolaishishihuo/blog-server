import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './helper/response.interceptor';
import { ResponseFailFilter } from './helper/responseFail.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    try {
        const app = await NestFactory.create(AppModule);
        const port = process.env.NEST_PORT || 3000;

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
            .setTitle('后台管理系统 API 文档')
            .setDescription('API description')
            .setVersion('1.0')
            .addBearerAuth()
            .addTag('auth', '认证相关')
            .addTag('user', '用户相关')
            .addTag('todo', '待办事项')
            .addTag('third-party', '第三方服务')
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api-docs', app, document);

        await app.listen(port);
        console.log(`✅ Application is running on: http://localhost:${port}`);
        console.log(`📚 Swagger documentation is available at: http://localhost:${port}/api-docs`);
    } catch (error) {
        console.error('❌ Failed to start the application:', error);
        if (error.message?.includes('ECONNREFUSED')) {
            console.error('💡 提示：请检查：');
            console.error('1. Docker 服务是否正在运行');
            console.error('2. 数据库连接配置是否正确');
            console.error('3. 其他依赖服务是否已启动');
        }
        process.exit(1);
    }
}
bootstrap();
