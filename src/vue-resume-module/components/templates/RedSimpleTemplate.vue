<template>
  <div class="red-simple-resume" ref="resumeContainer">
    <div class="header-section">
      <div class="header-content">
        <div class="photo-box">
          <span class="photo-icon">👤</span>
        </div>
        <div class="name-title">
          <h1 class="name">{{ resumeData.profile?.name || '姓名' }}</h1>
          <p class="title" v-if="resumeData.profile?.positionTitle">{{ resumeData.profile.positionTitle }}</p>
        </div>
      </div>
      <div class="header-line"></div>
      <div class="contact-list">
        <div class="contact-item" v-if="resumeData.profile?.mobile">
          <span class="contact-label">电话</span>
          <span class="contact-value">{{ resumeData.profile.mobile }}</span>
        </div>
        <div class="contact-item" v-if="resumeData.profile?.email">
          <span class="contact-label">邮箱</span>
          <span class="contact-value">{{ resumeData.profile.email }}</span>
        </div>
        <div class="contact-item" v-if="resumeData.profile?.currentAddress">
          <span class="contact-label">地址</span>
          <span class="contact-value">{{ resumeData.profile.currentAddress }}</span>
        </div>
        <div class="contact-item" v-if="resumeData.profile?.workPlace">
          <span class="contact-label">籍贯</span>
          <span class="contact-value">{{ resumeData.profile.workPlace }}</span>
        </div>
      </div>
    </div>
    
    <div class="content-section">
      <div class="section-title">
        <span class="title-icon">📚</span>
        <span class="title-text">教育背景</span>
        <div class="title-line"></div>
      </div>
      <div class="section-content">
        <div class="edu-item" v-for="(edu, index) in resumeData.educationList" :key="index" v-if="edu.school">
          <div class="edu-header">
            <div class="edu-school">{{ edu.school || '学校名称' }}</div>
            <div class="edu-time">{{ edu.edu_time?.[0] || '2020.09' }} - {{ edu.edu_time?.[1] || '2024.06' }}</div>
          </div>
          <div class="edu-info">
            <span v-if="edu.major">{{ edu.major }}</span>
            <span v-if="edu.academic_degree">· {{ edu.academic_degree }}</span>
            <span v-if="edu.college">· {{ edu.college }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="content-section" v-if="hasWork">
      <div class="section-title">
        <span class="title-icon">💼</span>
        <span class="title-text">工作经历</span>
        <div class="title-line"></div>
      </div>
      <div class="section-content">
        <div class="work-item" v-for="(work, index) in resumeData.workExpList" :key="index" v-if="work.company_name">
          <div class="work-header">
            <div class="work-company">{{ work.company_name || '公司名称' }}</div>
            <div class="work-time">{{ work.work_time?.[0] || '2024.07' }} - {{ work.work_time?.[1] || '至今' }}</div>
          </div>
          <div class="work-position" v-if="work.department_name">{{ work.department_name }}</div>
          <div class="work-description" v-if="work.work_desc">
            <ul>
              <li v-for="(line, i) in work.work_desc.split('\n')" :key="i">{{ line }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <div class="content-section" v-if="hasProjects">
      <div class="section-title">
        <span class="title-icon">🏆</span>
        <span class="title-text">获奖情况</span>
        <div class="title-line"></div>
      </div>
      <div class="section-content">
        <div class="awards-list">
          <div class="award-item" v-for="(project, index) in resumeData.projectList" :key="index" v-if="project.project_name">
            <span class="award-dot">●</span>
            <span class="award-name">{{ project.project_name }}</span>
            <span class="award-time" v-if="project.project_time">{{ project.project_time }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="content-section" v-if="hasSkills">
      <div class="section-title">
        <span class="title-icon">🔧</span>
        <span class="title-text">专业技能</span>
        <div class="title-line"></div>
      </div>
      <div class="section-content">
        <div class="skills-tags">
          <span class="skill-tag" v-for="(skill, index) in resumeData.skillList" :key="index" v-if="skill.skill_name">
            {{ skill.skill_name }}
            <span v-if="skill.skill_desc">: {{ skill.skill_desc }}</span>
          </span>
        </div>
      </div>
    </div>
    
    <div class="content-section" v-if="resumeData.aboutme?.aboutme_desc">
      <div class="section-title">
        <span class="title-icon">📝</span>
        <span class="title-text">自我评价</span>
        <div class="title-line"></div>
      </div>
      <div class="section-content">
        <p class="self-evaluation">{{ resumeData.aboutme.aboutme_desc }}</p>
      </div>
    </div>
    
    <div class="resume-actions" v-if="!isPrintMode">
      <button class="action-btn print-btn" @click="printResume">🖨️ 打印简历</button>
      <button class="action-btn pdf-btn" @click="downloadPDF">📄 导出PDF</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import html2pdf from 'html2pdf.js';

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  },
  theme: {
    type: Object,
    default: () => ({ color: '#dc3545' })
  },
  locale: {
    type: String,
    default: 'zh-CN'
  }
});

const resumeData = props.value;
const resumeContainer = ref(null);
const isPrintMode = ref(false);

const hasBasicInfo = computed(() => {
  return resumeData.profile?.name || resumeData.profile?.mobile || resumeData.profile?.email;
});

const hasEducation = computed(() => {
  return resumeData.educationList?.some(edu => edu.school);
});

const hasWork = computed(() => {
  return resumeData.workExpList?.some(work => work.company_name);
});

const hasProjects = computed(() => {
  return resumeData.projectList?.some(project => project.project_name);
});

const hasSkills = computed(() => {
  return resumeData.skillList?.some(skill => skill.skill_name);
});

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
    filename: `${resumeData.profile?.name || '简历'}_简历.pdf`,
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
.red-simple-resume {
  max-width: 210mm;
  margin: 0 auto;
  background: white;
  min-height: 297mm;
  padding: 30px 40px;
  font-family: 'Microsoft YaHei', 'SimSun', sans-serif;
}

.header-section {
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 20px;
}

.photo-box {
  width: 100px;
  height: 100px;
  background: #f5f5f5;
  border: 2px solid #dc3545;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.photo-icon {
  font-size: 50px;
}

.name-title {
  flex: 1;
}

.name {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0 0 5px;
}

.title {
  font-size: 16px;
  color: #dc3545;
  margin: 0;
  font-weight: 500;
}

.header-line {
  height: 4px;
  background: linear-gradient(90deg, #dc3545, #e4606d);
  margin-bottom: 15px;
}

.contact-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.contact-item {
  display: flex;
  gap: 8px;
  font-size: 14px;
}

.contact-label {
  color: #dc3545;
  font-weight: 600;
}

.contact-value {
  color: #555;
}

.content-section {
  margin-bottom: 25px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.title-icon {
  font-size: 18px;
  color: #dc3545;
}

.title-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.title-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, #dc3545, transparent);
  margin-left: 15px;
}

.section-content {
  padding-left: 28px;
}

.edu-item,
.work-item {
  margin-bottom: 20px;
}

.edu-header,
.work-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 5px;
}

.edu-school,
.work-company {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.edu-time,
.work-time {
  font-size: 14px;
  color: #dc3545;
  font-weight: 500;
}

.edu-info {
  font-size: 14px;
  color: #666;
}

.work-position {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.work-description ul {
  margin: 0;
  padding-left: 18px;
}

.work-description li {
  font-size: 14px;
  line-height: 1.8;
  color: #555;
  margin-bottom: 4px;
}

.awards-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.award-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #555;
}

.award-dot {
  color: #dc3545;
}

.award-name {
  font-weight: 500;
}

.award-time {
  color: #999;
  font-size: 13px;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  background: #ffebee;
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 14px;
  color: #dc3545;
  border: 1px solid #e4606d;
}

.self-evaluation {
  font-size: 14px;
  line-height: 1.8;
  color: #555;
  margin: 0;
}

.resume-actions {
  padding: 20px 0 30px;
  display: flex;
  gap: 15px;
  justify-content: center;
  border-top: 1px solid #e0e0e0;
  margin-top: 20px;
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
  background: #ffebee;
  color: #dc3545;
  border: 1px solid #dc3545;
}

.print-btn:hover {
  background: #ffcdd2;
}

.pdf-btn {
  background: linear-gradient(135deg, #dc3545, #e4606d);
  color: white;
}

.pdf-btn:hover {
  background: linear-gradient(135deg, #c82333, #dc3545);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

@media print {
  .red-simple-resume {
    box-shadow: none;
    max-width: 100%;
  }
  
  .resume-actions {
    display: none;
  }
  
  @page {
    margin: 0;
    size: A4 portrait;
  }
}
</style>
