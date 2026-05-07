# Vue 简历模板模块

从 React 简历生成器项目提取并适配 Vue 3 的简历模板模块。

## 功能特性

- 🎨 **多模板支持**: 内置 2 套精美简历模板
- 🎯 **主题配置**: 支持自定义主题颜色
- 🌍 **国际化**: 支持中英文切换
- 📱 **响应式**: 适配移动端和打印
- 🔧 **类型支持**: 完整的 TypeScript 类型定义

## 安装

将 `vue-resume-module` 文件夹复制到你的 Vue 项目中。

## 使用示例

### 基础用法

```vue
<template>
  <div class="resume-page">
    <ResumeTemplate
      :value="resumeData"
      :theme="theme"
      template="template1"
      locale="zh-CN"
    />
  </div>
</template>

<script setup lang="ts">
import { ResumeTemplate } from './vue-resume-module';
import type { ResumeConfig, ThemeConfig } from './vue-resume-module';

const resumeData: ResumeConfig = {
  profile: {
    name: '张三',
    mobile: '138****8888',
    email: 'zhangsan@example.com',
    github: 'https://github.com/zhangsan',
    workPlace: '北京',
    positionTitle: '前端工程师',
  },
  educationList: [
    {
      edu_time: ['2014.09', '2018.06'],
      school: '某某大学',
      major: '计算机科学与技术',
      academic_degree: '本科',
    },
  ],
  workExpList: [
    {
      company_name: '某某科技有限公司',
      department_name: '技术部',
      work_time: ['2018.07', null],
      work_desc: '负责公司核心产品的前端开发...',
    },
  ],
  projectList: [
    {
      project_name: '企业管理系统',
      project_role: '前端负责人',
      project_time: '2019.04 - 2020.06',
      project_desc: '面向企业内部的管理系统...',
      project_content: '1. 项目框架设计\n2. 组件库建设',
    },
  ],
  skillList: [
    {
      skill_name: 'Vue.js',
      skill_level: 90,
      skill_desc: '熟练使用 Vue 2/3',
    },
  ],
  aboutme: {
    aboutme_desc: '热爱前端开发，关注新技术...',
  },
};

const theme: ThemeConfig = {
  color: '#2f5785',
  tagColor: '#2f5785',
};
</script>
```

### 使用默认配置

```vue
<script setup lang="ts">
import { 
  ResumeTemplate, 
  defaultResumeConfig,
  defaultTheme 
} from './vue-resume-module';

// 基于默认配置修改
const resumeData = {
  ...defaultResumeConfig,
  profile: {
    ...defaultResumeConfig.profile,
    name: '李四',
    email: 'lisi@example.com',
  },
};
</script>
```

### 切换模板

```vue
<template>
  <div>
    <button @click="currentTemplate = 'template1'">模板1</button>
    <button @click="currentTemplate = 'template2'">模板2</button>
    
    <ResumeTemplate
      :value="resumeData"
      :theme="theme"
      :template="currentTemplate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ResumeTemplate, type TemplateType } from './vue-resume-module';

const currentTemplate = ref<TemplateType>('template1');
</script>
```

### 国际化

```vue
<template>
  <ResumeTemplate
    :value="resumeData"
    :theme="theme"
    template="template1"
    :locale="currentLocale"
  />
</template>

<script setup lang="ts">
import { ResumeTemplate } from './vue-resume-module';

const currentLocale = ref<'zh-CN' | 'en-US'>('zh-CN');
</script>
```

## API

### ResumeTemplate Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | ResumeConfig | 必填 | 简历数据配置 |
| theme | ThemeConfig | `{ color: '#2f5785', tagColor: '#2f5785' }` | 主题配置 |
| template | TemplateType | 'template1' | 模板类型 |
| locale | string | 'zh-CN' | 语言环境 |

### ResumeConfig 数据结构

```typescript
interface ResumeConfig {
  // 头像
  avatar?: {
    src?: string;
    shape?: 'circle' | 'square';
    size?: number;
    hidden?: boolean;
  };
  
  // 个人信息
  profile?: {
    name: string;
    mobile?: string;
    email?: string;
    github?: string;
    zhihu?: string;
    workExpYear?: string;
    workPlace?: string;
    positionTitle?: string;
  };
  
  // 教育背景
  educationList?: Array<{
    edu_time: [string, string | null];
    school: string;
    major?: string;
    academic_degree?: string;
  }>;
  
  // 工作经历
  workExpList?: Array<{
    company_name: string;
    department_name: string;
    work_time?: [string, string | null];
    work_desc: string;
  }>;
  
  // 项目经历
  projectList?: Array<{
    project_name: string;
    project_role: string;
    project_desc?: string;
    project_content?: string;
    project_time?: string;
  }>;
  
  // 技能列表
  skillList?: Array<{
    skill_name?: string;
    skill_level?: number; // 0-100
    skill_desc?: string;
  }>;
  
  // 奖项
  awardList?: Array<{
    award_info: string;
    award_time?: string;
  }>;
  
  // 作品
  workList?: Array<{
    work_name?: string;
    work_desc?: string;
    visit_link?: string;
  }>;
  
  // 自我介绍
  aboutme?: {
    aboutme_desc: string;
  };
  
  // 标题映射（自定义标题名称）
  titleNameMap?: {
    educationList?: string;
    workExpList?: string;
    projectList?: string;
    skillList?: string;
    awardList?: string;
    workList?: string;
    aboutme?: string;
  };
}
```

## 模板预览

### Template1
- 左右分栏布局
- 左侧：头像、个人信息、教育、技能、奖项
- 右侧：工作经历、项目经历

### Template2
- 上下布局
- 顶部：姓名、联系方式、头像
- 主体：左右分栏，左侧教育技能，右侧工作项目

## 打印样式

组件已内置打印样式，可直接调用浏览器打印功能：

```javascript
window.print();
```

## 注意事项

1. 本模块基于 Vue 3 + TypeScript 开发，需要 Vue 3 环境
2. 使用了 `<script setup>` 语法，需要开启相应配置
3. 样式使用 scoped CSS，不会污染全局样式
4. 打印样式已优化，支持 A4 纸张

## 文件结构

```
vue-resume-module/
├── components/
│   ├── ResumeTemplate.vue    # 主组件，模板选择器
│   ├── common/               # 公共组件
│   │   ├── StarRating.vue
│   │   ├── SectionHeader.vue
│   │   └── SectionTitle2.vue
│   └── templates/            # 模板组件
│       ├── Template1.vue
│       └── Template2.vue
├── config/
│   └── resume.config.ts      # 默认配置
├── types/
│   └── resume.ts             # 类型定义
├── index.ts                  # 入口文件
└── README.md                 # 说明文档
```

## 许可证

MIT
