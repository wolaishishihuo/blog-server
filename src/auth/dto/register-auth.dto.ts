import { PartialType } from '@nestjs/mapped-types';
import { LoginAuthDto } from './login-auth.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
    @IsNotEmpty({ message: '邮箱不能为空' })
    @IsEmail({}, { message: '邮箱格式不正确' })
    email: string;

    @IsNotEmpty({ message: '昵称不能为空' })
    nickname: string;
}
