# 豫见中原

河南旅游介绍与线上观景平台。项目使用原生 HTML、CSS、JavaScript、Node.js HTTP 服务和 SQLite，包含游客浏览、账号、景点画廊、天气、线上观景、收藏、行程、票务体验和旅行问答。

## 本地运行

要求 Node.js 22.5 或更高版本。

```powershell
npm.cmd start
```

访问 `http://127.0.0.1:3000/`。开发时可以使用：

```powershell
npm.cmd run dev
```

运行测试：

```powershell
npm.cmd test
```

## 环境变量

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `PORT` | `3000` | HTTP 服务端口 |
| `HOST` | `0.0.0.0` | 监听地址 |
| `DB_FILE` | `data/store.db` | SQLite 数据库路径 |
| `LEGACY_DATA_FILE` | `data/store.json` | 旧版 JSON 数据迁移来源 |
| `NODE_ENV` | 未设置 | 设为 `production` 时为会话 Cookie 增加 `Secure` |
| `COOKIE_SECURE` | `false` | 在反向代理 HTTPS 环境中强制使用安全 Cookie |
| `ALIYUN_SERVER_PASSWORD` | 未设置 | 部署脚本使用的 SSH 密码；未设置时交互输入 |

## 产品边界

- 游客可以浏览景点、天气、文化内容和线上观景。
- 收藏、行程、体验订单和旅行问答需要登录。
- 当前票务模块是功能演示，只用于预算和交互验证，不会付款、占票或产生真实出票。
- 景点详情支持 `/spots/<景点 ID>` 直达链接，例如 `/spots/longmen`。

## 数据与部署

SQLite 数据文件、WAL 文件和旧数据文件均被 `.gitignore` 排除。生产部署前应配置数据库定时备份，并通过 HTTPS 反向代理访问 Node 服务。

`deploy.py` 会保留服务器上的持久化数据，只上传应用代码与公开资源；项目根目录中的原始图片不会打入发布包，浏览器使用 `public/images` 下的优化版本。

## 主要目录

```text
public/             浏览器端页面、样式、脚本和图片
miniprogram/        原生微信小程序端（可直接导入微信开发者工具）
test/               Node.js 集成测试
server.js           HTTP 接口、景点数据和静态资源服务
database.js         SQLite 表结构与数据访问
gallery-data.json   景点画廊元数据
```

继续扩展真实票务、管理后台或智能路线时，建议先将 `server.js` 和 `public/app.js` 按业务模块拆分，并引入正式的数据库迁移机制。
