# 字有引力 · 黏土视觉升级

## 视觉方向

以用户提供的五张参考图为方向：温暖的手作黏土微缩世界、奶油色字卡、绿叶装饰与橙色操作按钮。参考图只用于风格判断，未将带水印的参考素材直接放入产品。

桌面场景铺满画布，标题、气泡和托盘叠放在同一世界中；手机端保留竖屏流程，通过场景渐隐和托盘重叠连接上下区域。汉字字卡、提示和描摹区保持真实 HTML/SVG 交互，避免把界面做成不能操作的截图。

## 本次修改

- 替换平面树、桥、船、鸟和花园为独立透明黏土素材，场景与字卡共用素材。
- 生成几何位置一致的干涸与有水背景，降雨时淡入恢复后的河流。
- 新的黏土品牌字标；学习用汉字继续使用标准字体。
- 标题牌、面板、气泡、字卡统一使用奶油黏土纹理、顶部高光和底部厚度。
- 调整提示气泡，避免遮挡狐狸；保留种树、降雨、过河和开花动效与减少动效设置。
- 原图保存于 `art/source`；运行素材位于 `public/assets`，转换为保留透明度的 WebP。十张新增运行素材共约 1 MB。
- 转换可通过 `node scripts/optimize-art.mjs` 重现。

## 素材生成提示词

使用内置 imagegen 工具，未调用付费 API 脚本。以下为提示词规格；每个道具分别生成，背景编辑采用上一张背景作为输入。

共同道具规格：`isolated transparent game sprite for a Chinese children's clay adventure; high quality handmade polymer clay stop-motion miniature; subtle fingerprints and sculpted material; rounded thick forms; soft ambient occlusion; warm sunlight from upper left; sage green, butter cream, terracotta orange, sky blue, honey brown; centered whole object; no text, watermark, UI or ground plane; genuine alpha transparency`。

| 素材 | 主体提示词 |
| --- | --- |
| tree-clay | Single lush round-canopy green tree, whole chunky twisting brown trunk and little grassy root mound, slightly elevated three-quarter camera, soft sculpted foliage clusters. |
| bridge-clay | Small arched wooden footbridge, two rounded handrails, chunky posts, individual honey-brown planks, sculpted grain, slightly elevated three-quarter view, left-to-right horizontal span. |
| boat-clay | Small wooden rowboat, one paddle diagonally across it, whole object, slightly elevated three-quarter view, bow right, honey-brown sculpted planks and cream highlights. |
| bird-clay | Adorable blue bird with wide open wings, orange beak and feet, cream round belly, shiny black eyes, facing right, rounded toy proportions. |
| rain-clay | Small fluffy cream-blue cloud made of clay balls, three blue shiny suspended clay raindrops, slight fingerprints, whole object. |
| garden-clay | Oval flower bed, rounded cream stone border, brown clay soil, four flowers with cream-yellow petals and orange centers, thick sage green stems and leaves, slightly elevated three-quarter view. |
| logo-clay | Exact Chinese text 字有引力, four accurate characters in one horizontal line; thick rounded clay strokes; 字 sage green with sprout, 有 terracotta orange, 引 golden yellow, 力 sky blue with sprout; no panel or subtitle. |
| clay-texture | Seamless flat evenly lit macro surface of pale warm butter-cream polymer clay, subtle tiny pores and fingerprints, low contrast, hue #f4e4c5, no shapes, objects, frame or gradients. |
| island-clay-dry | Edit existing island preserving camera, geometry, banks, two bare left trees, cottage and dock. Softer chunkier polymer clay toys, rounded stones, fingerprints, soft light, sculpted leaves instead of photographic grass. Left side and riverbed remain dry. No characters, text or UI. |
| island-clay-wet | Edit only riverbed and grass colors of new dry background. Preserve exact framing and all object positions, bare trees, cottage, dock and sky. Fill existing central riverbed with turquoise clay water, cream ripples and foam. Fresh sage grass on left; no added trees or characters. |

## 验证

- TypeScript 与 Vite 构建通过，原有 5 项核心测试通过。
- 浏览器实际描摹四笔、组合林、降雨、手机拖船过河、错误字反馈、花园浇水和刷新恢复进度通过。
- 检查 1280×800、390×844、360×800 布局；无横向溢出；HTML 图片加载正常。
- 本次未配置真实模型凭据，也未进行实体手机和儿童试用。

截图保存于 `docs/screenshots`，文件名以 `clay-v2-` 开头。
