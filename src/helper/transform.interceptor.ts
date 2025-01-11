import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// 定义统一的响应接口
export interface ApiResponse<T> {
    data: T;
    code: number;
    message: string;
    success: boolean;
    timestamp: number;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((data) => ({
                data,
                code: 0, // 0 表示成功
                message: '请求成功', // 成功信息
                success: true, // 请求状态
                timestamp: Date.now() // 响应时间戳
            }))
        );
    }
}
