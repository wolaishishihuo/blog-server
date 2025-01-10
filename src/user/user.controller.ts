import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { Auth } from '@/auth/decorators/auth.decorator';
import { PermissionActionMap } from '@/enum/permission';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // 获取当前登录人信息
    @Get('findUser')
    @Auth([PermissionActionMap.READ])
    findUser(@Req() req: Request) {
        return req.user;
    }
}
