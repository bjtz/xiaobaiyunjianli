<template>
  <div class="artistic-blue-resume" ref="resumeContainer">
    <div class="decorative-top">
      <svg class="wave-bg" viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,100 C150,50 350,150 500,80 C650,10 750,120 800,60 L800,0 L0,0 Z" fill="#3a7ca5"/>
        <path d="M0,120 C200,80 400,160 600,100 C700,70 750,130 800,90 L800,0 L0,0 Z" fill="#2d6a8f" opacity="0.7"/>
      </svg>
    </div>
    
    <div class="header-section">
      <div class="header-content">
        <h1 class="name">{{ resumeData.profile?.name || '姓名' }}</h1>
        <p class="subtitle">PERSONAL RESUME</p>
      </div>
      <div class="photo-container" v-if="true">
        <div class="photo-circle">
          <span class="photo-placeholder">📷</span>
        </div>
      </div>
    </div>
    
    <div class="resume-content">
      <div class="modules-grid">
        <div class="module-card" v-if="resumeData.aboutme?.aboutme_desc">
          <div class="module-header">
            <div class="module-icon">👤</div>
            <h3 class="module-title">Self assessment</h3>
            <span class="module-title-cn">自我评价</span>
          </div>
          <div class="module-body">
            <p class="module-text">{{ resumeData.aboutme.aboutme_desc }}</p>
          </div>
        </div>
        
        <div class="module-card" v-if="hasBasicInfo">
          <div class="module-header">
            <div class="module-icon">📋</div>
            <h3 class="module-title">Basic information</h3>
            <span class="module-title-cn">基本信息</span>
          </div>
          <div class="module-body">
            <div class="info-list">
              <div class="info-item" v-if="resumeData.profile?.positionTitle">
                <span class="label">应聘岗位：</span>
                <span class="value">{{ resumeData.profile.positionTitle }}</span>
              </div>
              <div class="info-item" v-if="resumeData.profile?.mobile">
                <span class="label">手机：</span>
                <span class="value">{{ resumeData.profile.mobile }}</span>
              </div>
              <div class="info-item" v-if="resumeData.profile?.email">
                <span class="label">邮箱：</span>
                <span class="value">{{ resumeData.profile.email }}</span>
              </div>
              <div class="info-item" v-if="resumeData.profile?.workPlace">
                <span class="label">地址：</span>
                <span class="value">{{ resumeData.profile.workPlace }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="module-card full-width" v-if="hasEducation">
          <div class="module-header">
            <div class="module-icon">🎓</div>
            <h3 class="module-title">Education background</h3>
            <span class="module-title-cn">教育背景</span>
          </div>
          <div class="module-body">
            <div class="education-items" v-for="(edu, index) in resumeData.educationList" :key="index">
              <div class="education-item" v-if="edu.school">
                <div class="edu-date">{{ edu.edu_time?.[0] || '2020.09' }} - {{ edu.edu_time?.[1] || '2024.06' }}</div>
                <div class="edu-content">
                  <div class="edu-school">{{ edu.school || '学校名称' }}</div>
                  <div class="edu-details">
                    <span v-if="edu.college">{{ edu.college }}</span>
                    <span v-if="edu.major">· {{ edu.major }}</span>
                    <span v-if="edu.academic_degree">· {{ edu.academic_degree }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="module-card full-width" v-if="hasWork">
          <div class="module-header">
            <div class="module-icon">💼</div>
            <h3 class="module-title">Work experience</h3>
            <span class="module-title-cn">工作经历</span>
          </div>
          <div class="module-body">
            <div class="work-items" v-for="(work, index) in resumeData.workExpList" :key="index">
              <div class="work-item" v-if="work.company_name">
                <div class="work-date">{{ work.work_time?.[0] || '2024.07' }} - {{ work.work_time?.[1] || '至今' }}</div>
                <div class="work-content">
                  <div class="work-company">{{ work.company_name || '公司名称' }}</div>
                  <div class="work-position" v-if="work.department_name">{{ work.department_name }}</div>
                  <div class="work-desc" v-if="work.work_desc">
                    <ul>
                      <li v-for="(line, i) in work.work_desc.split('\n')" :key="i">{{ line }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="module-card full-width" v-if="hasSkills">
          <div class="module-header">
            <div class="module-icon">🔧</div>
            <h3 class="module-title">Professional skills</h3>
            <span class="module-title-cn">专业技能</span>
          </div>
          <div class="module-body">
            <div class="skills-tags">
              <span class="skill-tag" v-for="(skill, index) in resumeData.skillList" :key="index" v-if="skill.skill_name">
                {{ skill.skill_name }}
                <span v-if="skill.skill_desc">· {{ skill.skill_desc }}</span>
              </span>
            </div>
          </div>
        </div>
        
        <div class="module-card" v-if="hasProjects">
          <div class="module-header">
            <div class="module-icon">🏆</div>
            <h3 class="module-title">Get the honor</h3>
            <span class="module-title-cn">获得荣誉</span>
          </div>
          <div class="module-body">
            <div class="honors-list">
              <div class="honor-item" v-for="(project, index) in resumeData.projectList.slice(0, 3)" :key="index" v-if="project.project_name">
                <span class="honor-dot">●</span>
                <span class="honor-text">{{ project.project_name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="decorative-bottom">
      <svg class="mountain-bg" viewBox="0 0 800 150" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,150 L0,100 C100,60 200,80 300,50 C400,20 500,70 600,40 C700,10 750,60 800,30 L800,150 Z" fill="#2d6a8f"/>
        <path d="M0,150 L0,120 C150,80 250,100 400,70 C550,40 650,90 800,60 L800,150 Z" fill="#3a7ca5"/>
        <path d="M0,150 L0,130 C100,110 300,120 450,100 C600,80 700,110 800,90 L800,150 Z" fill="#f9a826"/>
      </svg>
      <div class="deco-circle circle-1"></div>
      <div class="deco-circle circle-2"></div>
      <div class="deco-circle circle-3"></div>
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
    default: () => ({ color: '#3a7ca5' })
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
.artistic-blue-resume {
  max-width: 210mm;
  margin: 0 auto;
  background: linear-gradient(135deg, #f8fafc 0%, #e8f4f8 100%);
  min-height: 297mm;
  position: relative;
  overflow: hidden;
  font-family: 'Microsoft YaHei', 'SimSun', sans-serif;
}

.decorative-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 150px;
  z-index: 0;
}

.wave-bg {
  width: 100%;
  height: 150px;
}

.header-section {
  position: relative;
  z-index: 1;
  padding: 60px 50px 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.header-content {
  flex: 1;
}

.name {
  font-size: 48px;
  color: #1e3c5e;
  margin: 0;
  font-weight: 300;
  letter-spacing: 4px;
}

.subtitle {
  font-size: 16px;
  color: #3a7ca5;
  margin: 8px 0 0;
  letter-spacing: 6px;
  font-weight: 500;
}

.photo-container {
  flex-shrink: 0;
}

.photo-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3a7ca5, #2d6a8f);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(58, 124, 165, 0.3);
  border: 4px solid white;
}

.photo-placeholder {
  font-size: 60px;
}

.resume-content {
  position: relative;
  z-index: 1;
  padding: 0 50px 40px;
}

.modules-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.module-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s;
}

.module-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.module-card.full-width {
  grid-column: 1 / -1;
}

.module-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e8f4f8;
}

.module-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3a7ca5, #2d6a8f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.module-title {
  font-size: 16px;
  color: #1e3c5e;
  margin: 0;
  font-weight: 600;
}

.module-title-cn {
  font-size: 14px;
  color: #3a7ca5;
  margin-left: auto;
  font-weight: 500;
}

.module-body {
  color: #444;
}

.module-text {
  font-size: 14px;
  line-height: 1.8;
  margin: 0;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item {
  display: flex;
  font-size: 14px;
}

.info-item .label {
  color: #1e3c5e;
  font-weight: 500;
  min-width: 70px;
}

.info-item .value {
  color: #444;
  flex: 1;
}

.education-items,
.work-items {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.education-item,
.work-item {
  display: flex;
  gap: 15px;
}

.edu-date,
.work-date {
  min-width: 120px;
  color: #3a7ca5;
  font-weight: 600;
  font-size: 14px;
  padding-top: 2px;
}

.edu-content,
.work-content {
  flex: 1;
}

.edu-school,
.work-company {
  font-size: 16px;
  font-weight: 600;
  color: #1e3c5e;
  margin-bottom: 4px;
}

.edu-details {
  font-size: 14px;
  color: #666;
}

.work-position {
  font-size: 14px;
  color: #3a7ca5;
  margin-bottom: 6px;
}

.work-desc ul {
  margin: 0;
  padding-left: 18px;
}

.work-desc li {
  font-size: 14px;
  line-height: 1.8;
  color: #444;
  margin-bottom: 4px;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  background: linear-gradient(135deg, #e8f4f8, #d0e8f0);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: #1e3c5e;
  border: 1px solid #b8d8e8;
}

.honors-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.honor-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #444;
}

.honor-dot {
  color: #3a7ca5;
  margin-top: 2px;
}

.decorative-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  z-index: 0;
}

.mountain-bg {
  width: 100%;
  height: 120px;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, #f9a826, #f57c00);
  opacity: 0.6;
}

.circle-1 {
  width: 80px;
  height: 80px;
  bottom: 60px;
  right: 80px;
}

.circle-2 {
  width: 50px;
  height: 50px;
  bottom: 100px;
  right: 180px;
}

.circle-3 {
  width: 30px;
  height: 30px;
  bottom: 40px;
  right: 240px;
}

.resume-actions {
  position: relative;
  z-index: 10;
  padding: 20px 50px 40px;
  display: flex;
  gap: 15px;
  justify-content: center;
  border-top: 1px solid #e0e0e0;
  background: rgba(255, 255, 255, 0.9);
}

.action-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'SimSun', serif;
}

.print-btn {
  background: #f0f4f8;
  color: #1e3c5e;
  border: 1px solid #1e3c5e;
}

.print-btn:hover {
  background: #e0eaf4;
}

.pdf-btn {
  background: linear-gradient(135deg, #3a7ca5, #2d6a8f);
  color: white;
}

.pdf-btn:hover {
  background: linear-gradient(135deg, #2d6a8f, #1e3c5e);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(58, 124, 165, 0.3);
}

@media print {
  .artistic-blue-resume {
    box-shadow: none;
    max-width: 100%;
  }
  
  .resume-actions {
    display: none;
  }
  
  .deco-circle {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  @page {
    margin: 0;
    size: A4 portrait;
  }
}
</style>
