FROM node:22.13.0-slim AS build-stage

WORKDIR /app

# Install OpenSSL and other required dependencies
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 设置 npm 镜像源
RUN npm config set registry https://registry.npmmirror.com/

# 安装 pnpm 并设置 pnpm 镜像源
RUN npm install -g pnpm && \
    pnpm config set registry https://registry.npmmirror.com/

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 复制 Prisma 相关文件  
COPY prisma/ prisma/  

# 安装依赖 生成 prisma 代码
RUN pnpm install && npx prisma generate 

# 复制所有源代码并构建应用
COPY . .
RUN pnpm run build

# production stage
FROM node:22.13.0-slim AS production-stage

WORKDIR /app

# Install OpenSSL for Prisma Client runtime
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 复制构建产物和必要文件
COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/node_modules /app/node_modules
COPY --from=build-stage /app/prisma /app/prisma
COPY --from=build-stage /app/package.json /app/package.json

# 创建启动脚本
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo 'npx prisma migrate deploy' >> /app/start.sh && \
    echo 'node dist/prisma/seed.js' >> /app/start.sh && \
    echo 'node dist/src/main.js' >> /app/start.sh && \
    chmod +x /app/start.sh

EXPOSE 3000

# 使用启动脚本
CMD ["/app/start.sh"]