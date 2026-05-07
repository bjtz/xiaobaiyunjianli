<template>
  <div class="resume-builder">
    <h3>简历生成器</h3>
    <div class="resume-form" v-if="!generatedResume">
      <div class="form-group">
        <label for="resumeTemplate">简历模板 *</label>
        <select id="resumeTemplate" v-model="selectedTemplate" required>
          <option value="html">HTML简历模板</option>
          <option value="artistic-blue">艺术蓝色模板</option>
          <option value="sidebar-pink">侧边栏粉色模板</option>
          <option value="red-simple">红色简洁模板</option>
          <option value="blue-business">蓝色商务模板</option>
          <option value="modern-simple">现代简约模板</option>
        </select>
      </div>
      <div class="form-group">
        <label for="locale">语言</label>
        <select id="locale" v-model="currentLocale">
          <option value="zh-CN">中文</option>
          <option value="en-US">英文</option>
        </select>
      </div>
      <div class="form-group">
        <label for="resumeName">姓名 *</label>
        <input type="text" id="resumeName" v-model="resumeData.profile.name" placeholder="请输入您的姓名" required>
      </div>
      <div class="form-group">
        <label for="positionTitle">应聘岗位 *</label>
        <input type="text" id="positionTitle" v-model="resumeData.profile.positionTitle" placeholder="请输入您想申请的职位" required>
      </div>
      <div class="form-group">
        <label for="mobile">电话</label>
        <input type="text" id="mobile" v-model="resumeData.profile.mobile" placeholder="请输入您的电话">
      </div>
      <div class="form-group">
        <label for="email">邮箱</label>
        <input type="email" id="email" v-model="resumeData.profile.email" placeholder="请输入您的邮箱">
      </div>
      <div class="form-group">
        <label for="github">GitHub</label>
        <input type="text" id="github" v-model="resumeData.profile.github" placeholder="https://github.com/username">
      </div>
      <div class="form-group">
        <label for="workPlace">工作地点</label>
        <input type="text" id="workPlace" v-model="resumeData.profile.workPlace" placeholder="请输入您期望的工作地点">
      </div>
      
      <!-- 教育经历 -->
      <div class="form-section">
        <h4>{{ currentLocale === 'zh-CN' ? '教育经历' : 'Education' }}</h4>
        <div v-for="(edu, index) in resumeData.educationList" :key="index" class="education-item">
          <div class="form-row">
            <div class="form-group half">
              <label>{{ currentLocale === 'zh-CN' ? '开始时间' : 'Start Date' }}</label>
              <input type="date" v-model="edu.edu_time[0]">
            </div>
            <div class="form-group half">
              <label>{{ currentLocale === 'zh-CN' ? '结束时间' : 'End Date' }}</label>
              <input type="date" v-model="edu.edu_time[1]">
            </div>
          </div>
          <div class="form-group">
            <label>{{ currentLocale === 'zh-CN' ? '学校' : 'School' }}</label>
            <input type="text" v-model="edu.school" value="广东白云学院" readonly style="background-color: #f5f5f5;" required>
          </div>
          <div class="form-group">
            <label>{{ currentLocale === 'zh-CN' ? '学院' : 'College' }}</label>
            <select v-model="edu.college" required>
              <option value="">请选择学院</option>
              <option value="智能制造工程学院">智能制造工程学院</option>
              <option value="电气与信息工程学院">电气与信息工程学院</option>
              <option value="建筑工程学院">建筑工程学院</option>
              <option value="大数据与计算机学院">大数据与计算机学院</option>
              <option value="会计学院">会计学院</option>
              <option value="应用经济学院">应用经济学院</option>
              <option value="工商管理学院">工商管理学院</option>
              <option value="外国语学院">外国语学院</option>
              <option value="艺术设计学院">艺术设计学院</option>
              <option value="传媒学院">传媒学院</option>
              <option value="体育学院">体育学院</option>
              <option value="教育学院">教育学院</option>
              <option value="国际学院">国际学院</option>
              <option value="国际时尚设计学院">国际时尚设计学院</option>
              <option value="曙光大数据产业学院">曙光大数据产业学院</option>
              <option value="华为ICT学院">华为ICT学院</option>
              <option value="创新创业学院">创新创业学院</option>
              <option value="马克思主义学院">马克思主义学院</option>
              <option value="继续教育学院">继续教育学院</option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ currentLocale === 'zh-CN' ? '专业' : 'Major' }}</label>
            <input type="text" v-model="edu.major" placeholder="请输入专业名称">
          </div>
          <div class="form-group">
            <label>{{ currentLocale === 'zh-CN' ? '学位' : 'Degree' }}</label>
            <select v-model="edu.academic_degree">
              <option value="">请选择学位</option>
              <option value="本科">本科</option>
              <option value="硕士">硕士</option>
              <option value="博士">博士</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <button @click="removeEducation(index)" class="remove-btn">
            {{ currentLocale === 'zh-CN' ? '删除' : 'Remove' }}
          </button>
        </div>
        <button @click="addEducation" class="add-btn">
          {{ currentLocale === 'zh-CN' ? '添加教育经历' : 'Add Education' }}
        </button>
      </div>
      
      <!-- 工作经历 -->
      <div class="form-section">
        <h4>{{ currentLocale === 'zh-CN' ? '工作经历' : 'Work Experience' }}</h4>
        <div v-for="(work, index) in resumeData.workExpList" :key="index" class="work-item">
          <div class="form-row">
            <div class="form-group half">
              <label>{{ currentLocale === 'zh-CN' ? '公司名称' : 'Company' }}</label>
              <input type="text" v-model="work.company_name" placeholder="请输入公司名称">
            </div>
            <div class="form-group half">
              <label>{{ currentLocale === 'zh-CN' ? '部门' : 'Department' }}</label>
              <input type="text" v-model="work.department_name" placeholder="请输入部门名称">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group half">
              <label>{{ currentLocale === 'zh-CN' ? '开始时间' : 'Start Date' }}</label>
              <input type="text" v-model="work.work_time[0]" placeholder="例如：2024.01">
            </div>
            <div class="form-group half">
              <label>{{ currentLocale === 'zh-CN' ? '结束时间' : 'End Date' }}</label>
              <input type="text" v-model="work.work_time[1]" placeholder="例如：至今">
            </div>
          </div>
          <div class="form-group">
            <label>{{ currentLocale === 'zh-CN' ? '工作描述' : 'Description' }}</label>
            <textarea v-model="work.work_desc" placeholder="请描述您的工作内容"></textarea>
          </div>
          <button @click="removeWork(index)" class="remove-btn">
            {{ currentLocale === 'zh-CN' ? '删除' : 'Remove' }}
          </button>
        </div>
        <button @click="addWork" class="add-btn">
          {{ currentLocale === 'zh-CN' ? '添加工作经历' : 'Add Work Experience' }}
        </button>
      </div>
      
      <!-- 项目经历 -->
      <div class="form-section">
        <h4>{{ currentLocale === 'zh-CN' ? '项目经历' : 'Project Experience' }}</h4>
        <div v-for="(project, index) in resumeData.projectList" :key="index" class="project-item">
          <div class="form-group">
            <label>{{ currentLocale === 'zh-CN' ? '项目名称' : 'Project Name' }}</label>
            <input type="text" v-model="project.project_name" placeholder="请输入项目名称">
          </div>
          <div class="form-group">
            <label>{{ currentLocale === 'zh-CN' ? '项目角色' : 'Role' }}</label>
            <input type="text" v-model="project.project_role" placeholder="请输入您的角色">
          </div>
          <div class="form-group">
            <label>{{ currentLocale === 'zh-CN' ? '项目时间' : 'Project Time' }}</label>
            <input type="text" v-model="project.project_time" placeholder="例如：2024.01 - 2024.06">
          </div>
          <div class="form-group">
            <label>{{ currentLocale === 'zh-CN' ? '项目描述' : 'Description' }}</label>
            <textarea v-model="project.project_desc" placeholder="请描述项目内容"></textarea>
          </div>
          <div class="form-group">
            <label>{{ currentLocale === 'zh-CN' ? '项目职责' : 'Responsibilities' }}</label>
            <textarea v-model="project.project_content" placeholder="请描述您的职责"></textarea>
          </div>
          <button @click="removeProject(index)" class="remove-btn">
            {{ currentLocale === 'zh-CN' ? '删除' : 'Remove' }}
          </button>
        </div>
        <button @click="addProject" class="add-btn">
          {{ currentLocale === 'zh-CN' ? '添加项目经历' : 'Add Project' }}
        </button>
      </div>
      
      <!-- 技能列表 -->
      <div class="form-section">
        <h4>{{ currentLocale === 'zh-CN' ? '专业技能' : 'Skills' }}</h4>
        <div v-for="(skill, index) in resumeData.skillList" :key="index" class="skill-item">
          <div class="form-row">
            <div class="form-group three-quarters">
              <label>{{ currentLocale === 'zh-CN' ? '技能名称' : 'Skill Name' }}</label>
              <input type="text" v-model="skill.skill_name" placeholder="例如：JavaScript">
            </div>
            <div class="form-group quarter">
              <label>{{ currentLocale === 'zh-CN' ? '熟练度' : 'Level' }}</label>
              <input type="number" v-model="skill.skill_level" placeholder="0-100">
            </div>
          </div>
          <div class="form-group">
            <label>{{ currentLocale === 'zh-CN' ? '技能描述' : 'Description' }}</label>
            <input type="text" v-model="skill.skill_desc" placeholder="请描述您的技能水平">
          </div>
          <button @click="removeSkill(index)" class="remove-btn">
            {{ currentLocale === 'zh-CN' ? '删除' : 'Remove' }}
          </button>
        </div>
        <button @click="addSkill" class="add-btn">
          {{ currentLocale === 'zh-CN' ? '添加技能' : 'Add Skill' }}
        </button>
      </div>
      
      <!-- 自我介绍 -->
      <div class="form-section">
        <h4>{{ currentLocale === 'zh-CN' ? '自我介绍' : 'About Me' }}</h4>
        <div class="form-group">
          <textarea v-model="resumeData.aboutme.aboutme_desc" placeholder="请输入您的自我介绍"></textarea>
        </div>
      </div>
      
      <div class="form-actions">
        <button @click="generateResume">
          {{ currentLocale === 'zh-CN' ? '生成简历' : 'Generate Resume' }}
        </button>
        <button @click="cancel">
          {{ currentLocale === 'zh-CN' ? '取消' : 'Cancel' }}
        </button>
      </div>
    </div>
    
    <div v-else class="generated-resume">
      <h3>{{ currentLocale === 'zh-CN' ? '生成的简历' : 'Generated Resume' }}</h3>
      <div class="resume-content">
        <ResumeTemplate 
          :value="resumeData" 
          :template="selectedTemplate"
          :locale="currentLocale"
        />
      </div>
      <div class="resume-actions">
        <button @click="copyResume">
          {{ currentLocale === 'zh-CN' ? '复制简历' : 'Copy Resume' }}
        </button>
        <button @click="downloadResume">
          {{ currentLocale === 'zh-CN' ? '下载TXT简历' : 'Download TXT' }}
        </button>
        <button @click="downloadMarkdownResume">
          {{ currentLocale === 'zh-CN' ? '下载MD简历' : 'Download MD' }}
        </button>
        <button @click="downloadHTMLResume">
          {{ currentLocale === 'zh-CN' ? '下载HTML简历' : 'Download HTML' }}
        </button>
        <button @click="downloadWordResume">
          {{ currentLocale === 'zh-CN' ? 'MD转Word' : 'MD to Word' }}
        </button>
        <button @click="downloadPDFResume">
          {{ currentLocale === 'zh-CN' ? '下载PDF简历' : 'Download PDF' }}
        </button>
        <button @click="reset">
          {{ currentLocale === 'zh-CN' ? '重新生成' : 'Reset' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import html2pdf from 'html2pdf.js';
import ResumeTemplate from '../vue-resume-module/components/ResumeTemplate.vue';

export default {
  name: 'ResumeBuilder',
  components: {
    ResumeTemplate
  },
  props: {
    initialData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      selectedTemplate: 'html',
      currentLocale: 'zh-CN',
      resumeData: {
        profile: {
          name: '',
          positionTitle: '',
          mobile: '',
          email: '',
          github: '',
          workExpYear: '',
          workPlace: ''
        },
        educationList: [
          {
            edu_time: ['', ''],
            school: '广东白云学院',
            college: '',
            major: '',
            academic_degree: ''
          }
        ],
        workExpList: [
          {
            company_name: '',
            department_name: '',
            work_time: ['', ''],
            work_desc: ''
          }
        ],
        projectList: [
          {
            project_name: '',
            project_role: '',
            project_time: '',
            project_desc: '',
            project_content: ''
          }
        ],
        skillList: [
          {
            skill_name: '',
            skill_level: 80,
            skill_desc: ''
          }
        ],
        aboutme: {
          aboutme_desc: ''
        }
      },
      generatedResume: null
    }
  },
  mounted() {
    // 优先使用传入的initialData，如果没有则从localStorage中读取
    if (this.initialData) {
      this.loadFromInitialData()
    } else {
      this.loadImportedData()
    }
  },
  methods: {
    loadFromInitialData() {
      try {
        const data = this.initialData
        
        // 填充个人信息
        if (data.profile) {
          this.resumeData.profile = {
            ...this.resumeData.profile,
            ...data.profile
          }
        }
        
        // 填充教育经历
        if (data.educationList && data.educationList.length > 0) {
          this.resumeData.educationList = data.educationList.filter(edu => edu.school).map(edu => ({
            edu_time: edu.edu_time || ['2020-09', '2024-06'],
            school: edu.school || '',
            college: edu.college || '',
            major: edu.major || '',
            academic_degree: edu.academic_degree || '本科'
          }))
        }
        
        // 填充工作经历
        if (data.workExpList && data.workExpList.length > 0) {
          this.resumeData.workExpList = data.workExpList.filter(work => work.company_name).map(work => ({
            work_time: work.work_time || ['2024-07', '至今'],
            company_name: work.company_name || '',
            department_name: work.department_name || '',
            work_desc: work.work_desc || ''
          }))
        }
        
        // 填充项目经历
        if (data.projectList && data.projectList.length > 0) {
          this.resumeData.projectList = data.projectList.filter(project => project.project_name).map(project => ({
            project_name: project.project_name || '',
            project_role: '',
            project_time: project.project_time ? project.project_time.join(' - ') : '',
            project_desc: project.project_desc || '',
            project_content: project.project_skills || ''
          }))
        }
        
        // 填充技能
        if (data.skillList && data.skillList.length > 0) {
          this.resumeData.skillList = data.skillList.filter(skill => skill.skill_name).map(skill => ({
            skill_name: skill.skill_name || '',
            skill_level: skill.skill_level || 80,
            skill_desc: skill.skill_desc || ''
          }))
        }
      } catch (error) {
        console.error('Failed to load initial data:', error)
      }
    },
    loadImportedData() {
      try {
        // 读取导入的资料
        const importData = localStorage.getItem('importData')
        if (importData) {
          const data = JSON.parse(importData)
          
          // 填充个人信息
          if (data.profile) {
            this.resumeData.profile = {
              ...this.resumeData.profile,
              ...data.profile
            }
          }
          
          // 填充教育经历
          if (data.educationList && data.educationList.length > 0) {
            this.resumeData.educationList = data.educationList.map(edu => ({
              edu_time: edu.edu_time || ['2020-09', '2024-06'],
              school: edu.school || '',
              college: edu.college || '',
              major: edu.major || '',
              academic_degree: edu.academic_degree || '本科'
            }))
          }
          
          // 填充工作经历
          if (data.workExpList && data.workExpList.length > 0) {
            this.resumeData.workExpList = data.workExpList.map(work => ({
              work_time: work.work_time || ['2024-07', '至今'],
              company_name: work.company_name || '',
              department_name: work.department_name || '',
              work_desc: work.work_desc || ''
            }))
          }
          
          // 填充技能
          if (data.skillList && data.skillList.length > 0) {
            this.resumeData.skillList = data.skillList.map(skill => ({
              skill_name: skill.skill_name || '',
              skill_level: skill.skill_level || '80',
              skill_desc: skill.skill_desc || ''
            }))
          }
        }
      } catch (error) {
        console.error('Failed to load imported data:', error)
      }
    },
    
    generateResume() {
      // 验证必填字段
      if (!this.selectedTemplate) {
        alert(this.currentLocale === 'zh-CN' ? '请选择简历模板' : 'Please select a template')
        return
      }
      if (!this.resumeData.profile.name || !this.resumeData.profile.positionTitle) {
        alert(this.currentLocale === 'zh-CN' ? '请填写所有必填字段（姓名、应聘岗位）' : 'Please fill in all required fields (name, position)')
        return
      }
      
      // 生成简历
      this.generatedResume = '简历已生成'
    },
    addEducation() {
      this.resumeData.educationList.push({
        edu_time: ['', ''],
        school: '广东白云学院',
        college: '',
        major: '',
        academic_degree: ''
      })
    },
    removeEducation(index) {
      if (this.resumeData.educationList.length > 1) {
        this.resumeData.educationList.splice(index, 1)
      }
    },
    addWork() {
      this.resumeData.workExpList.push({
        company_name: '',
        department_name: '',
        work_time: ['', ''],
        work_desc: ''
      })
    },
    removeWork(index) {
      if (this.resumeData.workExpList.length > 1) {
        this.resumeData.workExpList.splice(index, 1)
      }
    },
    addProject() {
      this.resumeData.projectList.push({
        project_name: '',
        project_role: '',
        project_time: '',
        project_desc: '',
        project_content: ''
      })
    },
    removeProject(index) {
      if (this.resumeData.projectList.length > 1) {
        this.resumeData.projectList.splice(index, 1)
      }
    },
    addSkill() {
      this.resumeData.skillList.push({
        skill_name: '',
        skill_level: 80,
        skill_desc: ''
      })
    },
    removeSkill(index) {
      if (this.resumeData.skillList.length > 1) {
        this.resumeData.skillList.splice(index, 1)
      }
    },
    copyResume() {
      alert(this.currentLocale === 'zh-CN' ? '简历已复制到剪贴板' : 'Resume copied to clipboard')
    },
    downloadResume() {
      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.generateResumeText()))
      element.setAttribute('download', `${this.resumeData.profile.name}_简历.txt`)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    },
    downloadWordResume() {
      if (this.resumeData) {
        // 创建Word文档
        const doc = this.createWordDocument();

        // 生成Word文档并下载
        Packer.toBlob(doc).then((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${this.resumeData.profile.name}_简历.docx`;
          link.click();
          URL.revokeObjectURL(url);
        });
      }
    },
    downloadPDFResume() {
      if (this.resumeData) {
        // 创建一个临时容器，用于生成PDF
        const tempContainer = document.createElement('div');
        tempContainer.style.width = '210mm';
        tempContainer.style.padding = '10mm';
        tempContainer.style.margin = '0 auto';
        tempContainer.style.backgroundColor = '#fff';
        tempContainer.style.fontFamily = 'SimSun, serif';
        
        // 复制简历内容到临时容器
        const resumeElement = document.querySelector('.resume-content');
        if (resumeElement) {
          tempContainer.innerHTML = resumeElement.innerHTML;
          document.body.appendChild(tempContainer);
          
          // 配置PDF选项
          const opt = {
            margin: 0,
            filename: `${this.resumeData.profile.name}_简历.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              logging: false,
              letterRendering: true
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };

          // 生成PDF并下载
          html2pdf().set(opt).from(tempContainer).save().then(() => {
            // 下载完成后移除临时容器
            document.body.removeChild(tempContainer);
          });
        }
      }
    },
    generateResumeText() {
      let text = this.currentLocale === 'zh-CN' ? '个人简历\n\n' : 'RESUME\n\n';
      
      // 个人信息
      text += this.currentLocale === 'zh-CN' ? `姓名: ${this.resumeData.profile.name}\n` : `Name: ${this.resumeData.profile.name}\n`;
      text += this.currentLocale === 'zh-CN' ? `应聘岗位: ${this.resumeData.profile.positionTitle}\n` : `Position: ${this.resumeData.profile.positionTitle}\n`;
      if (this.resumeData.profile.mobile) {
        text += this.currentLocale === 'zh-CN' ? `电话: ${this.resumeData.profile.mobile}\n` : `Phone: ${this.resumeData.profile.mobile}\n`;
      }
      if (this.resumeData.profile.email) {
        text += this.currentLocale === 'zh-CN' ? `邮箱: ${this.resumeData.profile.email}\n` : `Email: ${this.resumeData.profile.email}\n`;
      }
      if (this.resumeData.profile.github) {
        text += this.currentLocale === 'zh-CN' ? `GitHub: ${this.resumeData.profile.github}\n` : `GitHub: ${this.resumeData.profile.github}\n`;
      }
      if (this.resumeData.profile.workPlace) {
        text += this.currentLocale === 'zh-CN' ? `工作地点: ${this.resumeData.profile.workPlace}\n` : `Location: ${this.resumeData.profile.workPlace}\n`;
      }
      
      // 教育背景
      text += '\n' + (this.currentLocale === 'zh-CN' ? '教育背景:\n' : 'EDUCATION:\n');
      this.resumeData.educationList.forEach(edu => {
        if (edu.school) {
          text += `${edu.edu_time[0]} - ${edu.edu_time[1]} ${edu.school} ${edu.major} ${edu.academic_degree}\n`;
        }
      });
      
      // 工作经历
      text += '\n' + (this.currentLocale === 'zh-CN' ? '工作经历:\n' : 'WORK EXPERIENCE:\n');
      this.resumeData.workExpList.forEach(work => {
        if (work.company_name) {
          text += `${work.work_time[0]} - ${work.work_time[1]} ${work.company_name} ${work.department_name}\n`;
          text += `${work.work_desc}\n`;
        }
      });
      
      // 项目经历
      text += '\n' + (this.currentLocale === 'zh-CN' ? '项目经历:\n' : 'PROJECT EXPERIENCE:\n');
      this.resumeData.projectList.forEach(project => {
        if (project.project_name) {
          text += `${project.project_time} ${project.project_name} ${project.project_role}\n`;
          text += `${project.project_desc}\n`;
          text += `${project.project_content}\n`;
        }
      });
      
      // 专业技能
      text += '\n' + (this.currentLocale === 'zh-CN' ? '专业技能:\n' : 'SKILLS:\n');
      this.resumeData.skillList.forEach(skill => {
        if (skill.skill_name) {
          text += `${skill.skill_name} (${skill.skill_level}%) ${skill.skill_desc}\n`;
        }
      });
      
      // 自我介绍
      if (this.resumeData.aboutme.aboutme_desc) {
        text += '\n' + (this.currentLocale === 'zh-CN' ? '自我介绍:\n' : 'ABOUT ME:\n');
        text += `${this.resumeData.aboutme.aboutme_desc}\n`;
      }
      
      return text;
    },
    generateResumeMarkdown() {
      let md = `# ${this.resumeData.profile.name || '个人简历'}\n\n`;
      
      // 个人信息
      md += `## ${this.currentLocale === 'zh-CN' ? '联系方式' : 'Contact Information'}\n\n`;
      if (this.resumeData.profile.positionTitle) {
        md += `${this.currentLocale === 'zh-CN' ? '应聘岗位' : 'Position'}: ${this.resumeData.profile.positionTitle}\n\n`;
      }
      const contactInfo = [];
      if (this.resumeData.profile.mobile) {
        contactInfo.push(`${this.currentLocale === 'zh-CN' ? '电话' : 'Phone'}: ${this.resumeData.profile.mobile}`);
      }
      if (this.resumeData.profile.email) {
        contactInfo.push(`${this.currentLocale === 'zh-CN' ? '邮箱' : 'Email'}: ${this.resumeData.profile.email}`);
      }
      if (this.resumeData.profile.github) {
        contactInfo.push(`GitHub: ${this.resumeData.profile.github}`);
      }
      if (this.resumeData.profile.workPlace) {
        contactInfo.push(`${this.currentLocale === 'zh-CN' ? '工作地点' : 'Location'}: ${this.resumeData.profile.workPlace}`);
      }
      if (contactInfo.length > 0) {
        md += contactInfo.join(' | ') + '\n\n';
      }
      
      // 教育背景
      const hasEducation = this.resumeData.educationList.some(edu => edu.school);
      if (hasEducation) {
        md += `## ${this.currentLocale === 'zh-CN' ? '教育背景' : 'Education'}\n\n`;
        this.resumeData.educationList.forEach(edu => {
          if (edu.school) {
            md += `### ${edu.school}\n\n`;
            if (edu.college || edu.major || edu.academic_degree) {
              const eduInfo = [];
              if (edu.college) eduInfo.push(edu.college);
              if (edu.major) eduInfo.push(edu.major);
              if (edu.academic_degree) eduInfo.push(edu.academic_degree);
              if (eduInfo.length > 0) {
                md += `${eduInfo.join(' - ')}\n\n`;
              }
            }
            if (edu.edu_time[0] && edu.edu_time[1]) {
              md += `${edu.edu_time[0]} - ${edu.edu_time[1]}\n\n`;
            }
          }
        });
      }
      
      // 工作经历
      const hasWork = this.resumeData.workExpList.some(work => work.company_name);
      if (hasWork) {
        md += `## ${this.currentLocale === 'zh-CN' ? '工作经历' : 'Work Experience'}\n\n`;
        this.resumeData.workExpList.forEach(work => {
          if (work.company_name) {
            md += `### ${work.company_name}\n\n`;
            const workInfo = [];
            if (work.department_name) workInfo.push(work.department_name);
            if (work.work_time[0] && work.work_time[1]) {
              workInfo.push(`${work.work_time[0]} - ${work.work_time[1]}`);
            }
            if (workInfo.length > 0) {
              md += `${workInfo.join(' | ')}\n\n`;
            }
            if (work.work_desc) {
              md += `${work.work_desc}\n\n`;
            }
          }
        });
      }
      
      // 项目经历
      const hasProjects = this.resumeData.projectList.some(project => project.project_name);
      if (hasProjects) {
        md += `## ${this.currentLocale === 'zh-CN' ? '项目经历' : 'Projects'}\n\n`;
        this.resumeData.projectList.forEach(project => {
          if (project.project_name) {
            md += `### ${project.project_name}\n\n`;
            const projectInfo = [];
            if (project.project_role) projectInfo.push(project.project_role);
            if (project.project_time) projectInfo.push(project.project_time);
            if (projectInfo.length > 0) {
              md += `${projectInfo.join(' | ')}\n\n`;
            }
            if (project.project_desc) {
              md += `${project.project_desc}\n\n`;
            }
            if (project.project_content) {
              md += `${project.project_content}\n\n`;
            }
          }
        });
      }
      
      // 专业技能
      const hasSkills = this.resumeData.skillList.some(skill => skill.skill_name);
      if (hasSkills) {
        md += `## ${this.currentLocale === 'zh-CN' ? '专业技能' : 'Skills'}\n\n`;
        this.resumeData.skillList.forEach(skill => {
          if (skill.skill_name) {
            md += `- ${skill.skill_name} (${skill.skill_level}%)`;
            if (skill.skill_desc) {
              md += ` - ${skill.skill_desc}`;
            }
            md += '\n';
          }
        });
        md += '\n';
      }
      
      // 自我介绍
      if (this.resumeData.aboutme.aboutme_desc) {
        md += `## ${this.currentLocale === 'zh-CN' ? '自我介绍' : 'About Me'}\n\n`;
        md += `${this.resumeData.aboutme.aboutme_desc}\n\n`;
      }
      
      return md;
    },
    downloadMarkdownResume() {
      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/markdown;charset=utf-8,' + encodeURIComponent(this.generateResumeMarkdown()))
      element.setAttribute('download', `${this.resumeData.profile.name}_简历.md`)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    },
    downloadHTMLResume() {
      // 获取简历内容元素
      const resumeElement = document.querySelector('.resume-content');
      if (resumeElement) {
        // 创建完整的HTML文档
        const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.resumeData.profile.name}_个人简历</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .resume-container {
      max-width: 210mm;
      margin: 0 auto;
      background: white;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="resume-container">
    ${resumeElement.innerHTML}
  </div>
</body>
</html>`;
        
        // 下载HTML文件
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));
        element.setAttribute('download', `${this.resumeData.profile.name}_简历.html`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    },
    createWordDocument() {
      const children = [];
      
      // 标题
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: {
            before: 300,
            after: 300,
          },
          children: [
            new TextRun({
              text: this.currentLocale === 'zh-CN' ? '个人简历' : 'RESUME',
              bold: true,
              size: 48,
              font: 'Arial',
            }),
          ],
        })
      );
      
      // 个人信息
      children.push(
        new Paragraph({
          spacing: {
            before: 100,
            after: 100,
          },
          children: [
            new TextRun({
              text: this.currentLocale === 'zh-CN' ? '姓名: ' : 'Name: ',
              bold: true,
              size: 20,
              font: 'Arial',
            }),
            new TextRun({
              text: this.resumeData.profile.name,
              size: 20,
              font: 'Arial',
            }),
          ],
        })
      );
      
      children.push(
        new Paragraph({
          spacing: {
            after: 100,
          },
          children: [
            new TextRun({
              text: this.currentLocale === 'zh-CN' ? '应聘岗位: ' : 'Position: ',
              bold: true,
              size: 20,
              font: 'Arial',
            }),
            new TextRun({
              text: this.resumeData.profile.positionTitle,
              size: 20,
              font: 'Arial',
            }),
          ],
        })
      );
      
      if (this.resumeData.profile.mobile) {
        children.push(
          new Paragraph({
            spacing: {
              after: 100,
            },
            children: [
              new TextRun({
                text: this.currentLocale === 'zh-CN' ? '电话: ' : 'Phone: ',
                bold: true,
                size: 20,
                font: 'Arial',
              }),
              new TextRun({
                text: this.resumeData.profile.mobile,
                size: 20,
                font: 'Arial',
              }),
            ],
          })
        );
      }
      
      if (this.resumeData.profile.email) {
        children.push(
          new Paragraph({
            spacing: {
              after: 100,
            },
            children: [
              new TextRun({
                text: this.currentLocale === 'zh-CN' ? '邮箱: ' : 'Email: ',
                bold: true,
                size: 20,
                font: 'Arial',
              }),
              new TextRun({
                text: this.resumeData.profile.email,
                size: 20,
                font: 'Arial',
              }),
            ],
          })
        );
      }
      
      // 教育背景
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 200,
            after: 150,
          },
          children: [
            new TextRun({
              text: this.currentLocale === 'zh-CN' ? '教育背景' : 'EDUCATION',
              bold: true,
              size: 24,
              font: 'Arial',
            }),
          ],
        })
      );
      
      this.resumeData.educationList.forEach(edu => {
        if (edu.school) {
          children.push(
            new Paragraph({
              spacing: {
                before: 100,
                after: 100,
              },
              children: [
                new TextRun({
                  text: `${edu.edu_time[0]} - ${edu.edu_time[1]}`,
                  bold: true,
                  size: 18,
                  font: 'Arial',
                }),
              ],
            })
          );
          children.push(
            new Paragraph({
              spacing: {
                after: 50,
              },
              children: [
                new TextRun({
                  text: edu.school,
                  bold: true,
                  size: 18,
                  font: 'Arial',
                }),
              ],
            })
          );
          if (edu.college) {
            children.push(
              new Paragraph({
                spacing: {
                  after: 50,
                },
                children: [
                  new TextRun({
                    text: edu.college,
                    size: 16,
                    font: 'Arial',
                  }),
                ],
              })
            );
          }
          children.push(
            new Paragraph({
              spacing: {
                after: 50,
              },
              children: [
                new TextRun({
                  text: edu.major,
                  size: 16,
                  font: 'Arial',
                }),
              ],
            })
          );
          if (edu.academic_degree) {
            children.push(
              new Paragraph({
                spacing: {
                  after: 50,
                },
                children: [
                  new TextRun({
                    text: edu.academic_degree,
                    size: 16,
                    font: 'Arial',
                  }),
                ],
              })
            );
          }
        }
      });
      
      // 工作经历
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 200,
            after: 150,
          },
          children: [
            new TextRun({
              text: this.currentLocale === 'zh-CN' ? '工作经历' : 'WORK EXPERIENCE',
              bold: true,
              size: 24,
              font: 'Arial',
            }),
          ],
        })
      );
      
      this.resumeData.workExpList.forEach(work => {
        if (work.company_name) {
          children.push(
            new Paragraph({
              spacing: {
                before: 100,
                after: 50,
              },
              children: [
                new TextRun({
                  text: `${work.work_time[0]} - ${work.work_time[1]}`,
                  bold: true,
                  size: 18,
                  font: 'Arial',
                }),
              ],
            })
          );
          children.push(
            new Paragraph({
              spacing: {
                after: 50,
              },
              children: [
                new TextRun({
                  text: work.company_name,
                  bold: true,
                  size: 18,
                  font: 'Arial',
                }),
              ],
            })
          );
          if (work.department_name) {
            children.push(
              new Paragraph({
                spacing: {
                  after: 50,
                },
                children: [
                  new TextRun({
                    text: work.department_name,
                    size: 16,
                    font: 'Arial',
                  }),
                ],
              })
            );
          }
          if (work.work_desc) {
            children.push(
              new Paragraph({
                spacing: {
                  after: 100,
                },
                children: [
                  new TextRun({
                    text: work.work_desc,
                    size: 16,
                    font: 'Arial',
                  }),
                ],
              })
            );
          }
        }
      });
      
      // 专业技能
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 200,
            after: 150,
          },
          children: [
            new TextRun({
              text: this.currentLocale === 'zh-CN' ? '专业技能' : 'SKILLS',
              bold: true,
              size: 24,
              font: 'Arial',
            }),
          ],
        })
      );
      
      this.resumeData.skillList.forEach(skill => {
        if (skill.skill_name) {
          children.push(
            new Paragraph({
              spacing: {
                after: 80,
              },
              children: [
                new TextRun({
                  text: skill.skill_name,
                  bold: true,
                  size: 18,
                  font: 'Arial',
                }),
                new TextRun({
                  text: ` (${skill.skill_level}%)`,
                  size: 16,
                  font: 'Arial',
                }),
                new TextRun({
                  text: skill.skill_desc ? ` - ${skill.skill_desc}` : '',
                  size: 16,
                  font: 'Arial',
                }),
              ],
            })
          );
        }
      });
      
      // 自我介绍
      if (this.resumeData.aboutme.aboutme_desc) {
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 200,
              after: 150,
            },
            children: [
              new TextRun({
                text: this.currentLocale === 'zh-CN' ? '自我介绍' : 'ABOUT ME',
                bold: true,
                size: 24,
                font: 'Arial',
              }),
            ],
          })
        );
        children.push(
          new Paragraph({
            spacing: {
              after: 100,
            },
            children: [
              new TextRun({
                text: this.resumeData.aboutme.aboutme_desc,
                size: 16,
                font: 'Arial',
              }),
            ],
          })
        );
      }
      
      return new Document({
        sections: [
          {
            properties: {
              page: {
                size: {
                  width: 11906,
                  height: 16838,
                },
              },
              margin: {
                top: 720,
                right: 720,
                bottom: 720,
                left: 720,
              },
            },
            children: children,
          },
        ],
      });
    },
    reset() {
      this.generatedResume = null
      this.resumeData = {
        profile: {
          name: '',
          positionTitle: '',
          mobile: '',
          email: '',
          github: '',
          workExpYear: '',
          workPlace: ''
        },
        educationList: [
          {
            edu_time: ['', ''],
            school: '广东白云学院',
            college: '',
            major: '',
            academic_degree: ''
          }
        ],
        workExpList: [
          {
            company_name: '',
            department_name: '',
            work_time: ['', ''],
            work_desc: ''
          }
        ],
        projectList: [
          {
            project_name: '',
            project_role: '',
            project_time: '',
            project_desc: '',
            project_content: ''
          }
        ],
        skillList: [
          {
            skill_name: '',
            skill_level: 80,
            skill_desc: ''
          }
        ],
        aboutme: {
          aboutme_desc: ''
        }
      }
      this.selectedTemplate = 'html'
      this.currentLocale = 'zh-CN'
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
/* 样式已在全局styles.css中定义 */
</style>