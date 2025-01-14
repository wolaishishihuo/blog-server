import { ClassSerializerInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '@/modules/auth/decorators/auth.decorator';
import { UserInfo } from './decorators/user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
@Auth()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: '获取当前登录用户信息' })
    @ApiResponse({
        status: 200,
        description: '获取成功',
        type: User
    })
    @Get('findUser')
    findUser(@UserInfo() user: User) {
        console.log(user, 1);
        return new User(user);
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
    async findUserList() {
        const userList = await this.userService.findUserList();
        return userList.map((user) => new User(user));
    }
}
