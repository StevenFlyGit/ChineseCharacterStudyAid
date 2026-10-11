# 心音字灵 · MindGlyph
移动端优先的汉字学习辅助 MVP。把“赢”拆成五块，看结构、听短故事、亲手拼回，再撤去提示辨认。由家长或教师陪伴使用。

## 开始使用
需要 Node.js 22.12+。在本目录执行：

~~~powershell
npm install
npm run dev
~~~

打开 http://127.0.0.1:5193 。Vite 5193，Express 3019。首页输入“赢”后点击“帮我认识”，或点击“赢”字卡进入学习；推荐区的“镜、藏、警”暂未开放，会明确提示。最近学习过的字保存在本机，可点选再次学习。结构页按“亡在上、口在中、月贝凡在下”展开，直接点字块高亮并朗读位置，可自由探索和重复点击重听；点击“听个小故事”直接进入五句故事。“一分钟路演”自动推进开场、五块聚焦和五句故事，拼回及辨认等待实际操作。
运行模式默认为本地脚本，不查询 API 状态，也不发送模型请求。

构建后运行：

~~~powershell
npm run build
npm start
~~~

生产预览 http://127.0.0.1:3019 。构建还会生成 docs/心音字灵-离线演示.html，可双击直接打开，包含字形、UI、说明和普通话音频，不依赖 CDN。
离线文件仍使用设备浏览器；真实 API 需使用上述 HTTP 服务。

## 真实 AI
复制 .env.example 为 .env，填写 AI_BASE_URL、AI_MODEL、AI_API_KEY，重启服务。不要使用 VITE_ 密钥，不要把 .env 提交或发送。
模型服务需兼容 Chat Completions 的 JSON 输出模式。AI 只改写讲解，字形、部件、读音、释义和判断规则由本地配置提供。

在“陪伴者设置”切换“真实 API”后，点击“请求短故事”。电脑版 Ctrl + H 可切换模式。实际来源显示为“本地脚本 / 真实 API / 本地回退”；三秒超时、缺少凭据、无效输出或断网都保留本地流程。切换会取消旧请求，迟到响应不会覆盖新模式。

POST /api/story 请求：
~~~json
{"lessonId":"ying-v1","contentVersion":1,"theme":"陪伴","length":"short"}
~~~
返回 intro、五项有固定 id 的 lines、outro、source。固定 id 顺序为 wang、kou、yue、bei、fan。
无凭据返回 HTTP 503，模型失败或无效内容返回 502，不伪造真实成功。
当前没有配置供应商凭据。真实供应商延迟和内容质量仍需联调。

## 演示与学习记录
“一分钟路演”可以人工暂停，超时不自动回答；实际时长取决于操作速度。
“动画预览”使用独立演示状态，不覆盖已有学习记录；在设置中可返回原来的学习。预览也不会自动代选答案。
本地只保存稳定学习进度、尝试/求助次数及声音/动态偏好。刷新后恢复，损坏数据回到开始页；存储不可用时继续内存流程。
无提示辨认与看过提示的辨认分开记录，结果只描述本次操作，不声称已掌握或已有疗效。

## 音频与素材
src/audio 提供固定普通话音频，构建时内联，不在运行中请求语音生成。动态 AI 讲解尝试浏览器中文语音；不可用时保留字幕。
~~~powershell
npm run audio:generate
~~~
上述开发脚本联网重新制作音频，运行应用无需执行。
五幅联想插画为本项目手绘 SVG。字形来自 hanzi-writer-data / Make Me a Hanzi，使用 Arphic Public License；完整许可证见 public/licenses/ARPHICPL.TXT。
“亡像小帽、口来呼唤、月亮照路、贝壳作伴、平凡的我向前”是记忆联想，不是字源解释；暂未开展专业内容评审和儿童试用。

## 验证
~~~powershell
npm test
npm run test:browser
~~~
浏览器检查需要先启动 npm run dev，默认使用本机 Microsoft Edge 的独立测试上下文；BROWSER_CHANNEL=chrome 可改用 Chrome。
覆盖 360/390/430px 触摸学习、错误/求助/刷新、桌面、API 错误与迟到响应、预览记录隔离、离线单文件及路演暂停。截图保存 test-output。
API 成功用例采用明确的受控响应，不代表真实模型已经验证。
PRD 位于 docs/产品方案.md；路演讲稿位于 docs/三分钟路演.md。

## Cloudflare 部署

已上线：https://mindglyph-mvp.pages.dev/ 。部署记录见 docs/Cloudflare部署.md。

前端和 /api/story 使用 Pages + Pages Functions。首次执行 npx wrangler login 完成浏览器授权，再创建项目：

~~~powershell
npx wrangler pages project create mindglyph-mvp --production-branch main
npm run deploy:cloudflare
~~~

本机模拟云端：npm run dev:cloudflare，访问 http://127.0.0.1:8788。
默认本地故事和音频可正常运行。真实 AI 需在 Cloudflare 的 Pages 项目设置中添加 AI_API_KEY（Secret）、AI_MODEL、AI_BASE_URL 后重新部署；当前未配置这些值，云端接口会返回明确的 503，前端回退本地故事。
部署命令只上传 dist 静态文件和 functions，密钥不进入前端构建。
