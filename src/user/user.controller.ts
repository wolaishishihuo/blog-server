import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // @Post('find')
    // findUser(@Body() body: { id: number; username: string; email: string }) {
    //     return this.userService.findUser(body);
    // }
}
