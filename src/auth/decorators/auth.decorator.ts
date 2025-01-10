import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from '../guards/permission.guard';

export const Auth = (permissions: string[]) =>
    applyDecorators(SetMetadata('permissions', permissions), UseGuards(AuthGuard('jwt'), PermissionGuard));
