## 1. Analytics 初始化

- [x] 1.1 在 `initGA()` 中为当前 measurement ID 生成稳定的 GA script URL。
- [x] 1.2 追加 script 前检测是否已经存在相同 GA script，避免重复注入。
- [x] 1.3 保持 `window.dataLayer` 和 `window.gtag` 初始化逻辑可重复安全执行。

## 2. Verify

- [x] 2.1 运行前端 typecheck/build，确认没有 TypeScript 或打包回归。
- [x] 2.2 将完成的任务在 `tasks.md` 中勾选。
