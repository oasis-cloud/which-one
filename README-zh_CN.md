# which one

交互式 CLI 工具，列出 `package.json` 中的 scripts 并选择其中一项运行。

当项目 script 较多时，`wo` 可以免去记忆名称或翻阅 `package.json` 的麻烦。命令名 `wo` 是 **which one** 的缩写。

阅读其他语言版本：[English](./README.md) | [简体中文](./README-zh_CN.md)

## 安装

需要 Node.js `>= 6`。当前工作目录须存在含 `scripts` 字段的 `package.json`。

```shell
npm install -D @oasis-cloud/which-one
```

## 基本用法

| 场景 | 命令 | 行为 |
| --- | --- | --- |
| 列出全部 | `wo` | 弹出 `which one` 交互菜单 |
| 过滤后选择 | `wo c` | 仅展示名称匹配 `c` 的 scripts |
| 唯一匹配直达 | `wo color` | 不弹菜单，直接执行 `npm run color` |
| 重跑上次 | `wo -r` | 执行当前目录上次选中的 script |

### 交互式选择

```shell
└─> wo
? which one › - Use arrow-keys. Return to submit.
❯   color
    demo:c
```

### 过滤后选择

```shell
└─> wo c
? which one › - Use arrow-keys. Return to submit.
❯   color
    demo:c
```

### 唯一匹配自动执行

过滤后只剩一个 script 时，不弹出菜单，直接执行。

```shell
└─> wo color
```

## 过滤规则

位置参数视为正则表达式片段，多个参数用 `|` 拼接（OR 匹配）。

| 命令 | 正则 | 匹配示例 |
| --- | --- | --- |
| `wo c` | `/c/ig` | `color`、`demo:c` 等 |
| `wo 'd.*:c'` | `/d.*:c/ig` | `demo:c` |
| `wo a b` | `/(a\|b)/ig` | 名称匹配 `a` 或 `b` 的 scripts |
| `wo`（无参数） | 全部 script 名 | `package.json` 中所有 scripts |

匹配忽略大小写，并使用全局（`g`）标志。

> **说明：** `-f` / `--filter` 在 `--help` 示例中有展示，但**当前版本尚未接入**。请使用位置参数进行过滤，详见 [Roadmap](#roadmap)。

## 命令行选项

| 选项 | 说明 |
| --- | --- |
| `-h`, `--help` | 显示帮助 |
| `-r`, `--run` | 重跑当前目录上次执行的 script |
| 位置参数 | 按正则过滤 script 名称 |

### `-r` / `--run`

选中或执行 script 后，名称会按目录写入缓存。`wo -r` 可再次运行该 script。

- **有缓存** → 直接执行缓存的 script
- **无缓存** → 静默退出（不弹出菜单）

```shell
└─> wo 'd.*:c'
? which one › - Use arrow-keys. Return to submit.
❯   demo:c

# 执行 demo:c

└─> wo -r
# 再次执行 demo:c
```

## 执行与缓存

- **执行方式：** 固定使用 `npm run <script>`（暂不支持 pnpm / yarn）
- **缓存路径：** `~/.wo/script.json`
- **缓存粒度：** 按 `process.cwd()` 区分，不同项目目录互不影响
- **更新时机：** 每次选中或执行 script 后写入缓存

## 边界行为

| 情况 | 当前行为 |
| --- | --- |
| 过滤后无匹配 | 静默退出 |
| 缺少 `package.json` | Node `require` 抛出错误 |
| `scripts` 为空或不存在 | 静默退出 |
| 取消菜单（Esc / Ctrl+C） | 不执行任何 script |

## 本地开发

```bash
git clone https://github.com/oasis-cloud/which-one
cd which-one
pnpm install   # 或 npm install
node bin/which-one.js
# 或 npm link 后全局使用 wo
```

## Roadmap

按优先级整理的可扩展方向。

### 高优先级（缺口 / 不一致）

| 方向 | 现状 | 建议 |
| --- | --- | --- |
| 实现 `-f` / `--filter` | yargs 已定义，未接入 `filterScripts()` | 与位置参数统一过滤逻辑 |
| `-r` 无缓存 UX | help 文案写「列出全部 scripts」，实际静默退出 | 对齐文案或 fallback 到全量列表 |
| 错误提示 | 缺 package.json、无匹配时静默 | 输出友好 stderr 消息 + 非零 exit code |

### 中优先级（体验增强）

| 方向 | 现状 | 建议 |
| --- | --- | --- |
| 多包管理器 | 硬编码 `spawn('npm', …)` | 检测 lockfile 或增加 `--pm npm\|pnpm\|yarn` |
| 子进程 TTY | 手动 pipe stdout/stderr | 改用 `stdio: 'inherit'` 以支持 watch / 交互式脚本 |
| 测试 | `npm test` 为占位 | 添加单元测试 + CI |
| CHANGELOG | 仅记录 v0.0.7 | 补全历史版本或建立发布规范 |

### 低优先级（可选增强）

| 方向 | 说明 |
| --- | --- |
| 模糊搜索 | 除正则外支持 substring / fzf 风格匹配 |
| script 描述 | 展示 package.json 中 script 旁注释或约定字段 |
| Monorepo | 支持选择子包 scripts |
| TypeScript 重写 | 单文件 CommonJS → 类型安全、可维护 |
| 配置化 | `~/.wo/config.json` 自定义缓存路径、默认包管理器等 |

## 相关链接

- GitHub: https://github.com/oasis-cloud/which-one
- Issues: https://github.com/oasis-cloud/which-one/issues
- License: ISC
