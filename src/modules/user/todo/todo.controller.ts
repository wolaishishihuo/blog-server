import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PermissionActionMap } from '@/enum/permission';
import { UserInfo } from '../decorators/user.decorator';
import { Auth } from '@/modules/auth/decorators/auth.decorator';

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    // 获取当前登录人待办事项
    @Get('getTodoList')
    @Auth([PermissionActionMap.READ])
    getTodoList(@UserInfo('id') userId: number) {
        return this.todoService.getTodoList(userId);
    }

    // 创建待办事项
    @Post('createTodo')
    @Auth([PermissionActionMap.WRITE])
    createTodo(@Body() todo: CreateTodoDto) {
        return this.todoService.createTodo(todo);
    }

    // 更新待办事项
    @Post('updateTodo')
    @Auth([PermissionActionMap.WRITE])
    updateTodo(@Body() todo: UpdateTodoDto) {
        return this.todoService.updateTodo(todo);
    }

    // 删除待办事项
    @Post('deleteTodo')
    @Auth([PermissionActionMap.WRITE])
    deleteTodo(@Body('id') id: number) {
        console.log(id, 'id');
        return this.todoService.deleteTodo(id);
    }
}
