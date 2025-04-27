多合一个人收款网站搭建指南V1.0.0

本项目是一个简单的多合一个人收款网站，你可以通过它方便地接收微信支付、支付宝、QQ钱包等多种方式的捐款。
如果项目对你有帮助，欢迎给作者打赏，让可爱的作者吃根棒棒糖，若你也想搭建属于自己的收款网站，按照以下步骤操作即可。

打赏地址：https://donate.techisle.top

---

## 一、项目结构说明

- `index.html`：主页面，包含所有收款渠道的入口和页面结构。**收款信息、昵称、头像、页面标题等均可在本文件顶部的 `<script>` 配置区自定义修改**，如：
  - `var myname`、`var profile`、`var wechat`、`var alipay`、`var paypal`、`var tenpay` 等变量。
- `assets/styles/style.css`：自定义样式文件。**如需调整页面配色、字体、按钮样式等，可直接编辑本文件**。
- `assets/js/function.js`：主要的前端逻辑，包括多语言支持、支付方式切换、二维码生成等。**如需自定义副标题、支付提示文案、语言适配等，可在本文件顶部相关变量和函数内修改**。
- `assets/js/iconfont.js`：SVG 图标库，包含微信、支付宝、QQ钱包、PayPal 等支付图标。**如需新增或替换图标，可在此文件中操作**。
- `assets/js/jquery-qrcode.js`：二维码生成库，无需修改。
- `assets/bundles/`：打包后的 JS/CSS 文件，生产环境使用。
- `gulpfile.js`：自动化构建脚本，包含 CSS/JS 合并压缩、HTML 压缩等任务。**如需自定义构建流程，可编辑本文件**。
- `package.json`：项目依赖与脚本说明，包含 `live-server` 用于本地预览。
- `LICENSE`：开源协议文件。
- `functioncat.yaml`：功能配置文件（如有特殊需求可自定义）。

---

## 二、快速搭建步骤

1. **Fork 项目**
   - 访问本项目的原始仓库页面，点击右上角"Fork"按钮，将项目复制到自己的 GitHub 仓库。

2. **修改参数**
   - 编辑 `index.html` 文件顶部 `<script>` 区域，**将收款二维码链接、昵称、头像等变量替换为你的信息**。
   - 如需调整页面样式，编辑 `assets/styles/style.css`。
   - 如需自定义副标题、文案或多语言内容，编辑 `assets/js/function.js`。

3. **本地预览**
   - 直接双击打开 `index.html` 文件或在浏览器中拖入该文件即可预览。

4. **部署上线**
   - 将修改后的代码推送到 GitHub Pages、Vercel、Netlify 等平台即可上线。

---

## 三、依赖说明

- [gulp](https://gulpjs.com/) 及相关插件：用于自动化构建、压缩合并资源文件。
- [Merger](https://merger.huangxin.org)：二维码合并与多渠道收款支持。
- [jQuery](https://jquery.com/)、[jquery-qrcode](https://larsjung.de/jquery-qrcode/)：二维码生成与 DOM 操作。

---

## 四、常见问题与自定义入口

1. **如何更换收款二维码？**
   - 在 `index.html` 顶部 `<script>` 区域，修改 `wechat`、`alipay`、`paypal`、`tenpay` 等变量为你的收款链接。

2. **如何自定义页面样式？**
   - 编辑 `assets/styles/style.css`，可调整背景渐变、按钮样式、字体等。

3. **如何修改副标题或多语言内容？**
   - 编辑 `assets/js/function.js`，查找 `subtitle`、`finalsub`、`method` 等变量及相关函数。

4. **如何新增/替换支付方式图标？**
   - 编辑 `assets/js/iconfont.js`，添加或替换 SVG 图标代码。

---

## 五、截图示例

index.html
![屏幕截图 2025-04-22 205335](https://github.com/user-attachments/assets/cc27ee73-2c3e-401d-8a06-db74f39ca23b)
![屏幕截图 2025-04-22 205351](https://github.com/user-attachments/assets/b3e0144c-fc7f-4b06-be1c-48760f1599ff)
![屏幕截图 2025-04-22 205358](https://github.com/user-attachments/assets/61eb3667-a394-4e1d-a037-39a1c432d601)

function.js
![屏幕截图 2025-04-22 205610](https://github.com/user-attachments/assets/adfbfa1f-ed59-4b41-a3cf-d69fef629285)
图片最底下一段为副标题

---

如有更多问题，欢迎在 Issues 区留言或联系作者 Cubeyu（cubeyu@aliyun.com）。
