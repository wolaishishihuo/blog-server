import { IsEmail, IsEnum, IsNotEmpty, MinLength, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoginType } from '@/enum/user';

export class LoginAuthDto {
    @ApiProperty({
        description: '登录类型',
        example: 'email'
    })
    @IsNotEmpty({ message: '登录类型不能为空' })
    @IsEnum(LoginType)
    loginType: LoginType;

    @ApiProperty({
        description: '用户名',
        example: 'john_doe'
    })
    @IsNotEmpty({ message: '用户名或邮箱不能为空!' })
    @ValidateIf((object, value) => object.loginType === LoginType.PASSWORD)
    username: string;

    @ApiProperty({
        description: '密码',
        example: '12345678',
        minLength: 5
    })
    @IsNotEmpty({ message: '密码不能为空' })
    @ValidateIf((object, value) => object.loginType === LoginType.PASSWORD)
    password: string;

    @ApiProperty({
        description: '邮箱',
        example: '12345678@qq.com',
        required: false
    })
    @IsEmail({}, { message: '邮箱格式错误' })
    @IsNotEmpty({ message: '邮箱不能为空' })
    @ValidateIf((object, value) => object.loginType === LoginType.EMAIL)
    email: string;

    @ApiProperty({
        description: '验证码',
        example: '12345',
        required: false
    })
    @IsNotEmpty({ message: '验证码不能为空' })
    @ValidateIf((object, value) => object.loginType === LoginType.EMAIL)
    emailCode: string;
}
