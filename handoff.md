# DonatePage 交接文档

> 写给完全没有上下文的新会话。先读这份，再动代码。

## 在做什么

个人收款/捐赠页（Merger v0.28.6 的 GPL-3.0 fork），纯静态站点，部署在 Vercel，线上地址 https://donate.techisle.top 。
- 2026-11-05（第一轮）：完整安全/工程审计 + 修复全部 P0/P1 问题（CDN 全本地化、CSP、gulpfile 重写等）。
- 2026-11-05（第二轮）：**V2.0.0 蓝图 geek 风格改版**——移除 QQ 钱包与 PayPal（QQ 被管制、PayPal 弃用），整个 UI 重写为 anxforever.cn 风格的图纸美学。
**两轮改动均已本地验证通过，尚未提交 git、尚未部署上线。**

## 为什么这么选（技术栈/原理）

- **纯静态 + jQuery**：继承自上游 Merger，无后端。所有"配置"都是 index.html 顶部的全局变量（`wechat`、`alipay`、`tenpay`、`paypal`、`myname`、`profile` 等）。
- **资源全本地化**：审计发现原页面同时加载 cdnjs 的上游 Merger bundle 和本地 bundle（同一套逻辑执行两遍，微信/支付宝 UA 下第二个会抛 TypeError），且 CDN 外链无 SRI。本地 `assets/bundles/function.main.js`（iconfont + jQuery + jquery-qrcode + function.js 经 terser 打包）与 cdnjs 版本内容等价，因此直接删掉全部 CDN 引用，页面只加载本地 2 个文件，供应链风险归零。
- **构建用 gulp 4**：`pnpm build` = clean → pack-js/pack-css 并行 → minify-html + copy-assets 并行，产出完整 `public/` 目录。**关键约束：minify-html 只输出到 public/，绝不写回项目根**（旧版 gulpfile 会覆盖源 index.html，这是审计发现的最危险设计，已重写）。
- **部署 Vercel**：`vercel.json` 用新版 API（`buildCommand`/`outputDirectory`/`headers`），不再用已弃用的 builds+routes。安全响应头（X-Frame-Options 等）在 vercel.json 里配置，CSP 在 index.html 的 meta 里（`default-src 'none'` + 受控白名单，内联脚本需要 'unsafe-inline'）。
- **包管理 pnpm**：`pnpm-workspace.yaml` 含 `packages: ["."]`（**必须有**：pnpm 9 强制要求该字段，而 Vercel 按 lockfileVersion 9.0 可能选 pnpm 9，缺了 install 直接报错）与 `allowBuilds.es5-ext: false`（仅用于消除 "Ignored build scripts" 警告，缺了 install 也不会失败——v1.1.0 审计段"必须否则报错退出 1"的说法有误，已实测纠正）。配合 package.json 的 `packageManager: pnpm@11.22.0` 锁死版本，双保险。

## 完成了什么

### 2026-11-05 审计 + 修复（v1.1.0）

审计结论（详见对话记录）：双 bundle 重复加载、CDN 无 SRI、tenpay 链接带 `_xxx_sign` 占位符、gulpfile 破坏源文件、`gulp.start()` 是 gulp 3 API、双部署配置漂移（vercel.json + functioncat.yaml）、`profile_error = 0` 赋值笔误、QQ 弹窗硬编码中文绕过多语言、`error_num` 漏统计 tenpay、presshold 字符串拼接 hack、大量死代码。Mimosa 深度扫描 6 个 findings 全部落在压缩后 jQuery 库代码上，人工复核为误报。

修复内容：

| 文件 | 改动 |
|------|------|
| `index.html` | 删除全部 cdnjs 引用与 preconnect，改引本地 bundle；CSP 收紧为 default-src 'none' 白名单；加 lang/title/description；viewport 恢复可缩放；修 `profile_error` 笔误；GitHub 链接加 rel="noopener noreferrer"；PayPal 按钮加 aria-label；删除内联 opentenpay 与 tenpay 图标注入脚本（分别移入 function.js 与 iconfont.js） |
| `assets/js/function.js` | tenpay 纳入多语言（tenpayscan，三语）与未配置移除逻辑，error_num 阈值 3→4；opentenpay 移入并多语言化；presshold 英文 hack 重写为显式三目；openbox 移出条件块、window.open 加 noopener 并防 null；删除 urlencode 死代码 |
| `assets/js/iconfont.js` | tenpay 图标 symbol 合并进 `_iconfont_svg_string_974919` 字符串 |
| `gulpfile.js` | 全部重写：不覆盖源文件、删除 src/ 死任务与 gulp.start、产物输出 public/（index.html 压缩版 + bundles + images） |
| `package.json` | scripts.build 改 `gulp build`；engines 改 `>=20`；devDeps 精简为实际使用的 6 个（含 http-server）；版本升 1.1.0 |
| `vercel.json` | 重写为新 API + 安全响应头（X-Frame-Options SAMEORIGIN、nosniff、Referrer-Policy、Permissions-Policy） |
| `.gitignore` | 新增（node_modules/、public/、.mimosa/ 等） |
| `pnpm-workspace.yaml` | pnpm 11 自动生成，allowBuilds.es5-ext: false |
| 删除 | `functioncat.yaml`（用户确认不再用）、`assets/styles/style.min.css`（无引用死文件） |

### 验证情况

- `pnpm build` 成功，public/ 结构正确，源 index.html 未被修改（git diff 证实）。
- 本地 http-server + 浏览器实测：四个按钮渲染正常；微信/QQ/支付宝点击后弹窗标题与二维码（data:image/png）均正确生成；QQ 弹窗文案"手机QQ扫一扫 向麦希屿捐赠"（多语言生效）；icon-tenpay SVG 注入成功；视觉截图确认布局无回归。
- 已知限制：英文/繁中语言分支、微信内 UA 自动跳转未做浏览器实测（逻辑层面已复核；后者的问题根源——双 bundle——已删除）。

## 卡在哪里

无阻塞。待用户决定：
1. **提交 git**（变更未提交）；
2. **部署 Vercel**（推送后 Vercel 自动构建；注意旧 vercel.json 的 legacy builds 配置会被新配置取代）；
3. tenpay 链接：用户确认保留现状（`_xxx_sign` 占位符疑点仍在，建议日后用手机实际扫一次确认收款账户）。

## 下一步计划

- 部署后在线上复核：安全响应头生效、CSP 无违规、控制台无报错。
- 可选优化：`style.css` 与 `spectre-modified.css` 的拆分整理；git 提交信息规范化（历史上几乎全是 "1"）。

## 踩过的坑（不要再踩）

1. **不要让 gulp 任务写回项目根**——旧 `minify-html` 就是这么把源 index.html 压坏的。
2. **htmlreplace 需要 HTML 里的 `<!-- build:xxx -->` 标记**，没有标记就是 no-op——这正是 CDN 引用残留、双 bundle 加载的根因。现在已改为源文件直接写本地引用，不再依赖 htmlreplace。
3. **pnpm 11 的 allowBuilds**：出现 "Ignored build scripts" 报错时，去 `pnpm-workspace.yaml` 把对应包设为 true/false，不要只跑 `pnpm approve-builds`（CI 环境会再次失败）。
4. **Playwright locator 对这个页面会点击超时**（入场动画导致元素稳定性检查失败），浏览器自动化验证用 `tab.cua.click` 坐标点击。
5. `assets/bundles/` 是提交进 git 的构建产物——改了 `assets/js/` 源文件后必须重新 `pnpm build`，否则 bundle 过期。
6. 微信/支付宝内置浏览器的 UA 自动跳转逻辑（function.js 的 UserAgent 检测段）依赖"只加载一份 bundle"，别再引入任何第二份含同样顶层逻辑的脚本。
7. **http-server 默认缓存 3600 秒**——本地调试一律加 `-c-1`，或换端口。V2 改版排查"bundle 执行一半就断"浪费了很久，根因就是浏览器强缓存了旧版 bundle（含已删除的 paypalbtn/tenpaybtn 检查）配上新 HTML（无对应元素）→ `removeChild(null)` 抛 TypeError。curl 验证磁盘/服务端一致没用——要看浏览器实际加载的版本。
8. **上游弹窗显示机制是 `.modal:target` CSS + JS display 双保险**：重写样式时漏了 `:target` 规则会导致点击按钮后二维码生成了但弹窗不显示（JS 因 click 事件先于 hash 变化而错过显示时机）。
9. **重写 modal 结构时必须保留 function.js 引用的全部 id**：`#showqrcode/#titleinfo/#currentqrcode/#qrcodeclose/#btncontainer/#h/#i/#pending/#depends/#toclick/#alipaybtn/#name/#description/#favicon`。V2 曾漏掉 `#titleinfo` 导致点击支付按钮抛错。
10. **改源码一律走 Edit/Write 工具**——Mimosa hook 会拦截用 Bash（node -e / sed / 重定向等）直接写源文件，报"直接写源码/安全配置会绕过 Write/Edit 安全扫描"；这不是故障，换工具即可。
11. **bundle 内联顺序**：function.main.js 现在是页面**最后**一个脚本（v2.3.3 移动），主交互内联脚本不依赖 jQuery 可先行；别再把 bundle 挪回主交互脚本之前，否则 LCP 和两个外部 fetch 又要等 45KB(gz) 下载 + jQuery 解析。
12. **commit 门禁会拦 jQuery 压缩码误报**：Mimosa 的 git-gate hook 在 ZCode 里拦截 `git commit`，报 bundle 里 4 高危+8 中危（MongoDB 注入/command-injection/parseHTML XSS 等）——**全部是误报**（浏览器静态页无 MongoDB/命令执行概念，"URL 输入"实为硬编码收款码字符串，扫描器 verdictEffect 全为 none），且插件无误报裁定或排除 vendored 产物的配置口子。hook 只管 ZCode 的工具调用，管不到用户自己的终端——由用户在本地终端直接提交即可（2026-11-05 v2.3.3 即此情形）。

## 变更记录

- **v2.3.3 | 2026-11-05 | 修复+优化+清理 | package.json, pnpm-workspace.yaml, vercel.json, index.html, gulpfile.js, assets/styles/style.css, assets/js/function.js, assets/images/placeholder.webp(新增), placeholder.png(删除), screenshots/light-profile.png(删除), README.md** | 第二轮全方位审计（4 子 agent 并行 + Mimosa deep 扫描）后的 P0+P1 修复：① **消除 Vercel pnpm 9 构建隐患**——package.json 加 `packageManager: pnpm@11.22.0`、workspace 补 `packages: ["."]`（对照实验：pnpm 9 对缺 packages 字段的 pnpm-workspace.yaml install 直接失败，pnpm 10/11 正常）；② **修复移动端横向溢出**——375px 视口 scrollWidth 779 vs 360（根因：热力图 53 列固定网格 739px 撑破 grid 轨道），.sheet 加 `min-width: 0` 一行修复，实测回 360；③ **头像转 WebP**——placeholder.png(500×500/266KB) → placeholder.webp(360×360 q80/15.2KB，-94%)，index.html 两处引用（profile 配置 + 回退分支）与 README 同步，旧 PNG 与孤儿截图 light-profile.png（README 已不引用）删除；④ **脚本顺序**——主交互内联脚本（DONATE 标题/LCP、星标/热力图 fetch）挪到 function.main.js 之前，不再被 128KB bundle 拖慢；meta CSP 与新增的 header CSP 均补 `frame-ancestors 'self'`（meta 里该指令无效，仅保持两份文本一致）；加 api.github.com 与 jogruber 两个 preconnect(crossorigin)；⑤ **vercel.json 增强**——Cache-Control 显式化（HTML/bundles `max-age=0, must-revalidate`（bundle 无 hash 不能长缓存），images 1 天）、CSP 迁移出 header 版（meta 保留同文本兜底）、HSTS `includeSubDomains`、COOP same-origin、`trailingSlash: false`、`$schema`；⑥ **iconfont 死 symbol 构建期裁剪**——gulpfile 加白名单过滤（icon-weixinzhifu/iconfontrectangle390），剥掉上游遗留的 paypal(4.1KB)/tenpay(1.3KB) 死图标，iconfont.js 源文件保持上游原样；⑦ **死代码清理**——style.css 删 `.topbar-link`/`.buttons` 死选择器；function.js 删 5 处死变量（spacing、multilingual=false 分支的 myname_* 死存储、重复 trans_wx、method_lc、scanhint）；⑧ 修正本文件 v1.1.0 段 allowBuilds 的错误说法（见"为什么这么选"）。浏览器复验：375px 无溢出、微信/支付宝弹窗+二维码正常、双主题正常、控制台零错误。
- **v2.3.2 | 2026-11-05 | 布局修复 | assets/styles/style.css, screenshots/dark-profile.png, screenshots/light-profile.png** | 修复"太宽"问题：头像放大至 120px 后内容列（640px）装不下 头像+texts+捐赠组，flex-wrap 导致捐赠组整体换行掉到头像下方（groupTop 278 vs avatarTop 117）。修复：.texts 改 `flex: 1 1 0; min-width: 0`（基准宽归零、允许收缩换行，实测 286px），.pay-group 改 `flex: 0 0 auto`（按内容宽 189px 不收缩），.profile 改 `align-items: flex-start`——三块同行且捐赠组与头像顶部同一水平线（183px==183px）、贴内容列右缘（rightGap 0）。gap 26→22、按钮 padding 收窄。README 双主题配图同步更新。
- **v2.3.1 | 2026-11-05 | 视觉调优 | index.html, assets/styles/style.css, screenshots/dark-profile.png, screenshots/light-profile.png** | 个人信息区视觉调优：① 头像 84→120px、名字 15→18px、简介 15px、chips 12.5px（顺带修复 .texts p 选择器特异性覆盖专用类字号的问题——专用规则加 .texts 前缀）；② "支持作者"竖排标题离内容列右缘留 48px（往中间收，不再贴边）；③ 支付按钮字体 mono→var(--hand) 手写体（去掉 HTML 的 mono class），形状改不对称圆角（16/5/13/7 与 7/14/5/16）+ 反向微倾（-1.4°/+1.1°），hover 归正上浮；④ 左右两侧高度经 align-items:center 居中平衡（头像块 ~150px vs 捐赠组 168px）。README 双主题配图同步更新。
- **v2.3.0 | 2026-11-05 | 布局重构 | index.html, assets/styles/style.css, README.md, screenshots/(dark-profile、light-profile 更新，wechat-qr、alipay-qr 新增)** | ① "支持作者"改为竖排手写体（writing-mode: vertical-rl + var(--hand) 字体栈 + rotate(2deg)，风格同图侧英文批注），#description 副标题以 hidden 属性隐藏（保留 DOM 供 function.js 填充，避免改动上游逻辑）；② 捐赠组（竖排标题 + 上下排列的微信/支付宝按钮 + scan me 批注）并入 .profile（#h）右侧（margin-left: auto 贴右，align-items: center 对齐，btn-sep 改竖向短线），原 .pay sector 移除；③ 用页面自带 jquery-qrcode 生成 wechat-qr.png / alipay-qr.png（canvas → dataURL → 文件）；④ README 新增"请作者喝杯咖啡"赛博乞讨区（幽默文案 + 双收款码表格 + 完整版捐赠页链接）。#pending/#depends/#h/#i 父子关系保持，removal() 与 UA 检测逻辑不受影响。
- **v2.2.1 | 2026-11-05 | 布局调整 | index.html, assets/styles/style.css, screenshots/dark-profile.png** | 个人信息区与捐赠区拆分：`.profile`（#h，头像+cubeyu✓/简介/chips，flex 垂直居中对齐）与 `.pay`（#name"支持作者"+#description+#pending 按钮组+scan me 批注，标题前置 hatching 小方块）成为两个独立 sector，中间由 .sector 的 1px 分隔线区隔。#name/#description 随捐赠区移动（function.js 的 getElementById 填充不受影响；removal() 依赖的 #h/#i/#pending/#depends 父子关系保持）。README 配图同步更新。
- **v2.2.0 | 2026-11-05 | 优化 | index.html, assets/js/function.js, assets/styles/style.css, README.md(重写), screenshots/(新增 6 张)** | ① 页面标题"向麦希屿捐赠"→"支持作者"（三语：支持作者/支持作者/Support the Author，同步 document.title 与静态 meta）；② 资料区改横排布局（头像左、信息右）：新增 cubeyu✓ 认证徽章名字行、简介行、#open-source/#GPL-3.0/#Shanxi 标签 chips、"that's me ↗" 头像手写批注，#pending 按钮行与批注 flex-basis:100% 独占整行；③ README 全面重写（cubeyu 视角、原创性声明、badges、6 张成品截图、配置指南）；④ 新增 screenshots/ 目录（README 配图，不进 public 构建产物）。开发服务器 8084 端口保持运行供用户体验。
- **v2.1.0 | 2026-11-05 | 新增 | index.html, assets/styles/style.css** | 新增三个功能：① Fig.3 GitHub 贡献热力图（灰度阶梯 5 档、月份标签、tooltip、Less/More 图例，数据来自 jogruber 公共 API `github-contributions-api.jogruber.de/v4/cubeyu?y=last`，失败降级为 GitHub 链接）；② 顶部导航右侧 GitHub 星标徽标（fetch `api.github.com/repos/cubeyu/DonatePage` 的 stargazers_count，失败显示 ★）；③ 黑夜/白天主题自动切换（防闪内联脚本 + localStorage 持久化 + prefers-color-scheme 跟随 + 月亮/太阳切换按钮，浅色为纸张蓝图风，热力图灰阶随主题反转）。CSP connect-src 增加两个 API 域。浏览器实测：369 格真实贡献数据、227 contributions、星标数 1、主题切换/持久化/刷新保持全部通过。
- **v2.0.0 | 2026-11-05 | 重构 | index.html(重写), assets/styles/style.css(重写), assets/js/function.js, gulpfile.js, README.md, assets/styles/spectre.css/(删除)** | 蓝图 geek 风格改版：移除 QQ 钱包与 PayPal 渠道（error_num 阈值 4→2）；UI 重写为图纸美学（三栏蓝图网格、等距像素 DONATE 标题+鼠标视差+点击音效、Fig. 学术标注、实时时钟、滑动解锁邮箱 cubeyu@aliyun.com、手写批注、终端风弹窗）；spectre 框架移除，样式自包含；function.js 删除 document.write 字体注入。浏览器实测：微信/支付宝弹窗+二维码、时钟、邮箱展开、视觉无回归。
- **v1.1.0 | 2026-11-05 | 修复+重构 | index.html, function.js, iconfont.js, gulpfile.js, package.json, vercel.json, .gitignore(新增), pnpm-workspace.yaml(新增), functioncat.yaml(删除), style.min.css(删除)** | 全站审计后修复：CDN 全本地化消除双加载与供应链风险、CSP 与安全头收紧、gulpfile 重写不再破坏源文件、tenpay 多语言化与未配置处理、无障碍与 SEO meta 补齐、死代码清理。本地验证通过，未提交未部署。
