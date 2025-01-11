import { PrismaService } from '@/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/todo/create-todo.dto';
import { UpdateTodoDto } from './dto/todo/update-todo.dto';
import { formatDateToISO, formatISOToDate } from '@/utils/time';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async getTodoList(userId: number) {
        const todoList = await this.prisma.todo.findMany({
            where: { userId }
        });
        return todoList.map((todo) => ({
            ...todo,
            deadline: formatISOToDate(todo.deadline.toString())
        }));
    }

    async createTodo(todo: CreateTodoDto) {
        return await this.prisma.todo.create({
            data: {
                title: todo.title,
                status: todo.status,
                priority: todo.priority,
                deadline: formatDateToISO(todo.deadline),
                user: {
                    connect: {
                        id: todo.userId
                    }
                }
            }
        });
    }

    async updateTodo(todo: UpdateTodoDto) {
        return await this.prisma.todo.update({
            where: { id: todo.id },
            data: {
                ...todo,
                deadline: formatDateToISO(todo.deadline)
            }
        });
    }
}
