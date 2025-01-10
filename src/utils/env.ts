const env = process.env.NODE_ENV;

export const isDev = env === 'development';
export const isProd = env === 'production';

export const envFilePath = [`.env.${isDev ? 'dev' : 'prod'}`, '.env'];
