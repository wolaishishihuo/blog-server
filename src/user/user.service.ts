import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    // constructor(private readonly prisma: PrismaService) {}
    // async findUser(body: { id: number; username: string; email: string }) {
    //     const { id, username, email } = body;
    //     const isNumeric = !isNaN(+id);
    //     return this.prisma.user.findFirst({
    //         where: {
    //             OR: [{ username }, { email }, ...(isNumeric ? [{ id }] : [])]
    //         }
    //     });
    // }
}
