<template>
  <div class="resume-template-wrapper">
    <component
      :is="currentTemplate"
      :value="resumeConfig"
      :theme="themeConfig"
      :locale="locale"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ResumeConfig, ThemeConfig, TemplateType } from '../types/resume';
import Template1 from './templates/Template1.vue';
import Template2 from './templates/Template2.vue';

interface Props {
  /** 简历配置数据 */
  value: ResumeConfig;
  /** 主题配置 */
  theme?: ThemeConfig;
  /** 模板类型 */
  template?: TemplateType;
  /** 语言 */
  locale?: string;
}

const props = withDefaults(defineProps<Props>(), {
  theme: () => ({
    color: '#2f5785',
    tagColor: '#2f5785',
  }),
  template: 'template1',
  locale: 'zh-CN',
});

const resumeConfig = computed(() => props.value);
const themeConfig = computed(() => props.theme);

const currentTemplate = computed(() => {
  switch (props.template) {
    case 'template2':
      return Template2;
    case 'template1':
    default:
      return Template1;
  }
});
</script>

<style scoped>
.resume-template-wrapper {
  width: 100%;
}
</style>
