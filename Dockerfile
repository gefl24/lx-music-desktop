# ============================
# 阶段 1: 构建前端 (Builder)
# ============================
FROM node:18-slim AS builder

WORKDIR /app

# 1. 安装项目依赖
# 只需要 package.json 和 package-lock.json (如果有)
COPY package*.json ./

# 安装所有依赖 (包括 devDependencies，因为需要 webpack 构建)
# --ignore-scripts 跳过 electron 相关的 postinstall 脚本，避免在 Linux 环境下报错
RUN npm install --ignore-scripts --legacy-peer-deps

# 2. 复制源代码
COPY . .

# 3. 编译 Vue 前端
# 注意：你需要确保你的 build:renderer 脚本已经修改为 target: web
RUN npm run build:renderer

# ============================
# 阶段 2: 构建运行环境 (Runtime)
# ============================
FROM node:18-alpine

WORKDIR /app

# 1. 安装系统依赖 (better-sqlite3 编译需要 python 和 build-base)
RUN apk add --no-cache python3 make g++

# 2. 准备后端依赖
# 我们直接在生产镜像里安装 server 需要的库，不再复用 electron 的 node_modules
RUN npm install express cors body-parser needle better-sqlite3

# 3. 复制后端代码
COPY server ./server

# 4. 复制编译好的前端静态文件 (从第一阶段复制)
COPY --from=builder /app/dist ./dist

# 5. 创建数据目录
RUN mkdir -p /app/data

# 6. 环境变量
ENV PORT=3000
ENV DATA_DIR=/app/data
ENV NODE_ENV=production

# 7. 暴露端口
EXPOSE 3000

# 8. 启动命令
CMD ["node", "server/index.js"]
