<template>
  <div class="modern-simple-resume" ref="resumeContainer">
    <div class="resume-header">
      <div class="header-content">
        <h1 class="name">{{ value.profile?.name || '姓名' }}</h1>
        <p class="position" v-if="value.profile?.positionTitle">{{ value.profile.positionTitle }}</p>
        <div class="contact-bar">
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
      <section v-if="value.aboutme?.aboutme_desc" class="section">
        <div class="section-header">
          <span class="section-icon">📝</span>
          <h3 class="section-title">自我评价</h3>
        </div>
        <div class="section-content">
          <p class="self-intro">{{ value.aboutme.aboutme_desc }}</p>
        </div>
      </section>

      <section v-if="value.workExpList?.length" class="section">
        <div class="section-header">
          <span class="section-icon">💼</span>
          <h3 class="section-title">工作经验</h3>
        </div>
        <div class="section-content">
          <div v-for="(work, index) in value.workExpList" :key="index" class="work-item" v-if="work.company_name">
            <div class="work-header">
              <div class="work-info">
                <div class="work-company">{{ work.company_name }}</div>
                <div v-if="work.department_name" class="work-department">{{ work.department_name }}</div>
              </div>
              <div class="work-time">{{ formatTimeRange(work.work_time) }}</div>
            </div>
            <div v-if="work.work_desc" class="work-desc">
              <ul>
                <li v-for="(line, i) in work.work_desc.split('\n')" :key="i">{{ line }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section v-if="value.projectList?.length" class="section">
        <div class="section-header">
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

      <div class="two-columns">
        <div class="column">
          <section v-if="value.educationList?.length" class="section">
            <div class="section-header">
              <span class="section-icon">🎓</span>
              <h3 class="section-title">教育背景</h3>
            </div>
            <div class="section-content">
              <div v-for="(edu, index) in value.educationList" :key="index" class="edu-item" v-if="edu.school">
                <div class="edu-school">{{ edu.school }}</div>
                <div class="edu-detail">
                  <span v-if="edu.major">{{ edu.major }}</span>
                  <span v-if="edu.academic_degree"> · {{ edu.academic_degree }}</span>
                </div>
                <div class="edu-time">{{ formatTimeRange(edu.edu_time) }}</div>
              </div>
            </div>
          </section>

          <section v-if="value.awardList?.length" class="section">
            <div class="section-header">
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

        <div class="column">
          <section v-if="value.skillList?.length" class="section">
            <div class="section-header">
              <span class="section-icon">🔧</span>
              <h3 class="section-title">专业技能</h3>
            </div>
            <div class="section-content">
              <div class="skills-grid">
                <span v-for="(skill, index) in value.skillList" :key="index" class="skill-tag" v-if="skill.skill_name">
                  {{ skill.skill_name }}
                  <span v-if="skill.skill_desc" class="skill-desc"> · {{ skill.skill_desc }}</span>
                </span>
              </div>
            </div>
          </section>
        </div>
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
  theme: () => ({ color: '#2c3e50' }),
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
.modern-simple-resume {
  max-width: 210mm;
  margin: 0 auto;
  background: white;
  min-height: 297mm;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
}

.resume-header {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  padding: 50px 60px;
  color: white;
}

.header-content {
  text-align: center;
}

.name {
  font-size: 42px;
  font-weight: 300;
  margin: 0 0 10px;
  letter-spacing: 2px;
}

.position {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 20px;
  letter-spacing: 1px;
}

.contact-bar {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.contact-item .icon {
  font-size: 16px;
}

.resume-body {
  padding: 40px 60px;
}

.section {
  margin-bottom: 35px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #ecf0f1;
}

.section-icon {
  width: 32px;
  height: 32px;
  background: #2c3e50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  letter-spacing: 1px;
}

.section-content {
  padding-left: 5px;
}

.self-intro {
  font-size: 15px;
  line-height: 1.8;
  color: #34495e;
  margin: 0;
  text-align: justify;
}

.work-item {
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ecf0f1;
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
  margin-bottom: 10px;
}

.work-info {
  flex: 1;
}

.work-company {
  font-size: 17px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.work-department {
  font-size: 14px;
  color: #7f8c8d;
}

.work-time {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
  background: #ecf0f1;
  padding: 4px 12px;
  border-radius: 12px;
}

.work-desc ul {
  margin: 0;
  padding-left: 20px;
}

.work-desc li {
  font-size: 14px;
  line-height: 1.8;
  color: #34495e;
  margin-bottom: 6px;
}

.project-item {
  margin-bottom: 22px;
  padding-bottom: 18px;
  border-bottom: 1px dashed #ecf0f1;
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
  margin-bottom: 6px;
}

.project-name {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.project-role {
  font-size: 13px;
  color: #2c3e50;
  background: #e8f4f8;
  padding: 3px 10px;
  border-radius: 10px;
}

.project-time {
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 8px;
}

.project-desc,
.project-content {
  font-size: 14px;
  line-height: 1.7;
  color: #34495e;
  margin-bottom: 4px;
}

.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.column {
  display: flex;
  flex-direction: column;
}

.edu-item {
  margin-bottom: 16px;
}

.edu-school {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.edu-detail {
  font-size: 14px;
  color: #34495e;
  margin-bottom: 4px;
}

.edu-time {
  font-size: 13px;
  color: #7f8c8d;
}

.award-item {
  margin-bottom: 12px;
}

.award-info {
  font-size: 14px;
  color: #34495e;
  margin-bottom: 2px;
}

.award-time {
  font-size: 12px;
  color: #7f8c8d;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  background: #ecf0f1;
  color: #2c3e50;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  transition: all 0.2s;
}

.skill-tag:hover {
  background: #2c3e50;
  color: white;
}

.skill-desc {
  color: #7f8c8d;
  font-size: 13px;
}

.resume-actions {
  padding: 20px 60px 30px;
  display: flex;
  gap: 15px;
  justify-content: center;
  border-top: 1px solid #ecf0f1;
  background: #fafafa;
}

.action-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.print-btn {
  background: #ecf0f1;
  color: #2c3e50;
  border: 2px solid #2c3e50;
}

.print-btn:hover {
  background: #2c3e50;
  color: white;
}

.pdf-btn {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  color: white;
}

.pdf-btn:hover {
  background: linear-gradient(135deg, #1a252f, #2c3e50);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.3);
}

@media print {
  .modern-simple-resume {
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

  .section-icon {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .skill-tag {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  @page {
    margin: 0;
    size: A4 portrait;
  }
}
</style>
