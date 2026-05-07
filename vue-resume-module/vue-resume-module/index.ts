/**
 * Vue 简历模板模块
 * 从 React 项目提取并适配 Vue 3
 */

// 类型导出
export * from './types/resume';

// 配置导出
export {
  defaultResumeConfig,
  defaultTheme,
  getDefaultTitleNameMap,
  validateResumeConfig,
} from './config/resume.config';

// 组件导出
export { default as ResumeTemplate } from './components/ResumeTemplate.vue';
export { default as Template1 } from './components/templates/Template1.vue';
export { default as Template2 } from './components/templates/Template2.vue';
export { default as StarRating } from './components/common/StarRating.vue';
export { default as SectionHeader } from './components/common/SectionHeader.vue';
export { default as SectionTitle2 } from './components/common/SectionTitle2.vue';
