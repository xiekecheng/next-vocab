**词汇背诵网站需求文档**

---

## 一、项目概述

1. **项目名称**：NextVocab
2. **项目简介**：一款响应式的英语单词背诵 Web 应用，支持手机端与 PC 端，提供登录与用户单词学习记录功能，并可标记已背或已熟悉的单词。
3. **目标用户**：英语学习者、学生、备考人群。
4. **核心功能**：单词浏览、学习进度跟踪、单词标记、数据导入/导出、邮件通知等。

---

## 二、功能需求

### 2.1 用户管理

* **注册 / 登录 / 注销**：支持邮箱/密码注册、第三方 OAuth（Google/GitHub）。
* **用户个人中心**：查看个人资料、修改密码、查看学习进度。

### 2.2 单词库管理

* **单词列表展示**：按频次排序或分组页面。
* **单词详情页**：显示单词拼写、音标、释义、例句、相关图片（可选）。
* **学习状态标记**：标记“未学”、“已背”、“熟悉”。
* **搜索 & 筛选**：按关键词、频次区间、学习状态筛选。
* **批量导入**：CSV/JSON 文件上传导入单词。
* **批量导出**：导出选中单词或整个列表。

### 2.3 学习任务与计划

* **自定义学习计划**：设置每日目标、单词数量。
* **复习提醒**：定时推送或邮件通知复习任务（使用 Inngest 定时任务 + Resend 邮件）。
* **学习统计**：展示每日/周/月学习数量、进度曲线。

### 2.4 后台任务

* **定时任务**：发送复习邮件、清理过期数据、数据备份。
* **错误日志与告警**：自动捕获接口错误并通知运维。

---

## 三、技术架构与栈选型

| 层级         | 技术栈                              | 说明                       |
| ---------- | -------------------------------- | ------------------------ |
| 前端         | Next.js, Tailwind CSS, Shadcn/UI | SSR/SPA 混合，响应式布局，骨架屏     |
| 图标         | SVGL                             | 矢量图标库                    |
| 文件上传       | Uploadthing                      | 图片或单词导入文件上传              |
| 鉴权         | Auth.js                          | JWT / Session 认证         |
| 接口安全       | Arcjet                           | 请求保护、速率限制                |
| 后端（Server） | Next.js API Routes / App Router  | 轻量微服务                    |
| ORM & 数据库  | Prisma + Neon (PostgreSQL)       | 对象关系映射，线上数据库（Serverless） |
| 后台任务       | Inngest                          | 事件驱动 & 定时任务              |
| 邮件服务       | Resend                           | 发信与邮件模板管理                |
| 部署         | Vercel / Neon                    | 前后端一体部署及数据库托管            |

---

## 四、前端规划

### 4.1 页面总览

整个应用保持统一的 App Shell（顶部导航 + 侧边栏/底部导航），支持移动端抽屉式菜单与 PC 端侧边栏。页面切换使用 Framer Motion 动画，加载时展示 Shadcn Skeleton 骨架屏。

### 4.2 主要页面与功能

#### 4.2.1 登录 / 注册页

* **路径**：`/auth/login`, `/auth/signup`
* **功能**：

  * 邮箱 + 密码 登录／注册表单
  * OAuth 按钮（Google/GitHub）
  * 表单验证：邮箱格式、密码强度、重复校验
  * 忘记密码链接，跳转找回页／弹出模态框

#### 4.2.2 首页（单词列表）

* **路径**：`/words`
* **功能**：

  * 单词卡片网格／列表视图切换
  * 支持分页游览、无限滚动或“加载更多”
  * 关键字段：单词、音标、释义摘要、学习状态标记
  * 搜索栏：实时联想关键词搜索
  * 筛选面板：按频次区间、学习状态、新增日期等多维过滤
  * 批量操作：全选、标记“已背”／“熟悉”／“重置”

#### 4.2.3 单词详情页

* **路径**：`/words/[id]`
* **功能**：

  * 单词完整信息：拼写、音标、详细释义、例句列表、相关图片（可选）
  * 发音按钮（播放音频）
  * 学习状态切换：NEW → LEARNED → FAMILIAR
  * 上一/下一单词导航
  * 添加笔记/标签/自定义解释

#### 4.2.4 我的学习计划

* **路径**：`/plan`
* **功能**：

  * 当前计划概览：每日目标单词数、完成进度条
  * 快速开始练习：随机抽取当天计划内单词进入记忆模式（闪卡/测试）
  * 练习模式切换：选择“拼写测试”／“听写”／“单词连连看”
  * 计划管理：修改目标、重置进度

#### 4.2.5 学习统计（我的统计）

* **路径**：`/stats`
* **功能**：

  * 折线图：每日/每周/每月学习曲线
  * 饼图或柱状图：不同状态单词占比（新学/已背/熟悉）
  * 完成率、连胜天数、累计学习总数等关键指标
  * 导出统计报告（PDF/CSV）

#### 4.2.6 导入 / 导出页面

* **路径**：`/data`
* **功能**：

  * 文件上传：CSV/JSON 格式导入（示例模板下载）
  * 映射字段校验、预览导入数据
  * 导入进度提示与结果报告
  * 导出选中或全部单词：CSV/JSON 下载

#### 4.2.7 个人中心

* **路径**：`/profile`
* **功能**：

  * 查看/编辑个人信息：昵称、头像、邮箱
  * 修改密码
  * 第三方授权管理（解绑／重绑）
  * 安全设置：登出所有设备、Session 管理

---

## 五、后端规划

1. **接口设计**：

   * `POST   /api/auth/signup`              : 用户注册

   * `POST   /api/auth/login`               : 用户登录，返回 Token / Session

   * `POST   /api/auth/logout`              : 用户登出，销毁 Session

   * `POST   /api/auth/password/forgot`     : 发起重置密码邮件

   * `POST   /api/auth/password/reset`      : 重置密码

   * `GET    /api/auth/oauth/:provider`     : 第三方 OAuth 登录跳转 URL

   * `GET    /api/auth/oauth/:provider/callback`: 第三方 OAuth 回调

   * `GET    /api/words`                    : 获取单词列表（支持分页、筛选、排序）

   * `GET    /api/words/search`             : 单独的搜索接口，按关键词快速返回建议列表

   * `GET    /api/words/:id`                : 获取单词详情

   * `POST   /api/words/import`             : 上传并导入单词文件（CSV/JSON），返回导入任务 ID

   * `GET    /api/words/import/:taskId`     : 查询导入任务状态与结果

   * `GET    /api/words/export`             : 导出单词列表或筛选结果（CSV/JSON）

   * `GET    /api/user/words`               : 获取当前用户的单词状态列表

   * `PATCH  /api/user/words/:wordId`       : 更新单个单词学习状态或笔记

   * `PATCH  /api/user/words/batch`         : 批量更新学习状态（已背/熟悉/重置）

   * `GET    /api/user/plan`                : 获取用户当前学习计划

   * `POST   /api/user/plan`                : 创建/更新学习计划

   * `POST   /api/user/plan/reset`          : 重置学习计划进度

   * `GET    /api/user/stats`               : 获取学习统计（折线、占比、关键指标）

   * `GET    /api/user/stats/export`        : 导出统计报告（PDF/CSV）

2. **安全与中间件**： **安全与中间件**：

   * Arcjet：全局中间件，防暴力请求、CSRF 防护
   * Auth.js：鉴权中间件

3. **后台任务**：

   * 使用 Inngest 定时触发 `sendReviewEmails` 函数
   * 定期清理数据、生成统计报告

---

## 六、数据库结构设计

```prisma
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  name          String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  words         UserWord[]
  sessions      Session[]
}

model Word {
  id        String   @id @default(uuid())
  text      String   @unique
  phonetic  String?
  meaning   String
  examples  String[]
  frequency Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  users     UserWord[]
}

model UserWord {
  id        String   @id @default(uuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  word      Word     @relation(fields: [wordId], references: [id])
  wordId    String
  status    LearningStatus @default(NEW)
  updatedAt DateTime       @updatedAt
  createdAt DateTime       @default(now())

  @@unique([userId, wordId])
}

enum LearningStatus {
  NEW       // 未学
  LEARNED   // 已背
  FAMILIAR  // 熟悉
}

model Session {
  id        String   @id @default(uuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  expires   DateTime
  createdAt DateTime @default(now())
}
```

---

## 七、CI/CD 及部署

1. 集成测试：GitHub Actions，覆盖关键 API & 前端渲染
2. 部署流程：Push 到 main 分支 -> Vercel 自动构建并上线
3. 数据库迁移：Prisma Migrate

---

## 八、后续扩展

* 移动端原生 App（React Native）
* 社交功能：分享单词本、好友对战背词
* AI 测验：智能判题、口语识别
