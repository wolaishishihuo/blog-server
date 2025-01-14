import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: '用户注册' })
    @ApiResponse({
        status: 200,
        description: '注册成功',
        type: RegisterAuthDto
    })
    @Post('register')
    register(@Body() registerAuthDto: RegisterAuthDto) {
        return this.authService.register(registerAuthDto);
    }

    @ApiOperation({ summary: '用户登录' })
    @ApiResponse({
        status: 200,
        description: '登录成功',
        schema: {
            properties: {
                access_token: { type: 'string' },
                refresh_token: { type: 'string' }
            }
        }
    })
    @Post('login')
    login(@Body() loginAuthDto: LoginAuthDto) {
        return this.authService.login(loginAuthDto);
    }

    @ApiOperation({ summary: '刷新Token' })
    @ApiResponse({
        status: 200,
        description: '刷新成功',
        schema: {
            properties: {
                access_token: { type: 'string' },
                refresh_token: { type: 'string' }
            }
        }
    })
    @Get('refresh')
    refresh(@Query('refresh_token') refreshToken: string) {
        return this.authService.refreshToken(refreshToken);
    }
}
