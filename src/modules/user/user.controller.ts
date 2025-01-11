import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '@/modules/auth/decorators/auth.decorator';
import { PermissionActionMap } from '@/enum/permission';
import { UserInfo } from './decorators/user.decorator';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // 获取当前登录人信息
    @Get('findUser')
    @Auth([PermissionActionMap.READ])
    findUser(@UserInfo() user: User) {
        return user;
    }
}
