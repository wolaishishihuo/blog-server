import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '@/modules/auth/decorators/auth.decorator';
import { UserInfo } from './decorators/user.decorator';
import { User } from '@prisma/client';

@Controller('user')
@Auth()
export class UserController {
    constructor(private readonly userService: UserService) {}

    // 获取当前登录人信息
    @Get('findUser')
    findUser(@UserInfo() user: User) {
        return user;
    }
    // 获取当前登录人角色信息
    @Get('findUserRole')
    findUserRole(@UserInfo('id') userId: number) {
        return this.userService.findUserRole(userId);
    }

    // 获取用户列表
    @Get('findUserList')
    findUserList() {
        return this.userService.findUserList();
    }
}
