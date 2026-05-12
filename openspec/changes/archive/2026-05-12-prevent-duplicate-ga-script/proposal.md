## Why

`initGA()` 目前每次执行都会向页面追加一个 Google Analytics 脚本。虽然现在只在入口文件里调用一次，但如果以后它被复用、移动到 React effect 里，或者在开发环境中被再次触发，就可能重复注入 GA 脚本。

## What Changes

- 在追加新脚本前，先检测当前页面是否已经存在同一个 measurement ID 对应的 GA 脚本。
- 即使脚本标签已经存在，也继续保证 `window.dataLayer` 和 `window.gtag` 初始化可用。
- 保持现有页面访问统计和事件追踪行为不变。

## Capabilities

### New Capabilities

- `analytics-initialization`: Google Analytics 初始化可以被多次安全调用，不会重复注入脚本标签。

### Modified Capabilities

无。

## Impact

- `frontend/src/utils/analytics.ts`: 增加重复脚本检测，让初始化逻辑具备幂等性。
- 验证：运行前端 typecheck/build，确认没有 TypeScript 或打包回归。
