import { formatISOToDate } from '@/utils/time';
import { Exclude, Transform } from 'class-transformer';
export class User {
    username: string;
    email: string;
    nickname: string;
    avatar: string;
    @Transform(({ value }) => formatISOToDate(value))
    createdAt: Date;
    @Transform(({ value }) => formatISOToDate(value))
    updatedAt: Date;
    @Exclude()
    password: string;
    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}
