import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // 获取当前登录人信息
    @Get('findUser')
    @UseGuards(AuthGuard('jwt'))
    findUser(@Req() req: Request) {
        // return this.userService.findUser(req.user);
        return req.user;
    }
}
