import { PrismaService } from '@/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async getTodoList(userId: number) {
        const todoList = await this.prisma.todo.findMany({
            where: { userId }
        });
        return todoList;
    }
}
