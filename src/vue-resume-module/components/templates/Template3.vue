<template>
  <div class="template3-resume resume-content">
    <!-- 头部信息 -->
    <div class="header">
      <div v-if="value.profile?.name" class="name">{{ value.profile.name }}</div>
      <div v-if="value.profile?.positionTitle" class="position">{{ value.profile.positionTitle }}</div>
      <div class="contact-info">
        <div v-if="value.profile?.mobile" class="contact-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="icon" viewBox="0 0 16 16">
            <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
          </svg>
          {{ value.profile.mobile }}
        </div>
        <div v-if="value.profile?.email" class="contact-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="icon" viewBox="0 0 16 16">
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
          </svg>
          {{ value.profile.email }}
        </div>
        <div v-if="value.profile?.workPlace" class="contact-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="icon" viewBox="0 0 16 16">
            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
          </svg>
          {{ value.profile.workPlace }}
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="content">
      <!-- 教育背景 -->
      <section v-if="value.educationList?.length" class="section">
        <h2 class="section-title" :style="{ color: theme.color }">
          {{ t('教育背景') }}
        </h2>
        <div class="section-content">
          <div
            v-for="(edu, idx) in value.educationList"
            :key="idx"
            class="education-item"
          >
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
      </section>

      <!-- 工作经历 -->
      <section v-if="value.workExpList?.length" class="section">
        <h2 class="section-title" :style="{ color: theme.color }">
          {{ t('工作经历') }}
        </h2>
        <div class="section-content">
          <div
            v-for="(work, idx) in value.workExpList"
            :key="idx"
            class="work-item"
          >
            <div class="item-header">
              <b>{{ work.company_name }}</b>
              <span class="time">{{ formatTimeRange(work.work_time) }}</span>
            </div>
            <div v-if="work.department_name" class="department">{{ work.department_name }}</div>
            <div v-if="work.work_desc" class="work-desc">{{ work.work_desc }}</div>
          </div>
        </div>
      </section>

      <!-- 项目经历 -->
      <section v-if="value.projectList?.length" class="section">
        <h2 class="section-title" :style="{ color: theme.color }">
          {{ t('项目经历') }}
        </h2>
        <div class="section-content">
          <div
            v-for="(project, idx) in value.projectList"
            :key="idx"
            class="project-item"
          >
            <div class="item-header">
              <b>{{ project.project_name }}</b>
              <span v-if="project.project_time" class="time">{{ project.project_time }}</span>
            </div>
            <div v-if="project.project_role" class="role">{{ project.project_role }}</div>
            <div v-if="project.project_desc" class="project-desc">{{ project.project_desc }}</div>
            <div v-if="project.project_content" class="project-content">{{ project.project_content }}</div>
          </div>
        </div>
      </section>

      <!-- 专业技能 -->
      <section v-if="value.skillList?.length" class="section">
        <h2 class="section-title" :style="{ color: theme.color }">
          {{ t('专业技能') }}
        </h2>
        <div class="section-content">
          <div v-for="(skill, idx) in value.skillList" :key="idx" class="skill-item">
            <div class="skill-name">{{ skill.skill_name }}</div>
            <div v-if="skill.skill_desc" class="skill-desc">{{ skill.skill_desc }}</div>
          </div>
        </div>
      </section>

      <!-- 自我介绍 -->
      <section v-if="value.aboutme?.aboutme_desc" class="section">
        <h2 class="section-title" :style="{ color: theme.color }">
          {{ t('自我介绍') }}
        </h2>
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
      '至今': '至今',
    },
    'en-US': {
      '教育背景': 'Education',
      '工作经历': 'Work Experience',
      '项目经历': 'Projects',
      '专业技能': 'Skills',
      '自我介绍': 'About Me',
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
.template3-resume {
  width: 794px;
  min-height: 942px;
  margin-bottom: 60px;
  padding: 40px;
  box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.15);
  background: #fff;
}

@media (max-width: 794px) {
  .template3-resume {
    width: 100%;
    padding: 20px;
  }
}

@media print {
  @page {
    size: A4;
  }
  .template3-resume {
    width: 100%;
    box-shadow: none;
  }
}

/* 头部信息 */
.header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.name {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
}

.position {
  font-size: 16px;
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

.contact-item .icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
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
  gap: 12px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 8px;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 教育背景 */
.education-item {
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
.work-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

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
.project-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

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
.skill-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
}
</style>