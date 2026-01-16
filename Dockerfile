# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app

# 安装依赖
COPY package*.json ./
# 忽略 electron 相关的依赖安装脚本，因为我们现在是 web 环境
RUN npm install --ignore-scripts

# 复制源码
COPY . .

# 修改: 你的 package.json 里的 build 脚本原本是 electron-builder
# 你需要确保只运行 webpack 编译 renderer 进程
# 假设你修改了 script 为 "build:web": "webpack --config ..."
RUN npm run build:renderer 

# ---

# 运行阶段
FROM node:18-alpine

WORKDIR /app

# 复制构建产物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# 安装仅服务端需要的依赖 (如 express)
RUN npm install express cors body-parser --save

# 暴露端口
EXPOSE 3000

# 启动 Node 服务
CMD ["node", "server/index.js"]
