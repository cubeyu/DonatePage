# 贡献指南

感谢你愿意为 DonatePage 贡献一份力量！这个项目是纯静态站点，改动门槛很低。

## 本地开发

```bash
pnpm install
pnpm build     # 构建产物到 public/
pnpm start     # 本地预览
```

> **注意**：`assets/bundles/` 是构建产物（已加入 .gitignore，不入库），由 `pnpm build` 生成、CI 与 Vercel 部署时自动重建。本地改了 `assets/js/` 或 `assets/styles/` 后需重新执行 `pnpm build` 才能看到效果。

## 提交改动

1. Fork 本仓库并从 `main` 创建分支：`git checkout -b feat/your-feature`
2. 保持改动聚焦——一个 PR 只做一件事
3. 提交信息用清晰的前缀：`feat:` / `fix:` / `docs:` / `style:` / `refactor:` / `chore:`
4. 推送并开 Pull Request，描述里说明"改了什么"和"为什么"

## 代码约定

- **注释与文档使用中文**，代码标识符、路径、命令保持英文原样
- 样式改动优先通过 `assets/styles/style.css` 顶部的 CSS 变量（`--bg` / `--fg` / `--line` 等），保证暗色/浅色主题都能正常工作
- 不要引入 CDN 外链依赖（本项目坚持零外链，所有依赖都打包进本地 bundle）
- 修改 `index.html` 结构时，**务必保留** `function.js` 依赖的 id：
  `#showqrcode` `#titleinfo` `#currentqrcode` `#qrcodeclose` `#btncontainer` `#h` `#i` `#pending` `#depends` `#toclick` `#alipaybtn` `#name` `#description` `#favicon`

## 报告问题

- 使用 Issue 模板提交，附上浏览器版本与复现步骤
- 涉及收款功能的问题请**不要**在 Issue 里贴真实收款码或个人信息

## 许可

提交贡献即表示你同意以 [GPL-3.0](../LICENSE) 协议授权你的改动。
