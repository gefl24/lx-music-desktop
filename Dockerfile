# 基础镜像
FROM lscr.io/linuxserver/webtop:ubuntu-xfce

# 设置环境变量
ENV NODE_ENV=production \
    ELECTRON_IS_DEV=0 \
    # 使用淘宝镜像源加速 Electron 下载，防止网络超时导致构建失败
    ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/" \
    ELECTRON_CUSTOM_DIR="{{ version }}" \
    # 显式指定 Python 路径，帮助 node-gyp 找到它
    PYTHON=/usr/bin/python3 \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# 1. 安装系统依赖
# 新增: python-is-python3 (解决 node-gyp 找不到 python 的报错)
# 修改: libasound2t64 (适配 Ubuntu 24.04)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
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
# 策略修改：
# 1. 设置 npm 镜像源加速
# 2. --ignore-scripts: 先只下载包，不运行 postinstall (避免 electron-builder 在环境未就绪时报错)
RUN npm config set registry https://registry.npmmirror.com && \
    npm install --unsafe-perm --production=false --legacy-peer-deps --ignore-scripts

# 5. 复制源代码
COPY . .

# 6. 手动运行原生模块编译
# 这步是之前报错的地方，现在环境修复后应该能通过
# 我们显式运行 electron-builder install-app-deps
RUN npx electron-builder install-app-deps

# 7. 配置自动启动
RUN mkdir -p /defaults/autostart
COPY lx-music.desktop /defaults/autostart/lx-music.desktop
RUN chmod +x /defaults/autostart/lx-music.desktop

# 端口暴露由基础镜像处理
