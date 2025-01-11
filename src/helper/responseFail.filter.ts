import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
    UnauthorizedException
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomError } from './customError';

interface ErrorResponse {
    message: string;
    data: null;
    timestamp: number;
    path: string;
    code: number;
    success: false;
    details?: unknown;
}

interface CustomErrorResponse {
    message: string;
    status: number;
}

@Catch()
export class ResponseFailFilter implements ExceptionFilter {
    private readonly logger = new Logger(ResponseFailFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const timestamp = Date.now();

        // Log error
        this.logger.error(`${request.method} ${request.url}`, exception instanceof Error ? exception.stack : undefined);

        // Handle different types of errors
        if (exception instanceof UnauthorizedException) {
            return this.handleUnauthorized(response, request.url, timestamp);
        }

        if (exception instanceof CustomError) {
            return this.handleCustomError(exception, response, request.url, timestamp);
        }

        // Handle general errors
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception instanceof HttpException ? exception.message : 'Internal server error';

        return this.sendErrorResponse(response, {
            message,
            data: null,
            timestamp,
            path: request.url,
            code: status,
            success: false
        });
    }

    private handleUnauthorized(response: Response, path: string, timestamp: number): Response {
        return this.sendErrorResponse(
            response,
            {
                message: '用户不存在或令牌已失效',
                data: null,
                timestamp,
                path,
                code: HttpStatus.UNAUTHORIZED,
                success: false
            },
            HttpStatus.UNAUTHORIZED
        );
    }

    private handleCustomError(exception: CustomError, response: Response, path: string, timestamp: number): Response {
        const { message, status } = exception.getResponse() as CustomErrorResponse;
        return this.sendErrorResponse(
            response,
            {
                message,
                data: null,
                timestamp,
                path,
                code: status,
                success: false
            },
            status
        );
    }

    private sendErrorResponse(response: Response, errorResponse: ErrorResponse, status?: number): Response {
        return response.status(status ?? errorResponse.code).send(errorResponse);
    }
}
