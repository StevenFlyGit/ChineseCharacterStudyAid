# Cloudflare 部署

当前状态：2026-10-11 已成功部署，并通过线上验证。

正式地址：https://mindglyph-mvp.pages.dev/

本次部署地址：https://7670a46a.mindglyph-mvp.pages.dev/

采用 Pages 托管 dist，Pages Functions 提供 /api/story。字形、普通话音频、拆解、故事、拼回和辨认使用现有前端流程。真实 AI 未配置，接口返回 NOT_CONFIGURED（503），前端可回退本地故事。

## 首次发布

在 Code-3 目录中执行：

~~~powershell
npx wrangler login
npx wrangler pages project list --json
# 确认名称未被其他项目使用后创建
npx wrangler pages project create mindglyph-mvp --production-branch main
npm run deploy:cloudflare
~~~

后续更新执行 npm run deploy:cloudflare 即可。以部署命令实际返回的 URL 为准。

## 验证

- 应用生产构建成功。
- 10 项自动测试通过，包含云端接口的方法、4KB 请求限制、无效输入和未配置模型处理。
- Wrangler 4.149.0 成功生成类型并编译 Pages Functions。
- 本地 Cloudflare 运行时验证：390px 首页、点击凡的位置提示、进入首句故事通过；真实 HTTP 接口的 503、405、404 通过。

- 线上验证：正式域名 HTTP 200，390px 手机点击凡显示位置提示、进入首句故事正常，无页面脚本错误；云端故事接口返回预期的 NOT_CONFIGURED（503）。

## 模型配置

在 Cloudflare Pages 项目设置的 Variables and Secrets 中配置 AI_API_KEY（Secret）、AI_MODEL、AI_BASE_URL，并重新部署。不要将密钥写入前端或 wrangler.jsonc。

## 本地云端模拟

~~~powershell
npm run dev:cloudflare
~~~

访问 http://127.0.0.1:8788。部署只上传 dist 和 Functions 编译产物。
