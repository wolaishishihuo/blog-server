import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '@/modules/auth/decorators/auth.decorator';
import { PermissionActionMap } from '@/enum/permission';
import { UserInfo } from './decorators/user.decorator';
import { User } from '@prisma/client';
import { CreateTodoDto } from './dto/todo/create-todo.dto';
import { UpdateTodoDto } from './dto/todo/update-todo.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // 获取当前登录人信息
    @Get('findUser')
    @Auth([PermissionActionMap.READ])
    findUser(@UserInfo() user: User) {
        return user;
    }

    // 获取当前登录人待办事项
    @Get('getTodoList')
    @Auth([PermissionActionMap.READ])
    getTodoList(@UserInfo('id') userId: number) {
        return this.userService.getTodoList(userId);
    }

    // 创建待办事项
    @Post('createTodo')
    @Auth([PermissionActionMap.WRITE])
    createTodo(@Body() todo: CreateTodoDto) {
        return this.userService.createTodo(todo);
    }

    // 更新待办事项
    @Post('updateTodo')
    @Auth([PermissionActionMap.WRITE])
    updateTodo(@Body() todo: UpdateTodoDto) {
        return this.userService.updateTodo(todo);
    }

    // 删除待办事项
    @Post('deleteTodo')
    @Auth([PermissionActionMap.WRITE])
    deleteTodo(@Body('id') id: number) {
        return this.userService.deleteTodo(id);
    }
}
