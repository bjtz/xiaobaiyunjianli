<template>
  <div class="template4-resume resume-content">
    <!-- 头部信息 -->
    <div class="header">
      <div v-if="value.profile?.name" class="name">{{ value.profile.name }}</div>
      <div v-if="value.profile?.positionTitle" class="position">{{ value.profile.positionTitle }}</div>
      <div class="contact-info">
        <div v-if="value.profile?.mobile" class="contact-item">
          <span class="label">{{ t('电话') }}:</span>
          {{ value.profile.mobile }}
        </div>
        <div v-if="value.profile?.email" class="contact-item">
          <span class="label">{{ t('邮箱') }}:</span>
          {{ value.profile.email }}
        </div>
        <div v-if="value.profile?.workPlace" class="contact-item">
          <span class="label">{{ t('工作地点') }}:</span>
          {{ value.profile.workPlace }}
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="content">
      <!-- 教育背景 -->
      <section v-if="value.educationList?.length" class="section">
        <div class="section-header">
          <div class="section-title" :style="{ background: theme.color }">
            {{ t('教育背景') }}
          </div>
        </div>
        <div class="section-content">
          <div
            v-for="(edu, idx) in value.educationList"
            :key="idx"
            class="timeline-item"
          >
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="item-header">
                <b>{{ edu.school }}</b>
                <span class="time">{{ formatTimeRange(edu.edu_time) }}</span>
              </div>
              <div class="item-detail">
                <span v-if="edu.major">{{ edu.major }}</span>
                <span v-if="edu.academic_degree" class="degree">({{ edu.academic_degree }})</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 工作经历 -->
      <section v-if="value.workExpList?.length" class="section">
        <div class="section-header">
          <div class="section-title" :style="{ background: theme.color }">
            {{ t('工作经历') }}
          </div>
        </div>
        <div class="section-content">
          <div
            v-for="(work, idx) in value.workExpList"
            :key="idx"
            class="timeline-item"
          >
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="item-header">
                <b>{{ work.company_name }}</b>
                <span class="time">{{ formatTimeRange(work.work_time) }}</span>
              </div>
              <div v-if="work.department_name" class="department">{{ work.department_name }}</div>
              <div v-if="work.work_desc" class="work-desc">{{ work.work_desc }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 项目经历 -->
      <section v-if="value.projectList?.length" class="section">
        <div class="section-header">
          <div class="section-title" :style="{ background: theme.color }">
            {{ t('项目经历') }}
          </div>
        </div>
        <div class="section-content">
          <div
            v-for="(project, idx) in value.projectList"
            :key="idx"
            class="timeline-item"
          >
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="item-header">
                <b>{{ project.project_name }}</b>
                <span v-if="project.project_time" class="time">{{ project.project_time }}</span>
              </div>
              <div v-if="project.project_role" class="role">{{ project.project_role }}</div>
              <div v-if="project.project_desc" class="project-desc">{{ project.project_desc }}</div>
              <div v-if="project.project_content" class="project-content">{{ project.project_content }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 专业技能 -->
      <section v-if="value.skillList?.length" class="section">
        <div class="section-header">
          <div class="section-title" :style="{ background: theme.color }">
            {{ t('专业技能') }}
          </div>
        </div>
        <div class="section-content">
          <div class="skills-grid">
            <div v-for="(skill, idx) in value.skillList" :key="idx" class="skill-item">
              <div class="skill-name">{{ skill.skill_name }}</div>
              <div v-if="skill.skill_desc" class="skill-desc">{{ skill.skill_desc }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 自我介绍 -->
      <section v-if="value.aboutme?.aboutme_desc" class="section">
        <div class="section-header">
          <div class="section-title" :style="{ background: theme.color }">
            {{ t('自我介绍') }}
          </div>
        </div>
        <div class="section-content">
          <div class="aboutme-content">{{ value.aboutme.aboutme_desc }}</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ResumeConfig, ThemeConfig } from '../../types/resume';

interface Props {
  value: ResumeConfig;
  theme: ThemeConfig;
  locale?: string;
}

const props = withDefaults(defineProps<Props>(), {
  locale: 'zh-CN',
});

// 简单的国际化函数
const t = (key: string): string => {
  const translations: Record<string, Record<string, string>> = {
    'zh-CN': {
      '教育背景': '教育背景',
      '工作经历': '工作经历',
      '项目经历': '项目经历',
      '专业技能': '专业技能',
      '自我介绍': '自我介绍',
      '电话': '电话',
      '邮箱': '邮箱',
      '工作地点': '工作地点',
      '至今': '至今',
    },
    'en-US': {
      '教育背景': 'Education',
      '工作经历': 'Work Experience',
      '项目经历': 'Projects',
      '专业技能': 'Skills',
      '自我介绍': 'About Me',
      '电话': 'Phone',
      '邮箱': 'Email',
      '工作地点': 'Location',
      '至今': 'Present',
    },
  };
  return translations[props.locale]?.[key] || key;
};

// 格式化时间范围
const formatTimeRange = (time?: [string | undefined, string | number | null]): string => {
  if (!time || !Array.isArray(time)) return '';
  const [start, end] = time;
  const endText = end === null ? t('至今') : end;
  return start ? `${start} - ${endText}` : String(endText);
};
</script>

<style scoped>
.template4-resume {
  width: 794px;
  min-height: 942px;
  margin-bottom: 60px;
  padding: 40px;
  box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.15);
  background: #fff;
}

@media (max-width: 794px) {
  .template4-resume {
    width: 100%;
    padding: 20px;
  }
}

@media print {
  @page {
    size: A4;
  }
  .template4-resume {
    width: 100%;
    box-shadow: none;
  }
}

/* 头部信息 */
.header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.name {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}

.position {
  font-size: 18px;
  color: #666;
  margin-bottom: 16px;
}

.contact-info {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 14px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.contact-item .label {
  font-weight: bold;
  color: #333;
}

/* 主要内容 */
.content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 通用 section 样式 */
.section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  margin-bottom: 8px;
}

.section-title {
  color: white;
  padding: 8px 16px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 4px;
  display: inline-block;
}

.section-content {
  position: relative;
  padding-left: 24px;
}

/* 时间线样式 */
.section-content::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e0e0e0;
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
}

.timeline-dot {
  position: absolute;
  left: -24px;
  top: 6px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #e0e0e0;
  z-index: 1;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
}

.time {
  color: #666;
  font-size: 14px;
}

.item-detail {
  font-size: 14px;
  color: #333;
}

.degree {
  margin-left: 8px;
  color: #666;
}

/* 工作经历 */
.department {
  font-size: 14px;
  color: #666;
}

.work-desc {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

/* 项目经历 */
.role {
  font-size: 14px;
  color: #666;
}

.project-desc,
.project-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

/* 专业技能 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 4px;
}

.skill-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.skill-desc {
  font-size: 14px;
  color: #666;
}

/* 自我介绍 */
.aboutme-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  text-align: justify;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 4px;
}
</style>