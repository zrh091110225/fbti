## Context

`frontend/src/main.tsx` 在应用启动时调用 `initGA()`。当前 `initGA()` 会在每次调用时创建并追加一个 Google Analytics `gtag/js` script 标签，然后初始化 `window.dataLayer` 和 `window.gtag`。

## Goals / Non-Goals

**Goals:**

- 让 `initGA()` 可以被重复调用，而不会重复注入同一个 GA script。
- 保持现有 `trackPageView()` 和 `trackEvent()` 行为不变。
- 在已有 script 标签时，仍保证 `window.dataLayer` 和 `window.gtag` 初始化可用。

**Non-Goals:**

- 不重构所有 analytics 事件类型。
- 不改变现有 GA measurement ID 配置方式。
- 不引入新的 analytics 库或依赖。

## Decisions

### Decision 1: 使用 script src 检测已有 GA 标签

在 `initGA()` 中根据当前 `GA_MEASUREMENT_ID` 拼出 `gtag/js` 的 script URL，并用 `document.querySelector()` 检测页面中是否已经存在相同 `src` 的 script。

这样实现范围最小，和当前 DOM 注入方式一致，也能直接覆盖“同一个 measurement ID 不重复注入”的需求。

### Decision 2: 将 dataLayer / gtag 初始化与 script 注入解耦

即使页面中已经存在 GA script，也继续执行 `window.dataLayer = window.dataLayer || []` 和 `window.gtag = window.gtag || ...` 的初始化逻辑。

这样可以保证重复调用 `initGA()` 时不会破坏后续 `trackPageView()` 和 `trackEvent()` 的调用能力。
