## ADDED Requirements

### Requirement: Google Analytics 初始化应保持幂等

系统 MUST 允许 `initGA()` 被多次调用，同时避免为同一个 measurement ID 重复注入 `gtag/js` 脚本。

#### Scenario: 首次初始化时注入 GA 脚本

- **WHEN** 配置了 `VITE_GA_MEASUREMENT_ID` 且页面中尚不存在对应的 GA 脚本
- **THEN** 系统应向 `document.head` 追加一个对应 measurement ID 的 `gtag/js` 脚本
- **AND** 系统应初始化 `window.dataLayer` 和 `window.gtag`

#### Scenario: 重复初始化时不重复注入 GA 脚本

- **WHEN** 配置了 `VITE_GA_MEASUREMENT_ID` 且页面中已经存在对应的 GA 脚本
- **THEN** 系统不应再追加第二个相同 measurement ID 的 `gtag/js` 脚本
- **AND** 系统仍应保证 `window.dataLayer` 和 `window.gtag` 可用于后续追踪调用

#### Scenario: 未配置 measurement ID 时不初始化 GA

- **WHEN** 未配置 `VITE_GA_MEASUREMENT_ID`
- **THEN** 系统不应注入 GA 脚本
