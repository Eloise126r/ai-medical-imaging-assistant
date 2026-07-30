# AI医学影像检查全流程助手 · 微信小程序

> 面向患者的智能医学影像检查服务平台。解决患者"不知道流程 / 不清楚准备 / 反复咨询 / 不知排队进度 / 担心辐射 / 不知报告时间"六大痛点。

---

## 一、产品定位

| 维度 | 说明 |
| --- | --- |
| 服务对象 | **仅患者端**（本人 + 家人代绑） |
| 不涉及 | 医生端、技师端、医院管理后台 |
| 核心目标 | 降低患者焦虑、减少无效咨询、提升检查体验 |
| 创新模块 | **Dose Translation Engine** —— 患者中心化辐射健康教育系统 |

---

## 二、技术栈

| 技术 | 说明 |
| --- | --- |
| **Uni-app** | 跨端框架（微信小程序 + H5 双端可运行） |
| **Vue 3** | `<script setup>` 组合式 API |
| **TypeScript** | 全量类型约束（`types/index.ts`） |
| **Pinia** | 状态管理（用户、聊天会话） |
| **SCSS** | 蓝白医疗主题、变量化设计 |
| **组件化** | 7 个公共组件 + 8 个业务页面 |

> 若您更熟悉原生小程序，可参考本项目的目录结构与 API 预留，1:1 迁移为 WXML/WXSS。

---

## 三、功能架构与页面导航

```
首页 Home
   ├─ 我的检查（当前检查卡片）
   ├─ 实时排队信息 → 排队详情页
   ├─ 可视化进度条（已完成→当前等待→即将检查）
   ├─ 临近3人 → 弹窗提醒 + 微信服务通知
   └─ 左侧抽屉导航（☰ 汉堡菜单）
        ↓
我的检查详情 Detail
   ├─ 检查信息（项目/部位/地点/时间/耗时）
   ├─ 检查流程可视化（签到→候诊→注射→扫描→完成）
   ├─ 检查前准备（饮食/携带/衣物 + 图/动画/视频入口）
   ├─ 禁忌症提醒（红色高危警示）
   └─ 检查后注意事项
        ↓
实时排队系统 Queue
   ├─ 检查室状态 / 你的号码 / 前方人数 / 预计等待
   ├─ 同检查室排队（仅序号与状态，**不显示姓名**）
   └─ 急诊插队联动通知
        ↓
AI智能问答 Chat
   ├─ ChatGPT 风格对话（文字 + 语音输入）
   ├─ 历史记录 / 收藏 / 分享家人
   └─ 规则约束：仅流程/注意事项/健康教育，禁止诊断治疗
        ↓
报告进度管理 Report
   ├─ 状态：检查完成 / 审核中 / 已生成
   ├─ 报告摘要 + AI解读 + 取报告地点时间
   └─ 接入 PACS 跳转完整报告
        ↓
辐射安全教育 Radiation（Dose Translation Engine）
   ├─ 按检查自动生成辐射解释
   ├─ 图标 + 动画 + 生活化比较（≈飞机X小时 / 约等于自然辐射X年）
   └─ 强调"医生评估必要性"，不制造恐慌
```

---

## 四、目录结构

```
ai-medical-imaging-assistant/
├── index.html                 # H5 入口
├── package.json
├── tsconfig.json
├── vite.config.ts
├── manifest.json              # 应用配置（含微信小程序 appid 占位）
├── pages.json                 # 页面路由 + tabBar + 全局样式
├── App.vue                    # 应用根 + 长辈模式全局样式
├── main.ts                    # 入口（Vue3 + Pinia）
├── api/
│   ├── index.ts               # ★ API 接口预留层（全部可替换点）
│   └── mockData.ts            # 模拟数据（Demo 直接运行）
├── components/                # 公共组件
│   ├── NavBar.vue             # 自定义导航栏
│   ├── ProgressSteps.vue      # 排队进度条
│   ├── TimelineSteps.vue      # 检查流程时间轴
│   ├── DoseCard.vue           # 辐射剂量可视化卡片
│   ├── ChatBubble.vue         # AI 聊天气泡
│   ├── ContraindicationCard.vue # 禁忌症警示
│   ├── ExamStatusCard.vue     # 当前检查状态卡
│   ├── UserAvatar.vue         # 头像（首字母兜底）
│   └── SideDrawer.vue         # 左侧抽屉导航
├── pages/
│   ├── login/        # 登录/绑定（微信登录 + 扫码绑定 + 家人代绑）
│   ├── index/        # 首页
│   ├── detail/       # 检查详情
│   ├── queue/        # 实时排队
│   ├── chat/         # AI 智能问答
│   ├── report/       # 报告管理
│   ├── radiation/    # 辐射安全教育
│   └── settings/     # 个人中心 + 长辈模式
├── store/
│   ├── user.ts       # 用户/检查/家庭 store
│   └── chat.ts       # AI 问答会话 store
├── types/
│   └── index.ts      # 全局类型定义
├── utils/
│   ├── index.ts      # 通用工具（时间/脱敏/状态映射）
│   └── nav.ts        # 页面导航 + 扫码绑定
└── styles/
    ├── variables.scss # 主题变量（蓝白医疗）
    └── global.scss    # 全局通用样式
```

---

## 五、运行说明

### 前置条件
- Node.js ≥ 18
- HBuilderX 或 CLI（推荐 CLI 便于类型检查）
- 微信开发者工具（运行到小程序时需）

### 安装依赖
```bash
cd ai-medical-imaging-assistant
npm install
```

### 运行到 H5（最快预览，推荐先看效果）
```bash
npm run dev:h5
# 浏览器打开 http://localhost:8080
```

### 运行到微信小程序
```bash
# 1. 填入 manifest.json 中的 appid
# 2. 编译产物到 dist/dev/mp-weixin
npm run dev:mp-weixin
# 3. 微信开发者工具 → 导入项目 → 选择 dist/dev/mp-weixin
```

### 构建生产包
```bash
npm run build:mp-weixin   # 小程序
npm run build:h5          # H5
```

> **Demo 默认走 mock 数据**，无需任何后端即可交互体验全部流程。

---

## 六、模拟数据与 API 预留

所有后端对接点集中在 **`api/index.ts`**，当前 `USE_MOCK = true` 返回模拟数据。后续接入只需替换函数体：

| 能力 | 预留函数 | 对接系统 |
| --- | --- | --- |
| 微信登录 | `wxLogin(code)` | 微信登录接口 |
| 获取手机号 | `getPhoneNumber()` | 微信加密数据 |
| 扫码绑定检查单 | `bindExamByBarcode()` | 医院 **HIS** |
| 我的检查列表 | `getMyExams()` | 医院 **HIS** |
| 检查流程/准备 | `getExamSteps()` / `getPreExamItems()` | 医院 **HIS** |
| 实时排队状态 | `getQueueStatus()` | **排队叫号系统** |
| 同室排队列表 | `getQueueList()` | **排队叫号系统** |
| 排队订阅通知 | `subscribeQueueNotify()` | 微信订阅消息 / WebSocket |
| 报告列表/详情 | `getReports()` / `getReportDetail()` | **PACS** |
| AI 问答 | `askAI(messages)` | **大语言模型 API** |
| 家庭成员 | `getFamilyMembers()` / `addFamilyMember()` | 医院 **HIS** |

`request()` 已封装统一请求骨架（含 Token、拦截器注释），接入真实后端时取消注释即可。

---

## 七、关键设计说明

### 1. 隐私保护（排队场景）
同检查室排队列表**仅展示序号与状态，绝不显示患者姓名**（见 `QueuePatient` 类型与 `queue.vue`）。

### 2. AI 回答规则约束
`askAI` 仅返回检查流程、注意事项、健康教育内容；回复尾部固定附**免责声明**（"不能替代医生诊断"）。聊天组件 `ChatBubble` 通过 `showWarning` 强制展示，从源头避免诊断/治疗建议。

### 3. 辐射教育（Dose Translation Engine）
- 用**生活化比较**替代裸数字（≈飞机X小时、≈自然辐射X年）
- MRI / 超声明确标注 **0 mSv · 非电离辐射**
- 每条都强调"医生评估必要性"，**不制造恐慌**

### 4. 适老化（长辈模式）
`settings` 一键开启：
- 字号放大、按钮放大、减少文字密度
- 全局 `.elder-mode` 类驱动样式
- 预留语音提示开关（接 `createInnerAudioContext`）

### 5. 组件化与可维护
状态、流程、UI 三层分离；`types/index.ts` 提供全量类型；`styles/variables.scss` 统一管理医疗主题色。

---

## 八、后续接入清单（Checklist）

- [ ] 替换 `manifest.json` 微信 `appid`
- [ ] 实现 `wxLogin` 真实 code → openid 换取
- [ ] 接入 HIS 检查单 / 排班 / 报告接口
- [ ] 接入 PACS 调阅完整影像报告
- [ ] 接入 LLM（建议流式输出，体验更佳）
- [ ] 接入排队叫号 WebSocket 实时推送
- [ ] 配置微信订阅消息模板（临近到号 / 报告生成）
- [ ] 补充 tabBar 图标资源（`static/icons/`，当前为纯文字 tab）
- [ ] 检查前准备补充真实图/动画/短视频资源

---

## 九、免责声明

本小程序为**患者健康教育与流程辅助工具**，所有内容不构成医疗诊断或治疗建议。具体医疗决策请遵从主治医师意见。
