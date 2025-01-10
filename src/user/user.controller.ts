import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // 获取当前登录人信息
    @Get('findUser')
    @UseGuards(AuthGuard('jwt'))
    findUser() {
        return 1;
        // return this.userService.findUser(body);
    }
}
