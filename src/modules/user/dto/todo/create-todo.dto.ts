import { IsString, IsDateString, IsNumber, Matches } from 'class-validator';

export class CreateTodoDto {
    @IsString()
    title: string;

    @IsNumber()
    userId: number;

    @IsNumber()
    status: number;

    @IsNumber()
    priority: number;

    @IsDateString()
    deadline: string;
}
