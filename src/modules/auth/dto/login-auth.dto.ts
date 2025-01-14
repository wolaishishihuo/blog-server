import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
    @ApiProperty({
        description: '用户名',
        example: 'john_doe'
    })
    @IsNotEmpty({ message: '用户名不能为空' })
    username: string;

    @ApiProperty({
        description: '密码',
        example: '12345678',
        minLength: 5
    })
    @IsNotEmpty({ message: '密码不能为空' })
    password: string;
}
