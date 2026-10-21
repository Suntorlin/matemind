# Matemind 竞品调研

调研日期：2026-10-21。GitHub stars 均取自 GitHub API 当天的数字。标"没验证"的条目，我没找到一手来源。

## 1. 结论

1. **"理解用户"这个位置是空的。** 我查了 14 个产品。它们都在做三件事之一：远程控制 agent、并行编排 agent、托管 agent。没有一个以"用户本人的话和偏好"为中心。
2. **最大威胁是平台方自己。** Claude Code Remote Control、Codex app、Cursor iOS、GitHub Agent HQ 都已内置手机控制或"任务中心"。它们只管自家 agent。
3. **独立工具很难赚钱。** Vibe Kanban 因找不到商业模式关停公司。Terragon 已关停。Omnara 已转型做 agent 托管。
4. **有钱的对手在往"监督 + 评审"走。** Conductor 拿了 2200 万美元 A 轮，Pro 档 $50/月含手机 app。Codex app 自称"监督进度、评审改动"的指挥中心。
5. **帆形 logo 的形状没有撞车。** 最近的是 Sail Research（AI 基础设施，两片直角帆，中高相似）。名字 Matemind 没有同名公司或产品。
6. **新配色有两个问题。** 帆的渐变色标和 Instagram 2016 版渐变的 5 个色值完全一样。App 图标的粉紫蓝光球正是 AI 品牌最常见的套路。
7. **域名：** matemind.com 已被注册（2009 年的德语旧站）。matemind.ai/.dev/.app 查询显示未注册。商标没验证。

## 2. 竞品对比

| 产品 | 定位（一句话） | 类别 | 开源 | 价格 | Stars / 热度 | 和 Matemind 的区别 |
|---|---|---|---|---|---|---|
| hapi | 本地优先的 agent 远程控制 app，支持 10 种 agent [1] | 远程控制 | 是，AGPL-3.0 [1] | 免费（我猜，没验证） | 5,274 [1] | Matemind 的上游。它只管"随时随地控制"，不做拆任务、记忆、报告 |
| Happy | "Orchestrate Claude, Codex and Grok in one app" [2] | 远程控制 → 多模型编排 | 是，MIT [2] | 免费 [2] | 24,240；iOS 评分 4.9 [2] | 以 agent 为中心，卖"用自己的订阅" |
| Claude Code（Remote Control / web / 手机 / Agent Teams） | 手机或网页驱动本地或云端会话；Agent Teams 让多实例协作 [3][4][5] | 远程控制 + 编排 | 否 | Pro $20，Max 起 $100，Team $25/$125 每席 [6] | 不适用 | 官方，只管 Claude。没有跨 agent 视图和面向用户的结论 |
| OpenAI Codex（app / cloud / 手机） | "a command center... supervise progress... review code changes" [7] | 编排 + 远程控制 | 只有 CLI 开源，Apache-2.0 [8] | Free 到 Pro $500 多档 [9] | CLI 130,170 stars；月活开发者超 100 万（2026-02）[7] | 官方，只管 Codex。"监督 + 评审"话术和 Matemind 最接近 |
| Cursor cloud agents | 云端 VM 并行跑 agent，iOS 可远程控制本机 agent [10][11] | 编排 + 远程控制 | 否 | 云 agent 从 Premium $30 起 [12] | 被 SpaceX 以 600 亿美元收购 [13] | 只管 Cursor，以云端执行为主 |
| OpenAI Symphony | 把看板上的 issue 变成隔离的自动实现任务，"manage work instead of supervising coding agents" [14] | 编排 | 是，Apache-2.0 [14] | 免费 | 27,758 [14] | 以任务看板为中心。它的"工作证明"（CI、PR 评审、讲解视频）和 Matemind 的报告思路接近 |
| GitHub Agent HQ / Mission Control | 多家 agent 的统一入口，含任务中心、代码评审、用量仪表盘 [15][16] | 编排 + 监督 | 否 | 需付费 Copilot 订阅 [16]；Pro+ $39 来自协调方，没验证 | 不适用 | 云端、以仓库为中心。最可能挤压"观测 + 评审"这一块 |
| Conductor | "Run parallel Claude Code, Codex, and Cursor agents in isolated workspaces on your Mac" [17] | 并行编排 | 否 | Free；Pro $50/月；Teams $60/人/月 [18] | A 轮 2200 万美元（2026-03-30）；10 万+ 用户 [19] | Mac 桌面优先，以 worktree 并行为核心，不做用户记忆 |
| Vibe Kanban | 看板管理多个 agent 任务 [20] | 并行编排 | 是，Apache-2.0 [21] | 公司已关停，社区维护 [20] | 28,410 [21] | 证明"看板 + 并行"很受欢迎，但没有收入模式 |
| Nimbalyst（原 Crystal） | 并行 Claude Code / Codex 会话的可视化工作区，带看板和 iOS app [22] | 并行编排 | 是，MIT（2026-04-30 起）[22] | 个人免费 [22] | Nimbalyst 1,948；Crystal 3,135 [21] | 有 agent 写的项目 wiki（协调方提供，没验证）。它记的是项目，不是用户 |
| Sculptor（Imbue） | Mac app，每个 agent 跑在独立 Docker 容器 [23] | 并行编排 | 是，MIT [21] | Beta 期免费 [24] | 240 [21] | 偏隔离和本地 IDE 同步，没有手机和报告 |
| Omnara | 现为"open-source alternative to Claude Managed Agents"[25]；原为手机端 agent "mission control" [26] | 原远程控制，现 agent 托管 | 是，Apache-2.0 [27] | 平台费 $0，按机器用量 [28] | 2,949 [27] | 已离开这个赛道，转做给开发者的基础设施 |
| Terragon | 云端编排 Claude Code agent（没验证细节） | 编排 | 没验证 | 已关停 [29] | 关停日期 2026-02-09 来自协调方，没验证 | 已退出 |
| Claude Squad | 终端里管理多个 agent 会话 [21] | 并行编排（仅终端） | 是，AGPL-3.0 [21] | 免费 | 8,637 [21] | 只有终端界面，没有手机和报告 |

### 结论：三类产品，第四类空着

| 类别 | 代表 | 中心是谁 |
|---|---|---|
| 远程控制 | hapi、早期 Happy、Claude Remote Control、Codex 手机 | 会话 |
| 并行编排 | Conductor、Vibe Kanban、Nimbalyst、Sculptor、Symphony、Agent Teams | 任务和 worktree |
| agent 托管 | Omnara、Cursor 云端、Codex cloud | 云端算力 |
| **理解用户 + 给结论** | **没找到** | 用户 |

## 3. 品牌外观

| 产品 | Logo 形状 / 隐喻 | 主色 | 来源 |
|---|---|---|---|
| hapi | 圆角方框里的笑脸，两侧有小箭头（"handoff"） | 珊瑚红 #F25562，淡粉底 | [30] |
| Happy | 7 个方块拼成像素 "H" | 墨黑 #101014，奶油底 #f5f0e7，红黄蓝绿点缀 | [31] |
| Claude / Claude Code | 放射状星芒（spark） | 珊瑚橙 | [32] |
| OpenAI Codex | 蓝色圆中白色 OpenAI 花形；og 图为蓝紫渐变 | 蓝、蓝紫渐变 | [33] |
| Cursor | 圆角框里的等轴测立方体，一面像光标 | 浅 #f7f7f4 / 深 #14120b | [34] |
| Omnara | 黑色圆中白色对话气泡 | 近黑 #0a0a0a | [35] |
| Conductor | 像素 "C"（协调方提供，没验证） | 没验证 | [17] |
| GitHub | Octocat 剪影 | 黑白 | 公认，未单独核对 |
| Vibe Kanban、Nimbalyst、Sculptor、Claude Squad | 没验证 | 没验证 | — |

### 品类套路（Matemind 要避开）

| 套路 | 谁在用 | 来源 |
|---|---|---|
| 像素或方块字母图标 | Happy 的像素 H；Conductor 的像素 C（没验证） | [31] |
| 奶油底 + 墨黑 / 暖灰 | Happy、Cursor | [31][34] |
| 星芒 / sparkle | Claude；AI 品牌普遍使用 | [32][36] |
| 紫蓝粉多段渐变、光球、光晕 | OpenAI、Gemini、Copilot 等 | [36][37] |
| 终端提示符、机器人 | 这类工具的通用图标（我的观察，没逐一统计） | — |

### Matemind 新配色离套路有多近

| 元素 | 现状 | 离套路距离 | 判断 |
|---|---|---|---|
| 帆形 + 三段 + 底条 | 几何、单色可用 | 远 | 形状有辨识度，保留 |
| 帆的渐变 | 色标 #feda75 → #fa7e1e → #d62976 → #962fbf → #4f5bd5 | **完全重合 Instagram** | 这 5 个值就是 Instagram 渐变的公开色值 [38]。Instagram 2016 起把渐变当核心识别 [39]。Meta 品牌规范不许把 Instagram 品牌元素和别的公司名组合使用，但页面没有单独写渐变 [40]。是否构成侵权我没验证，但用户第一眼会想到 Instagram |
| App 图标光球（粉紫蓝 + 橙光） | 软渐变光球底 | **正中 AI 套路** | 和"紫蓝粉渐变、光球、光晕"这一条完全一致 [36][37] |
| 白帆在暖色底上 | 白色三段横纹 + 底座 | 近 VLC | 见第 4 节 |

建议：保留形状，换配色。可选方向是近黑主色加一个独有的强调色（原方案 #2f6bff 那条路），或自定一组不来自任何大品牌的渐变。

## 4. Logo 撞车检查

| 对象 | 外观 | 相似度 | 说明 | 来源 |
|---|---|---|---|---|
| Sail Research | 两片藏青直角帆，竖边在右，斜边左下到右上 | **中高** | 方向和构造一致，同属 AI agent 基础设施，2026 年种子轮 | [41][42] |
| VLC | 橙色锥体加白色横纹，下有底座 | **中（新配色后上升）** | 白色分段三角 + 底条在暖色底上，像交通锥。我的目测判断，没做用户测试 | [43][44] |
| Laravel Sail | 橙底白帆船，两片帆竖缝分开 | 中 | 同为开发工具，切缝方向不同 | [45] |
| Sails.js | 半圆主帆 + 三角帆 | 中 | 无分段、无底条 | [46] |
| Saildrone | 竖直翼帆 + 下方横线 | 低到中 | 非软件 | [47] |
| Spinnaker | 弧形帆 | 低到中 | 曲线，无分段 | [48] |
| Mistral AI | 像素 "M"，彩虹横条 | 低到中 | 只共享"横向分段" | [49] |
| Windsurf | 波浪 "W" | 低 | 只有名字联想和品类重叠；已被 Cognition 收购 | [50][51] |
| SailPoint、Vercel、Helm、Docker、DigitalOcean、Bitbucket、Sailfish OS、TextMate 等 | 立体三棱锥、正三角、舵轮等 | 低 | 构造不同 | [52] |

### 名字和域名

| 项目 | 结果 | 来源 |
|---|---|---|
| "Matemind / MateMind / Mate Mind" 公司或产品 | 没找到。近似名有 Mathtermind（数学 App）、MindMate 系列 | [53] |
| GitHub 组织 matemind | 未被占用（API 返回 404） | [54] |
| GitHub 同名仓库 | 5 个，都是 0 星的学生项目（棋类训练、学习 App 等） | [55] |
| npm `matemind` | 未被占用 | [56] |
| matemind.com | 已注册（2009 年，GoDaddy，到期 2027-10），是停用的德语"通讯录"旧站，不是出售页 | 用 whois / curl 查询，2026-10-21 |
| matemind.ai / .dev / .app | 查询显示未注册；是否溢价没查 | whois.nic.ai 与 RDAP 查询，2026-10-21 |
| 商标（USPTO / EUIPO） | 没验证，需人工查 | [57][58] |
| CLI 名 `mate` | 已被 TextMate 占用（BRAND.md 已避开） | — |

## 5. 空白点（Matemind 能赢的地方）

1. **以用户为中心的长期记忆。** 竞品的记忆要么没有，要么是项目 wiki（Nimbalyst）。没有一个记"这个用户怎么想、怎么决定"。
2. **跨厂商的中立视图。** 官方工具各管自家（Claude、Codex、Cursor）。用户同时用 3 家时，只有中立层能给一张总表。hapi 和 Happy 是中立的，但只做遥控。
3. **"给结论"而不是"给日志"。** Symphony 交"工作证明"，Codex app 讲"监督 + 评审"。但都面向工程流程。面向用户的一页结论 + 公开分享报告，没看到对手在做。
4. **本地 CLI + 手机 PWA + 多会话群聊。** 代码留在本机，又能在手机上看多个会话互相 @。Conductor 和 Sculptor 是 Mac 桌面，Cursor 和 Codex cloud 是云端。
5. **评审闭环（worker + reviewer）。** 只有 GitHub Agent HQ 明确做 agent 代码评审，而它在云端、绑 GitHub。

## 6. 风险

1. **平台方补齐功能。** Anthropic、OpenAI、GitHub 都已有手机控制或任务中心 [3][7][15]。它们加一个"记忆 + 周报"就能覆盖 Matemind 的大半价值，而且免费附带在订阅里。
2. **有钱或有量的近邻抄功能。** Conductor 有 A 轮资金和手机 app [18][19]。Happy 有 2.4 万 stars，代码同源可直接借鉴 [2]。
3. **商业模式难。** Vibe Kanban 关停公司 [20]，Terragon 关停 [29]，Omnara 转型 [25]。另外 AGPL 许可限制闭源变现。多 Claude 账号配额切换可能触及服务条款，我没验证，建议上线前核对。

## 来源

1. https://github.com/tiann/hapi
2. https://happy.engineering ；https://github.com/slopus/happy
3. https://code.claude.com/docs/en/remote-control
4. https://code.claude.com/docs/en/claude-code-on-the-web
5. https://code.claude.com/docs/en/agent-teams
6. https://claude.com/pricing
7. https://interestingengineering.com/ai-robotics/openai-codex-app-multi-agent-software-development
8. https://github.com/openai/codex
9. https://learn.chatgpt.com/docs/pricing
10. https://cursor.com/docs/cloud-agent
11. https://pulse2.com/cursor-launches-native-ios-app-for-building-with-ai-agents-from-anywhere/
12. https://cursor.com/pricing
13. https://www.techzine.eu/news/devops/142197/spacex-acquires-cursor-for-60-billion/
14. https://github.com/openai/symphony
15. https://visualstudiomagazine.com/articles/2025/10/28/github-introduces-agent-hq-to-orchestrate-any-agent-any-way-you-work.aspx
16. https://siliconangle.com/2025/10/28/github-tackles-vibe-coding-chaos-control-center-ai-coding-agents/
17. https://www.conductor.build
18. https://www.conductor.build/pricing
19. https://www.conductor.build/blog/series-a
20. https://vibekanban.com/blog/shutdown
21. GitHub API，2026-10-21：BloopAI/vibe-kanban、stravu/crystal、nimbalyst/nimbalyst、imbue-ai/sculptor、smtg-ai/claude-squad
22. https://rywalker.com/research/nimbalyst
23. https://imbue.com/blog/containers
24. https://www.everydev.ai/tools/sculptor-by-imbue
25. https://www.omnara.com
26. https://hyper.ai/en/stories/2b3679014e35e256cdf6621473df1cae
27. https://github.com/omnara-ai/omnara
28. https://www.omnara.com/pricing
29. https://www.terragonlabs.com （页面标题 "Terragon Shutdown"）
30. https://hapi.run/icon.svg
31. https://happy.engineering/favicon.svg
32. https://assets.claude.com/95a868946ac8a31e5ff832e2899f294aa368b836.png
33. https://learn.chatgpt.com/favicon.png ；https://learn.chatgpt.com/og/docs.png
34. https://cursor.com/marketing-static/favicon-light.svg
35. https://omnara.com/favicon.svg
36. https://logodiffusion.com/blog/gradient-trends-in-ai-logo-design
37. https://braindetox.kr/en/posts/ai_logo_design_convergence_2026.html
38. https://codeofcolors.com/instagram-colors.html
39. https://thenextweb.com/news/instagram-just-got-new-logo
40. https://www.meta.com/brand/resources/instagram/instagram-brand/
41. https://www.sailresearch.com/
42. https://www.redpoint.com/companies/sail
43. https://1000logos.net/vlc-logo/
44. https://whatthelogo.com/logo/videolan/181027
45. https://raw.githubusercontent.com/laravel/sail/1.x/art/logo.svg
46. https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/sailsdotjs.svg
47. https://www.saildrone.com
48. https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/spinnaker.svg
49. https://www.mistral.ai/brand
50. https://windsurf.com/favicon.svg
51. https://www.techcrunch.com/2025/07/14/cognition-maker-of-the-ai-coding-agent-devin-acquires-windsurf/
52. https://www.sailpoint.com/icon.png ；https://simpleicons.org
53. https://apps.apple.com/ch/app/mathtermind/id1470470532
54. https://api.github.com/users/matemind
55. https://github.com/search?q=matemind&type=repositories
56. https://registry.npmjs.org/matemind
57. https://tmsearch.uspto.gov/
58. https://euipo.europa.eu/eSearch/
