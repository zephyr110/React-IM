# React-IM 全面升级与通信功能补全 — 设计方案

## 概述

将 React-IM 项目从 React 16 / CRA 3 技术栈全面升级到现代前端技术栈，并补全基于 WebSocket 的实时通信功能。

---

## 升级路线

### 第 1 步：CRA → Vite 迁移

**目标**：将构建工具从 Create React App (react-scripts 3.4.1) 迁移到 Vite。

**变更清单**：
- 安装 `vite` + `@vitejs/plugin-react`
- 创建 `vite.config.js`，配置 React 插件 + 路径别名（`components` → `src/components`、`assets` → `src/assets` 等）
- `public/index.html` → 根目录 `index.html`，添加 `<script type="module" src="/src/index.jsx">`
- `src/` 下所有含 JSX 的文件 `.js` → `.jsx`
- 更新 `package.json` scripts：`vite` / `vite build` / `vite preview`
- 移除 `react-scripts` 依赖及相关 CRA 配置
- SVG 导入方式适配：`import { ReactComponent as X }` → `import X from '...?react'`

### 第 2 步：React 18 + React Router v6

**目标**：升级核心框架到 React 18，路由升级到 v6。

**React 18 变更**：
- `ReactDOM.render()` → `createRoot().render()`
- `React.StrictMode` 保留
- PropTypes 内置移除 → 单独安装 `prop-types`

**React Router v6 变更**：
- `<Switch>` → `<Routes>`，`component` → `element`
- `useHistory` → `useNavigate`
- `useRouteMatch` 移除
- 路由匹配语法变化

**影响文件**：`src/index.js`、`src/components/ChatApp/index.js`、`src/App.js`

### 第 3 步：styled-components v6 + react-spring v9

**目标**：升级样式库和动画库。

**styled-components v5 → v6**：API 基本兼容，50+ style.js 文件几乎无需修改。

**react-spring v8 → v9**（改动最大）：
- `useSpring`：`{ from, to }` 新签名
- `useTrail`：同 useSpring 模式
- `useTransition`：从返回对象数组变为 `transitions((style, item) => ...)` render props 模式
- 修复原代码拼写错误：`translated3d` → `translate3d`

**影响文件**：`src/hooks/useStaggeredList.js`、`src/components/Conversation/index.js`、`src/components/ChatApp/index.js`

### 第 4 步：Storybook v5 → v8

**目标**：升级组件文档工具。

**变更**：
- 包替换：`@storybook/react` → `storybook` + `@storybook/react-vite` + `@storybook/addon-essentials`
- 移除 `@storybook/preset-create-react-app`
- 配置文件重构：`config.js`/`preview.js` → `main.ts`/`preview.ts`
- 装饰器从 `addDecorator()` → `decorators` 数组导出
- 16 个 stories 文件从 CSF v1 迁移到 CSF v3 格式

### 第 5 步：后端 + 通信逻辑

**目标**：搭建 Express + Socket.IO 后端，补全前端通信功能。

**后端结构**：
```
server/
├── index.js          # Express + Socket.IO 启动
├── socket.js         # 事件处理（login/message:send/typing...）
└── data/
    ├── messages.json # 消息持久化
    └── contacts.json # 联系人数据
```

**前端新增**：
- `src/context/SocketContext.jsx` — 连接管理、sendMessage/login 方法
- `src/context/MessageContext.jsx` — 消息列表、联系人状态、activeContact
- `src/components/Login/` — 简单登录页（输入昵称，随机头像）
- 改造 Conversation / Footer / MessageList / ConcatList 使用真实数据

**事件流**：
```
Footer 输入 → MessageContext.sendTextMessage()
  → Socket.emit('message:send')
    → 服务端存储 + 转发 Socket.to(to).emit('message:new')
      → 接收方 MessageContext.append(msg) → UI 更新
```

---

## 附加升级

- FontAwesome v5 → v6
- `@testing-library/react` v9 → v16
- 修复拼写错误：`VedioCall` → `VideoCall`、`translated3d` → `translate3d`
- `hygen` 模板生成器视需要保留/移除

---

## 风险控制

- 每步完成后执行 `vite build` 验证构建通过
- 每步完成后手动检查页面渲染
- 使用 Git 分支隔离每一步，便于回退
- Storybook 升级单独验证所有 stories 可正常展示
