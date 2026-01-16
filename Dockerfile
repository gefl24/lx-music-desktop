# 基础镜像
FROM lscr.io/linuxserver/webtop:ubuntu-xfce

# 设置环境变量
ENV NODE_ENV=production \
    ELECTRON_IS_DEV=0 \
    # 强制指定 Python 路径
    PYTHON=/usr/bin/python3 \
    # 使用镜像源加速 Electron 下载
    ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# 1. 安装系统依赖
# 注意：这里将 Node.js 源修改为 22.x 以匹配 package.json 的要求
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
    nodejs \
    build-essential \
    python3 \
    python-is-python3 \
    git \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libgbm1 \
    libasound2t64 \
    libpangocairo-1.0-0 \
    libxss1 \
    libgtk-3-0 \
    libnotify4 \
    fonts-noto-cjk \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 2. 设置工作目录
WORKDIR /app

# 3. 复制依赖文件
COPY package*.json ./

# 4. 安装项目依赖
RUN npm config set registry https://registry.npmmirror.com && \
    npm install -g node-gyp && \
    npm install --unsafe-perm --production=false --legacy-peer-deps --ignore-scripts

# 5. 复制源代码
COPY . .

# 6. 构建应用 (编译 TS/Vue 到 dist 目录)
# 这是必须的步骤，否则没有 dist/main.js 可供运行
RUN npm run build:main && \
    npm run build:renderer && \
    npm run build:renderer-lyric && \
    npm run build:renderer-scripts

# 7. 手动运行原生模块编译
RUN npx electron-builder install-app-deps

# 8. 配置自动启动
# 将 .desktop 文件复制到标准的 XDG 系统自动启动目录
RUN mkdir -p /etc/xdg/autostart
COPY lx-music.desktop /etc/xdg/autostart/lx-music.desktop
RUN chmod 644 /etc/xdg/autostart/lx-music.desktop

# 端口暴露由基础镜像处理 (3000, 3001)
