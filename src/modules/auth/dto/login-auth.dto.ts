import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginAuthDto {
    @IsNotEmpty({ message: '用户名不能为空' })
    username: string;

    @IsNotEmpty({ message: '密码不能为空' })
    @MinLength(5, { message: '密码长度不能小于5位' })
    password: string;
}
