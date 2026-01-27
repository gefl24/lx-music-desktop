<p align="center"><a href="https://github.com/lyswhut/lx-music-desktop"><img width="200" src="https://github.com/lyswhut/lx-music-desktop/blob/master/doc/images/icon.png" alt="lx-music logo"></a></p>

<h1 align="center">LX Music Docker版</h1>

# LX Music Desktop - Docker 容器化 Web 应用

## 项目简介

LX Music Desktop 是一个免费的音乐查找助手，现在已经转换为 Docker 容器化 Web 应用，通过 web 页面管理音乐。

## 核心功能

- **自定义源支持**：支持多个音乐平台的音乐源，可配置和管理用户 API
- **歌单功能**：支持歌单创建、编辑、删除，歌曲添加、移除、排序，歌单导入/导出
- **排行榜功能**：支持多个音乐平台的排行榜，可查看排行榜详情，将排行榜歌曲添加到歌单
- **音乐搜索和下载**：支持多平台音乐搜索，可下载音乐文件
- **设置管理**：支持应用设置的配置和管理
- **数据持久化**：使用 SQLite 数据库存储数据，确保数据安全

## 技术栈

- **后端**：Express + TypeScript + SQLite
- **前端**：Vue 3 + TypeScript + Vue Router
- **容器化**：Docker + Docker Compose

## 部署方式

### 使用 Docker Compose

1. **克隆仓库**

```bash
git clone https://github.com/gefl24/lx-music-desktop.git
cd lx-music-desktop
```

2. **启动服务**

```bash
docker-compose up -d
```

3. **访问应用**

打开浏览器，访问 `http://localhost:3000`

### 使用 Docker 命令

1. **构建镜像**

```bash
docker build -t lx-music-web .
```

2. **运行容器**

```bash
docker run -p 3000:3000 -v ./data:/app/data lx-music-web
```

## API 端点说明

### 歌单管理

- `GET /api/list` - 获取歌单列表
- `POST /api/list` - 创建歌单
- `PUT /api/list/:id` - 更新歌单
- `DELETE /api/list/:id` - 删除歌单
- `GET /api/list/:id/musics` - 获取歌单歌曲
- `POST /api/list/:id/musics` - 添加歌单歌曲
- `DELETE /api/list/:id/musics` - 删除歌单歌曲
- `PUT /api/list/:id/musics/position` - 更新歌单歌曲位置

### 排行榜功能

- `GET /api/leaderboard` - 获取排行榜列表
- `GET /api/leaderboard/:id` - 获取排行榜详情

### 自定义源管理

- `GET /api/user-api` - 获取用户 API 配置
- `POST /api/user-api` - 保存用户 API 配置
- `POST /api/user-api/test` - 测试用户 API

### 搜索功能

- `GET /api/search` - 搜索音乐
- `GET /api/search/detail` - 获取音乐详情
- `GET /api/search/url` - 获取音乐 URL

### 下载功能

- `GET /api/download` - 获取下载列表
- `POST /api/download` - 添加下载任务
- `PUT /api/download/:id` - 更新下载任务
- `DELETE /api/download/:id` - 删除下载任务
- `DELETE /api/download` - 清空下载列表

### 设置管理

- `GET /api/setting` - 获取设置
- `PUT /api/setting` - 更新设置
- `POST /api/setting/reset` - 重置设置

### 健康检查

- `GET /health` - 健康检查

## 使用说明

1. **首次访问**

   首次访问应用时，系统会自动初始化默认设置。

2. **配置自定义源**

   1. 点击左侧菜单的「设置」
   2. 在「用户 API」选项卡中配置自定义源
   3. 可手动添加或在线导入用户 API

3. **使用歌单功能**

   1. 点击左侧菜单的「歌单」
   2. 可创建新歌单，编辑或删除现有歌单
   3. 点击歌单进入详情页，可添加、移除、排序歌曲

4. **使用排行榜功能**

   1. 点击左侧菜单的「排行榜」
   2. 选择音乐平台和排行榜类型
   3. 点击排行榜进入详情页，可查看歌曲列表，将歌曲添加到歌单

5. **搜索音乐**

   1. 点击左侧菜单的「搜索」
   2. 输入关键词，选择音乐平台
   3. 点击搜索按钮，查看搜索结果
   4. 可查看音乐详情，下载音乐文件

## 注意事项

1. **数据持久化**

   应用数据会持久化到本地的 `./data` 目录中，包括数据库文件和其他配置文件。请确保该目录有足够的权限。

2. **自定义源配置**

   请确保配置的自定义源 API 是可用的，否则可能无法搜索和下载音乐。

3. **性能优化**

   应用使用 SQLite 数据库的 WAL 模式，提高了并发性能和可靠性。

4. **安全注意事项**

   - 请不要在生产环境中暴露应用的公网访问，建议使用反向代理并配置访问控制
   - 请定期备份 `./data` 目录中的数据，以防数据丢失

5. **环境变量**

   可通过环境变量配置应用：
   - `PORT` - 服务端口，默认 3000
   - `DATA_PATH` - 数据存储路径，默认 /app/data

## 常见问题

### 应用无法启动

1. 检查 Docker 服务是否正常运行
2. 检查端口 3000 是否被占用
3. 检查 `./data` 目录权限是否正确

### 无法搜索音乐

1. 检查自定义源 API 配置是否正确
2. 检查网络连接是否正常
3. 尝试切换其他音乐平台

### 下载失败

1. 检查网络连接是否正常
2. 检查音乐源是否支持下载
3. 检查 `./data` 目录空间是否足够

## 许可证

Apache-2.0


### 四、资源使用

4.1 本项目内使用的部分包括但不限于字体、图片等资源来源于互联网。如果出现侵权可联系本项目移除。

### 五、免责声明

5.1 由于使用本项目产生的包括由于本协议或由于使用或无法使用本项目而引起的任何性质的任何直接、间接、特殊、偶然或结果性损害（包括但不限于因商誉损失、停工、计算机故障或故障引起的损害赔偿，或任何及所有其他商业损害或损失）由使用者负责。

### 六、使用限制

6.1 本项目完全免费，且开源发布于 GitHub 面向全世界人用作对技术的学习交流。本项目不对项目内的技术可能存在违反当地法律法规的行为作保证。

6.2 **禁止在违反当地法律法规的情况下使用本项目。** 对于使用者在明知或不知当地法律法规不允许的情况下使用本项目所造成的任何违法违规行为由使用者承担，本项目不承担由此造成的任何直接、间接、特殊、偶然或结果性责任。

### 七、版权保护

7.1 音乐平台不易，请尊重版权，支持正版。

### 八、非商业性质

8.1 本项目仅用于对技术可行性的探索及研究，不接受任何商业（包括但不限于广告等）合作及捐赠。

### 九、接受协议

9.1 若你使用了本项目，即代表你接受本协议。

---

若对此有疑问请 mail to: lyswhut+qq.com (请将 `+` 替换为 `@`)
