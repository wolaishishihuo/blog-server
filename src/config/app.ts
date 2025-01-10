import { registerAs } from '@nestjs/config';

// 应用配置
const appConfig = registerAs('appConfig', () => ({
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME
}));

export default appConfig;
