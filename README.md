# NextVocab - 智能英语词汇学习平台

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0.0-38B2AC)
![Prisma](https://img.shields.io/badge/Prisma-5.0.0-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0.0-336791)

</div>

## 📖 项目简介

NextVocab 是一款现代化的英语词汇学习 Web 应用，采用 Next.js 15 构建，提供响应式设计，支持多端访问。通过智能学习计划和进度追踪，帮助用户高效记忆英语单词。

## ✨ 主要特性

- 🎯 **智能学习计划**：自定义每日学习目标，追踪学习进度
- 📱 **多端适配**：完美支持桌面端和移动端
- 🔄 **学习状态管理**：支持标记单词状态（未学/已背/熟悉）
- 📊 **数据可视化**：直观展示学习统计和进度
- 📤 **数据导入导出**：支持 CSV/JSON 格式的单词导入导出
- 📧 **邮件提醒**：定时发送复习提醒邮件
- 🔐 **安全认证**：支持邮箱密码和第三方 OAuth 登录

## 🛠️ 技术栈

- **前端框架**：Next.js 15 (App Router)
- **UI 组件**：Shadcn UI + Tailwind CSS
- **状态管理**：React Server Components
- **数据库**：PostgreSQL + Prisma ORM
- **认证**：Auth.js (NextAuth)
- **文件上传**：Uploadthing
- **邮件服务**：Resend
- **后台任务**：Inngest
- **安全防护**：Arcjet

## 🚀 快速开始

### 环境要求

- Node.js 18.0.0 或更高版本
- PostgreSQL 15.0 或更高版本
- pnpm 8.0.0 或更高版本

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/yourusername/next-vocab.git
cd next-vocab
```

2. 安装依赖
```bash
pnpm install
```

3. 配置环境变量
```bash
cp .env.example .env.local
```
编辑 `.env.local` 文件，填入必要的环境变量。

4. 初始化数据库
```bash
pnpm prisma generate
pnpm prisma db push
```

5. 启动开发服务器
```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📚 项目结构

```
next-vocab/
├── app/                # Next.js App Router 页面
├── components/         # React 组件
├── lib/               # 工具函数和配置
├── prisma/            # 数据库 schema 和迁移
├── public/            # 静态资源
└── styles/            # 全局样式
```

## 🔧 开发指南

### 数据库迁移

```bash
# 创建新的迁移
pnpm prisma migrate dev

# 应用迁移
pnpm prisma migrate deploy
```

### 代码规范

- 使用 ESLint 和 Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 使用 Conventional Commits 规范提交信息

## 📝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🤝 联系我们

- 项目维护者：[Your Name](https://github.com/yourusername)
- 邮箱：your.email@example.com

---

<div align="center">
Made with ❤️ by Your Team
</div>
