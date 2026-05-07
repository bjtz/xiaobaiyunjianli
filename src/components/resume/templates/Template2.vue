<template>
  <div class="template2-resume resume-content">
    <!-- 头部信息 -->
    <div class="header-info">
      <div class="profile-section">
        <div class="profile-main">
          <h1 v-if="value.profile?.name" class="name">{{ value.profile.name }}</h1>
          <div class="profile-list">
            <span v-if="value.profile?.mobile" class="profile-item">
              <span class="icon" :style="{ color: theme.color }">📱</span>
              {{ value.profile.mobile }}
            </span>
            <span v-if="value.profile?.email" class="profile-item">
              <span class="icon" :style="{ color: theme.color }">✉️</span>
              {{ value.profile.email }}
            </span>
            <span v-if="value.profile?.github" class="profile-item">
              <span class="icon" :style="{ color: theme.color }">🐙</span>
              <a :href="value.profile.github" target="_blank">GitHub</a>
            </span>
            <span v-if="value.profile?.workPlace" class="profile-item">
              <span class="icon" :style="{ color: theme.color }">📍</span>
              {{ value.profile.workPlace }}
            </span>
            <span v-if="value.profile?.positionTitle" class="profile-item">
              <span class="icon" :style="{ color: theme.color }">🎯</span>
              {{ value.profile.positionTitle }}
            </span>
          </div>
        </div>
        <div v-if="!value.avatar?.hidden" class="avatar-wrapper">
          <img
            v-if="value.avatar?.src"
            :src="value.avatar.src"
            class="avatar"
            alt="avatar"
          />
          <div v-else class="avatar avatar-placeholder">
            {{ value.profile?.name?.charAt(0) || '?' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="body-content">
      <!-- 左侧 -->
      <div class="left-column">
        <!-- 教育背景 -->
        <section v-if="value.educationList?.length" class="section">
          <SectionTitle2 :title="titleNameMap.educationList || t('教育背景')" :color="theme.color" />
          <div class="section-body">
            <div
              v-for="(edu, idx) in value.educationList"
              :key="idx"
              class="education-item"
            >
              <div class="item-title">
                <b>{{ edu.school }}</b>
                <span class="time">{{ formatTimeRange(edu.edu_time) }}</span>
              </div>
              <div class="item-subtitle">
                {{ edu.major }}
                <span v-if="edu.academic_degree">({{ edu.academic_degree }})</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 专业技能 -->
        <section v-if="value.skillList?.length" class="section">
          <SectionTitle2 :title="titleNameMap.skillList || t('专业技能')" :color="theme.color" />
          <div class="section-body">
            <div v-for="(skill, idx) in value.skillList" :key="idx" class="skill-item">
              <div class="skill-name">{{ skill.skill_name }}</div>
              <StarRating :value="(skill.skill_level || 0) / 20" />
            </div>
          </div>
        </section>

        <!-- 更多信息 -->
        <section v-if="value.awardList?.length" class="section">
          <SectionTitle2 :title="titleNameMap.awardList || t('更多信息')" :color="theme.color" />
          <div class="section-body">
            <div v-for="(award, idx) in value.awardList" :key="idx" class="award-item">
              <span class="icon">🏅</span>
              {{ award.award_info }}
              <span v-if="award.award_time" class="time">({{ award.award_time }})</span>
            </div>
          </div>
        </section>
      </div>

      <!-- 右侧 -->
      <div class="right-column">
        <!-- 工作经历 -->
        <section v-if="value.workExpList?.length" class="section">
          <SectionTitle2 :title="titleNameMap.workExpList || t('工作经历')" :color="theme.color" />
          <div class="section-body">
            <div
              v-for="(work, idx) in value.workExpList"
              :key="idx"
              class="work-item"
            >
              <div class="item-header">
                <b class="company">{{ work.company_name }}</b>
                <span class="time">{{ formatTimeRange(work.work_time) }}</span>
              </div>
              <div v-if="work.department_name" class="department">{{ work.department_name }}</div>
              <div class="work-desc">{{ work.work_desc }}</div>
            </div>
          </div>
        </section>

        <!-- 项目经历 -->
        <section v-if="value.projectList?.length" class="section">
          <SectionTitle2 :title="titleNameMap.projectList || t('项目经历')" :color="theme.color" />
          <div class="section-body">
            <div
              v-for="(project, idx) in value.projectList"
              :key="idx"
              class="project-item"
            >
              <div class="item-header">
                <b class="project-name">{{ project.project_name }}</b>
                <span v-if="project.project_role" class="role-tag" :style="{ background: theme.tagColor }">
                  {{ project.project_role }}
                </span>
              </div>
              <div v-if="project.project_time" class="project-time">{{ project.project_time }}</div>
              <div v-if="project.project_desc" class="project-desc">
                <b>{{ t('项目描述') }}：</b>{{ project.project_desc }}
              </div>
              <div v-if="project.project_content" class="project-content">
                <b>{{ t('主要工作') }}：</b>
                <span class="pre-wrap">{{ project.project_content }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 自我介绍 -->
        <section v-if="aboutmeList.length" class="section">
          <SectionTitle2 :title="titleNameMap.aboutme || t('自我介绍')" :color="theme.color" />
          <div class="section-body">
            <p v-for="(line, idx) in aboutmeList" :key="idx" class="aboutme-line">
              {{ line }}
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ResumeConfig, ThemeConfig } from '../../../types/resume';
import { getDefaultTitleNameMap } from "../../../config/resume.config";
import StarRating from '../common/StarRating.vue';
import SectionTitle2 from '../common/SectionTitle2.vue';

interface Props {
  value: ResumeConfig;
  theme: ThemeConfig;
  locale?: string;
}

const props = withDefaults(defineProps<Props>(), {
  locale: 'zh-CN',
});

const titleNameMap = computed(() => {
  return {
    ...getDefaultTitleNameMap(props.locale),
    ...props.value.titleNameMap,
  };
});

const aboutmeList = computed(() => {
  const desc = props.value.aboutme?.aboutme_desc || '';
  return desc.split('\n').filter(line => line.trim());
});

const t = (key: string): string => {
  const translations: Record<string, Record<string, string>> = {
    'zh-CN': {
      '教育背景': '教育背景',
      '专业技能': '专业技能',
      '更多信息': '更多信息',
      '工作经历': '工作经历',
      '项目经历': '项目经历',
      '自我介绍': '自我介绍',
      '项目描述': '项目描述',
      '主要工作': '主要工作',
      '至今': '至今',
    },
    'en-US': {
      '教育背景': 'Education',
      '专业技能': 'Skills',
      '更多信息': 'Awards',
      '工作经历': 'Work Experience',
      '项目经历': 'Projects',
      '自我介绍': 'About Me',
      '项目描述': 'Description',
      '主要工作': 'Responsibilities',
      '至今': 'Present',
    },
  };
  return translations[props.locale]?.[key] || key;
};

const formatTimeRange = (time?: [string | undefined, string | number | null]): string => {
  if (!time || !Array.isArray(time)) return '';
  const [start, end] = time;
  const endText = end === null ? t('至今') : end;
  return start ? `${start} ~ ${endText}` : String(endText);
};
</script>

<style scoped>
.template2-resume {
  width: 794px;
  min-height: 942px;
  margin-bottom: 60px;
  box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.15);
  background: #fff;
  padding: 40px;
}

@media (max-width: 794px) {
  .template2-resume {
    width: 100%;
    padding: 20px;
  }
}

@media print {
  @page {
    size: A4;
  }
  .template2-resume {
    width: 100%;
    box-shadow: none;
  }
}

/* 头部信息 */
.header-info {
  border-bottom: 2px solid v-bind('theme.color');
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.profile-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-main {
  flex: 1;
}

.name {
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 15px 0;
  color: #333;
}

.profile-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 20px;
}

.profile-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.profile-item .icon {
  margin-right: 6px;
}

.profile-item a {
  color: inherit;
  text-decoration: none;
}

.profile-item a:hover {
  text-decoration: underline;
}

.avatar-wrapper {
  margin-left: 30px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid v-bind('theme.color');
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e0e0e0;
  color: #666;
  font-size: 40px;
  font-weight: bold;
}

/* 主体内容 */
.body-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
}

@media (max-width: 794px) {
  .body-content {
    grid-template-columns: 1fr;
  }
}

.section {
  margin-bottom: 25px;
}

.section-body {
  padding-top: 10px;
}

/* 教育背景 */
.education-item {
  margin-bottom: 12px;
}

.item-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.item-title b {
  font-size: 16px;
  color: #333;
}

.time {
  color: #999;
  font-size: 13px;
}

.item-subtitle {
  color: #666;
  font-size: 14px;
}

/* 技能 */
.skill-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.skill-name {
  font-size: 14px;
  color: #333;
}

/* 奖项 */
.award-item {
  margin-bottom: 6px;
  font-size: 14px;
  color: #333;
}

.award-item .icon {
  margin-right: 6px;
}

/* 工作经历 */
.work-item {
  margin-bottom: 20px;
}

.work-item .item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.company {
  font-size: 16px;
  color: #333;
}

.department {
  color: #666;
  font-size: 14px;
  margin-bottom: 6px;
}

.work-desc {
  color: #555;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

/* 项目经历 */
.project-item {
  margin-bottom: 20px;
}

.project-item .item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.project-name {
  font-size: 16px;
  color: #333;
}

.role-tag {
  color: #fff;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.project-time {
  color: #999;
  font-size: 13px;
  margin-bottom: 6px;
}

.project-desc,
.project-content {
  color: #555;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 6px;
}

.pre-wrap {
  white-space: pre-wrap;
}

/* 自我介绍 */
.aboutme-line {
  margin: 0 0 8px 0;
  color: #555;
  font-size: 14px;
  line-height: 1.6;
}
</style>
