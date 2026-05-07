# 小白云简历生成助手 - 鸿蒙三层架构设计

## 1. 架构设计

### 1.1 三层架构

| 层次 | 职责 | 目录 | 说明 |
|------|------|------|------|
| 表现层（UI层） | 用户界面展示和交互 | `src/ui/` | 包含Vue组件和页面 |
| 业务逻辑层（Service层） | 处理业务逻辑 | `src/services/` | 包含业务服务和API调用 |
| 数据访问层（Data层） | 数据存储和访问 | `src/data/` | 包含数据模型和存储操作 |

### 1.2 核心模块

| 模块 | 功能 | 实现文件 |
|------|------|----------|
| 简历管理 | 简历生成、编辑、导出 | `src/services/resumeService.js` |
| 智能对话 | 聊天交互、简历扩写 | `src/services/chatService.js` |
| 数据管理 | 个人资料、教育经历等管理 | `src/services/dataService.js` |
| 学校数据 | 学校、学院、专业数据 | `src/services/schoolService.js` |
| 本地存储 | 数据持久化 | `src/data/localStorage.js` |

## 2. 项目结构

```
iflowdeznt/
├── src/
│   ├── ui/                    # 表现层
│   │   ├── components/        # 组件
│   │   │   ├── Sidebar.vue
│   │   │   ├── ChatInterface.vue
│   │   │   ├── ResumeBuilder.vue
│   │   │   ├── NotesComponent.vue
│   │   │   └── SettingsComponent.vue
│   │   └── pages/             # 页面
│   │       ├── HomePage.vue
│   │       └── ResumePage.vue
│   ├── services/              # 业务逻辑层
│   │   ├── resumeService.js   # 简历相关服务
│   │   ├── chatService.js     # 聊天相关服务
│   │   ├── dataService.js     # 数据管理服务
│   │   └── schoolService.js   # 学校数据服务
│   ├── data/                  # 数据访问层
│   │   ├── localStorage.js    # 本地存储操作
│   │   ├── models/            # 数据模型
│   │   │   ├── Resume.js
│   │   │   ├── User.js
│   │   │   └── School.js
│   │   └── mock/              # 模拟数据
│   │       └── schoolData.js
│   ├── utils/                 # 工具函数
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── App.vue
│   ├── main.js
│   └── styles.css
├── backend/                   # 后端服务
│   ├── controllers/           # 控制器
│   │   ├── chatController.js
│   │   ├── resumeController.js
│   │   └── dataController.js
│   ├── services/              # 后端服务
│   │   ├── aiService.js
│   │   └── dataService.js
│   ├── models/                # 后端模型
│   │   └── schoolModel.js
│   ├── server.js
│   └── package.json
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 3. API接口设计

### 3.1 前端API

| API | 方法 | 功能 | 实现文件 |
|-----|------|------|----------|
| `saveImportData()` | 方法 | 保存导入数据 | `src/services/dataService.js` |
| `loadImportData()` | 方法 | 加载导入数据 | `src/services/dataService.js` |
| `resetImportData()` | 方法 | 重置导入数据 | `src/services/dataService.js` |
| `getSchools()` | 方法 | 获取学校列表 | `src/services/schoolService.js` |
| `getColleges()` | 方法 | 获取学院列表 | `src/services/schoolService.js` |
| `getMajors()` | 方法 | 获取专业列表 | `src/services/schoolService.js` |
| `generateResume()` | 方法 | 生成简历 | `src/services/resumeService.js` |
| `expandResume()` | 方法 | 扩写简历 | `src/services/chatService.js` |
| `sendMessage()` | 方法 | 发送消息 | `src/services/chatService.js` |

### 3.2 后端API

| API | 方法 | 路径 | 功能 |
|-----|------|------|------|
| 聊天接口 | POST | `/api/chat` | 智能对话 |
| 简历扩写接口 | POST | `/api/expand-resume` | 简历内容扩写 |
| 保存数据接口 | POST | `/api/import-data` | 保存导入数据 |
| 读取数据接口 | GET | `/api/import-data` | 读取导入数据 |
| 重置数据接口 | DELETE | `/api/import-data` | 重置导入数据 |
| 学校列表接口 | GET | `/api/schools` | 获取学校列表 |
| 学院列表接口 | GET | `/api/colleges` | 获取学院列表 |
| 专业列表接口 | GET | `/api/majors` | 获取专业列表 |
| 健康检查接口 | GET | `/api/health` | 服务健康检查 |

## 4. 技术实现要点

### 4.1 表现层
- 使用Vue 3 Composition API
- 响应式设计，适配移动端和桌面端
- 组件化开发，提高代码复用性

### 4.2 业务逻辑层
- 服务化设计，将业务逻辑与UI分离
- 统一的错误处理和日志记录
- 支持AI接口调用，实现智能功能

### 4.3 数据访问层
- 本地存储实现数据持久化
- 模拟数据支持离线使用
- 数据模型规范化，确保数据一致性

### 4.4 后端服务
- Express框架构建RESTful API
- 支持智谱AI和OpenAI接口
- 模块化设计，便于扩展和维护

## 5. 实现计划

1. 创建项目目录结构
2. 实现数据访问层（本地存储和模拟数据）
3. 实现业务逻辑层（各种服务）
4. 实现表现层（Vue组件）
5. 实现后端API接口
6. 集成前后端，测试功能
7. 优化和调试