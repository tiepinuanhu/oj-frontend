# oj-frontend

在线评测系统（Online Judge）前端。基于 Vue 3 + TypeScript + Vite，对接 [oj-backend](https://github.com/tiepinuanhu/oj-backend) 提供题库、提交、比赛与用户中心界面。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3、TypeScript、Vite 6 |
| UI | Element Plus、@element-plus/icons-vue |
| 状态 | Pinia + pinia-plugin-persistedstate |
| 路由 | Vue Router 4 |
| 请求 | Axios |
| 编辑器 | Monaco Editor、CodeMirror 5 |
| Markdown | @kangc/v-md-editor、md-editor-v3、KaTeX、highlight.js |
| 图表 | ECharts、vue-echarts |
| 包管理 | pnpm（推荐） |

## 功能概览

- **首页**：日榜等信息展示
- **用户**：注册、登录、个人主页
- **题库**：题目列表（难度 / 标签筛选）、详情（Markdown + 公式）、在线编程提交、新增 / 编辑题目、统计
- **提交**：提交列表与详情、判题状态轮询、用例展示
- **比赛**：比赛列表 / 详情、报名、赛题作答、比赛提交与榜单、赛题管理

## 环境要求

- Node.js 18+（建议 LTS）
- pnpm 8+（或 npm / yarn）
- 已启动的 [oj-backend](https://github.com/tiepinuanhu/oj-backend)（默认 `http://localhost:8080/api`）

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置后端地址

在 `src/axios/config.ts` 中修改：

```ts
export const baseURL: string = "http://localhost:8080/api"
```

按实际后端地址与端口调整。后端 context-path 为 `/api`。

### 3. 启动开发服务

```bash
pnpm dev
```

默认由 Vite 提供本地开发服务器（通常为 `http://localhost:5173`）。

### 4. 构建与预览

```bash
pnpm build
pnpm preview
```

`build` 会先执行 `vue-tsc` 类型检查，再打包。

## 主要页面路由

| 路径 | 说明 |
|------|------|
| `/` | 首页 |
| `/user/login`、`/user/register` | 登录 / 注册 |
| `/user/:id` | 用户主页 |
| `/problems` | 题库列表 |
| `/problem/:id` | 题目详情与提交 |
| `/problem/add`、`/problem/edit/:id` | 新增 / 编辑题目 |
| `/submission`、`/submission/:id` | 提交列表 / 详情 |
| `/contest`、`/contest/:id` | 比赛列表 / 详情 |
| `/contest/add` | 创建比赛 |
| `/contest/:cid/problem/:idx` | 比赛题目 |
| `/contest/submission/:id` | 比赛提交详情 |

## 项目结构

```text
oj-frontend/
├── index.html
├── package.json
├── vite.config.ts
└── src/
    ├── api/              # 按模块划分的接口封装
    │   ├── user/
    │   ├── problem/
    │   ├── submission/
    │   ├── contest/
    │   ├── tag/
    │   └── rank/
    ├── axios/            # Axios 实例与 baseURL
    ├── components/       # 公共组件（Header、编辑器、Markdown 预览等）
    ├── router/           # 路由
    ├── store/            # Pinia（用户登录态等）
    ├── views/            # 页面
    │   ├── user/
    │   ├── problem/
    │   ├── submission/
    │   └── contest/
    ├── App.vue
    └── main.ts
```

## 鉴权说明

- 登录成功后 JWT 写入 Pinia（并持久化）
- 请求拦截器自动附加 `Authorization: Bearer <token>`
- 响应头若带回新 token，会更新本地存储

## 与后端联调

1. 按 oj-backend README 启动 MySQL、Redis、RabbitMQ、go-judge 与后端服务
2. 确认 `baseURL` 指向正确的后端
3. 启动本项目 `pnpm dev` 即可联调

若出现跨域问题，可在后端开启 CORS，或在 `vite.config.ts` 中增加 `server.proxy` 代理到后端。

## 开发提示

- 路径别名：`@` → `src`
- Element Plus 组件与 API 已通过 `unplugin-vue-components` / `unplugin-auto-import` 按需引入
- 题目 Markdown 预览统一使用 `VMdViewer`，公式依赖本地 KaTeX

## License

Private / 学习项目，按需自行约定使用范围。
