import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TodoModule } from './todo/todo.module';

@Module({
    imports: [TodoModule],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}
