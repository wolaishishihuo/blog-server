import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() registerAuthDto: RegisterAuthDto) {
        console.log(registerAuthDto, 'registerAuthDto');
        return 1;
        // return this.authService.register(registerAuthDto);
    }

    @Post('login')
    login(@Body() loginAuthDto: LoginAuthDto) {
        return this.authService.login(loginAuthDto);
    }

    @Get('refresh')
    refresh(@Query('refresh_token') refreshToken: string) {
        return this.authService.refreshToken(refreshToken);
    }
}
