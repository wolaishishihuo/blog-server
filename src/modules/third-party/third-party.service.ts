import { Injectable } from '@nestjs/common';

@Injectable()
export class ThirdPartyService {
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
