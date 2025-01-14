import { registerAs } from '@nestjs/config';

// 应用配置
const appConfig = registerAs('appConfig', () => ({
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
    jwtRefreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME,
    logLevel: process.env.LOG_LEVEL,
    amapKey: process.env.AMAP_KEY,
    githubOwner: process.env.GITHUB_OWNER,
    githubRepo: process.env.GITHUB_REPO,
    githubApiBaseUrl: process.env.GITHUB_API_BASE_URL,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASSWORD
}));
console.log(appConfig());
export default appConfig;
