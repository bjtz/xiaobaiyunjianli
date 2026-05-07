<template>
  <div class="html-resume-container" ref="resumeContainer">
    <div class="resume-header">
      <div class="header-top-bar"></div>
      <div class="header-content">
        <div class="personal-info">
          <h1 class="name">{{ resumeData.profile?.name || '姓名' }}</h1>
          <p class="position">{{ resumeData.profile?.positionTitle || '应聘岗位' }}</p>
          
          <div class="contact-details">
            <div class="contact-item" v-if="resumeData.profile?.mobile">
              <span class="icon">📞</span>
              <span>{{ resumeData.profile.mobile }}</span>
            </div>
            <div class="contact-item" v-if="resumeData.profile?.email">
              <span class="icon">📧</span>
              <span>{{ resumeData.profile.email }}</span>
            </div>
            <div class="contact-item" v-if="resumeData.profile?.workPlace">
              <span class="icon">📍</span>
              <span>{{ resumeData.profile.workPlace }}</span>
            </div>
            <div class="contact-item" v-if="resumeData.profile?.github">
              <span class="icon">🔗</span>
              <span>{{ resumeData.profile.github }}</span>
            </div>
          </div>
        </div>
        
        <div class="photo-placeholder">
          <div class="photo-box">
            <span class="photo-text">照片</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="resume-body">
      <div class="section" v-if="hasEducation">
        <div class="section-header">
          <div class="section-icon">🎓</div>
          <h2 class="section-title">教育背景 (Education)</h2>
          <div class="section-line"></div>
        </div>
        
        <div class="education-list">
          <div class="education-item" v-for="(edu, index) in resumeData.educationList" :key="index">
            <div class="edu-header">
              <span class="edu-dates">{{ edu.edu_time?.[0] || '2020.09' }} - {{ edu.edu_time?.[1] || '2024.06' }}</span>
              <span class="edu-school">{{ edu.school || '学校名称' }}</span>
              <span class="edu-major">{{ edu.major || '专业' }}</span>
            </div>
            <div class="edu-details">
              <span v-if="edu.college">{{ edu.college }}</span>
              <span v-if="edu.academic_degree">· {{ edu.academic_degree }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="section" v-if="hasWork">
        <div class="section-header">
          <div class="section-icon">💼</div>
          <h2 class="section-title">实习经历 (Internship)</h2>
          <div class="section-line"></div>
        </div>
        
        <div class="work-list">
          <div class="work-item" v-for="(work, index) in resumeData.workExpList" :key="index">
            <div class="work-header">
              <span class="work-dates">{{ work.work_time?.[0] || '2024.07' }} - {{ work.work_time?.[1] || '至今' }}</span>
              <span class="work-company">{{ work.company_name || '公司名称' }}</span>
              <span class="work-position">{{ work.department_name || '职位' }}</span>
            </div>
            <div class="work-description" v-if="work.work_desc">
              <ul>
                <li v-for="(line, i) in work.work_desc.split('\n')" :key="i">{{ line }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div class="section" v-if="hasProjects">
        <div class="section-header">
          <div class="section-icon">🏫</div>
          <h2 class="section-title">校园经历 (Campus)</h2>
          <div class="section-line"></div>
        </div>
        
        <div class="project-list">
          <div class="project-item" v-for="(project, index) in resumeData.projectList" :key="index">
            <div class="project-header">
              <span class="project-dates">{{ getProjectDateRange(project.project_time) }}</span>
              <span class="project-company">{{ getProjectCompany(project) }}</span>
              <span class="project-position">{{ project.project_role || '职位' }}</span>
            </div>
            <div class="project-description" v-if="project.project_desc">
              <ul>
                <li v-for="(line, i) in project.project_desc.split('\n')" :key="i">{{ line }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div class="section" v-if="hasSkills">
        <div class="section-header">
          <div class="section-icon">🔧</div>
          <h2 class="section-title">技能证书 (Skills)</h2>
          <div class="section-line"></div>
        </div>
        
        <div class="skills-list">
          <div class="skill-item" v-for="(skill, index) in resumeData.skillList" :key="index">
            <span class="skill-name">{{ skill.skill_name || '技能名称' }}</span>
            <span v-if="skill.skill_desc">· {{ skill.skill_desc }}</span>
          </div>
        </div>
      </div>
      
      <div class="section" v-if="resumeData.aboutme?.aboutme_desc">
        <div class="section-header">
          <div class="section-icon">📝</div>
          <h2 class="section-title">自我评价 (Self-assessment)</h2>
          <div class="section-line"></div>
        </div>
        
        <div class="about-me">
          <p>{{ resumeData.aboutme.aboutme_desc }}</p>
        </div>
      </div>
    </div>
    
    <div class="resume-actions" v-if="!isPrintMode">
      <button class="action-btn print-btn" @click="printResume">
        🖨️ 打印简历
      </button>
      <button class="action-btn pdf-btn" @click="downloadPDF">
        📄 导出PDF
      </button>
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
    default: () => ({ color: '#2f5785' })
  },
  locale: {
    type: String,
    default: 'zh-CN'
  }
});

const resumeData = props.value;
const resumeContainer = ref(null);
const isPrintMode = ref(false);

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

const getProjectDateRange = (timeStr) => {
  if (!timeStr) return '2023.03 - 2023.06';
  const parts = timeStr.split(' - ');
  if (parts.length === 2) return timeStr;
  return `${timeStr} - 至今`;
};

const getProjectCompany = (project) => {
  if (project.project_company) return project.project_company;
  return project.project_name || '项目名称';
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
.html-resume-container {
  max-width: 210mm;
  margin: 0 auto;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-family: 'SimSun', 'Microsoft YaHei', serif;
  position: relative;
}

.resume-header {
  position: relative;
}

.header-top-bar {
  height: 8px;
  background: linear-gradient(90deg, #1e3c5e, #2f5785, #4a7cb3);
}

.header-content {
  padding: 30px 40px 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
  border-bottom: 2px solid #1e3c5e;
}

.personal-info {
  flex: 1;
}

.name {
  font-size: 32px;
  font-weight: bold;
  color: #1e3c5e;
  margin: 0 0 8px;
  letter-spacing: 2px;
}

.position {
  font-size: 18px;
  color: #2f5785;
  margin: 0 0 20px;
  font-weight: 500;
}

.contact-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 20px;
  margin-top: 15px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
}

.contact-item .icon {
  font-size: 14px;
}

.photo-placeholder {
  flex-shrink: 0;
}

.photo-box {
  width: 100px;
  height: 120px;
  border: 2px solid #1e3c5e;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.photo-text {
  color: #999;
  font-size: 14px;
}

.resume-body {
  padding: 20px 40px 30px;
}

.section {
  margin-bottom: 25px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.section-icon {
  font-size: 20px;
  width: 32px;
  height: 32px;
  background: #1e3c5e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #1e3c5e;
  margin: 0;
  flex: 0;
}

.section-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, #1e3c5e, transparent);
}

.education-list,
.work-list,
.project-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.edu-header,
.work-header,
.project-header {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 15px;
  margin-bottom: 5px;
}

.edu-dates,
.work-dates,
.project-dates {
  color: #1e3c5e;
  font-weight: bold;
  min-width: 120px;
}

.edu-school,
.work-company,
.project-company {
  font-weight: bold;
  color: #333;
}

.edu-major,
.work-position,
.project-position {
  color: #666;
}

.edu-details {
  font-size: 14px;
  color: #555;
  padding-left: 135px;
}

.work-description,
.project-description {
  padding-left: 135px;
}

.work-description ul,
.project-description ul {
  margin: 0;
  padding-left: 20px;
}

.work-description li,
.project-description li {
  font-size: 14px;
  color: #444;
  line-height: 1.8;
  margin-bottom: 5px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.skill-item {
  font-size: 14px;
  color: #444;
  background: #f0f4f8;
  padding: 8px 15px;
  border-radius: 4px;
  border-left: 3px solid #1e3c5e;
}

.skill-name {
  font-weight: bold;
}

.about-me p {
  font-size: 14px;
  line-height: 1.8;
  color: #444;
  margin: 0;
  padding-left: 44px;
}

.resume-actions {
  padding: 20px 40px 30px;
  display: flex;
  gap: 15px;
  justify-content: center;
  border-top: 1px solid #eee;
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
  background: #f0f4f8;
  color: #1e3c5e;
  border: 1px solid #1e3c5e;
}

.print-btn:hover {
  background: #e0eaf4;
}

.pdf-btn {
  background: linear-gradient(135deg, #1e3c5e, #2f5785);
  color: white;
}

.pdf-btn:hover {
  background: linear-gradient(135deg, #2f5785, #4a7cb3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 60, 94, 0.3);
}

@media print {
  .html-resume-container {
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