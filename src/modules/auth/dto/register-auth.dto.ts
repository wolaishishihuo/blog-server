import { PartialType } from '@nestjs/mapped-types';
import { LoginAuthDto } from './login-auth.dto';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
    @IsNotEmpty({ message: '用户名不能为空' })
    @MaxLength(10, { message: '用户名长度不能大于10位' })
    @MinLength(5, { message: '用户名长度不能小于5位' })
    username: string;

    @IsNotEmpty({ message: '邮箱不能为空' })
    @IsEmail({}, { message: '邮箱格式不正确' })
    email: string;

    @IsNotEmpty({ message: '确认密码不能为空' })
    confirmPassword: string;

    @IsOptional()
    @MaxLength(10, { message: '昵称长度不能大于10位' })
    @MinLength(2, { message: '昵称长度不能小于2位' })
    @ValidateIf((o) => o.nickname !== '')
    nickname: string;
}
