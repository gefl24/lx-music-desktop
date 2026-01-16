# 基础镜像：包含 Ubuntu XFCE 桌面环境和 KasmVNC (Web 访问支持)
FROM lscr.io/linuxserver/webtop:ubuntu-xfce

# 镜像元数据
LABEL maintainer="gefl24"

# 设置环境变量，避免交互式安装暂停
ENV DEBIAN_FRONTEND=noninteractive \
    NODE_ENV=production \
    ELECTRON_IS_DEV=0

# 1. 安装 Node.js 18.x 和运行 Electron 所需的系统依赖
# 注意：Electron 需要 libnss3, libatk, libdrm 等库
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
    nodejs \
    build-essential \
    python3 \
    git \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libxss1 \
    libgtk-3-0 \
    libnotify4 \
    fonts-noto-cjk \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 2. 设置工作目录
WORKDIR /app

# 3. 复制依赖文件并安装
# 需要重新编译 native 模块 (如 better-sqlite3) 以适应容器环境
COPY package*.json ./
RUN npm install --unsafe-perm

# 4. 复制项目所有源代码
COPY . .

# 5. 配置自动启动
# 我们将创建一个 .desktop 文件放到 XFCE 的自动启动目录中
RUN mkdir -p /defaults/autostart
COPY lx-music.desktop /defaults/autostart/lx-music.desktop
RUN chmod +x /defaults/autostart/lx-music.desktop

# 6. (可选) 清理构建工具以减小镜像体积
# RUN apt-get remove -y build-essential python3 && apt-get autoremove -y

# 端口由基础镜像暴露 (3000, 3001)
