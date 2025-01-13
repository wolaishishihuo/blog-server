import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
    UnauthorizedException,
    BadRequestException
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

@Catch()
export class ResponseFailFilter implements ExceptionFilter {
    private readonly logger = new Logger(ResponseFailFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const timestamp = Date.now();

        this.logger.error(`${request.method} ${request.url}`, exception instanceof Error ? exception.stack : undefined);

        // Handle validation errors
        if (exception instanceof BadRequestException) {
            const validationResponse = exception.getResponse() as any;
            return this.handleValidationError(validationResponse, response, request.url, timestamp);
        }

        // Handle unauthorized
        if (exception instanceof UnauthorizedException) {
            return this.handleUnauthorized(response, request.url, timestamp);
        }

        // Handle custom errors
        if (exception instanceof CustomError) {
            return this.handleCustomError(exception, response, request.url, timestamp);
        }

        // Handle HTTP exceptions
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const errorResponse: ErrorResponse = {
                message: exception.message,
                data: null,
                timestamp,
                path: request.url,
                code: status,
                success: false
            };
            return this.sendErrorResponse(response, errorResponse, status);
        }

        // Handle unknown errors
        const errorResponse: ErrorResponse = {
            message: 'Internal server error',
            data: null,
            timestamp,
            path: request.url,
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            success: false
        };
        return this.sendErrorResponse(response, errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private handleValidationError(validationError: any, response: Response, path: string, timestamp: number): Response {
        let message = '验证错误';
        let details = null;

        if (typeof validationError.message === 'string') {
            message = validationError.message;
        } else if (Array.isArray(validationError.message)) {
            message = validationError.message[0];
            details = validationError.message;
        }

        const errorResponse: ErrorResponse = {
            message,
            data: null,
            timestamp,
            path,
            code: HttpStatus.BAD_REQUEST,
            success: false,
            details
        };

        return this.sendErrorResponse(response, errorResponse, HttpStatus.BAD_REQUEST);
    }

    private handleUnauthorized(response: Response, path: string, timestamp: number): Response {
        const errorResponse: ErrorResponse = {
            message: '未授权访问',
            data: null,
            timestamp,
            path,
            code: HttpStatus.UNAUTHORIZED,
            success: false
        };
        return this.sendErrorResponse(response, errorResponse, HttpStatus.UNAUTHORIZED);
    }

    private handleCustomError(exception: CustomError, response: Response, path: string, timestamp: number): Response {
        const errorResponse: ErrorResponse = {
            message: exception.message,
            data: null,
            timestamp,
            path,
            code: exception.getStatus(),
            success: false
        };
        return this.sendErrorResponse(response, errorResponse, exception.getStatus());
    }

    private sendErrorResponse(response: Response, errorResponse: ErrorResponse, status?: number): Response {
        return response.status(status || HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
}
