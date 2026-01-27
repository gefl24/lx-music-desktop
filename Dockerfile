FROM node:22-alpine

WORKDIR /app

# 安装依赖
COPY package.json package-lock.json ./
RUN npm install --production --legacy-peer-deps

# 复制服务器文件
COPY ./server.js ./server.js

# 创建数据目录
RUN mkdir -p /app/data

# 环境变量
ENV DATA_PATH=/app/data
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "server.js"]
