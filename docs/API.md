# API 接口说明

## 概述

本文档描述了小白云简历生成助手的主要功能接口和组件API。

## 目录

- [组件API](#组件api)
- [数据结构](#数据结构)
- [本地存储API](#本地存储api)
- [工具函数](#工具函数)

---

## 组件API

### App.vue

主应用组件，负责整体状态管理和视图切换。

#### Props

无

#### Methods

| 方法名 | 说明 | 参数 | 返回值 |
|--------|------|------|--------|
| `loadImportData()` | 从localStorage加载导入的数据 | 无 | `void` |
| `saveImportData()` | 保存导入的数据到localStorage | 无 | `void` |
| `resetImportForms()` | 重置导入表单 | 无 | `void` |
| `toggleSidebar()` | 切换侧边栏显示/隐藏 | 无 | `void` |
| `closeSidebar()` | 关闭侧边栏 | 无 | `void` |
| `openImportModal(type)` | 打开导入模态框 | `type: string` | `void` |
| `closeImportModal()` | 关闭导入模态框 | 无 | `void` |
| `getImportTitle(type)` | 获取导入类型的标题 | `type: string` | `string` |
| `handleNavigation(view)` | 处理导航切换 | `view: string` | `void` |
| `closeModule()` | 关闭当前模块 | 无 | `void` |
| `startChat()` | 开始聊天 | 无 | `void` |
| `sendMessage(text)` | 发送消息 | `text: string` | `void` |
| `getAgentResponse(message)` | 获取智能助手响应 | `message: string` | `string` |
| `expandResume(message)` | 扩写简历 | `message: string` | `string` |

#### Data

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `showSidebar` | `boolean` | 侧边栏是否显示 |
| `activeView` | `string` | 当前激活的视图 |
| `showImportModal` | `boolean` | 导入模态框是否显示 |
| `currentImportType` | `string` | 当前导入类型 |
| `importData` | `object` | 导入的数据 |
| `messages` | `array` | 聊天消息列表 |
| `showChatInterface` | `boolean` | 聊天界面是否显示 |

---

### Sidebar.vue

侧边栏组件，提供导航和导入功能。

#### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `show` | `boolean` | `false` | 是否显示侧边栏 |

#### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| `close` | 关闭侧边栏 | 无 |
| `navigate` | 导航切换 | `view: string` |
| `openImport` | 打开导入模态框 | `type: string` |

#### Methods

| 方法名 | 说明 | 参数 | 返回值 |
|--------|------|------|--------|
| `handleImport(type)` | 处理导入操作 | `type: string` | `void` |
| `handleNavigate(view)` | 处理导航操作 | `view: string` | `void` |

---

### ChatInterface.vue

聊天界面组件，提供智能对话功能。

#### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `messages` | `array` | `[]` | 消息列表 |
| `show` | `boolean` | `false` | 是否显示聊天界面 |

#### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| `send` | 发送消息 | `text: string` |
| `close` | 关闭聊天界面 | 无 |

#### Methods

| 方法名 | 说明 | 参数 | 返回值 |
|--------|------|------|--------|
| `scrollToBottom()` | 滚动到底部 | 无 | `void` |
| `sendMessage()` | 发送消息 | 无 | `void` |

---

### ResumeBuilder.vue

简历生成器组件，提供简历编辑和生成功能。

#### Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `locale` | `string` | `'zh-CN'` | 语言设置 |

#### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| `cancel` | 取消操作 | 无 |

#### Methods

| 方法名 | 说明 | 参数 | 返回值 |
|--------|------|------|--------|
| `loadImportedData()` | 从localStorage加载导入的数据 | 无 | `void` |
| `generateResume()` | 生成简历 | 无 | `void` |
| `addEducation()` | 添加教育经历 | 无 | `void` |
| `removeEducation(index)` | 删除教育经历 | `index: number` | `void` |
| `addWork()` | 添加工作经历 | 无 | `void` |
| `removeWork(index)` | 删除工作经历 | `index: number` | `void` |
| `addProject()` | 添加项目经历 | 无 | `void` |
| `removeProject(index)` | 删除项目经历 | `index: number` | `void` |
| `addSkill()` | 添加技能 | 无 | `void` |
| `removeSkill(index)` | 删除技能 | `index: number` | `void` |
| `copyResume()` | 复制简历 | 无 | `void` |
| `downloadResume()` | 下载TXT简历 | 无 | `void` |
| `downloadWordResume()` | 下载Word简历 | 无 | `void` |
| `downloadPDFResume()` | 下载PDF简历 | 无 | `void` |
| `generateResumeText()` | 生成简历文本 | 无 | `string` |
| `createWordDocument()` | 创建Word文档 | 无 | `Document` |
| `reset()` | 重置表单 | 无 | `void` |
| `cancel()` | 取消操作 | 无 | `void` |

---

## 数据结构

### importData

导入的数据结构

```javascript
{
  profile: {
    name: string,
    mobile: string,
    email: string,
    gender: string,
    birth: string,
    location: string,
    position: string,
    start_work: string,
    self_intro: string
  },
  educationList: [
    {
      edu_time: [string, string],
      school: string,
      college: string,
      major: string,
      academic_degree: string
    }
  ],
  workExpList: [
    {
      company_name: string,
      department_name: string,
      work_time: [string, string],
      work_desc: string
    }
  ],
  projectList: [
    {
      project_name: string,
      project_time: [string, string],
      project_desc: string,
      project_skills: string
    }
  ],
  skillList: [
    {
      skill_name: string,
      skill_level: number,
      skill_desc: string
    }
  ],
  websites: [string],
  accounts: [string],
  bookmarks: [string]
}
```

### Message

聊天消息结构

```javascript
{
  text: string,
  isUser: boolean,
  type: string
}
```

---

## 本地存储API

### localStorage Keys

| Key | 说明 | 数据类型 |
|-----|------|----------|
| `importData` | 导入的用户资料 | `object` |

### 使用示例

```javascript
// 保存数据
localStorage.setItem('importData', JSON.stringify(data));

// 读取数据
const data = JSON.parse(localStorage.getItem('importData'));

// 删除数据
localStorage.removeItem('importData');
```

---

## 工具函数

### 学校和专业数据

#### getColleges(school)

获取指定校区的学院列表

**参数：**
- `school` (string): 校区名称

**返回：**
- `array`: 学院名称数组

**示例：**
```javascript
const colleges = getColleges('广东白云学院（西校区）');
// 返回: ['电气与信息工程学院', '机械工程学院', ...]
```

#### getMajors(school, college)

获取指定校区和学院的专业列表

**参数：**
- `school` (string): 校区名称
- `college` (string): 学院名称

**返回：**
- `array`: 专业名称数组

**示例：**
```javascript
const majors = getMajors('广东白云学院（西校区）', '计算机科学与工程学院');
// 返回: ['计算机科学与技术', '软件工程', ...]
```

---

## 第三方库API

### docx

用于生成Word文档

**主要类：**
- `Document`: Word文档
- `Paragraph`: 段落
- `TextRun`: 文本运行
- `Packer`: 文档打包器

**使用示例：**
```javascript
import { Document, Packer, Paragraph, TextRun } from 'docx';

const doc = new Document({
  sections: [{
    children: [
      new Paragraph({
        children: [new TextRun('Hello World')]
      })
    ]
  }]
});

Packer.toBlob(doc).then(blob => {
  // 下载文档
});
```

### html2pdf.js

用于生成PDF文档

**使用示例：**
```javascript
import html2pdf from 'html2pdf.js';

const opt = {
  margin: 0,
  filename: 'document.pdf',
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2 },
  jsPDF: { unit: 'mm', format: 'a4' }
};

html2pdf().set(opt).from(element).save();
```
