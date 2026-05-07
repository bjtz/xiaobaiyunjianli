<template>
  <div class="blue-business-resume" ref="resumeContainer">
    <div class="resume-header">
      <div class="header-left">
        <div v-if="!value.avatar?.hidden" class="avatar-wrapper">
          <img v-if="value.avatar?.src" :src="value.avatar.src" class="avatar" alt="avatar" />
          <div v-else class="avatar avatar-placeholder">{{ value.profile?.name?.charAt(0) || '?' }}</div>
        </div>
      </div>
      <div class="header-right">
        <h1 class="name">{{ value.profile?.name || '姓名' }}</h1>
        <p class="position" v-if="value.profile?.positionTitle">{{ value.profile.positionTitle }}</p>
        <div class="contact-info">
          <span v-if="value.profile?.mobile" class="contact-item">
            <span class="icon">📱</span>{{ value.profile.mobile }}
          </span>
          <span v-if="value.profile?.email" class="contact-item">
            <span class="icon">📧</span>{{ value.profile.email }}
          </span>
          <span v-if="value.profile?.workPlace" class="contact-item">
            <span class="icon">📍</span>{{ value.profile.workPlace }}
          </span>
        </div>
      </div>
    </div>

    <div class="resume-body">
      <div class="column-left">
        <section v-if="value.educationList?.length" class="section">
          <div class="section-title-wrapper">
            <span class="section-icon">🎓</span>
            <h3 class="section-title">教育背景</h3>
          </div>
          <div class="section-content">
            <div v-for="(edu, index) in value.educationList" :key="index" class="edu-item" v-if="edu.school">
              <div class="edu-school">{{ edu.school }}</div>
              <div class="edu-time">{{ formatTimeRange(edu.edu_time) }}</div>
              <div class="edu-detail">
                <span v-if="edu.major">{{ edu.major }}</span>
                <span v-if="edu.academic_degree" class="degree">({{ edu.academic_degree }})</span>
              </div>
            </div>
          </div>
        </section>

        <section v-if="value.skillList?.length" class="section">
          <div class="section-title-wrapper">
            <span class="section-icon">🔧</span>
            <h3 class="section-title">专业技能</h3>
          </div>
          <div class="section-content">
            <div v-for="(skill, index) in value.skillList" :key="index" class="skill-item" v-if="skill.skill_name">
              <div class="skill-name">{{ skill.skill_name }}</div>
              <div class="skill-level">
                <div class="skill-bar">
                  <div class="skill-fill" :style="{ width: getSkillLevel(skill) }"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section v-if="value.awardList?.length" class="section">
          <div class="section-title-wrapper">
            <span class="section-icon">🏆</span>
            <h3 class="section-title">获得荣誉</h3>
          </div>
          <div class="section-content">
            <div v-for="(award, index) in value.awardList" :key="index" class="award-item" v-if="award.award_info">
              <div class="award-info">{{ award.award_info }}</div>
              <div v-if="award.award_time" class="award-time">{{ award.award_time }}</div>
            </div>
          </div>
        </section>
      </div>

      <div class="column-right">
        <section v-if="value.workExpList?.length" class="section">
          <div class="section-title-wrapper">
            <span class="section-icon">💼</span>
            <h3 class="section-title">工作经验</h3>
          </div>
          <div class="section-content">
            <div v-for="(work, index) in value.workExpList" :key="index" class="work-item" v-if="work.company_name">
              <div class="work-header">
                <div class="work-company">{{ work.company_name }}</div>
                <div class="work-time">{{ formatTimeRange(work.work_time) }}</div>
              </div>
              <div v-if="work.department_name" class="work-position">{{ work.department_name }}</div>
              <div v-if="work.work_desc" class="work-desc">
                <ul>
                  <li v-for="(line, i) in work.work_desc.split('\n')" :key="i">{{ line }}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section v-if="value.projectList?.length" class="section">
          <div class="section-title-wrapper">
            <span class="section-icon">🏢</span>
            <h3 class="section-title">项目经历</h3>
          </div>
          <div class="section-content">
            <div v-for="(project, index) in value.projectList" :key="index" class="project-item" v-if="project.project_name">
              <div class="project-header">
                <div class="project-name">{{ project.project_name }}</div>
                <div v-if="project.project_role" class="project-role">{{ project.project_role }}</div>
              </div>
              <div v-if="project.project_time" class="project-time">{{ project.project_time }}</div>
              <div v-if="project.project_desc" class="project-desc">{{ project.project_desc }}</div>
              <div v-if="project.project_content" class="project-content">{{ project.project_content }}</div>
            </div>
          </div>
        </section>

        <section v-if="value.aboutme?.aboutme_desc" class="section">
          <div class="section-title-wrapper">
            <span class="section-icon">📝</span>
            <h3 class="section-title">自我评价</h3>
          </div>
          <div class="section-content">
            <div class="self-intro">{{ value.aboutme.aboutme_desc }}</div>
          </div>
        </section>
      </div>
    </div>

    <div class="resume-actions" v-if="!isPrintMode">
      <button class="action-btn print-btn" @click="printResume">🖨️ 打印简历</button>
      <button class="action-btn pdf-btn" @click="downloadPDF">📄 导出PDF</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ResumeConfig, ThemeConfig } from '../../types/resume';
import html2pdf from 'html2pdf.js';

interface Props {
  value: ResumeConfig;
  theme?: ThemeConfig;
  locale?: string;
}

const props = withDefaults(defineProps<Props>(), {
  theme: () => ({ color: '#1976d2' }),
  locale: 'zh-CN'
});

const resumeContainer = ref<HTMLElement | null>(null);
const isPrintMode = ref(false);

const formatTimeRange = (time?: [string | undefined, string | number | null]): string => {
  if (!time || !Array.isArray(time)) return '';
  const [start, end] = time;
  const endText = end === null ? '至今' : end;
  return start ? `${start} - ${endText}` : String(endText);
};

const getSkillLevel = (skill: any): string => {
  if (skill.skill_level) return `${skill.skill_level}%`;
  if (skill.skill_desc) {
    if (skill.skill_desc.includes('精通') || skill.skill_desc.includes('熟练')) return '90%';
    if (skill.skill_desc.includes('熟悉')) return '70%';
    if (skill.skill_desc.includes('了解')) return '50%';
  }
  return '70%';
};

const printResume = () => {
  isPrintMode.value = true;
  setTimeout(() => {
    window.print();
    isPrintMode.value = false;
  }, 100);
};

const downloadPDF = () => {
  const element = resumeContainer.value;
  if (!element) return;

  const opt = {
    margin: [10, 10, 10, 10],
    filename: `${props.value.profile?.name || '简历'}_简历.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait'
    },
    pagebreak: {
      mode: ['css', 'legacy']
    }
  };

  html2pdf().set(opt).from(element).save();
};
</script>

<style scoped>
.blue-business-resume {
  max-width: 210mm;
  margin: 0 auto;
  background: white;
  min-height: 297mm;
  font-family: 'Microsoft YaHei', 'SimSun', sans-serif;
}

.resume-header {
  background: linear-gradient(135deg, #1976d2, #1565c0);
  padding: 40px 50px;
  display: flex;
  gap: 30px;
  align-items: center;
}

.header-left {
  flex-shrink: 0;
}

.avatar-wrapper {
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.avatar-placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 48px;
  font-weight: bold;
}

.header-right {
  flex: 1;
}

.name {
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px;
}

.position {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 15px;
}

.contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-size: 14px;
}

.contact-item .icon {
  font-size: 16px;
}

.resume-body {
  display: flex;
  gap: 40px;
  padding: 40px 50px;
}

.column-left {
  width: 35%;
  flex-shrink: 0;
}

.column-right {
  flex: 1;
}

.section {
  margin-bottom: 30px;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #1976d2;
}

.section-icon {
  width: 28px;
  height: 28px;
  background: #1976d2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.section-content {
  padding-left: 5px;
}

.edu-item {
  margin-bottom: 18px;
}

.edu-school {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.edu-time {
  font-size: 13px;
  color: #1976d2;
  margin-bottom: 4px;
}

.edu-detail {
  font-size: 14px;
  color: #666;
}

.degree {
  color: #1976d2;
  margin-left: 5px;
}

.skill-item {
  margin-bottom: 15px;
}

.skill-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
}

.skill-level {
  width: 100%;
}

.skill-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: linear-gradient(90deg, #1976d2, #42a5f5);
  border-radius: 4px;
  transition: width 0.5s;
}

.award-item {
  margin-bottom: 10px;
}

.award-info {
  font-size: 14px;
  color: #333;
  margin-bottom: 2px;
}

.award-time {
  font-size: 12px;
  color: #1976d2;
}

.work-item {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.work-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.work-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
}

.work-company {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.work-time {
  font-size: 13px;
  color: #1976d2;
  font-weight: 500;
}

.work-position {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.work-desc ul {
  margin: 0;
  padding-left: 18px;
}

.work-desc li {
  font-size: 14px;
  line-height: 1.8;
  color: #555;
  margin-bottom: 4px;
}

.project-item {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #e0e0e0;
}

.project-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.project-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.project-role {
  font-size: 13px;
  color: #1976d2;
  background: #e3f2fd;
  padding: 2px 10px;
  border-radius: 12px;
}

.project-time {
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
}

.project-desc,
.project-content {
  font-size: 14px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 4px;
}

.self-intro {
  font-size: 14px;
  line-height: 1.8;
  color: #555;
  text-align: justify;
}

.resume-actions {
  padding: 20px 50px 30px;
  display: flex;
  gap: 15px;
  justify-content: center;
  border-top: 1px solid #e0e0e0;
  background: #fafafa;
}

.action-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'SimSun', serif;
}

.print-btn {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #1976d2;
}

.print-btn:hover {
  background: #bbdefb;
}

.pdf-btn {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  color: white;
}

.pdf-btn:hover {
  background: linear-gradient(135deg, #1565c0, #1976d2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

@media print {
  .blue-business-resume {
    box-shadow: none;
    max-width: 100%;
  }

  .resume-actions {
    display: none;
  }

  .resume-header {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .skill-fill {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  @page {
    margin: 0;
    size: A4 portrait;
  }
}
</style>
