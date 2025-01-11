import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { formatDateToISO, formatISOToDate } from '@/utils/time';

@Injectable()
export class TodoService {
    constructor(private readonly prisma: PrismaService) {}

    async getTodoList(userId: number) {
        const todoList = await this.prisma.todo.findMany({
            where: { userId }
        });
        return todoList
            .map((todo) => ({
                ...todo,
                deadline: formatISOToDate(todo.deadline.toString())
            }))
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async createTodo(todo: CreateTodoDto) {
        await this.prisma.todo.create({
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
        await this.prisma.todo.update({
            where: { id: todo.id },
            data: {
                ...todo,
                deadline: formatDateToISO(todo.deadline)
            }
        });
    }

    async deleteTodo(id: number) {
        await this.prisma.todo.delete({
            where: { id }
        });
    }
}
