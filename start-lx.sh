#!/bin/bash
# 进入应用目录
cd /app

# 等待桌面环境加载完成
sleep 5

# 启动 LX Music (使用 electron 直接运行源码)
# --no-sandbox 是 Docker 中运行 Electron 必须的参数
# 环境变量 DISPLAY 已经在 webtop 镜像中设置好了
echo "Starting LX Music..."
npm start -- --no-sandbox
