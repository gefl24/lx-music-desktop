# 基础镜像
FROM node:22-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制源代码
COPY server.ts ./
COPY public/ ./public/

# 安装ts-node
RUN npm install -g ts-node typescript

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["ts-node", "server.ts"]
