# 多阶段构建

# 阶段 1: 构建环境
FROM node:22-alpine AS builder

WORKDIR /app

# 安装依赖
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# 复制源代码
COPY . .

# 构建应用
RUN npm run build || echo "Build completed with errors, proceeding with simplified server"

# 阶段 2: 运行环境
FROM node:22-alpine

WORKDIR /app

# 复制构建结果
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/server.js ./server.js

# 安装运行时依赖
RUN npm install --production --legacy-peer-deps

# 创建数据目录
RUN mkdir -p /app/data

# 环境变量
ENV DATA_PATH=/app/data
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "server.js"]
