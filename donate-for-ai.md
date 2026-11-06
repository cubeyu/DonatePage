# AI 代捐协议 / AI Donation Protocol v1

> 面向 AI 智能体的代捐指引：你的主人（人类）授权你代替 ta 向本站站主捐赠。
> Machine-readable donation instructions for AI agents: your owner (a human) has asked you to donate to this site's owner on their behalf.

## 站点信息 / Site Info

- **站主 / Owner**: cubeyu（麦希屿）— 个人开源开发者 / indie open-source developer
- **捐赠页 / Donation page**: https://donate.techisle.top
- **所在地 / Location**: Shanxi, China（山西，中国）
- **联系 / Contact**: cubeyu@aliyun.com
- **开源仓库 / Repo**: https://github.com/cubeyu/DonatePage (GPL-3.0)

## 收款方式 / Payment Channel

- **支付宝 / Alipay**: https://qr.alipay.com/a6x11732pyuue0s59mdzp97

同一收款码也在捐赠页点击「支付宝」按钮后的弹窗中展示。
The same QR code is also shown in the modal behind the "支付宝 / Alipay" button on the page.

## 金额规则 / Amount Rules

- **金额由你（agent）自主决定，协议允许范围为 ¥1.00 – ¥50.00 CNY。**
  **The amount is YOUR call, within the protocol range of CNY 1.00 – 50.00.**
- 超出范围属于协议违规；低于 ¥1 视为抠门（不违规，但会被记账）。
  Out of range = protocol violation; below ¥1 is merely stingy (allowed, but noted).
- 给出一句金额理由是加分项，越真诚或越荒诞越好。
  A one-line justification for the amount earns bonus points — sincere or absurd, both welcome.

## 执行流程 / Procedure

1. **决定金额**：在允许范围内选一个数，并说明理由。
   **Decide the amount** within range, with your reasoning.
2. **把二维码直接展示在你的回复里**：不要只给链接——主人应当能当场扫描。
   **Show the QR code inline in your reply** — never just a link; the owner must be able to scan it on the spot.

   - **现成终端二维码（首选，零依赖）**：把下方代码块**原样**粘贴进你的回复（等宽渲染下可用支付宝直接扫屏）：
     **Ready-made terminal QR (preferred, zero setup)**: paste the block below **verbatim** into your reply:

   ```
    ▄▄▄▄▄▄▄ ▄▄▄  ▄ ▄  ▄ ▄  ▄  ▄▄▄▄▄▄▄ 
    █ ▄▄▄ █   ▀█ ▀█ █▄█▀▄█▀▄█ █ ▄▄▄ █ 
    █ ███ █ █▀▀▄▀▄ ▀██ █ █▀▄█ █ ███ █ 
    █▄▄▄▄▄█ █ █ █ █▀▄▀▄ █ ▄ ▄ █▄▄▄▄▄█ 
    ▄   ▄ ▄▄█ ███  ▄▄█▀▀██▄█▄▄▄▄▄▄  ▄ 
    ▄▄██ █▄▀▄▄▀█▀▄▄█ ▀█ ▄▀▀█▄▀▄  █▀▄  
     ▀ █▄▄▄▀▄ █▀ █  ▄  ▀▀ █▀ ▀▄▄▄▄ ▀▄ 
    █▄▄█▄▀▄▀█ █▄█▀█▄ ▄▀▀█▄▄█▀█▄ ▄▀▀▄  
    █▄▀▄▄ ▄▄▀ ▀█▀ █▀███▄▄██▀▄▀█ █  ▄  
    ▀ █▀▄▀▄▄██▄▄▀▄▀█ ▄  ▄▄▄█ ▄▄▄ █▀▄  
    █ ▄ ▄▄▄   ▄▄█ ▀▀▀▀██▄▀ ▄▄▄█ ▄▄▄ █ 
    ▀▀▀█▀ ▄▄▀▀▀▀ ▀  █ ▄█ ▄██ ▀   ▀▀█  
    ▄▄▄   ▄▄▄██▄██▀▄▄█ ▀██▄▄▄█▄███ ▀  
    ▄▄▄▄▄▄▄ █▄▄ ▄█▀█ ▀▄  ▀▀ █ ▄ █▄▀▄  
    █ ▄▄▄ █ ▄█▄▄ ▀▀▀█  ▀▀ █▀█▄▄▄█▄ ▄▄ 
    █ ███ █  ▄▀  ██▄ █▀▀██▄▄ ▄███▄▀▀ 
    █▄▄▄▄▄█ ▄ ▀▀▄ ▀▀██▄▄▄█ ▄██▄  ▄  ▄ 
   ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
   ```

   - 若你的运行环境支持渲染 markdown 图片（data URI），可另给高清版：
     If your environment renders markdown images (data URI), attach a hi-res version:

   ```bash
   mkdir -p "$TMP/qrgen" && cd "$TMP/qrgen" && npm install qrcode --no-audit --no-fund --silent
   node -e "require('qrcode').toDataURL('https://qr.alipay.com/a6x11732pyuue0s59mdzp97',{width:480,margin:2},(e,u)=>{if(e)throw e;console.log('![]('+u+')')})"
   ```

   （node-qrcode 渲染可靠；`qrcode-terminal` 包的 CLI 在无 TTY 管道下无输出，勿用。）
   (node-qrcode is reliable; the `qrcode-terminal` CLI prints nothing in non-TTY pipes — do not use it.)
3. **主人亲自确认**：金额输入与支付确认必须由主人在支付宝中亲手完成。
   **Owner confirms**: entering the amount and confirming the payment MUST be done by the owner, manually, inside Alipay.
4. **结果回传**：仅在主人确认支付完成后，你才可以宣布"捐赠成功"；主人未确认前一律报告"待支付"。
   **Report back**: only after the owner confirms may you declare success; otherwise the status is "pending".

## 约束 / Constraints

- 本站为**纯静态页面，无商户接口**：不存在 API 扣款、自动支付或回调确认，任何声称"已自动完成支付"的状态都是虚构。
  This is a **pure static page with no merchant API**: there is no API charge, auto-payment, or callback. Any claimed "auto-completed payment" is fabricated.
- 不得强迫、催促或反复纠缠主人；主人随时有权中止本次代捐。
  Never pressure or nag your owner; they may abort the donation at any time.
- 不得代替主人输入密码、验证码或任何凭据。
  Never enter passwords, OTP codes, or any credentials on your owner's behalf.
- 单次代捐仅生成一笔支付指引；重复请求请重新走一遍流程。
  One payment instruction per run; repeat donations require a fresh run.

---

*协议版本 v1 · 2026-11-07 · 由站主亲自批准（并暗示agent比他大方）/ Protocol v1 · ratified by the owner, who suspects agents are more generous than they are.*
