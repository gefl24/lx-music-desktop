# 使用支持 Web 访问桌面的基础镜像 (包含 KasmVNC，支持音频)
FROM ghcr.io/linuxserver/webtop:ubuntu-xfce

# 设置环境变量
ENV TITLE="LX Music Web" \
    LC_ALL=zh_CN.UTF-8 \
    LANG=zh_CN.UTF-8 \
    LANGUAGE=zh_CN.UTF-8 \
    NODE_ENV=production

# 安装运行所需的依赖 (Node.js, 编译工具, 音频库, 字体)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    gnupg \
    build-essential \
    python3 \
    libasound2 \
    libgbm-dev \
    libnss3 \
    libxss1 \
    libxtst6 \
    fonts-noto-cjk \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 lock 文件 (利用 Docker 缓存层)
COPY package*.json ./

# 安装项目依赖 (包括 Electron 和 Native 模块)
# 注意：better-sqlite3 等模块需要重新编译以适应 Linux 环境
RUN npm install --unsafe-perm

# 复制所有源代码
COPY . .

# 添加启动脚本
COPY start-lx.sh /defaults/autostart/start-lx.sh
RUN chmod +x /defaults/autostart/start-lx.sh

# 暴露 Web 端口 (Webtop 默认是 3000)
EXPOSE 3000

# 容器启动时会自动运行 /init，并加载 /defaults/autostart 下的脚本
