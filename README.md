# React-IM

即时通讯 Web 应用，基于 React 18 + Vite + Socket.IO + SQLite + Tailwind CSS + shadcn/ui。

## 技术栈

| 层 | 技术 |
|-----|------|
| 前端 | React 18, Vite 5, Tailwind CSS, shadcn/ui, lucide-react |
| 状态管理 | React Context + Hooks |
| 实时通信 | Socket.IO 4 |
| 后端 | Express 5, Socket.IO |
| 数据库 | SQLite (better-sqlite3) |
| 动画 | react-spring 9 |
| 测试 | Vitest, Testing Library |
| 包管理 | pnpm (monorepo) |

## 项目结构

```
React-IM/
├── packages/
│   ├── client/          # 前端 React 应用
│   │   └── src/
│   │       ├── components/   # UI 组件
│   │       │   └── ui/       # shadcn/ui 基础组件
│   │       ├── context/      # React Context (Socket, Message)
│   │       ├── hooks/        # 自定义 Hooks
│   │       ├── lib/          # 工具函数
│   │       └── data/         # 静态数据 (emoji)
│   └── server/          # 后端 Express + Socket.IO
│       └── src/
│           ├── db/           # 数据库层 (models, schema)
│           ├── index.js      # 入口 + REST API
│           └── socket.js     # Socket.IO 事件处理
├── docs/                 # 文档
└── pnpm-workspace.yaml   # Monorepo 配置
```

## 快速启动

```bash
# 安装依赖
pnpm install

# 同时启动前后端
pnpm dev

# 或分别启动
pnpm server    # 后端 http://localhost:4000
pnpm start     # 前端 http://localhost:3000
```

## 命令

```bash
pnpm dev          # 同时启动前后端
pnpm build        # 构建前端
pnpm server       # 启动后端
pnpm start        # 启动前端开发服务器
pnpm test         # 运行测试
pnpm storybook    # 启动 Storybook
```

## 功能

- 文字消息收发
- 语音消息录制/播放
- 表情选择器（9 分类）
- 图片发送（压缩后 base64）
- 消息引用回复
- @提及高亮
- 消息撤回（2 分钟内）
- 已读回执
- 草稿保存
- 未读计数
- 消息搜索
- 联系人管理
- 在线状态实时推送
- 屏蔽用户
- Toast 通知系统
- 个人资料编辑
- 快捷键（Esc 关闭会话，Ctrl+Enter 发送）
- 视频通话 UI（占位）

## API

```
GET  /api/health                    # 健康检查
GET  /api/contacts                  # 联系人列表
GET  /api/users/:id                 # 用户信息
GET  /api/messages/:user1/:user2    # 消息历史
```

## 数据库

SQLite 文件位于 `packages/server/src/data/im.db`，首次启动自动创建表和种子数据。

表结构：
- `users` — 用户
- `contacts` — 联系人（预置 4 个）
- `messages` — 消息（按 room_key 分区，最多 200 条/房间）
