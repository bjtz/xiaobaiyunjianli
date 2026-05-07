<template>
  <div class="template1-resume resume-content">
    <!-- 左侧基础信息 -->
    <div class="basic-info">
      <!-- 头像 -->
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

      <!-- 个人信息 -->
      <div class="profile">
        <div v-if="value.profile?.name" class="name">{{ value.profile.name }}</div>
        <div class="profile-list">
          <div v-if="value.profile?.mobile" class="profile-item">
            <span class="icon" :style="{ color: theme.color }">📱</span>
            {{ value.profile.mobile }}
          </div>
          <div v-if="value.profile?.email" class="profile-item">
            <span class="icon" :style="{ color: theme.color }">✉️</span>
            {{ value.profile.email }}
          </div>
          <div v-if="value.profile?.github" class="profile-item">
            <span class="icon" :style="{ color: theme.color }">🐙</span>
            <a :href="value.profile.github" target="_blank">{{ value.profile.github }}</a>
          </div>
          <div v-if="value.profile?.zhihu" class="profile-item">
            <span class="icon" :style="{ color: theme.color }">📖</span>
            <a :href="value.profile.zhihu" target="_blank">{{ value.profile.zhihu }}</a>
          </div>
          <div v-if="value.profile?.workExpYear" class="profile-item">
            <span class="icon" :style="{ color: theme.color }">💼</span>
            <span>{{ t('工作经验') }}: {{ value.profile.workExpYear }}</span>
          </div>
          <div v-if="value.profile?.workPlace" class="profile-item">
            <span class="icon" :style="{ color: theme.color }">📍</span>
            <span>{{ t('期望工作地') }}: {{ value.profile.workPlace }}</span>
          </div>
          <div v-if="value.profile?.positionTitle" class="profile-item">
            <span class="icon" :style="{ color: theme.color }">🎯</span>
            <span>{{ t('职位') }}: {{ value.profile.positionTitle }}</span>
          </div>
        </div>
      </div>

      <!-- 自我介绍 -->
      <section v-if="aboutmeList.length" class="section section-aboutme">
        <div class="section-title" :style="{ color: theme.color }">
          {{ titleNameMap.aboutme || t('自我介绍') }}
        </div>
        <div v-for="(line, idx) in aboutmeList" :key="idx" class="aboutme-line">
          {{ line }}
        </div>
      </section>

      <!-- 教育背景 -->
      <section v-if="value.educationList?.length" class="section section-education">
        <div class="section-title" :style="{ color: theme.color }">
          {{ titleNameMap.educationList || t('教育背景') }}
        </div>
        <div
          v-for="(edu, idx) in value.educationList"
          :key="idx"
          class="education-item"
        >
          <div class="edu-header">
            <b>{{ edu.school }}</b>
            <span class="sub-info">
              {{ formatTimeRange(edu.edu_time) }}
            </span>
          </div>
          <div class="edu-detail">
            <span v-if="edu.major">{{ edu.major }}</span>
            <span v-if="edu.academic_degree" class="sub-info">
              ({{ edu.academic_degree }})
            </span>
          </div>
        </div>
      </section>

      <!-- 个人作品 -->
      <section v-if="value.workList?.length" class="section section-work">
        <div class="section-title" :style="{ color: theme.color }">
          {{ titleNameMap.workList || t('个人作品') }}
        </div>
        <div v-for="(work, idx) in value.workList" :key="idx" class="work-item">
          <div class="work-header">
            <span class="icon">🏆</span>
            <b>{{ work.work_name }}</b>
            <a v-if="work.visit_link" :href="work.visit_link" class="sub-info link">
              {{ t('访问链接') }}
            </a>
          </div>
          <div v-if="work.work_desc" class="work-desc">{{ work.work_desc }}</div>
        </div>
      </section>

      <!-- 专业技能 -->
      <section v-if="value.skillList?.length" class="section section-skill">
        <div class="section-title" :style="{ color: theme.color }">
          {{ titleNameMap.skillList || t('专业技能') }}
        </div>
        <div v-for="(skill, idx) in value.skillList" :key="idx" class="skill-item">
          <div class="skill-header">
            <b>{{ skill.skill_name }}</b>
            <StarRating :value="(skill.skill_level || 0) / 20" />
          </div>
          <div
            v-for="(desc, dIdx) in splitLines(skill.skill_desc)"
            :key="dIdx"
            v-if="desc"
            class="skill-detail"
          >
            <span class="icon">✓</span>
            {{ desc }}
          </div>
        </div>
      </section>

      <!-- 更多信息 -->
      <section v-if="value.awardList?.length" class="section section-award">
        <div class="section-title" :style="{ color: theme.color }">
          {{ titleNameMap.awardList || t('更多信息') }}
        </div>
        <div v-for="(award, idx) in value.awardList" :key="idx" class="award-item">
          <span class="icon">🏅</span>
          <b>{{ award.award_info }}</b>
          <span v-if="award.award_time" class="sub-info">({{ award.award_time }})</span>
        </div>
      </section>
    </div>

    <!-- 右侧主要内容 -->
    <div class="main-info">
      <!-- 工作经历 -->
      <section v-if="value.workExpList?.length" class="main-section">
        <SectionHeader
          :title="titleNameMap.workExpList || t('工作经历')"
          :color="theme.color"
          icon="work-experience"
        />
        <div class="section-body">
          <div
            v-for="(work, idx) in value.workExpList"
            :key="idx"
            class="work-exp-item"
          >
            <div class="item-header">
              <b class="company-name">
                {{ work.company_name }}
                <span class="sub-info">{{ work.department_name }}</span>
              </b>
              <span class="time-range">{{ formatTimeRange(work.work_time) }}</span>
            </div>
            <div class="work-desc">{{ work.work_desc }}</div>
          </div>
        </div>
      </section>

      <!-- 项目经历 -->
      <section v-if="value.projectList?.length" class="main-section">
        <SectionHeader
          :title="titleNameMap.projectList || t('项目经历')"
          :color="theme.color"
          icon="skill"
        />
        <div class="section-body">
          <div
            v-for="(project, idx) in value.projectList"
            :key="idx"
            class="project-item"
          >
            <div class="item-header">
              <b class="project-name">
                {{ project.project_name }}
                <span class="time-range">{{ project.project_time }}</span>
              </b>
              <span v-if="project.project_role" class="role-tag" :style="{ background: theme.tagColor }">
                {{ project.project_role }}
              </span>
            </div>
            <div v-if="project.project_desc" class="project-detail">
              <b>{{ t('项目描述') }}：</b>
              <span>{{ project.project_desc }}</span>
            </div>
            <div v-if="project.project_content" class="project-detail">
              <b>{{ t('主要工作') }}：</b>
              <span class="pre-wrap">{{ project.project_content }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ResumeConfig, ThemeConfig } from '../../types/resume';
import { getDefaultTitleNameMap } from '../../config/resume.config';
import StarRating from '../common/StarRating.vue';
import SectionHeader from '../common/SectionHeader.vue';

interface Props {
  value: ResumeConfig;
  theme: ThemeConfig;
  locale?: string;
}

const props = withDefaults(defineProps<Props>(), {
  locale: 'zh-CN',
});

// 计算标题映射
const titleNameMap = computed(() => {
  return {
    ...getDefaultTitleNameMap(props.locale),
    ...props.value.titleNameMap,
  };
});

// 计算自我介绍列表
const aboutmeList = computed(() => {
  const desc = props.value.aboutme?.aboutme_desc || '';
  return desc.split('\n').filter(line => line.trim());
});

// 简单的国际化函数
const t = (key: string): string => {
  const translations: Record<string, Record<string, string>> = {
    'zh-CN': {
      '工作经验': '工作经验',
      '期望工作地': '期望工作地',
      '职位': '职位',
      '教育背景': '教育背景',
      '个人作品': '个人作品',
      '访问链接': '访问链接',
      '专业技能': '专业技能',
      '更多信息': '更多信息',
      '自我介绍': '自我介绍',
      '工作经历': '工作经历',
      '项目经历': '项目经历',
      '项目描述': '项目描述',
      '主要工作': '主要工作',
      '至今': '至今',
    },
    'en-US': {
      '工作经验': 'Work Experience',
      '期望工作地': 'Expected Location',
      '职位': 'Position',
      '教育背景': 'Education',
      '个人作品': 'Works',
      '访问链接': 'Visit',
      '专业技能': 'Skills',
      '更多信息': 'Awards',
      '自我介绍': 'About Me',
      '工作经历': 'Work Experience',
      '项目经历': 'Projects',
      '项目描述': 'Description',
      '主要工作': 'Responsibilities',
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
  return start ? `${start} ~ ${endText}` : String(endText);
};

// 分割多行文本
const splitLines = (text?: string): string[] => {
  if (!text) return [];
  return text.split('\n').filter(line => line.trim());
};
</script>

<style scoped>
.template1-resume {
  width: 794px;
  min-height: 942px;
  margin-bottom: 60px;
  display: grid;
  grid-template-columns: 2fr 3fr;
  box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.15);
  background: #fff;
}

@media (max-width: 794px) {
  .template1-resume {
    width: 100%;
    grid-template-columns: 1fr;
  }
}

@media print {
  @page {
    size: A4;
  }
  .template1-resume {
    width: 100%;
    box-shadow: none;
  }
}

/* 左侧基础信息 */
.basic-info {
  padding: 24px 18px 24px 24px;
}

.avatar-wrapper {
  text-align: center;
  margin: 12px 0;
}

.avatar {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e0e0e0;
  color: #666;
  font-size: 32px;
  font-weight: bold;
}

.profile .name {
  margin: 8px auto 24px;
  font-size: 24px;
  text-align: center;
  font-weight: bold;
}

.profile-list {
  margin-bottom: 24px;
}

.profile-item {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  font-size: 14px;
}

.profile-item .icon {
  margin-right: 8px;
}

.profile-item a {
  color: inherit;
  text-decoration: none;
}

.profile-item a:hover {
  text-decoration: underline;
}

/* 通用 section 样式 */
.section {
  margin-top: 24px;
}

.section-title {
  margin-bottom: 12px;
  font-size: 18px;
  line-height: 32px;
  font-weight: bold;
}

.sub-info {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
  margin-left: 4px;
}

.sub-info.link {
  cursor: pointer;
  text-decoration: underline;
}

/* 教育背景 */
.edu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.education-item:not(:first-child) {
  margin-top: 8px;
}

/* 技能 */
.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.skill-detail {
  margin-top: 4px;
  font-size: 14px;
}

.skill-detail .icon {
  color: #ffc107;
  margin-right: 8px;
}

/* 奖项 */
.award-item {
  margin-top: 4px;
}

.award-item .icon {
  color: #ffc107;
  margin-right: 8px;
}

/* 作品 */
.work-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.work-header .icon {
  color: #ffc107;
}

/* 右侧主要内容 */
.main-info {
  height: 100%;
  padding: 33px 24px 32px 20px;
  background: #f2f2f2;
}

.main-section {
  margin-bottom: 16px;
}

.section-body {
  padding-top: 10px;
}

/* 工作经历 */
.work-exp-item:not(:first-child),
.project-item:not(:first-child) {
  margin-top: 18px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 16px;
}

.company-name .sub-info,
.project-name .time-range {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
  margin-left: 8px;
  font-weight: 300;
}

.role-tag {
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.work-desc,
.project-detail {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.85);
}

.project-detail:not(:first-child) {
  margin-top: 4px;
}

.pre-wrap {
  white-space: pre-wrap;
}

.aboutme-line {
  margin: 6px 0;
  font-size: 14px;
  line-height: 1.6;
}
</style>
