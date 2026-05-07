<template>
  <div class="sidebar-pink-resume" ref="resumeContainer">
    <div class="resume-wrapper">
      <div class="sidebar">
        <div class="sidebar-content">
          <div class="photo-box">
            <div class="photo-placeholder">
              <span class="photo-icon">👤</span>
            </div>
          </div>
          
          <div class="sidebar-section" v-if="hasBasicInfo">
            <div class="sidebar-header">
              <h3 class="sidebar-title">个人资料</h3>
              <span class="sidebar-subtitle">Personal data</span>
            </div>
            <div class="sidebar-body">
              <div class="info-field" v-if="resumeData.profile?.name">
                <div class="info-label">姓名</div>
                <div class="info-value">{{ resumeData.profile.name }}</div>
              </div>
              <div class="info-field" v-if="resumeData.profile?.birthDate">
                <div class="info-label">出生日期</div>
                <div class="info-value">{{ resumeData.profile.birthDate }}</div>
              </div>
              <div class="info-field" v-if="resumeData.profile?.workPlace">
                <div class="info-label">籍贯</div>
                <div class="info-value">{{ resumeData.profile.workPlace }}</div>
              </div>
              <div class="info-field" v-if="resumeData.profile?.maritalStatus">
                <div class="info-label">婚姻状况</div>
                <div class="info-value">{{ resumeData.profile.maritalStatus }}</div>
              </div>
              <div class="info-field" v-if="resumeData.profile?.currentAddress">
                <div class="info-label">现住址</div>
                <div class="info-value">{{ resumeData.profile.currentAddress }}</div>
              </div>
              <div class="info-field" v-if="resumeData.profile?.mobile">
                <div class="info-label">电话</div>
                <div class="info-value">{{ resumeData.profile.mobile }}</div>
              </div>
              <div class="info-field" v-if="resumeData.profile?.email">
                <div class="info-label">邮箱</div>
                <div class="info-value">{{ resumeData.profile.email }}</div>
              </div>
            </div>
          </div>
          
          <div class="sidebar-section" v-if="hasContact">
            <div class="sidebar-header">
              <h3 class="sidebar-title">联系方式</h3>
              <span class="sidebar-subtitle">Contact info</span>
            </div>
            <div class="sidebar-body">
              <div class="contact-item" v-if="resumeData.profile?.mobile">
                <span class="contact-icon">📱</span>
                <span class="contact-text">{{ resumeData.profile.mobile }}</span>
              </div>
              <div class="contact-item" v-if="resumeData.profile?.email">
                <span class="contact-icon">📧</span>
                <span class="contact-text">{{ resumeData.profile.email }}</span>
              </div>
              <div class="contact-item" v-if="resumeData.profile?.currentAddress">
                <span class="contact-icon">📍</span>
                <span class="contact-text">{{ resumeData.profile.currentAddress }}</span>
              </div>
            </div>
          </div>
          
          <div class="sidebar-section" v-if="hasSkills">
            <div class="sidebar-header">
              <h3 class="sidebar-title">专业技能</h3>
              <span class="sidebar-subtitle">Special skills</span>
            </div>
            <div class="sidebar-body">
              <div class="skill-bar" v-for="(skill, index) in resumeData.skillList" :key="index" v-if="skill.skill_name">
                <div class="skill-name">{{ skill.skill_name }}</div>
                <div class="skill-progress">
                  <div class="skill-fill" :style="{ width: getSkillPercent(skill) }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="main-content">
        <div class="main-header">
          <div class="header-name">{{ resumeData.profile?.name || '姓名' }}</div>
          <div class="header-title" v-if="resumeData.profile?.positionTitle">{{ resumeData.profile.positionTitle }}</div>
        </div>
        
        <div class="content-section" v-if="hasWork">
          <div class="section-header">
            <span class="section-icon">💼</span>
            <h3 class="section-title">工作经验</h3>
            <span class="section-subtitle">Work experience</span>
            <div class="section-line"></div>
          </div>
          <div class="section-body">
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
        
        <div class="content-section" v-if="hasSkills">
          <div class="section-header">
            <span class="section-icon">🔧</span>
            <h3 class="section-title">个人技能</h3>
            <span class="section-subtitle">Personal skills</span>
            <div class="section-line"></div>
          </div>
          <div class="section-body">
            <div class="skills-tags">
              <span class="skill-tag" v-for="(skill, index) in resumeData.skillList" :key="index" v-if="skill.skill_name">
                {{ skill.skill_name }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="content-section" v-if="resumeData.aboutme?.aboutme_desc">
          <div class="section-header">
            <span class="section-icon">📝</span>
            <h3 class="section-title">自我评价</h3>
            <span class="section-subtitle">Self evaluation</span>
            <div class="section-line"></div>
          </div>
          <div class="section-body">
            <div class="self-evaluation">
              <p>{{ resumeData.aboutme.aboutme_desc }}</p>
            </div>
          </div>
        </div>
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
    default: () => ({ color: '#e91e63' })
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

const hasContact = computed(() => {
  return resumeData.profile?.mobile || resumeData.profile?.email;
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

const getSkillPercent = (skill) => {
  if (skill.skill_desc) {
    if (skill.skill_desc.includes('精通') || skill.skill_desc.includes('熟练')) return '90%';
    if (skill.skill_desc.includes('熟悉')) return '70%';
    if (skill.skill_desc.includes('了解')) return '50%';
  }
  return '75%';
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
.sidebar-pink-resume {
  max-width: 210mm;
  margin: 0 auto;
  background: white;
  min-height: 297mm;
  font-family: 'Microsoft YaHei', 'SimSun', sans-serif;
}

.resume-wrapper {
  display: flex;
  min-height: 297mm;
}

.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #424242 0%, #616161 50%, #424242 100%);
  color: white;
  padding: 40px 25px;
  flex-shrink: 0;
}

.sidebar-content {
  position: relative;
  z-index: 1;
}

.photo-box {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.photo-placeholder {
  width: 150px;
  height: 180px;
  background: #757575;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.photo-icon {
  font-size: 60px;
}

.sidebar-section {
  margin-bottom: 30px;
}

.sidebar-header {
  margin-bottom: 15px;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
  color: white;
}

.sidebar-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.sidebar-body {
  padding-left: 5px;
}

.info-field {
  margin-bottom: 15px;
}

.info-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
}

.info-value {
  font-size: 14px;
  color: white;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 13px;
}

.contact-icon {
  font-size: 16px;
}

.contact-text {
  color: white;
}

.skill-bar {
  margin-bottom: 15px;
}

.skill-name {
  font-size: 13px;
  margin-bottom: 6px;
  color: white;
}

.skill-progress {
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: linear-gradient(90deg, #e91e63, #f06292);
  border-radius: 4px;
  transition: width 0.5s;
}

.main-content {
  flex: 1;
  padding: 40px 35px;
  background: white;
}

.main-header {
  border-left: 5px solid #e91e63;
  padding-left: 20px;
  margin-bottom: 35px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.header-name {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.header-title {
  font-size: 16px;
  color: #e91e63;
  font-weight: 500;
}

.content-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.section-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #e91e63, #f06292);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.section-subtitle {
  font-size: 12px;
  color: #999;
  margin: 0 0 0 5px;
}

.section-line {
  flex: 1;
  height: 3px;
  background: linear-gradient(90deg, #e91e63, #f06292);
  margin-left: 15px;
}

.section-body {
  padding-left: 47px;
}

.work-item {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px dashed #e0e0e0;
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
  color: #e91e63;
  font-weight: 500;
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
  margin-bottom: 5px;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  background: linear-gradient(135deg, #fce4ec, #f8bbd9);
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  color: #e91e63;
  border: 1px solid #f06292;
}

.self-evaluation p {
  font-size: 14px;
  line-height: 1.8;
  color: #555;
  margin: 0;
}

.resume-actions {
  padding: 20px 35px 30px;
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
  background: #fce4ec;
  color: #e91e63;
  border: 1px solid #e91e63;
}

.print-btn:hover {
  background: #f8bbd9;
}

.pdf-btn {
  background: linear-gradient(135deg, #e91e63, #f06292);
  color: white;
}

.pdf-btn:hover {
  background: linear-gradient(135deg, #c2185b, #e91e63);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
}

@media print {
  .sidebar-pink-resume {
    box-shadow: none;
    max-width: 100%;
  }
  
  .resume-actions {
    display: none;
  }
  
  .sidebar {
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
