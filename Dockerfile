# 基础镜像
FROM lscr.io/linuxserver/webtop:ubuntu-xfce

# 设置环境变量
ENV NODE_ENV=production \
    ELECTRON_IS_DEV=0 \
    # 强制指定 Python 路径
    PYTHON=/usr/bin/python3 \
    # 使用镜像源加速 Electron 下载
    ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/" \
    ELECTRON_CUSTOM_DIR="{{ version }}" \
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
# npm install -g node-gyp: 确保构建工具存在
RUN npm config set registry https://registry.npmmirror.com && \
    npm install -g node-gyp && \
    npm install --unsafe-perm --production=false --legacy-peer-deps --ignore-scripts

# 5. 复制源代码
COPY . .

# 6. 手动运行原生模块编译
# 这一步之前已经成功通过
RUN npx electron-builder install-app-deps

# 7. 配置自动启动
# 修正：将 .desktop 文件复制到标准的 XDG 系统自动启动目录
# 之前的 /defaults/autostart 在此镜像中是文件而非目录，会导致构建失败
RUN mkdir -p /etc/xdg/autostart
COPY lx-music.desktop /etc/xdg/autostart/lx-music.desktop
RUN chmod 644 /etc/xdg/autostart/lx-music.desktop

# 端口暴露由基础镜像处理 (3000, 3001)
