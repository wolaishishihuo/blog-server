import { registerAs } from '@nestjs/config';

// 应用配置
const appConfig = registerAs('appConfig', () => ({
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
    jwtRefreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME,
    logLevel: process.env.LOG_LEVEL || 'info',
    amapKey: process.env.AMAP_KEY,
    githubOwner: process.env.GITHUB_OWNER,
    githubRepo: process.env.GITHUB_REPO,
    githubApiBaseUrl: process.env.GITHUB_API_BASE_URL,
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: parseInt(process.env.REDIS_PORT || '6379')
}));

export default appConfig;
