# 小白云简历生成助手

一个基于 Vue 3 + Vite 构建的智能简历生成工具，为广东白云学院学生量身定制。

---

## 📋 项目简介

小白云简历生成助手是一个功能完整的智能简历生成平台，支持：
- ✨ 智能对话式简历生成
- 📄 多种简历模板选择
- 🌍 中英文双语支持
- 📥 多种格式导出（TXT、MD、Word、PDF）
- 📁 智能助手文件上传与MD转Word
- 📱 完美的响应式设计

---

## 🚀 功能特性

### 核心功能

1. **智能对话助手**
   - AI驱动的智能对话
   - 简历内容智能扩写
   - 基于导入资料的自动简历生成
   - 支持文件上传（.md、.txt）

2. **简历生成器**
   - 多种精美模板
   - 中英文一键切换
   - 所见即所得编辑
   - 实时预览

3. **资料导入模块**
   - 个人信息管理
   - 教育经历导入（广东白云学院专属）
   - 工作经验导入
   - 项目经历导入
   - 专业技能导入
   - 网站、账号、收藏夹管理

4. **多格式导出**
   - 📝 TXT 文本格式
   - 📄 Markdown 格式
   - 📋 Word 文档（.docx）
   - 📄 PDF 格式
   - 🎯 MD 直接转 Word

5. **其他功能**
   - 笔记功能
   - 设置面板
   - 本地存储（localStorage）
   - 响应式设计（完美适配手机/平板/电脑）

---

## 🛠️ 技术栈

### 前端框架
- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 新一代前端构建工具

### 核心库
- **docx** - Word 文档生成
- **html2pdf.js** - HTML 转 PDF
- **markdown-it** - Markdown 解析

### 开发工具
- **TypeScript** - 类型安全
- **ES Modules** - 模块化开发

### 后端
- **Node.js + Express** - 后端代理服务器
- **智谱AI API** - 智能对话支持

---

## 📦 安装与运行

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

项目将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 启动后端服务（如需AI功能）

```bash
cd backend
npm install
node server.js
```

后端服务将在 `http://localhost:3001` 启动。

---

## 📁 项目结构

```
iflowdeznt/
├── src/
│   ├── components/
│   │   ├── resume/              # 简历相关组件
│   │   │   ├── common/         # 通用组件
│   │   │   ├── templates/      # 简历模板
│   │   │   └── ResumeTemplate.vue
│   │   ├── ChatInterface.vue   # 聊天界面
│   │   ├── ResumeBuilder.vue   # 简历生成器
│   │   ├── Sidebar.vue         # 侧边栏
│   │   ├── NotesComponent.vue  # 笔记组件
│   │   └── SettingsComponent.vue # 设置组件
│   ├── config/
│   │   └── resume.config.ts    # 简历配置
│   ├── types/
│   │   └── resume.ts           # TypeScript 类型定义
│   ├── App.vue                 # 主应用组件
│   ├── main.js                 # 应用入口
│   └── styles.css              # 全局样式
├── backend/
│   ├── server.js               # Express 后端服务器
│   ├── package.json
│   └── package-lock.json
├── docs/
│   ├── API.md                  # API 接口文档
│   ├── DEPLOY.md              # 部署说明文档
│   └── CHANGELOG.md           # 更新日志
├── index.html
├── vite.config.js
├── package.json
├── .env                        # 环境变量（需自行创建）
├── .env.example               # 环境变量示例
├── AI_SETUP.md                # AI 配置说明
└── README.md                  # 本文件
```

---

## 🎯 快速开始

### 1. 配置环境变量

复制 `.env.example` 为 `.env` 并填入你的配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 智谱AI API密钥
ZHIPU_API_KEY=your_api_key_here

# 后端端口
PORT=3001
```

### 2. 启动项目

```bash
# 终端1 - 启动前端
npm run dev

# 终端2 - 启动后端（如需AI功能）
cd backend
node server.js
```

### 3. 开始使用

1. 打开浏览器访问 `http://localhost:5173`
2. 点击左侧"导入资料"填写个人信息
3. 点击"开始对话"与智能助手交流
4. 或直接进入"简历生成器"手动编辑
5. 选择模板、切换语言、下载简历

---

## 📚 使用指南

### 智能助手使用

1. **导入资料** - 先在左侧导入个人信息、教育经历等
2. **开始对话** - 点击欢迎页面的"开始对话"按钮
3. **生成简历** - 告诉助手"请帮我生成一份简历"
4. **扩写内容** - 说"帮我扩写一下简历"
5. **上传文件** - 点击📎图标上传 .md 文件
6. **转换格式** - 上传后点击"转换为Word"按钮

### 简历生成器使用

1. **填写信息** - 在表单中填写或编辑个人资料
2. **选择模板** - 在"简历模板"下拉框中选择喜欢的样式
3. **切换语言** - 在"语言"下拉框中选择中文或英文
4. **生成预览** - 点击"生成简历"按钮查看效果
5. **下载导出** - 选择需要的格式下载

---

## 🔧 配置说明

### AI 配置

详细的 AI 配置说明请参考 [AI_SETUP.md](./AI_SETUP.md)。

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| ZHIPU_API_KEY | 智谱AI API密钥 | - |
| PORT | 后端服务端口 | 3001 |

---

## 📖 文档

- [API 接口文档](./docs/API.md) - 后端 API 接口说明
- [大模型接口文档](./docs/LLM_API_INTERFACE.md) - LLM 接口、请求示例与调用链路
- [部署说明](./docs/DEPLOY.md) - 项目部署指南
- [更新日志](./docs/CHANGELOG.md) - 版本变更记录
- [AI 配置](./AI_SETUP.md) - 智能助手配置
- [智能体介绍](./智能体介绍文档.md) - 智能体详细说明

---

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 🙏 致谢

- Vue.js 团队
- Vite 团队
- 智谱AI
- 所有贡献者

---

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件
- 项目主页

---

**Made with ❤️ for 广东白云学院**

