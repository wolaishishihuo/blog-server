import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '@/modules/auth/decorators/auth.decorator';
import { UserInfo } from './decorators/user.decorator';
import { User } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
@Auth()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: '获取当前登录用户信息' })
    @ApiResponse({
        status: 200,
        description: '获取成功'
    })
    @Get('findUser')
    findUser(@UserInfo() user: User) {
        return user;
    }

    @ApiOperation({ summary: '获取当前用户角色信息' })
    @ApiResponse({
        status: 200,
        description: '获取成功'
    })
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
