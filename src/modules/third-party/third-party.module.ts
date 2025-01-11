import { Module } from '@nestjs/common';
import { ThirdPartyController } from './third-party.controller';

@Module({
    controllers: [ThirdPartyController]
})
export class ThirdPartyModule {}
