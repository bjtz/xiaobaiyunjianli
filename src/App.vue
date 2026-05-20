<template>
  <div class="container" v-if="!activeModule">
    <!-- 遮罩层 -->
    <div class="sidebar-overlay" v-show="showSidebar" @click="toggleSidebar" :class="{ 'show-sidebar': showSidebar }"></div>
    
    <!-- 左侧功能区 -->
    <div class="sidebar-container" :class="{ 'show-sidebar': showSidebar }">
      <Sidebar 
        @import-data="handleImportData"
        @navigate="handleNavigation"
      />
    </div>
    
    <!-- 右侧工作区 -->
    <div class="workspace">
      <div class="workspace-header">
        <div class="header-left">
          <button class="sidebar-toggle-btn" @click="toggleSidebar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-list icon" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
            </svg>
          </button>
          <div>
            <h3 class="workspace-title">WORKSPACE</h3>
            <h2 class="workspace-name">小白云简历生成助手</h2>
          </div>
        </div>
        <div class="status">
          <div class="status-dot"></div>
          <span class="status-text">{{ statusText }}</span>
        </div>
      </div>
      
      <!-- 内容区域 -->
      <div class="content-area-wrapper">
        <!-- 聊天视图 -->
        <div v-if="activeView === 'chat'">
          <!-- 主内容 -->
          <div v-if="!showChatInterface" class="content-area">
            <div class="main-content">
              <h3>欢迎使用小白云简历生成助手</h3>
              <p>您可以通过以下方式使用本助手：</p>
              <ul>
                <li>点击左侧导入资料，添加您的个人信息、教育经历、工作经验和技能</li>
                <li>点击下方按钮开始与智能助手对话</li>
                <li>使用智能助手生成简历、扩写简历内容</li>
                <li>在简历生成器中选择模板、切换语言、下载简历</li>
              </ul>
              <div class="welcome-buttons">
                <button class="start-chat-btn" @click="startChat">开始对话</button>
              </div>
            </div>
          </div>
          
          <!-- 聊天界面 -->
          <div v-else class="chat-container">
            <div class="chat-header">
              <h3>小白云简历生成助手</h3>
              <button class="close-chat-btn" @click="showChatInterface = false">×</button>
            </div>
            <ChatInterface 
              :messages="messages"
              @send-message="sendMessage"
              @upload-file="handleFileUpload"
              @export-html="exportResumeHTML"
              @select-template="selectResumeTemplate"
            />
          </div>
        </div>
        
        <!-- 笔记视图 -->
        <div v-else-if="activeView === 'notes'">
          <div class="note-area">
            <div class="module-header">
              <h3>笔记区域</h3>
              <button class="exit-btn" @click="closeModule">退出</button>
            </div>
            <NotesComponent />
          </div>
        </div>
        
        <!-- 设置视图 -->
        <div v-else-if="activeView === 'settings'">
          <div class="settings-area">
            <div class="module-header">
              <h3>设置</h3>
              <button class="exit-btn" @click="closeModule">退出</button>
            </div>
            <SettingsComponent />
          </div>
        </div>
      </div>
      
      <div class="controls">
        <button @click="newChat">新对话</button>
        <button @click="showModule('settings')">设置</button>
        <button @click="showModule('notes')">笔记</button>
      </div>
    </div>
  </div>
  
  <!-- 模块页面 -->
  <div v-else class="module-page animate-fade-in">
    <div class="module-header">
      <h2>{{ getModuleTitle(activeModule) }}</h2>
      <button class="exit-btn" @click="closeModule">退出</button>
    </div>
    <div class="module-content">
      <ResumeBuilder ref="resumeBuilderRef" v-if="activeModule === 'resume'" :initial-data="resumeData" />
      <NotesComponent v-else-if="activeModule === 'notes'" />
      <SettingsComponent v-else-if="activeModule === 'settings'" />
    </div>
  </div>
  
  <!-- 加载动画 -->
  <div v-if="loading" class="modal-overlay">
    <div class="modal-content loading-container">
      <div class="loading-spinner"></div>
    </div>
  </div>

  <!-- 导入模态框 -->
  <div v-if="showImportModal" class="modal-overlay" @click="closeImportModal">
    <div class="modal-content" @click.stop>
      <h3>{{ getImportTitle(currentImportType) }}</h3>
      
      <!-- 个人资料导入 -->
      <div v-if="currentImportType === 'profile'" class="import-form">
        <div class="form-group">
          <label>姓名</label>
          <input type="text" v-model="importData.profile.name" placeholder="请输入姓名">
        </div>
        <div class="form-group">
          <label>邮箱</label>
          <input type="email" v-model="importData.profile.email" placeholder="请输入邮箱">
        </div>
        <div class="form-group">
          <label>电话</label>
          <input type="text" v-model="importData.profile.mobile" placeholder="请输入电话">
        </div>
        <div class="form-group">
          <label>地址</label>
          <input type="text" v-model="importData.profile.workPlace" placeholder="请输入地址">
        </div>
        <div class="form-group">
          <label>GitHub</label>
          <input type="text" v-model="importData.profile.github" placeholder="https://github.com/username">
        </div>
        <div class="form-group">
          <label>应聘岗位</label>
          <input type="text" v-model="importData.profile.positionTitle" placeholder="请输入应聘岗位">
        </div>
      </div>
      
      <!-- 教育经历导入 -->
      <div v-else-if="currentImportType === 'education'" class="import-form">
        <div v-for="(edu, index) in importData.educationList" :key="index" class="education-item">
          <div class="form-row">
            <div class="form-group half">
              <label>开始时间</label>
              <input type="date" v-model="edu.edu_time[0]">
            </div>
            <div class="form-group half">
              <label>结束时间</label>
              <input type="date" v-model="edu.edu_time[1]">
            </div>
          </div>
          <div class="form-group">
            <label>学校</label>
            <input type="text" v-model="edu.school" readonly style="background-color: #f5f5f5;">
          </div>
          <div class="form-group">
            <label>学院</label>
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
            <label>专业</label>
            <input type="text" v-model="edu.major" placeholder="请输入专业名称">
          </div>
          <div class="form-group">
            <label>学位</label>
            <select v-model="edu.academic_degree">
              <option value="">请选择学位</option>
              <option value="本科">本科</option>
              <option value="硕士">硕士</option>
              <option value="博士">博士</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <button @click="removeEducation(index)" class="remove-btn">删除</button>
        </div>
        <button @click="addEducation" class="add-btn">添加教育经历</button>
      </div>
      
      <!-- 工作经验导入 -->
      <div v-else-if="currentImportType === 'work'" class="import-form">
        <div v-for="(work, index) in importData.workExpList" :key="index" class="work-item">
          <div class="form-row">
            <div class="form-group half">
              <label>公司名称</label>
              <input type="text" v-model="work.company_name" placeholder="请输入公司名称">
            </div>
            <div class="form-group half">
              <label>部门</label>
              <input type="text" v-model="work.department_name" placeholder="请输入部门名称">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group half">
              <label>开始时间</label>
              <input type="text" v-model="work.work_time[0]" placeholder="例如：2024.01">
            </div>
            <div class="form-group half">
              <label>结束时间</label>
              <input type="text" v-model="work.work_time[1]" placeholder="例如：至今">
            </div>
          </div>
          <div class="form-group">
            <label>工作描述</label>
            <textarea v-model="work.work_desc" placeholder="请描述您的工作内容"></textarea>
          </div>
          <button @click="removeWork(index)" class="remove-btn">删除</button>
        </div>
        <button @click="addWork" class="add-btn">添加工作经历</button>
      </div>
      
      <!-- 技能导入 -->
      <div v-else-if="currentImportType === 'skills'" class="import-form">
        <div v-for="(skill, index) in importData.skillList" :key="index" class="skill-item">
          <div class="form-row">
            <div class="form-group three-quarters">
              <label>技能名称</label>
              <input type="text" v-model="skill.skill_name" placeholder="例如：JavaScript">
            </div>
            <div class="form-group quarter">
              <label>熟练度</label>
              <input type="number" v-model="skill.skill_level" placeholder="0-100">
            </div>
          </div>
          <div class="form-group">
            <label>技能描述</label>
            <input type="text" v-model="skill.skill_desc" placeholder="请描述您的技能水平">
          </div>
          <button @click="removeSkill(index)" class="remove-btn">删除</button>
        </div>
        <button @click="addSkill" class="add-btn">添加技能</button>
      </div>
      
      <!-- 项目经历导入 -->
      <div v-else-if="currentImportType === 'projects'" class="import-form">
        <div v-for="(project, index) in importData.projectList" :key="index" class="project-item">
          <div class="form-row">
            <div class="form-group">
              <label>项目名称</label>
              <input type="text" v-model="project.project_name" placeholder="请输入项目名称">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group half">
              <label>开始时间</label>
              <input type="text" v-model="project.project_time[0]" placeholder="例如：2024.01">
            </div>
            <div class="form-group half">
              <label>结束时间</label>
              <input type="text" v-model="project.project_time[1]" placeholder="例如：至今">
            </div>
          </div>
          <div class="form-group">
            <label>项目描述</label>
            <textarea v-model="project.project_desc" placeholder="请描述项目内容"></textarea>
          </div>
          <div class="form-group">
            <label>使用技能</label>
            <input type="text" v-model="project.project_skills" placeholder="项目中使用的技能">
          </div>
          <button @click="removeProject(index)" class="remove-btn">删除</button>
        </div>
        <button @click="addProject" class="add-btn">添加项目经历</button>
      </div>
      
      <!-- 网站导入 -->
      <div v-else-if="currentImportType === 'websites'" class="import-form">
        <div class="form-group">
          <label>网站名称</label>
          <input type="text" v-model="newWebsite.name" placeholder="例如：GitHub">
        </div>
        <div class="form-group">
          <label>网站链接</label>
          <input type="text" v-model="newWebsite.url" placeholder="https://example.com">
        </div>
        <div class="form-group">
          <label>描述</label>
          <input type="text" v-model="newWebsite.description" placeholder="简要描述网站内容">
        </div>
        <button @click="addWebsite" class="add-btn">添加网站</button>
        
        <div v-if="importData.websites.length > 0" class="import-list">
          <h4>已添加的网站</h4>
          <div v-for="(website, index) in importData.websites" :key="index" class="import-item">
            <span>{{ website.name }}: {{ website.url }}</span>
            <button @click="removeWebsite(index)" class="remove-btn">删除</button>
          </div>
        </div>
      </div>
      
      <!-- 账号导入 -->
      <div v-else-if="currentImportType === 'accounts'" class="import-form">
        <div class="form-group">
          <label>平台名称</label>
          <input type="text" v-model="newAccount.platform" placeholder="例如：GitHub">
        </div>
        <div class="form-group">
          <label>用户名</label>
          <input type="text" v-model="newAccount.username" placeholder="您的用户名">
        </div>
        <div class="form-group">
          <label>链接（可选）</label>
          <input type="text" v-model="newAccount.url" placeholder="https://example.com/username">
        </div>
        <button @click="addAccount" class="add-btn">添加账号</button>
        
        <div v-if="importData.accounts.length > 0" class="import-list">
          <h4>已添加的账号</h4>
          <div v-for="(account, index) in importData.accounts" :key="index" class="import-item">
            <span>{{ account.platform }}: {{ account.username }}</span>
            <button @click="removeAccount(index)" class="remove-btn">删除</button>
          </div>
        </div>
      </div>
      
      <!-- 收藏夹导入 -->
      <div v-else-if="currentImportType === 'bookmarks'" class="import-form">
        <div class="form-group">
          <label>标题</label>
          <input type="text" v-model="newBookmark.title" placeholder="网站标题">
        </div>
        <div class="form-group">
          <label>链接</label>
          <input type="text" v-model="newBookmark.url" placeholder="https://example.com">
        </div>
        <div class="form-group">
          <label>分类</label>
          <select v-model="newBookmark.category">
            <option value="技术">技术</option>
            <option value="设计">设计</option>
            <option value="产品">产品</option>
            <option value="管理">管理</option>
            <option value="其他">其他</option>
          </select>
        </div>
        <button @click="addBookmark" class="add-btn">添加收藏</button>
        
        <div v-if="importData.bookmarks.length > 0" class="import-list">
          <h4>已添加的收藏</h4>
          <div v-for="(bookmark, index) in importData.bookmarks" :key="index" class="import-item">
            <span>[{{ bookmark.category }}] {{ bookmark.title }}: {{ bookmark.url }}</span>
            <button @click="removeBookmark(index)" class="remove-btn">删除</button>
          </div>
        </div>
      </div>
      
      <div class="modal-buttons">
        <button @click="saveImportData">保存</button>
        <button @click="closeImportModal">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import ChatInterface from './components/ChatInterface.vue'
import ResumeBuilder from './components/ResumeBuilder.vue'
import NotesComponent from './components/NotesComponent.vue'
import SettingsComponent from './components/SettingsComponent.vue'

export default {
  name: 'App',
  components: {
    Sidebar,
    ChatInterface,
    ResumeBuilder,
    NotesComponent,
    SettingsComponent
  },
  data() {
    return {
      messages: [],
      statusText: 'ONLINE',
      activeView: 'chat',
      activeModule: null, // 当前激活的模块：resume, notes, settings
      showChatInterface: false,
      showSidebar: true,
      loading: false, // 全局加载状态
      loadingMessage: '', // 加载提示消息
      importData: {
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
        skillList: [
          {
            skill_name: '',
            skill_level: 80,
            skill_desc: ''
          }
        ],
        projectList: [
          {
            project_name: '',
            project_time: ['', ''],
            project_desc: '',
            project_skills: ''
          }
        ],
        websites: [],
        accounts: [],
        bookmarks: []
      },
      showImportModal: false,
      currentImportType: '',
      newWebsite: {
        name: '',
        url: '',
        description: ''
      },
      newAccount: {
        platform: '',
        username: '',
        url: ''
      },
      newBookmark: {
        title: '',
        url: '',
        category: '技术'
      },
      generatedResumeContent: '',
      uploadedFileContent: '',
      uploadedFileName: '',
      selectedTemplate: 'html',
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
        educationList: [],
        workExpList: [],
        skillList: [],
        projectList: []
      }
    }
  },
  mounted() {
    this.initWelcomeMessage()
    this.loadImportData()
  },
  methods: {
    loadImportData() {
      const savedData = localStorage.getItem('importData')
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          // 确保教育经历的学校字段为广东白云学院
          if (parsedData.educationList) {
            parsedData.educationList = parsedData.educationList.map(edu => ({
              ...edu,
              school: '广东白云学院'
            }))
          }
          this.importData = {
            ...this.importData,
            ...parsedData,
            projectList: parsedData.projectList || [
              {
                project_name: '',
                project_time: ['', ''],
                project_desc: '',
                project_skills: ''
              }
            ]
          }
        } catch (error) {
          console.error('加载导入数据失败:', error)
        }
      }
    },
    initWelcomeMessage(preserveChatState = false) {
      // 如果需要保持聊天界面状态，就不修改showChatInterface
      if (!preserveChatState) {
        // 初始化时不显示聊天界面
        this.showChatInterface = false
      }
      
      // 清空消息
      this.messages = []
      
      // 添加欢迎消息
      this.messages.push({
        text: '哈喽！很荣幸能以这样的方式与你交流\n我是小白云简历生成助手，专门为您提供专业的简历生成服务。\n\n我可以帮您创建美观、专业的简历，支持多种模板和中英文切换，还可以导出为Word文档！',
        isUser: false,
        type: 'text'
      })
    },
    handleImportData(type, data) {
      this.currentImportType = type
      this.showImportModal = true
    },
    handleNavigation(view) {
      if (view === 'resume' || view === 'notes' || view === 'settings') {
        this.showModule(view)
      } else if (view === 'chat') {
        this.activeView = view
        this.showChatInterface = true
      } else {
        this.activeView = view
      }
    },
    startChat() {
      this.showChatInterface = true
    },
    sendMessage(text) {
      // 添加用户消息
      this.messages.push({
        text,
        isUser: true,
        type: 'text'
      })
      
      // 检测用户是否要求直接生成HTML文件
      const lowerText = text.toLowerCase().replace(/\s/g, '') // 移除所有空格
      const isDirectHTMLRequest = lowerText.includes('生成html') || 
                                   lowerText.includes('导出html') || 
                                   lowerText.includes('下载html') ||
                                   lowerText.includes('输出html') ||
                                   lowerText.includes('html文件') ||
                                   lowerText.includes('html简历') ||
                                   (lowerText.includes('简历') && lowerText.includes('html'))
      
      if (isDirectHTMLRequest) {
        // 直接生成并下载HTML文件
        this.loading = true
        this.loadingMessage = '正在生成HTML简历文件...'
        this.statusText = 'GENERATING...'
        
        setTimeout(() => {
          // 如果有智能助手生成的简历内容，使用它；否则使用导入的数据
          const hasGeneratedContent = this.generatedResumeContent && this.generatedResumeContent.length > 0
          this.exportResumeHTML(hasGeneratedContent)
          
          if (hasGeneratedContent) {
            this.messages.push({
              text: `已为您生成HTML格式的简历文件并开始下载！\n\n该文件基于智能助手生成的简历内容，包含：\n- 完整的简历样式\n- 支持打印功能\n- 支持导出PDF功能\n\n您可以在浏览器中打开下载的HTML文件，点击页面底部的按钮进行打印或导出PDF。`,
              isUser: false,
              type: 'text'
            })
          } else {
            this.messages.push({
              text: `已为您生成HTML格式的简历文件并开始下载！\n\n该文件基于您导入的简历数据，包含：\n- 完整的简历样式\n- 支持打印功能\n- 支持导出PDF功能\n\n您可以在浏览器中打开下载的HTML文件，点击页面底部的按钮进行打印或导出PDF。`,
              isUser: false,
              type: 'text'
            })
          }
          this.statusText = 'ONLINE'
          this.loading = false
        }, 1000)
        return
      }
      
      // 显示加载状态
      this.loading = true
      this.loadingMessage = '正在生成响应...'
      this.statusText = 'WRITING...'
      
      // 尝试调用真实AI，失败则使用本地响应
      this.callAIWithLocalContext(text).then(response => {
        // 清理响应中的Markdown格式
        const cleanResponse = this.cleanMarkdown(response)
        
        // 如果响应包含简历内容，保存到generatedResumeContent（保存原始内容用于导出）
        if (response && (response.includes('个人简历') || response.includes('基本信息') || response.includes('教育背景') || response.includes('工作经历'))) {
          this.generatedResumeContent = response
        }
        
        this.messages.push({
          text: cleanResponse,
          isUser: false,
          type: 'text'
        })
        this.statusText = 'ONLINE'
        this.loading = false
      }).catch(error => {
        console.error('AI调用失败，使用本地响应:', error)
        const response = this.getAgentResponse(text)
        
        // 清理响应中的Markdown格式
        const cleanResponse = this.cleanMarkdown(response)
        
        // 如果响应包含简历内容，保存到generatedResumeContent（保存原始内容用于导出）
        if (response && typeof response === 'string' && (response.includes('个人简历') || response.includes('基本信息') || response.includes('教育背景') || response.includes('工作经历'))) {
          this.generatedResumeContent = response
        }
        
        this.messages.push({
          text: cleanResponse,
          isUser: false,
          type: 'text'
        })
        this.statusText = 'ONLINE'
        this.loading = false
      })
    },
    cleanMarkdown(text) {
      if (!text || typeof text !== 'string') return text
      
      return text
        .replace(/^#{1,6}\s+/gm, '')           // 移除标题标记 ### 
        .replace(/^\s*[-*]{3,}\s*$/gm, '')     // 移除分隔线 ---
        .replace(/\*\*(.*?)\*\*/g, '$1')       // 移除粗体 **text**
        .replace(/\*(.*?)\*/g, '$1')           // 移除斜体 *text*
        .replace(/`(.*?)`/g, '$1')             // 移除代码标记 `text`
        .replace(/^\s*>\s*/gm, '')            // 移除引用标记 >
        .replace(/^\s*[-+*]\s+/gm, '• ')      // 统一列表符号为•
        .replace(/^\s*\d+\.\s+/gm, '')       // 移除编号列表 1. 2. 3.
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接 [text](url)
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')  // 移除图片 ![alt](url)
        .replace(/\n{3,}/g, '\n\n')           // 移除多余空行
        .trim()
    },
    async callAIWithLocalContext(userMessage) {
      try {
        const localContext = this.getLocalContext()
        const messages = this.messages.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        }))
        messages.push({ role: 'user', content: userMessage })
        
        const response = await fetch('http://localhost:3001/api/resume/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            localContext,
            messages
          })
        })
        
        if (!response.ok) {
          throw new Error('API请求失败')
        }
        
        const data = await response.json()
        return data.data?.response || this.getAgentResponse(userMessage)
      } catch (error) {
        console.warn('无法连接到AI服务，使用本地响应:', error)
        return this.getAgentResponse(userMessage)
      }
    },
    getLocalContext() {
      const context = []
      
      // 个人信息
      if (this.importData.profile.name || this.importData.profile.positionTitle) {
        context.push('【个人信息】')
        if (this.importData.profile.name) context.push(`姓名: ${this.importData.profile.name}`)
        if (this.importData.profile.positionTitle) context.push(`应聘岗位: ${this.importData.profile.positionTitle}`)
        if (this.importData.profile.mobile) context.push(`电话: ${this.importData.profile.mobile}`)
        if (this.importData.profile.email) context.push(`邮箱: ${this.importData.profile.email}`)
        if (this.importData.profile.github) context.push(`GitHub: ${this.importData.profile.github}`)
        if (this.importData.profile.workPlace) context.push(`工作地点: ${this.importData.profile.workPlace}`)
      }
      
      // 教育经历
      const hasEducation = this.importData.educationList.some(e => e.school)
      if (hasEducation) {
        context.push('\n【教育经历】')
        this.importData.educationList.forEach((edu, index) => {
          if (edu.school) {
            context.push(`${index + 1}. ${edu.school}`)
            if (edu.college) context.push(`   学院: ${edu.college}`)
            if (edu.major) context.push(`   专业: ${edu.major}`)
            if (edu.academic_degree) context.push(`   学位: ${edu.academic_degree}`)
            if (edu.edu_time[0] && edu.edu_time[1]) {
              context.push(`   时间: ${edu.edu_time[0]} - ${edu.edu_time[1]}`)
            }
          }
        })
      }
      
      // 工作经历
      const hasWork = this.importData.workExpList.some(w => w.company_name)
      if (hasWork) {
        context.push('\n【工作经历】')
        this.importData.workExpList.forEach((work, index) => {
          if (work.company_name) {
            context.push(`${index + 1}. ${work.company_name}`)
            if (work.department_name) context.push(`   部门: ${work.department_name}`)
            if (work.work_time[0] && work.work_time[1]) {
              context.push(`   时间: ${work.work_time[0]} - ${work.work_time[1]}`)
            }
            if (work.work_desc) context.push(`   描述: ${work.work_desc}`)
          }
        })
      }
      
      // 项目经历
      const hasProjects = this.importData.projectList?.some(p => p.project_name)
      if (hasProjects) {
        context.push('\n【项目经历】')
        this.importData.projectList.forEach((project, index) => {
          if (project.project_name) {
            context.push(`${index + 1}. ${project.project_name}`)
            if (project.project_time?.[0] && project.project_time?.[1]) {
              context.push(`   时间: ${project.project_time[0]} - ${project.project_time[1]}`)
            }
            if (project.project_desc) context.push(`   描述: ${project.project_desc}`)
            if (project.project_skills) context.push(`   技能: ${project.project_skills}`)
          }
        })
      }
      
      // 专业技能
      const hasSkills = this.importData.skillList?.some(s => s.skill_name)
      if (hasSkills) {
        context.push('\n【专业技能】')
        this.importData.skillList.forEach((skill, index) => {
          if (skill.skill_name) {
            context.push(`${index + 1}. ${skill.skill_name} (${skill.skill_level || 80}%)`)
            if (skill.skill_desc) context.push(`   描述: ${skill.skill_desc}`)
          }
        })
      }
      
      return context.join('\n')
    },
    getAgentResponse(userMessage) {
      const lowerMsg = userMessage.toLowerCase()
      
      if (lowerMsg.includes('你好') || lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        return "嘿！\n我是小白云简历生成助手！\n很高兴见到你！我是专门为您提供专业简历生成服务的AI助手。\n\n我可以通过导入的资料为您生成专业的简历，帮您扩写简历内容，和输出求职简历的样子。只需告诉我您的需求，例如：'请帮我写一个申请xxx公司xxx岗位的简历'。"
      } else if (lowerMsg.includes('名字') || lowerMsg.includes('name') || lowerMsg.includes('称呼')) {
        return "我是小白云简历生成助手，一个专业的AI助手，专门为您提供专业的简历生成服务。"
      } else if (lowerMsg.includes('谢谢') || lowerMsg.includes('thank')) {
        return "不客气！如果您还有其他问题，请随时告诉我，我会尽力帮助您。"
      } else if (lowerMsg.includes('再见') || lowerMsg.includes('bye') || lowerMsg.includes('拜拜')) {
        return "再见！如果您需要进一步的帮助，请随时回来找我。祝您有美好的一天！"
      } else if (lowerMsg.includes('帮助') || lowerMsg.includes('help') || lowerMsg.includes(' assistance')) {
        return "我可以帮助您回答问题、提供信息、进行计算、提供建议等。特别地，如果您需要求职方面的帮助，我还可以帮您创建专业的简历！请告诉我您需要什么帮助，我会尽力为您服务。"
      } else if (lowerMsg.includes('天气')) {
        return "我目前无法获取实时天气信息，但建议您查看当地的天气预报应用或网站以获取准确的天气信息。"
      } else if (lowerMsg.includes('时间') || lowerMsg.includes('几点')) {
        const now = new Date()
        return `当前时间是 ${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}。`
      } else if (lowerMsg.includes('计算') || lowerMsg.includes('算') || lowerMsg.includes('+') || lowerMsg.includes('-') || lowerMsg.includes('*') || lowerMsg.includes('/')) {
        try {
          const mathExpr = userMessage.match(/[\d+\-*/().\s]+/g)
          if (mathExpr) {
            const expr = mathExpr[0].replace(/[^0-9+\-*/().\s]/g, '')
            if (expr && expr.length > 0) {
              try {
                const result = Function('"use strict"; return (' + expr + ')')()
                return `计算结果：${expr} = ${result}`
              } catch (e) {
                return "表达式格式错误，请检查输入"
              }
            }
          }
        } catch (e) {
        }
        return "我可以帮助您进行数学计算。请提供具体的数学表达式，我会为您计算结果。"
      } else if (lowerMsg.includes('简历') || lowerMsg.includes('resume') ||
                 lowerMsg.includes('求职') || lowerMsg.includes('工作') ||
                 lowerMsg.includes('申请') || lowerMsg.includes('岗位')) {
        if (lowerMsg.includes('生成') || lowerMsg.includes('创建') || 
            lowerMsg.includes('写') || lowerMsg.includes('做')) {
          // 直接读取导入资料并生成简历
          return this.generateResumeFromImport(userMessage)
        } else if (lowerMsg.includes('扩写') || lowerMsg.includes('扩展') || lowerMsg.includes('丰富')) {
          // 读取导入资料并扩写简历
          return this.expandResume(userMessage)
        } else if (lowerMsg.includes('查看') || lowerMsg.includes('预览') || lowerMsg.includes('样子')) {
          // 输出求职简历的样子
          return this.showResumePreview()
        } else {
          return "关于简历方面的问题，我可以帮您提供很多帮助，包括简历模板、撰写技巧、岗位匹配建议等。如果您需要生成一份具体的简历，请提供相关个人信息，我会为您量身定制。"
        }
      } else {
        if (userMessage.length < 10) {
          return "我理解您可能有简短的问题，能否提供更多细节以帮助我更好地为您服务？"
        } else if (userMessage.length < 30) {
          return "我已收到您的消息，并正在分析您的请求。这是一个很好的问题，我会为您提供详细的信息。"
        } else {
          return "感谢您提供详细的信息。我已经仔细阅读了您的消息，并会为您提供全面和准确的回答。"
        }
      }
    },
    expandResume(message) {
      // 读取导入的资料
      const profile = this.importData.profile
      const educationList = this.importData.educationList
      const workExpList = this.importData.workExpList
      const skillList = this.importData.skillList
      const projectList = this.importData.projectList
      
      // 检查是否有导入的资料
      if (!profile.name && educationList.length === 0 && workExpList.length === 0) {
        return "我注意到您还没有导入任何资料。请先在左侧导入资料模块中添加您的个人信息、教育经历和工作经验，然后我可以帮您扩写简历内容。"
      }
      
      // 基于导入的资料生成扩写内容
      let response = "根据您导入的资料，我已经为您扩写了简历内容：\n\n"
      
      // 个人信息
      if (profile.name) {
        response += `个人信息\n`
        response += `姓名：${profile.name}\n`
        if (profile.positionTitle) {
          response += `应聘岗位：${profile.positionTitle}\n`
        }
        if (profile.mobile) {
          response += `电话：${profile.mobile}\n`
        }
        if (profile.email) {
          response += `邮箱：${profile.email}\n`
        }
        if (profile.github) {
          response += `GitHub：${profile.github}\n`
        }
        if (profile.workPlace) {
          response += `工作地点：${profile.workPlace}\n`
        }
        response += "\n"
      }
      
      // 教育经历
      if (educationList.length > 0 && educationList[0].school) {
        response += `教育背景\n`
        educationList.forEach((edu, index) => {
          if (edu.school) {
            response += `1. ${edu.edu_time[0]} - ${edu.edu_time[1]}\n`
            response += `   学校：${edu.school}\n`
            if (edu.college) {
              response += `   学院：${edu.college}\n`
            }
            if (edu.major) {
              response += `   专业：${edu.major}\n`
            }
            if (edu.academic_degree) {
              response += `   学位：${edu.academic_degree}\n`
            }
            // 扩写内容
            response += `   在校期间，我积极参与各类学术活动，成绩优异，获得了良好的专业知识基础和实践能力。\n`
          }
        })
        response += "\n"
      }
      
      // 工作经历
      if (workExpList.length > 0 && workExpList[0].company_name) {
        response += `工作经历\n`
        workExpList.forEach((work, index) => {
          if (work.company_name) {
            response += `1. ${work.work_time[0]} - ${work.work_time[1]}\n`
            response += `   公司：${work.company_name}\n`
            if (work.department_name) {
              response += `   部门：${work.department_name}\n`
            }
            if (work.work_desc) {
              response += `   工作内容：${work.work_desc}\n`
            } else {
              response += `   工作内容：负责相关业务的日常运营和管理，积极参与团队合作，为公司的发展做出了贡献。\n`
            }
            // 扩写内容
            response += `   在工作期间，我积累了丰富的实践经验，培养了良好的团队协作能力和问题解决能力。\n`
          }
        })
        response += "\n"
      }
      
      // 专业技能
      if (skillList.length > 0 && skillList[0].skill_name) {
        response += `专业技能\n`
        skillList.forEach((skill, index) => {
          if (skill.skill_name) {
            response += `${index + 1}. ${skill.skill_name} (${skill.skill_level}%)\n`
            if (skill.skill_desc) {
              response += `   ${skill.skill_desc}\n`
            }
          }
        })
        response += "\n"
      }
      
      // 项目经历
      if (projectList.length > 0 && projectList[0].project_name) {
        response += `项目经历\n`
        projectList.forEach((project, index) => {
          if (project.project_name) {
            response += `1. ${project.project_time[0]} - ${project.project_time[1]}\n`
            response += `   项目名称：${project.project_name}\n`
            if (project.project_desc) {
              response += `   项目描述：${project.project_desc}\n`
            }
            if (project.project_skills) {
              response += `   使用技能：${project.project_skills}\n`
            }
            response += `   通过该项目，我深入了解了相关技术，提升了实践能力和团队协作能力。\n`
          }
        })
        response += "\n"
      }
      
      // 总结
      response += "您可以将这些内容复制到简历生成器中，或者直接使用简历生成器生成完整的简历。如果需要进一步修改或扩展，请告诉我具体的需求。"
      
      return response
    },
    showResumePreview() {
      // 读取导入的资料
      const profile = this.importData.profile
      
      // 生成简历预览
      let response = "以下是您的求职简历预览：\n\n"
      response += `个人简历\n\n`
      
      // 个人信息
      if (profile.name) {
        response += `个人信息\n`
        response += `姓名：${profile.name}\n`
        if (profile.positionTitle) {
          response += `应聘岗位：${profile.positionTitle}\n`
        }
        if (profile.mobile) {
          response += `电话：${profile.mobile}\n`
        }
        if (profile.email) {
          response += `邮箱：${profile.email}\n`
        }
        response += "\n"
      }
      
      // 教育背景
      response += `教育背景\n`
      response += `2020.09 - 2024.06 广东白云学院 计算机科学与技术专业 本科\n\n`
      
      // 工作经历
      response += `工作经历\n`
      response += `2024.07 - 至今 某科技公司 软件开发工程师\n负责公司核心产品的开发和维护，参与需求分析、代码实现和测试工作。\n\n`
      
      // 专业技能
      response += `专业技能\n`
      response += `- 编程语言：JavaScript, Python, Java\n`
      response += `- 前端技术：Vue, React, HTML, CSS\n`
      response += `- 后端技术：Node.js, Express\n`
      response += `- 数据库：MySQL, MongoDB\n\n`
      
      // 项目经历
      response += `项目经历\n`
      response += `1. 电商网站开发\n   负责前端页面的开发和优化，使用Vue框架实现响应式设计。\n\n`
      
      // 自我评价
      response += `自我评价\n`
      response += `具有扎实的专业知识和丰富的实践经验，善于学习新技术，具备良好的团队协作能力和沟通能力。\n\n`
      
      response += "这是一个标准的求职简历模板，您可以根据自己的实际情况进行修改和调整。如果需要生成包含您个人信息的具体简历，请在简历生成器中填写相关信息。"
      
      return response
    },
    generateResumeFromImport(message) {
      // 读取导入的资料
      const profile = this.importData.profile
      const educationList = this.importData.educationList
      const workExpList = this.importData.workExpList
      const skillList = this.importData.skillList
      const projectList = this.importData.projectList
      
      // 检查是否有导入的资料
      const hasData = profile.name || 
                     educationList.some(e => e.school) || 
                     workExpList.some(w => w.company_name)
      
      if (!hasData) {
        return "我注意到您还没有导入任何资料。请先在左侧导入资料模块中添加您的个人信息、教育经历和工作经验，然后我可以帮您生成完整的简历。"
      }
      
      // 从消息中提取岗位信息
      const positionMatch = message.match(/申请[^\s的]+岗位|申请[^\s的]+职位|应聘[^\s的]+岗位|应聘[^\s的]+职位|[^\s]+工程师|[^\s]+设计师|[^\s]+经理|[^\s]+主管|[^\s]+专员|[^\s]+顾问|[^\s]+分析师/)
      const targetPosition = positionMatch ? positionMatch[0] : (profile.positionTitle || '求职岗位')
      
      // 生成完整的简历内容
      let resumeContent = `个人简历 | Personal resume\n\n`
      
      // 基本信息
      resumeContent += `基本信息\n`
      resumeContent += `姓名：${profile.name || '求职者'}\n`
      if (profile.mobile) {
        resumeContent += `电话：${profile.mobile}\n`
      }
      if (profile.email) {
        resumeContent += `邮箱：${profile.email}\n`
      }
      if (profile.github) {
        resumeContent += `GitHub：${profile.github}\n`
      }
      if (profile.workPlace) {
        resumeContent += `工作地点：${profile.workPlace}\n`
      }
      if (profile.positionTitle) {
        resumeContent += `应聘岗位：${profile.positionTitle}\n\n`
      } else {
        resumeContent += `\n`
      }
      
      // 教育背景
      const hasEducation = educationList.some(e => e.school)
      if (hasEducation) {
        resumeContent += `教育背景\n`
        educationList.forEach((edu, index) => {
          if (edu.school) {
            if (edu.edu_time[0] && edu.edu_time[1]) {
              resumeContent += `${edu.edu_time[0]}-${edu.edu_time[1]} | ${edu.school} | ${edu.major || '专业'} (${edu.academic_degree || '学位'})\n`
            } else {
              resumeContent += `${edu.school} | ${edu.major || '专业'} (${edu.academic_degree || '学位'})\n`
            }
            if (edu.courses) {
              resumeContent += `主修课程：${edu.courses}\n`
            } else {
              resumeContent += `主修课程：管理学、微观经济学、宏观经济学、管理信息系统、统计学、会计学、财务管理、市场营销、经济法、消费者行为学、国际市场营销\n`
            }
            resumeContent += `\n`
          }
        })
      } else {
        // 默认教育背景
        resumeContent += `教育背景\n`
        resumeContent += `2005.07-2009.06 | 大学 | 市场营销 (本科)\n`
        resumeContent += `主修课程：管理学、微观经济学、宏观经济学、管理信息系统、统计学、会计学、财务管理、市场营销、经济法、消费者行为学、国际市场营销\n\n`
      }
      
      // 实习经历
      const hasWork = workExpList.some(w => w.company_name)
      if (hasWork) {
        resumeContent += `实习经历\n`
        workExpList.forEach((work, index) => {
          if (work.company_name) {
            if (work.work_time && work.work_time[0] && work.work_time[1]) {
              resumeContent += `${work.work_time[0]}-${work.work_time[1]} | ${work.company_name} | ${work.department_name || '实习生'}\n`
            } else {
              resumeContent += `${work.company_name} | ${work.department_name || '实习生'}\n`
            }
            if (work.work_desc) {
              resumeContent += `${work.work_desc}\n`
            } else {
              resumeContent += `• 负责相关业务的日常运营和管理\n• 积极参与团队合作，为公司的发展做出贡献\n• 积累了丰富的实践经验，培养了良好的团队协作能力和问题解决能力\n`
            }
            resumeContent += `\n`
          }
        })
      } else {
        // 默认实习经历
        resumeContent += `实习经历\n`
        resumeContent += `2012.04-至今 | 信息科技有限公司 | 市场营销 (实习生)\n`
        resumeContent += `• 负责公司线上端资源的销售工作（以开拓客户为主），公司主要资源以广点通、智汇推、百度、小米、360、深户平等\n`
        resumeContent += `• 实时了解行业的变化，跟踪客户的详细数据，为客户制定更完善的投放计划\n\n`
        resumeContent += `2010.03-2012.03 | 信息科技有限公司 | 软件工程师\n`
        resumeContent += `• 负责公司业务系统的设计及改进，参与公司网上商城系统产品功能设计及实施工作\n`
        resumeContent += `• 负责客户调研、客户需求分析、方案写作等工作，参与公司多个大型电子商务项目的策划工作\n\n`
      }
      
      // 校园经历
      resumeContent += `校园经历\n`
      resumeContent += `2009.03-2011.06 | 信息科技有限公司 | 校园大使主席\n`
      resumeContent += `• 目标带领自己的团队，辅助完成在高院校的"优龙计划"，向全球顶尖的VA金融公司推送实习生资源\n`
      resumeContent += `• 整体运营前期开展了相关的线上线下宣传活动，中期为进行咨询，人员提供，后期进行了项目的维护阶段，保证了整个项目的完整性\n\n`
      
      // 技能证书
      const hasSkills = skillList?.some(s => s.skill_name)
      if (hasSkills) {
        resumeContent += `技能证书\n`
        skillList.forEach((skill, index) => {
          if (skill.skill_name) {
            resumeContent += `• ${skill.skill_name}`
            if (skill.skill_level) resumeContent += ` (${skill.skill_level}%)`
            if (skill.skill_desc) resumeContent += ` - ${skill.skill_desc}`
            resumeContent += `\n`
          }
        })
        resumeContent += `\n`
      } else {
        // 默认技能证书
        resumeContent += `技能证书\n`
        resumeContent += `• 普通话一级甲等\n`
        resumeContent += `• 大学英语四/六级 (CET-4/6)，良好的听说读写能力，快速浏览英语专业文件及书籍\n`
        resumeContent += `• 通过全国计算机二级考试，熟练操作office、PS等软件\n\n`
      }
      
      // 自我评价
      resumeContent += `自我评价\n`
      resumeContent += `深度互联网从业人员，对互联网产品有高度的敏感性和关注度，熟悉产品开发流程，有很强的产品规划、需求分析、交互设计能力，能独立承担APP和WEB项目的管控工作，善于沟通，贴近用户。\n\n`
      
      // 添加操作提示
      resumeContent += `---\n\n`
      resumeContent += `接下来您可以：\n`
      resumeContent += `1. 直接对我说"生成HTML简历"，我会直接为您生成并下载HTML格式的简历文件\n`
      resumeContent += `2. 点击下方按钮进入简历生成器，查看可视化的简历模板\n`
      resumeContent += `3. 在简历生成器中选择不同的模板和语言\n`
      resumeContent += `4. 下载为Word或PDF格式的简历\n`
      resumeContent += `5. 如果需要修改简历内容，请告诉我具体的需求！\n`
      
      // 保存生成的简历内容，供ResumeBuilder使用
      this.generatedResumeContent = resumeContent
      
      // 同时准备resumeData格式的数据
      this.prepareResumeDataForBuilder()
      
      return resumeContent
    },
    prepareResumeDataForBuilder() {
      // 深度复制导入的数据到resumeData
      this.resumeData = JSON.parse(JSON.stringify(this.importData))
      
      // 确保数据结构完整
      if (!this.resumeData.projectList) {
        this.resumeData.projectList = []
      }
      if (!this.resumeData.skillList) {
        this.resumeData.skillList = []
      }
    },
    showModule(module) {
      this.activeModule = module
    },
    closeModule() {
      this.activeModule = null
    },
    downloadResumeMD() {
      // 直接下载智能助手生成的简历内容为MD格式
      let content = ''
      
      // 查找最后一条助手消息
      const lastAgentMessage = this.messages
        .filter(msg => !msg.isUser)
        .slice(-1)[0]
      
      if (lastAgentMessage) {
        content = lastAgentMessage.text
      } else {
        content = '请先让智能助手生成简历内容'
      }
      
      const fileName = (this.importData.profile.name || '简历') + '_简历.md'
      this.downloadFile(content, fileName, 'text/markdown')
    },
    downloadResumeTXT() {
      // 直接下载智能助手生成的简历内容为TXT格式
      let content = ''
      
      // 查找最后一条助手消息
      const lastAgentMessage = this.messages
        .filter(msg => !msg.isUser)
        .slice(-1)[0]
      
      if (lastAgentMessage) {
        // 移除Markdown格式，转为纯文本
        content = lastAgentMessage.text
          .replace(/^#+\s*/gm, '')  // 移除标题
          .replace(/\*\*/g, '')       // 移除粗体
          .replace(/\*/g, '')         // 移除斜体
          .replace(/`/g, '')          // 移除代码标记
      } else {
        content = '请先让智能助手生成简历内容'
      }
      
      const fileName = (this.importData.profile.name || '简历') + '_简历.txt'
      this.downloadFile(content, fileName, 'text/plain')
    },
    selectResumeTemplate(template) {
      this.selectedTemplate = template
      this.messages.push({
        text: `已选择${this.getTemplateName(template)}模板。现在导出HTML文件时，将使用这个模板。`,
        isUser: false,
        type: 'text'
      })
    },
    getTemplateName(template) {
      const templateNames = {
        'html': 'HTML简历',
        'artistic-blue': '艺术蓝色',
        'sidebar-pink': '侧边栏粉色',
        'red-simple': '红色简洁'
      }
      return templateNames[template] || 'HTML简历'
    },
    exportResumeHTML(template = null) {
      // 确定使用的模板
      const useTemplate = template || this.selectedTemplate || 'html'
      
      // 显示加载状态
      this.loading = true
      this.loadingMessage = '正在准备HTML文档...'
      
      let htmlContent = ''
      let fileName = ''
      
      // 检查是否有智能助手生成的简历内容
      const hasGeneratedContent = this.generatedResumeContent && this.generatedResumeContent.length > 0
      
      if (typeof template === 'boolean' && hasGeneratedContent) {
        // 兼容旧的调用方式
        fileName = (this.importData.profile.name || '简历') + '_简历.html'
        htmlContent = this.generateHTMLFromText(this.generatedResumeContent, fileName, useTemplate)
      } else if (hasGeneratedContent) {
        // 使用智能助手生成的简历内容
        fileName = (this.importData.profile.name || '简历') + '_简历.html'
        htmlContent = this.generateHTMLFromText(this.generatedResumeContent, fileName, useTemplate)
      } else if (!hasGeneratedContent) {
        // 用户要求使用智能助手生成的内容，但内容不存在
        this.loading = false
        this.messages.push({
          text: '您还没有让智能助手生成简历内容。请先对我说"生成简历"或"帮我写一份简历"，然后再导出HTML文件。',
          isUser: false,
          type: 'text'
        })
        return
      } else {
        // 使用导入的数据
        this.prepareResumeDataForBuilder()
        fileName = (this.resumeData.profile.name || '简历') + '_简历.html'
        htmlContent = this.generateFullHTMLContent()
      }
      
      // 下载HTML文件
      this.downloadFile(htmlContent, fileName, 'text/html')
      
      this.loading = false
    },
    generateHTMLFromText(resumeText, fileName, template = 'html') {
      // 将智能助手生成的简历文本转换为模块化HTML格式
      const name = this.importData.profile.name || '求职者'

      // 先清理Markdown格式
      let cleanText = this.cleanMarkdown(resumeText)

      // 提取简历核心内容
      const resumeStartKeywords = ['个人简历', '基本信息', '姓名：', '姓名:', '个人简介', '教育背景']
      let startIndex = -1
      for (const keyword of resumeStartKeywords) {
        const idx = cleanText.indexOf(keyword)
        if (idx !== -1 && (startIndex === -1 || idx < startIndex)) {
          startIndex = idx
        }
      }
      if (startIndex !== -1) {
        cleanText = cleanText.substring(startIndex)
      }

      // 去除提示信息部分
      const promptIndex = cleanText.indexOf('---')
      if (promptIndex !== -1) {
        cleanText = cleanText.substring(0, promptIndex)
      }
      const endKeywords = [
        '接下来您可以', '希望这个模板', '如果需要进一步',
        '请随时告诉我', '祝您求职顺利', '希望这个简历',
        '您可以根据自己的经历', '您可以根据实际情况',
        '您可以根据需要', '您可以根据个人情况',
        '以上简历模板', '以上模板', '以上简历',
        '希望这份简历', '希望这个简历', '希望以上',
        '温馨提示', '提示：', '注意：',
        '祝求职顺利', '祝您早日', '祝您面试',
        '如果需要修改', '如果需要调整', '如果需要优化'
      ]
      for (const keyword of endKeywords) {
        const idx = cleanText.indexOf(keyword)
        if (idx !== -1) {
          cleanText = cleanText.substring(0, idx)
        }
      }

      cleanText = this.cleanMarkdown(cleanText)
      cleanText = cleanText.replace(/^\n+/, '').replace(/\n+$/, '')

      // 解析为模块数据
      const modules = this.parseResumeToModules(cleanText)

      // 根据选择的模板生成不同的HTML
      switch (template) {
        case 'artistic-blue':
          return this.generateArtisticBlueHTML(modules, name)
        case 'sidebar-pink':
          return this.generateSidebarPinkHTML(modules, name)
        case 'red-simple':
          return this.generateRedSimpleHTML(modules, name)
        default:
          return this.generateModularHTML(modules, name)
      }
    },
    
    generateArtisticBlueHTML(modules, name) {
      // 生成艺术蓝色风格的HTML简历
      const moduleTitles = {
        basic: '基本信息',
        education: '教育背景',
        work: '工作经历',
        project: '项目经历',
        skills: '专业技能',
        evaluation: '自我评价',
        campus: '校园经历',
        awards: '获得荣誉'
      }
      
      let modulesHTML = ''
      modules.forEach((module, index) => {
        const title = module.title || moduleTitles[module.type] || '其他'
        const contentHTML = module.content.map(line => {
          if (line.startsWith('•') || line.startsWith('-')) {
            return `<li class="module-list-item" contenteditable="true">${line.substring(1).trim()}</li>`
          }
          return `<p class="module-text" contenteditable="true">${line}</p>`
        }).join('\n')
        
        const listItems = module.content.filter(line => line.startsWith('•') || line.startsWith('-'))
        const textItems = module.content.filter(line => !line.startsWith('•') && !line.startsWith('-'))
        
        let contentBody = ''
        if (textItems.length > 0) {
          contentBody += textItems.map(line =>
            `<p class="module-text" contenteditable="true">${line}</p>`
          ).join('\n')
        }
        if (listItems.length > 0) {
          contentBody += `<ul class="module-list">\n` +
            listItems.map(line =>
              `<li class="module-list-item" contenteditable="true">${line.substring(1).trim()}</li>`
            ).join('\n') +
            `\n</ul>`
        }
        
        const isFullWidth = ['education', 'work', 'skills'].includes(module.type)
        const widthClass = isFullWidth ? 'full-width' : ''
        
        modulesHTML += `
      <div class="resume-module ${widthClass}" data-module-id="${module.id}" data-module-type="${module.type}" data-sort-index="${index}">
        <div class="module-header">
          <div class="module-drag-handle" title="拖动调整位置">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="4" cy="4" r="1.5"/>
              <circle cx="8" cy="4" r="1.5"/>
              <circle cx="12" cy="4" r="1.5"/>
              <circle cx="4" cy="8" r="1.5"/>
              <circle cx="8" cy="8" r="1.5"/>
              <circle cx="12" cy="8" r="1.5"/>
              <circle cx="4" cy="12" r="1.5"/>
              <circle cx="8" cy="12" r="1.5"/>
              <circle cx="12" cy="12" r="1.5"/>
            </svg>
          </div>
          <div class="module-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 16 16">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
            </svg>
          </div>
          <h2 class="module-title" contenteditable="true">${title}</h2>
          <span class="module-subtitle">${module.type === 'basic' ? 'Basic information' : module.type === 'education' ? 'Education background' : module.type === 'work' ? 'Work experience' : module.type === 'skills' ? 'Professional skills' : module.type === 'evaluation' ? 'Self assessment' : 'Get the honor'}</span>
          <div class="module-actions">
            <button class="module-btn module-up" onclick="moveModule('${module.id}', -1)" title="上移">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
              </svg>
            </button>
            <button class="module-btn module-down" onclick="moveModule('${module.id}', 1)" title="下移">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
              </svg>
            </button>
            <button class="module-btn module-delete" onclick="deleteModule('${module.id}')" title="删除">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="module-content">
          ${contentBody}
        </div>
      </div>`
      })
      
      return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - 个人简历</title>
  
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Microsoft YaHei', 'SimSun', sans-serif;
      background: linear-gradient(135deg, #f0f8fc 0%, #e0f0f8 100%);
      padding: 0;
      margin: 0;
      min-height: 100vh;
      position: relative;
      overflow-x: hidden;
    }
    
    .wave-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 150px;
      z-index: 0;
    }
    
    .resume-container {
      width: 794px;
      min-height: 1123px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      position: relative;
      z-index: 1;
      overflow: hidden;
    }
    
    .header-section {
      padding: 60px 50px 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      position: relative;
      z-index: 2;
    }
    
    .header-content {
      flex: 1;
    }
    
    .header-name {
      font-size: 48px;
      font-weight: 300;
      color: #1e3c5e;
      margin: 0 0 8px;
      letter-spacing: 4px;
    }
    
    .header-subtitle {
      font-size: 16px;
      color: #3a7ca5;
      margin: 0;
      letter-spacing: 6px;
      font-weight: 500;
    }
    
    .photo-box {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3a7ca5, #2d6a8f);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(58, 124, 165, 0.3);
      border: 4px solid white;
    }
    
    .photo-placeholder {
      font-size: 50px;
    }
    
    .modules-grid {
      padding: 0 50px 40px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    .resume-module {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s;
    }
    
    .resume-module:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    }
    
    .resume-module.full-width {
      grid-column: 1 / -1;
    }
    
    .module-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 15px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e8f4f8;
      flex-wrap: wrap;
    }
    
    .module-drag-handle {
      cursor: grab;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.2s;
      color: #999;
    }
    
    .module-drag-handle:hover {
      background: #f0f0f0;
      color: #3a7ca5;
    }
    
    .module-drag-handle:active {
      cursor: grabbing;
    }
    
    .module-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #3a7ca5, #2d6a8f);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .module-title {
      font-size: 18px;
      color: #1e3c5e;
      margin: 0;
      font-weight: 600;
    }
    
    .module-subtitle {
      font-size: 12px;
      color: #3a7ca5;
      margin-left: auto;
      font-weight: 500;
    }
    
    .module-actions {
      display: flex;
      gap: 4px;
      margin-left: auto;
    }
    
    .module-btn {
      background: none;
      border: none;
      padding: 4px 8px;
      cursor: pointer;
      border-radius: 4px;
      color: #999;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .module-btn:hover {
      background: #f0f0f0;
      color: #3a7ca5;
    }
    
    .module-content {
      color: #444;
    }
    
    .module-text {
      font-size: 14px;
      line-height: 1.8;
      margin-bottom: 8px;
    }
    
    .module-list {
      margin: 10px 0;
      padding-left: 20px;
    }
    
    .module-list-item {
      font-size: 14px;
      line-height: 1.8;
      margin-bottom: 4px;
      color: #555;
    }
    
    [contenteditable="true"]:focus {
      outline: 2px dashed #3a7ca5;
      outline-offset: 2px;
      border-radius: 4px;
    }
    
    .add-module-section {
      padding: 0 50px 20px;
      display: flex;
      justify-content: center;
    }
    
    .add-module-btn {
      background: white;
      border: 2px dashed #ccc;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      color: #666;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    
    .add-module-btn:hover {
      border-color: #3a7ca5;
      color: #3a7ca5;
      background: #f8fafc;
    }
    
    .add-module-menu {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      padding: 24px;
      z-index: 1001;
      min-width: 300px;
      display: none;
    }
    
    .add-module-menu.show {
      display: block;
    }
    
    .add-module-menu h3 {
      margin: 0 0 16px;
      font-size: 18px;
      color: #333;
    }
    
    .add-module-menu ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .add-module-menu li {
      padding: 12px 16px;
      cursor: pointer;
      border-radius: 6px;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .add-module-menu li:hover {
      background: #f0f8fc;
    }
    
    .add-module-menu .menu-icon {
      width: 28px;
      height: 28px;
      background: #e8f4f8;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: none;
    }
    
    .menu-overlay.show {
      display: block;
    }
    
    .resume-actions {
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
      background: #f0f8fc;
      color: #1e3c5e;
      border: 1px solid #1e3c5e;
    }
    
    .print-btn:hover {
      background: #e0e8f4;
    }

    .pdf-btn {
      background: linear-gradient(135deg, #3a7ca5, #2d6a8f);
      color: white;
      border: none;
    }

    .pdf-btn:hover {
      background: linear-gradient(135deg, #2d6a8f, #1e4f6e);
    }

    /* 移动端响应式布局 */
    @media only screen and (max-width: 768px) {
      body {
        padding: 10px;
        background: #f0f8fc;
      }
      
      .resume-container {
        width: 100%;
        max-width: 100%;
        min-height: auto;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      }
      
      .header-section {
        padding: 40px 20px 20px;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 20px;
      }
      
      .header-name {
        font-size: 32px;
        letter-spacing: 2px;
      }
      
      .header-subtitle {
        font-size: 12px;
        letter-spacing: 4px;
      }
      
      .photo-box {
        width: 100px;
        height: 100px;
      }
      
      .photo-placeholder {
        font-size: 40px;
      }
      
      .modules-grid {
        padding: 0 20px 20px;
        grid-template-columns: 1fr;
        gap: 15px;
      }
      
      .resume-module {
        border-radius: 8px;
        padding: 15px;
      }
      
      .module-header {
        flex-wrap: wrap;
        gap: 10px;
      }
      
      .module-subtitle {
        width: 100%;
        margin-left: 62px;
      }
      
      .module-text {
        font-size: 13px;
      }
      
      .module-list-item {
        font-size: 13px;
      }
      
      .add-module-section {
        padding: 0 20px 20px;
      }
      
      .add-module-btn {
        width: 100%;
        justify-content: center;
        min-height: 50px;
        font-size: 15px;
      }
      
      .action-btn {
        padding: 12px 20px;
        font-size: 14px;
        border-radius: 6px;
        min-height: 50px;
      }
      
      /* 触摸友好的按钮样式 */
      .module-btn {
        min-height: 36px;
        min-width: 36px;
        padding: 8px;
      }
      
      .resume-actions {
        padding: 20px;
      }
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .wave-bg,
      .resume-actions,
      .add-module-section,
      .module-actions,
      .module-drag-handle {
        display: none !important;
      }
      
      .resume-container {
        width: 100%;
        max-width: 100%;
        box-shadow: none;
        padding: 30px 40px;
      }
      
      .module-header {
        border-bottom: 1px solid #ddd;
      }
      
      [contenteditable="true"]:focus {
        outline: none;
      }
      
      @page {
        margin: 0;
        size: A4 portrait;
      }
    }
  </style>
</head>
<body>
  <svg class="wave-bg" viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,100 C150,50 350,150 500,80 C650,10 750,120 800,60 L800,0 L0,0 Z" fill="#3a7ca5"/>
    <path d="M0,120 C200,80 400,160 600,100 C700,70 750,130 800,90 L800,0 L0,0 Z" fill="#2d6a8f" opacity="0.7"/>
  </svg>
  
  <div class="resume-container" id="resumeContainer">
    <div class="header-section">
      <div class="header-content">
        <h1 class="header-name">${name}</h1>
        <p class="header-subtitle">PERSONAL RESUME</p>
      </div>
      <div class="photo-box">
        <span class="photo-placeholder">📷</span>
      </div>
    </div>
    
    <div class="modules-grid">
      ${modulesHTML}
    </div>
    
    <div class="add-module-section">
      <button class="add-module-btn" onclick="showAddModuleMenu()">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
        添加模块
      </button>
    </div>
  </div>
  
  <div class="menu-overlay" id="menuOverlay" onclick="closeAddModuleMenu()"></div>
  <div class="add-module-menu" id="addModuleMenu">
    <h3>选择要添加的模块</h3>
    <ul>
      <li onclick="addModule('basic', '基本信息')">
        <div class="menu-icon">👤</div>
        <span>基本信息</span>
      </li>
      <li onclick="addModule('education', '教育背景')">
        <div class="menu-icon">🎓</div>
        <span>教育背景</span>
      </li>
      <li onclick="addModule('work', '工作经历')">
        <div class="menu-icon">💼</div>
        <span>工作经历</span>
      </li>
      <li onclick="addModule('project', '项目经历')">
        <div class="menu-icon">🏢</div>
        <span>项目经历</span>
      </li>
      <li onclick="addModule('skills', '专业技能')">
        <div class="menu-icon">🔧</div>
        <span>专业技能</span>
      </li>
      <li onclick="addModule('evaluation', '自我评价')">
        <div class="menu-icon">📝</div>
        <span>自我评价</span>
      </li>
      <li onclick="addModule('campus', '校园经历')">
        <div class="menu-icon">🏫</div>
        <span>校园经历</span>
      </li>
      <li onclick="addModule('awards', '获得荣誉')">
        <div class="menu-icon">🏆</div>
        <span>获得荣誉</span>
      </li>
    </ul>
    <button class="action-btn print-btn" onclick="closeAddModuleMenu()" style="width:100%;margin-top:16px;">取消</button>
  </div>
  
  <div class="resume-actions">
    <button class="action-btn print-btn" onclick="window.print()">打印简历</button>
    <button class="action-btn pdf-btn" onclick="downloadPDF()">导出PDF</button>
  </div>

  \u003Cscript\u003E
    function downloadPDF() {
      const element = document.querySelector('.resume-container');
      const opt = {
        margin: 0,
        filename: '${name}_简历.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' }
      };

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = function() {
        html2pdf().set(opt).from(element).save();
      };
      document.head.appendChild(script);
    }

    let modules = [
      ${modules.map(m => `{ id: '${m.id}', type: '${m.type}', title: '${m.title}', content: ${JSON.stringify(m.content)} }`).join(',\n')}
    ]
    
    function moveModule(moduleId, direction) {
      const index = modules.findIndex(m => m.id === moduleId)
      if (index === -1) return
      
      const newIndex = index + direction
      if (newIndex < 0 || newIndex >= modules.length) return
      
      const temp = modules[index]
      modules[index] = modules[newIndex]
      modules[newIndex] = temp
      document.location.reload()
    }
    
    function deleteModule(moduleId) {
      modules = modules.filter(m => m.id !== moduleId)
      const element = document.querySelector('[data-module-id="' + moduleId + '"]')
      if (element) element.remove()
    }
    
    function showAddModuleMenu() {
      document.getElementById('menuOverlay').classList.add('show')
      document.getElementById('addModuleMenu').classList.add('show')
    }
    
    function closeAddModuleMenu() {
      document.getElementById('menuOverlay').classList.remove('show')
      document.getElementById('addModuleMenu').classList.remove('show')
    }
    
    function getModuleIcon(type) {
      const icons = {
        basic: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/></svg>',
        education: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 16 16"><path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917zM8 8.46 1.758 5.965 8 3.052l6.242 2.913z"/><path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46z"/></svg>',
        work: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 16 16"><path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5m1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0M1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5"/></svg>',
        project: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 16 16"><path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5m1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0M1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5"/></svg>',
        skills: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 16 16"><path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139q.323-.119.684-.12h5.396z"/></svg>',
        evaluation: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 16 16"><path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1z"/></svg>',
        campus: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 16 16"><path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917zM8 8.46 1.758 5.965 8 3.052l6.242 2.913z"/><path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46z"/></svg>',
        awards: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/></svg>'
      }
      return icons[type] || icons.basic
    }
    
    const moduleTitles = {
      basic: '基本信息',
      education: '教育背景',
      work: '工作经历',
      project: '项目经历',
      skills: '专业技能',
      evaluation: '自我评价',
      campus: '校园经历',
      awards: '获得荣誉'
    }
    
    function addModule(type, title) {
      const newModule = {
        id: 'module_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        type: type,
        title: title,
        content: ['在此输入内容...']
      }
      
      const isFullWidth = ['education', 'work', 'skills'].includes(type)
      const widthClass = isFullWidth ? 'full-width' : ''

      const moduleHTML = '<div class="resume-module ' + widthClass + '" data-module-id="' + newModule.id + '" data-module-type="' + type + '" data-sort-index="' + modules.length + '">' +
        '<div class="module-header">' +
          '<div class="module-drag-handle" title="拖动调整位置">' +
            '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">' +
              '<circle cx="4" cy="4" r="1.5"/>' +
              '<circle cx="8" cy="4" r="1.5"/>' +
              '<circle cx="12" cy="4" r="1.5"/>' +
              '<circle cx="4" cy="8" r="1.5"/>' +
              '<circle cx="8" cy="8" r="1.5"/>' +
              '<circle cx="12" cy="8" r="1.5"/>' +
              '<circle cx="4" cy="12" r="1.5"/>' +
              '<circle cx="8" cy="12" r="1.5"/>' +
              '<circle cx="12" cy="12" r="1.5"/>' +
            '</svg>' +
          '</div>' +
          '<div class="module-icon">' + getModuleIcon(type) + '</div>' +
          '<h2 class="module-title" contenteditable="true">' + title + '</h2>' +
          '<span class="module-subtitle">' + (type === 'basic' ? 'Basic information' : type === 'education' ? 'Education background' : type === 'work' ? 'Work experience' : type === 'skills' ? 'Professional skills' : type === 'evaluation' ? 'Self assessment' : 'Get the honor') + '</span>' +
          '<div class="module-actions">' +
            '<button class="module-btn module-up" onclick="moveModule(\'' + newModule.id + '\', -1)" title="上移">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/></svg>' +
            '</button>' +
            '<button class="module-btn module-down" onclick="moveModule(\'' + newModule.id + '\', 1)" title="下移">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/></svg>' +
            '</button>' +
            '<button class="module-btn module-delete" onclick="deleteModule(\'' + newModule.id + '\')" title="删除">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="module-content">' +
          '<p class="module-text" contenteditable="true">在此输入内容...</p>' +
        '</div>' +
      '</div>'
      
      document.querySelector('.modules-grid').insertAdjacentHTML('beforeend', moduleHTML)
      modules.push(newModule)
      closeAddModuleMenu()
    }

    // 模块拖拽功能
    let draggedElement = null;

    function initDragAndDrop() {
      const moduleElements = document.querySelectorAll('.resume-module, .sidebar-section, .main-section');
      moduleElements.forEach(module => {
        module.draggable = true;

        module.addEventListener('dragstart', function(e) {
          draggedElement = this;
          this.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
        });

        module.addEventListener('dragend', function() {
          this.classList.remove('dragging');
          draggedElement = null;
          document.querySelectorAll('.resume-module, .sidebar-section, .main-section').forEach(m => {
            m.classList.remove('drag-over');
          });
          updateModuleIndices();
        });

        module.addEventListener('dragover', function(e) {
          e.preventDefault();
          if (this !== draggedElement) {
            this.classList.add('drag-over');
          }
        });

        module.addEventListener('dragleave', function() {
          this.classList.remove('drag-over');
        });

        module.addEventListener('drop', function(e) {
          e.preventDefault();
          this.classList.remove('drag-over');
          if (this !== draggedElement && draggedElement) {
            const container = document.querySelector('.modules-grid') || document.getElementById('modules-container') || document.querySelector('.resume-modules');
            if (container) {
              const allModules = Array.from(container.children);
              const draggedIndex = allModules.indexOf(draggedElement);
              const targetIndex = allModules.indexOf(this);

              if (draggedIndex < targetIndex) {
                container.insertBefore(draggedElement, this.nextSibling);
              } else {
                container.insertBefore(draggedElement, this);
              }
            }
          }
        });
      });
    }

    // 更新模块索引
    function updateModuleIndices() {
      const container = document.querySelector('.modules-grid') || document.getElementById('modules-container') || document.querySelector('.resume-modules');
      if (container) {
        container.querySelectorAll('.resume-module, .sidebar-section, .main-section').forEach((module, index) => {
          module.setAttribute('data-sort-index', index);
        });
      }
    }

    // 初始化
    document.addEventListener('DOMContentLoaded', function() {
      initDragAndDrop();
    });
  \u003C/script\u003E
<\/body>
<\/html>`
    },

    generateSidebarPinkHTML(modules, name) {
      // 生成侧边栏粉色风格的HTML简历
      const moduleTitles = {
        basic: '基本信息',
        education: '教育背景',
        work: '工作经历',
        project: '项目经历',
        skills: '专业技能',
        evaluation: '自我评价',
        campus: '校园经历',
        awards: '获得荣誉'
      }
      
      let modulesHTML = ''
      modules.forEach((module, index) => {
        const title = module.title || moduleTitles[module.type] || '其他'
        const contentBody = module.content.map(line => {
          if (line.startsWith('•') || line.startsWith('-')) {
            return '<li class="module-list-item" contenteditable="true">' + line.substring(1).trim() + '</li>'
          }
          return '<p class="module-text" contenteditable="true">' + line + '</p>'
        }).join('\n')

        const isSidebar = ['basic', 'skills', 'evaluation', 'awards'].includes(module.type)
        const sectionClass = isSidebar ? 'sidebar-section' : 'main-section'

        modulesHTML += '<div class="' + sectionClass + '" data-module-id="' + module.id + '" data-module-type="' + module.type + '" data-sort-index="' + index + '">' +
          '<div class="section-header">' +
            '<div class="module-drag-handle" title="拖动调整位置">☰</div>' +
            '<h2 class="section-title" contenteditable="true">' + title + '</h2>' +
            '<div class="module-actions">' +
              '<button class="module-btn module-up" onclick="moveModule(\'' + module.id + '\', -1)" title="上移">↑</button>' +
              '<button class="module-btn module-down" onclick="moveModule(\'' + module.id + '\', 1)" title="下移">↓</button>' +
              '<button class="module-btn module-delete" onclick="deleteModule(\'' + module.id + '\')" title="删除">×</button>' +
            '</div>' +
          '</div>' +
          '<div class="section-content">' +
            contentBody +
          '</div>' +
        '</div>'
      })
      
      return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - 个人简历</title>
  
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Microsoft YaHei', 'SimSun', sans-serif;
      background: #f5f0f2;
      padding: 0;
      margin: 0;
      min-height: 100vh;
    }
    
    .resume-container {
      width: 794px;
      min-height: 1123px;
      margin: 0 auto;
      background: white;
      display: flex;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .sidebar {
      width: 300px;
      background: linear-gradient(180deg, #2c1e2e 0%, #3d2540 100%);
      color: white;
      padding: 40px 30px;
      flex-shrink: 0;
    }
    
    .sidebar-header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .photo-box {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #d45a8a, #e86fa3);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      border: 3px solid white;
      box-shadow: 0 4px 15px rgba(212, 90, 138, 0.4);
    }
    
    .photo-placeholder {
      font-size: 48px;
    }
    
    .sidebar-name {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 5px;
      color: #e86fa3;
    }
    
    .sidebar-position {
      font-size: 14px;
      opacity: 0.8;
      margin-bottom: 20px;
    }
    
    .sidebar-divider {
      height: 2px;
      background: linear-gradient(90deg, transparent, #d45a8a, transparent);
      margin: 20px 0;
    }
    
    .sidebar-section {
      margin-bottom: 30px;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
      flex-wrap: wrap;
    }
    
    .section-title {
      font-size: 16px;
      color: #e86fa3;
      margin: 0;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .sidebar .section-title {
      color: #f0a8c6;
    }
    
    .section-content {
      color: #555;
    }
    
    .sidebar .section-content {
      color: #ddd;
    }
    
    .module-text {
      font-size: 14px;
      line-height: 1.8;
      margin-bottom: 8px;
    }
    
    .module-list {
      margin: 10px 0;
      padding-left: 20px;
    }
    
    .module-list-item {
      font-size: 14px;
      line-height: 1.8;
      margin-bottom: 4px;
    }
    
    .main-content {
      flex: 1;
      padding: 40px;
      background: white;
    }
    
    .main-section {
      margin-bottom: 35px;
      border-left: 3px solid #e86fa3;
      padding-left: 20px;
    }
    
    .module-drag-handle {
      cursor: grab;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.2s;
      color: #999;
    }
    
    .module-drag-handle:hover {
      background: #f0f0f0;
      color: #e86fa3;
    }
    
    .module-drag-handle:active {
      cursor: grabbing;
    }
    
    .sidebar .module-drag-handle {
      color: #888;
    }
    
    .sidebar .module-drag-handle:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #e86fa3;
    }
    
    .module-actions {
      display: flex;
      gap: 4px;
      margin-left: auto;
    }
    
    .module-btn {
      background: none;
      border: none;
      padding: 4px 8px;
      cursor: pointer;
      border-radius: 4px;
      color: #999;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .module-btn:hover {
      background: #f0f0f0;
      color: #e86fa3;
    }
    
    .sidebar .module-btn {
      color: #888;
    }
    
    .sidebar .module-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #e86fa3;
    }
    
    [contenteditable="true"]:focus {
      outline: 2px dashed #e86fa3;
      outline-offset: 2px;
      border-radius: 4px;
    }
    
    .resume-actions {
      padding: 20px;
      display: flex;
      gap: 15px;
      justify-content: center;
      border-top: 1px solid #e0e0e0;
      background: white;
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
      background: linear-gradient(135deg, #d45a8a, #e86fa3);
      color: white;
    }
    
    .print-btn:hover {
      background: linear-gradient(135deg, #c44a7a, #d85f93);
    }

    .pdf-btn {
      background: linear-gradient(135deg, #d45a8a, #e86fa3);
      color: white;
      border: none;
    }

    .pdf-btn:hover {
      background: linear-gradient(135deg, #b84878, #cc5e93);
    }

    .add-module-btn {
      background: white;
      border: 2px dashed #e86fa3;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      color: #e86fa3;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    
    .add-module-btn:hover {
      background: #fff0f5;
      border-style: solid;
    }
    
    .add-module-menu {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      padding: 24px;
      z-index: 1001;
      min-width: 300px;
      display: none;
    }
    
    .add-module-menu.show {
      display: block;
    }
    
    .add-module-menu h3 {
      margin: 0 0 16px;
      font-size: 18px;
      color: #333;
    }
    
    .add-module-menu ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .add-module-menu li {
      padding: 12px 16px;
      cursor: pointer;
      border-radius: 6px;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .add-module-menu li:hover {
      background: #fff0f5;
    }
    
    .add-module-menu .menu-icon {
      width: 28px;
      height: 28px;
      background: #ffe8f0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: none;
    }
    
    .menu-overlay.show {
      display: block;
    }
    
    @media only screen and (max-width: 768px) {
      body {
        padding: 10px;
        background: #f5f0f2;
      }
      
      .resume-container {
        width: 100%;
        max-width: 100%;
        min-height: auto;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        flex-direction: column;
      }
      
      .sidebar {
        width: 100%;
        border-radius: 8px 8px 0 0;
      }
      
      .main-content {
        padding: 30px 20px;
      }
      
      .resume-actions {
        padding: 20px;
      }
      
      .action-btn {
        padding: 12px 20px;
        font-size: 14px;
        border-radius: 6px;
        min-height: 50px;
      }
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .resume-actions,
      .add-module-section,
      .module-actions,
      .module-drag-handle {
        display: none !important;
      }
      
      .resume-container {
        width: 100%;
        max-width: 100%;
        box-shadow: none;
      }
      
      [contenteditable="true"]:focus {
        outline: none;
      }
      
      @page {
        margin: 0;
        size: A4 portrait;
      }
    }
  </style>
</head>
<body>
  <div class="resume-container" id="resumeContainer">
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="photo-box">
          <span class="photo-placeholder">👤</span>
        </div>
        <h1 class="sidebar-name">${name}</h1>
        <p class="sidebar-position">求职简历</p>
      </div>
      
      ${modules.filter(m => ['basic', 'skills', 'evaluation', 'awards'].includes(m.type)).map((m, i) => {
        const title = m.title || moduleTitles[m.type] || '其他'
        const contentBody = m.content.map(line => {
          if (line.startsWith('•') || line.startsWith('-')) {
            return `<li class="module-list-item" contenteditable="true">${line.substring(1).trim()}</li>`
          }
          return `<p class="module-text" contenteditable="true">${line}</p>`
        }).join('\n')
        return `
        <div class="sidebar-section" data-module-id="${m.id}" data-module-type="${m.type}" data-sort-index="${i}">
          <div class="section-header">
            <div class="module-drag-handle" title="拖动调整位置">☰</div>
            <h2 class="section-title" contenteditable="true">${title}</h2>
            <div class="module-actions">
              <button class="module-btn module-up" onclick="moveModule('${m.id}', -1)" title="上移">↑</button>
              <button class="module-btn module-down" onclick="moveModule('${m.id}', 1)" title="下移">↓</button>
              <button class="module-btn module-delete" onclick="deleteModule('${m.id}')" title="删除">×</button>
            </div>
          </div>
          <div class="section-content">
            ${contentBody}
          </div>
        </div>`
      }).join('')}
    </div>
    
    <div class="main-content">
      ${modules.filter(m => ['education', 'work', 'project', 'campus'].includes(m.type)).map((m, i) => {
        const title = m.title || moduleTitles[m.type] || '其他'
        const contentBody = m.content.map(line => {
          if (line.startsWith('•') || line.startsWith('-')) {
            return `<li class="module-list-item" contenteditable="true">${line.substring(1).trim()}</li>`
          }
          return `<p class="module-text" contenteditable="true">${line}</p>`
        }).join('\n')
        return `
        <div class="main-section" data-module-id="${m.id}" data-module-type="${m.type}" data-sort-index="${i}">
          <div class="section-header">
            <div class="module-drag-handle" title="拖动调整位置">☰</div>
            <h2 class="section-title" contenteditable="true">${title}</h2>
            <div class="module-actions">
              <button class="module-btn module-up" onclick="moveModule('${m.id}', -1)" title="上移">↑</button>
              <button class="module-btn module-down" onclick="moveModule('${m.id}', 1)" title="下移">↓</button>
              <button class="module-btn module-delete" onclick="deleteModule('${m.id}')" title="删除">×</button>
            </div>
          </div>
          <div class="section-content">
            ${contentBody}
          </div>
        </div>`
      }).join('')}
    </div>
  </div>
  
  <div class="resume-actions">
    <button class="action-btn print-btn" onclick="window.print()">打印简历</button>
    <button class="action-btn pdf-btn" onclick="downloadPDF()">导出PDF</button>
  </div>
</body>
</html>
\u003Cscript\u003E
  function downloadPDF() {
    const element = document.querySelector('.resume-container');
    const opt = {
      margin: 0,
      filename: '${name}_简历.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' }
    };

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = function() {
      html2pdf().set(opt).from(element).save();
    };
    document.head.appendChild(script);
  }

    // 模块拖拽功能
    let draggedElement = null;

    function initDragAndDrop() {
      const moduleElements = document.querySelectorAll('.sidebar-section, .main-section');
      moduleElements.forEach(module => {
        module.draggable = true;

        module.addEventListener('dragstart', function(e) {
          draggedElement = this;
          this.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
        });

        module.addEventListener('dragend', function() {
          this.classList.remove('dragging');
          draggedElement = null;
          document.querySelectorAll('.sidebar-section, .main-section').forEach(m => {
            m.classList.remove('drag-over');
          });
          updateModuleIndices();
        });

        module.addEventListener('dragover', function(e) {
          e.preventDefault();
          if (this !== draggedElement) {
            this.classList.add('drag-over');
          }
        });

        module.addEventListener('dragleave', function() {
          this.classList.remove('drag-over');
        });

        module.addEventListener('drop', function(e) {
          e.preventDefault();
          this.classList.remove('drag-over');
          if (this !== draggedElement && draggedElement) {
            const container = this.parentNode;
            const allModules = Array.from(container.children);
            const draggedIndex = allModules.indexOf(draggedElement);
            const targetIndex = allModules.indexOf(this);

            if (draggedIndex < targetIndex) {
              container.insertBefore(draggedElement, this.nextSibling);
            } else {
              container.insertBefore(draggedElement, this);
            }
          }
        });
      });
    }

    // 更新模块索引
    function updateModuleIndices() {
      document.querySelectorAll('.sidebar-section, .main-section').forEach((module, index) => {
        module.setAttribute('data-sort-index', index);
      });
    }

    // 初始化
    document.addEventListener('DOMContentLoaded', function() {
      initDragAndDrop();
    });
\u003C/script\u003E
</body>
</html>`

    },

    generateRedSimpleHTML(modules, name) {
      // 生成红色简洁风格的HTML简历
      const moduleTitles = {
        basic: '基本信息',
        education: '教育背景',
        work: '工作经历',
        project: '项目经历',
        skills: '专业技能',
        evaluation: '自我评价',
        campus: '校园经历',
        awards: '获得荣誉'
      }
      
      let modulesHTML = ''
      modules.forEach((module, index) => {
        const title = module.title || moduleTitles[module.type] || '其他'
        const contentBody = module.content.map(line => {
          if (line.startsWith('•') || line.startsWith('-')) {
            return `<li class="module-list-item" contenteditable="true">${line.substring(1).trim()}</li>`
          }
          return `<p class="module-text" contenteditable="true">${line}</p>`
        }).join('\n')
        
        modulesHTML += `
      <div class="resume-module" data-module-id="${module.id}" data-module-type="${module.type}" data-sort-index="${index}">
        <div class="module-header">
          <div class="module-drag-handle" title="拖动调整位置">☰</div>
          <h2 class="module-title" contenteditable="true">${title}</h2>
          <div class="module-actions">
            <button class="module-btn module-up" onclick="moveModule('${module.id}', -1)" title="上移">↑</button>
            <button class="module-btn module-down" onclick="moveModule('${module.id}', 1)" title="下移">↓</button>
            <button class="module-btn module-delete" onclick="deleteModule('${module.id}')" title="删除">×</button>
          </div>
        </div>
        <div class="module-content">
          ${contentBody}
        </div>
      </div>`
      })
      
      return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - 个人简历</title>
  
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'SimSun', 'Microsoft YaHei', serif;
      background: #f8f8f8;
      padding: 0;
      margin: 0;
      min-height: 100vh;
    }
    
    .resume-container {
      width: 794px;
      min-height: 1123px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .header-section {
      background: linear-gradient(90deg, #c8102e, #e31e3c);
      color: white;
      padding: 40px 50px;
      position: relative;
    }
    
    .header-content {
      display: flex;
      align-items: center;
      gap: 30px;
    }
    
    .photo-box {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid rgba(255, 255, 255, 0.3);
      flex-shrink: 0;
    }
    
    .photo-placeholder {
      font-size: 48px;
      color: #c8102e;
    }
    
    .header-text {
      flex: 1;
    }
    
    .header-name {
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 8px;
      letter-spacing: 4px;
    }
    
    .header-position {
      font-size: 16px;
      opacity: 0.9;
      margin-bottom: 15px;
    }
    
    .header-divider {
      height: 3px;
      background: white;
      margin-top: 20px;
      opacity: 0.3;
    }
    
    .content-section {
      padding: 30px 50px;
    }
    
    .resume-module {
      margin-bottom: 25px;
    }
    
    .module-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #c8102e;
      flex-wrap: wrap;
    }
    
    .module-drag-handle {
      cursor: grab;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.2s;
      color: #999;
    }
    
    .module-drag-handle:hover {
      background: #f0f0f0;
      color: #c8102e;
    }
    
    .module-drag-handle:active {
      cursor: grabbing;
    }
    
    .module-title {
      font-size: 18px;
      color: #c8102e;
      margin: 0;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .module-actions {
      display: flex;
      gap: 4px;
      margin-left: auto;
    }
    
    .module-btn {
      background: none;
      border: none;
      padding: 4px 8px;
      cursor: pointer;
      border-radius: 4px;
      color: #999;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .module-btn:hover {
      background: #f0f0f0;
      color: #c8102e;
    }
    
    .module-content {
      color: #333;
      padding-left: 10px;
    }
    
    .module-text {
      font-size: 14px;
      line-height: 2;
      margin-bottom: 6px;
    }
    
    .module-list {
      margin: 8px 0;
      padding-left: 25px;
    }
    
    .module-list-item {
      font-size: 14px;
      line-height: 2;
      margin-bottom: 3px;
    }
    
    [contenteditable="true"]:focus {
      outline: 2px dashed #c8102e;
      outline-offset: 2px;
      border-radius: 4px;
    }
    
    .resume-actions {
      padding: 20px 50px;
      display: flex;
      gap: 15px;
      justify-content: center;
      border-top: 1px solid #e0e0e0;
      background: white;
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
      background: #c8102e;
      color: white;
    }
    
    .print-btn:hover {
      background: #a80e26;
    }

    .pdf-btn {
      background: linear-gradient(135deg, #c8102e, #e31e3c);
      color: white;
      border: none;
    }

    .pdf-btn:hover {
      background: linear-gradient(135deg, #a80e26, #c41830);
    }

    @media only screen and (max-width: 768px) {
      body {
        padding: 10px;
        background: #f8f8f8;
      }
      
      .resume-container {
        width: 100%;
        max-width: 100%;
        min-height: auto;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      }
      
      .header-section {
        padding: 30px 20px;
        border-radius: 8px 8px 0 0;
      }
      
      .header-content {
        flex-direction: column;
        text-align: center;
      }
      
      .content-section {
        padding: 25px 20px;
      }
      
      .resume-actions {
        padding: 20px;
      }
      
      .action-btn {
        padding: 12px 20px;
        font-size: 14px;
        border-radius: 6px;
        min-height: 50px;
      }
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .resume-actions,
      .add-module-section,
      .module-actions,
      .module-drag-handle {
        display: none !important;
      }
      
      .resume-container {
        width: 100%;
        max-width: 100%;
        box-shadow: none;
      }
      
      [contenteditable="true"]:focus {
        outline: none;
      }
      
      @page {
        margin: 0;
        size: A4 portrait;
      }
    }
  </style>
</head>
<body>
  <div class="resume-container" id="resumeContainer">
    <div class="header-section">
      <div class="header-content">
        <div class="photo-box">
          <span class="photo-placeholder">👤</span>
        </div>
        <div class="header-text">
          <h1 class="header-name">${name}</h1>
          <p class="header-position">求职简历</p>
        </div>
      </div>
      <div class="header-divider"></div>
    </div>
    
    <div class="content-section">
      ${modulesHTML}
    </div>
  </div>
  
  <div class="resume-actions">
    <button class="action-btn print-btn" onclick="window.print()">打印简历</button>
    <button class="action-btn pdf-btn" onclick="downloadPDF()">导出PDF</button>
  </div>
</body>
</html>
\u003Cscript\u003E
  function downloadPDF() {
    const element = document.querySelector('.resume-container');
    const opt = {
      margin: 0,
      filename: '${name}_简历.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' }
    };

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = function() {
      html2pdf().set(opt).from(element).save();
    };
    document.head.appendChild(script);
  }

    // 模块拖拽功能
    let draggedElement = null;

    function initDragAndDrop() {
      const moduleElements = document.querySelectorAll('.content-section > div');
      moduleElements.forEach(module => {
        module.draggable = true;

        module.addEventListener('dragstart', function(e) {
          draggedElement = this;
          this.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
        });

        module.addEventListener('dragend', function() {
          this.classList.remove('dragging');
          draggedElement = null;
          document.querySelectorAll('.content-section > div').forEach(m => {
            m.classList.remove('drag-over');
          });
          updateModuleIndices();
        });

        module.addEventListener('dragover', function(e) {
          e.preventDefault();
          if (this !== draggedElement) {
            this.classList.add('drag-over');
          }
        });

        module.addEventListener('dragleave', function() {
          this.classList.remove('drag-over');
        });

        module.addEventListener('drop', function(e) {
          e.preventDefault();
          this.classList.remove('drag-over');
          if (this !== draggedElement && draggedElement) {
            const container = document.querySelector('.content-section');
            if (container) {
              const allModules = Array.from(container.children);
              const draggedIndex = allModules.indexOf(draggedElement);
              const targetIndex = allModules.indexOf(this);

              if (draggedIndex < targetIndex) {
                container.insertBefore(draggedElement, this.nextSibling);
              } else {
                container.insertBefore(draggedElement, this);
              }
            }
          }
        });
      });
    }

    // 更新模块索引
    function updateModuleIndices() {
      const container = document.querySelector('.content-section');
      if (container) {
        container.querySelectorAll('> div').forEach((module, index) => {
          module.setAttribute('data-sort-index', index);
        });
      }
    }

    // 初始化
    document.addEventListener('DOMContentLoaded', function() {
      initDragAndDrop();
    });
\u003C/script\u003E
</body>
</html>`

    },

    parseResumeToModules(text) {
      // 将简历文本解析为模块数组
      const lines = text.split('\n')
      const modules = []
      let currentModule = null

      const sectionKeywords = {
        '基本信息': 'basic',
        '个人信息': 'basic',
        '教育背景': 'education',
        '教育经历': 'education',
        '工作经历': 'work',
        '实习经历': 'work',
        '项目经历': 'project',
        '项目经验': 'project',
        '专业技能': 'skills',
        '技能证书': 'skills',
        '自我评价': 'evaluation',
        '校园经历': 'campus',
        '获奖情况': 'awards'
      }

      lines.forEach((line, index) => {
        const trimmedLine = line.trim()
        if (!trimmedLine) return

        // 检测是否是模块标题
        let isSectionTitle = false
        let sectionType = ''
        let sectionTitle = trimmedLine

        for (const [keyword, type] of Object.entries(sectionKeywords)) {
          if (trimmedLine.includes(keyword)) {
            isSectionTitle = true
            sectionType = type
            break
          }
        }

        // 如果当前行是短文本且下一行是列表或长文本，也可能是标题
        if (!isSectionTitle && trimmedLine.length < 20 && index < lines.length - 1) {
          const nextLine = lines[index + 1]?.trim() || ''
          if (nextLine && (nextLine.startsWith('•') || nextLine.startsWith('-') || nextLine.length > 30)) {
            for (const [keyword, type] of Object.entries(sectionKeywords)) {
              if (trimmedLine.includes(keyword)) {
                isSectionTitle = true
                sectionType = type
                break
              }
            }
          }
        }

        if (isSectionTitle) {
          if (currentModule) {
            modules.push(currentModule)
          }
          currentModule = {
            id: 'module_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            type: sectionType,
            title: sectionTitle,
            content: []
          }
        } else if (currentModule) {
          currentModule.content.push(trimmedLine)
        }
      })

      if (currentModule) {
        modules.push(currentModule)
      }

      return modules
    },

    generateModularHTML(modules, name) {
      // 生成模块化的HTML简历
      const moduleIcons = {
        basic: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/></svg>',
        education: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917zM8 8.46 1.758 5.965 8 3.052l6.242 2.913z"/><path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46z"/></svg>',
        work: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5m1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0M1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5"/></svg>',
        project: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5m1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0M1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5"/></svg>',
        skills: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139q.323-.119.684-.12h5.396z"/></svg>',
        evaluation: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1"/></svg>',
        campus: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917zM8 8.46 1.758 5.965 8 3.052l6.242 2.913z"/><path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46z"/></svg>',
        awards: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/></svg>'
      }

      const moduleTitles = {
        basic: '基本信息',
        education: '教育背景',
        work: '工作经历',
        project: '项目经历',
        skills: '专业技能',
        evaluation: '自我评价',
        campus: '校园经历',
        awards: '获奖情况'
      }

      let modulesHTML = modules.map((module, index) => {
        const icon = moduleIcons[module.type] || '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M5 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1V4zm1 1h4V4H6v1z"/></svg>'
        const title = module.title || moduleTitles[module.type] || '其他'
        const contentHTML = module.content.map(line => {
          if (line.startsWith('•') || line.startsWith('-')) {
            return `<li class="module-list-item" contenteditable="true">${line.substring(1).trim()}</li>`
          }
          return `<p class="module-text" contenteditable="true">${line}</p>`
        }).join('\n')

        const listItems = module.content.filter(line => line.startsWith('•') || line.startsWith('-'))
        const textItems = module.content.filter(line => !line.startsWith('•') && !line.startsWith('-'))

        let contentBody = ''
        if (textItems.length > 0) {
          contentBody += textItems.map(line =>
            `<p class="module-text" contenteditable="true">${line}</p>`
          ).join('\n')
        }
        if (listItems.length > 0) {
          contentBody += `<ul class="module-list">\n` +
            listItems.map(line =>
              `<li class="module-list-item" contenteditable="true">${line.substring(1).trim()}</li>`
            ).join('\n') +
            `\n</ul>`
        }

        return `
      <div class="resume-module" data-module-id="${module.id}" data-module-type="${module.type}" data-sort-index="${index}">
        <div class="module-header">
          <div class="module-drag-handle" title="拖动调整位置">☰</div>
          <div class="module-icon">${icon}</div>
          <h2 class="module-title" contenteditable="true">${title}</h2>
          <div class="module-actions">
            <button class="module-btn module-up" onclick="moveModule('${module.id}', -1)" title="上移">↑</button>
            <button class="module-btn module-down" onclick="moveModule('${module.id}', 1)" title="下移">↓</button>
            <button class="module-btn module-delete" onclick="deleteModule('${module.id}')" title="删除">×</button>
          </div>
        </div>
        <div class="module-content">
          ${contentBody}
        </div>
      </div>`
      }).join('\n')

      return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - 个人简历</title>

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'SimSun', 'Microsoft YaHei', '宋体', serif;
      background: #f0f0f0;
      padding: 0;
      margin: 0;
    }

    .resume-container {
      width: 794px;
      min-height: 1123px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      padding: 40px 56px;
      box-sizing: border-box;
    }

    /* 移动端响应式布局 */
    @media only screen and (max-width: 768px) {
      body {
        padding: 10px;
      }

      .resume-container {
        width: 100%;
        max-width: 100%;
        padding: 20px 15px;
        box-shadow: none;
        min-height: auto;
      }

      .resume-header h1 {
        font-size: 18px;
      }

      .module-title {
        font-size: 14px;
      }

      .module-text {
        font-size: 12px;
      }

      .module-actions {
        opacity: 1;
      }

      .module-btn {
        width: 32px;
        height: 32px;
      }

      .add-module-btn {
        padding: 12px 20px;
        font-size: 14px;
      }
    }

    .resume-header {
      text-align: center;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 2px solid #1e3c5e;
    }

    .resume-header h1 {
      font-size: 22px;
      color: #1e3c5e;
      margin: 0;
      font-weight: bold;
    }

    /* 模块样式 */
    .resume-module {
      margin-bottom: 20px;
      padding: 15px;
      border: 1px dashed transparent;
      border-radius: 6px;
      transition: all 0.3s;
      position: relative;
    }

    .resume-module:hover {
      border-color: #1e3c5e;
      background: #fafbfc;
    }

    .module-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e0e0e0;
    }

    .module-drag-handle {
      cursor: move;
      color: #999;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .module-drag-handle:hover {
      background: #e0e0e0;
      color: #333;
    }

    .module-icon {
      font-size: 18px;
      width: 28px;
      height: 28px;
      background: #1e3c5e;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .module-title {
      font-size: 16px;
      color: #1e3c5e;
      font-weight: bold;
      margin: 0;
      flex: 1;
      outline: none;
      border: 1px solid transparent;
      border-radius: 4px;
      padding: 2px 6px;
      transition: all 0.2s;
    }

    .module-title:hover,
    .module-title:focus {
      border-color: #1e3c5e;
      background: white;
    }

    .module-actions {
      display: flex;
      gap: 4px;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .resume-module:hover .module-actions {
      opacity: 1;
    }

    .module-btn {
      width: 24px;
      height: 24px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 10px;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .module-btn:hover {
      background: #1e3c5e;
      color: white;
      border-color: #1e3c5e;
    }

    .module-delete:hover {
      background: #e53e3e;
      border-color: #e53e3e;
    }

    .module-content {
      padding-left: 38px;
    }

    .module-text {
      font-size: 13px;
      color: #333;
      margin: 4px 0;
      line-height: 1.6;
      outline: none;
      border: 1px solid transparent;
      border-radius: 4px;
      padding: 2px 6px;
      transition: all 0.2s;
    }

    .module-text:hover,
    .module-text:focus {
      border-color: #1e3c5e;
      background: white;
    }

    .module-list {
      margin: 6px 0 6px 18px;
      padding: 0;
    }

    .module-list-item {
      font-size: 13px;
      color: #333;
      margin: 3px 0;
      line-height: 1.6;
      outline: none;
      border: 1px solid transparent;
      border-radius: 4px;
      padding: 2px 6px;
      transition: all 0.2s;
    }

    .module-list-item:hover,
    .module-list-item:focus {
      border-color: #1e3c5e;
      background: white;
    }

    /* 拖拽时的样式 */
    .resume-module.dragging {
      opacity: 0.5;
      border: 2px dashed #1e3c5e;
    }

    .resume-module.drag-over {
      border-top: 3px solid #1e3c5e;
    }

    /* 添加模块按钮 */
    .add-module-bar {
      text-align: center;
      padding: 20px;
      margin-top: 10px;
    }

    .add-module-btn {
      padding: 8px 20px;
      border: 2px dashed #1e3c5e;
      background: white;
      color: #1e3c5e;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;
    }

    .add-module-btn:hover {
      background: #1e3c5e;
      color: white;
    }

    .resume-actions {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      display: flex;
      gap: 15px;
      justify-content: center;
    }

    .action-btn {
      padding: 10px 25px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      font-family: 'SimSun', serif;
      -webkit-tap-highlight-color: transparent;
    }

    .print-btn {
      background: #f0f4f8;
      color: #1e3c5e;
      border: 1px solid #1e3c5e;
      min-height: 44px;
      min-width: 120px;
    }

    .print-btn:hover,
    .print-btn:active {
      background: #e0eaf4;
    }

    .pdf-btn {
      background: linear-gradient(135deg, #1e3c5e, #2f5785);
      color: white;
      border: none;
      min-height: 44px;
      min-width: 120px;
    }

    .pdf-btn:hover,
    .pdf-btn:active {
      background: linear-gradient(135deg, #2f5785, #4a7cb3);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(30, 60, 94, 0.3);
    }

    /* 打印说明文字 */
    .print-hint {
      display: none;
      margin-top: 10px;
      padding: 10px 15px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 12px;
      color: #6b7280;
      line-height: 1.5;
    }

    @media only screen and (max-width: 768px) {
      .action-btn {
        padding: 14px 30px;
        font-size: 16px;
        min-height: 50px;
        border-radius: 8px;
      }

      .print-btn {
        min-width: 100%;
        min-height: 50px;
      }

      .print-hint {
        display: block;
      }
    }

    @media print {
      body {
        background: white;
        padding: 0;
        margin: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .resume-container {
        box-shadow: none;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 15mm 20mm !important;
      }

      .resume-module {
        border: none !important;
        background: transparent !important;
        margin-bottom: 15px !important;
        padding: 0 !important;
        page-break-inside: avoid;
      }

      .module-header {
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 5px;
        margin-bottom: 8px;
      }

      .module-drag-handle,
      .module-actions,
      .add-module-bar,
      .resume-actions,
      .print-hint {
        display: none !important;
      }

      .module-title,
      .module-text,
      .module-list-item {
        border: none !important;
        background: transparent !important;
        padding: 0 !important;
      }

      .module-content {
        padding-left: 0 !important;
      }

      @page {
        margin: 0;
        size: A4 portrait;
      }
    }
  </style>
</head>
<body>
  <div class="resume-container" id="resume">
    <div class="resume-header">
      <h1>${name} - 个人简历</h1>
    </div>

    <div class="resume-modules" id="modules-container">
      ${modulesHTML}
    </div>

    <div class="add-module-bar">
      <button class="add-module-btn" onclick="showAddModuleMenu()">+ 添加模块</button>
    </div>

    <div class="resume-actions" id="resume-actions">
      <button class="action-btn print-btn" onclick="window.print()">
        打印简历
      </button>
      <button class="action-btn pdf-btn" onclick="downloadPDF()">
        导出PDF
      </button>
    </div>

    <div class="print-hint">
      💡 打印提示：请选择A4纸张尺寸，关闭背景图形打印以获得最佳效果
    </div>
  </div>
</body>
</html>
\u003Cscript\u003E
    function downloadPDF() {
      const element = document.querySelector('.resume-container');
      const opt = {
        margin: 0,
        filename: '${name}_简历.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' }
      };

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = function() {
        html2pdf().set(opt).from(element).save();
      };
      document.head.appendChild(script);
    }

    // 模块排序功能
    let draggedElement = null;

    function initDragAndDrop() {
      const modules = document.querySelectorAll('.resume-module');
      modules.forEach(module => {
        module.draggable = true;

        module.addEventListener('dragstart', function(e) {
          draggedElement = this;
          this.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
        });

        module.addEventListener('dragend', function() {
          this.classList.remove('dragging');
          draggedElement = null;
          document.querySelectorAll('.resume-module').forEach(m => {
            m.classList.remove('drag-over');
          });
          updateModuleIndices();
        });

        module.addEventListener('dragover', function(e) {
          e.preventDefault();
          if (this !== draggedElement) {
            this.classList.add('drag-over');
          }
        });

        module.addEventListener('dragleave', function() {
          this.classList.remove('drag-over');
        });

        module.addEventListener('drop', function(e) {
          e.preventDefault();
          this.classList.remove('drag-over');
          if (this !== draggedElement && draggedElement) {
            const container = document.getElementById('modules-container');
            const allModules = Array.from(container.children);
            const draggedIndex = allModules.indexOf(draggedElement);
            const targetIndex = allModules.indexOf(this);

            if (draggedIndex < targetIndex) {
              this.parentNode.insertBefore(draggedElement, this.nextSibling);
            } else {
              this.parentNode.insertBefore(draggedElement, this);
            }
          }
        });
      });
    }

    // 上下移动模块
    function moveModule(moduleId, direction) {
      const module = document.querySelector('[data-module-id="' + moduleId + '"]');
      if (!module) return;

      const container = document.getElementById('modules-container');
      const sibling = direction === -1 ? module.previousElementSibling : module.nextElementSibling;

      if (sibling && sibling.classList.contains('resume-module')) {
        if (direction === -1) {
          container.insertBefore(module, sibling);
        } else {
          container.insertBefore(module, sibling.nextSibling);
        }
        updateModuleIndices();
      }
    }

    // 删除模块
    function deleteModule(moduleId) {
      const module = document.querySelector('[data-module-id="' + moduleId + '"]');
      if (module) {
        if (confirm('确定要删除这个模块吗？')) {
          module.remove();
          updateModuleIndices();
        }
      }
    }

    // 更新模块索引
    function updateModuleIndices() {
      const modules = document.querySelectorAll('.resume-module');
      modules.forEach((module, index) => {
        module.setAttribute('data-sort-index', index);
      });
    }

    // 添加新模块
    function showAddModuleMenu() {
      const moduleTypes = [
        { type: 'basic', title: '基本信息' },
        { type: 'education', title: '教育背景' },
        { type: 'work', title: '工作经历' },
        { type: 'project', title: '项目经历' },
        { type: 'skills', title: '专业技能' },
        { type: 'evaluation', title: '自我评价' },
        { type: 'campus', title: '校园经历' },
        { type: 'awards', title: '获奖情况' }
      ];

      let menuHTML = '<div id="add-module-modal" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.2);z-index:1000;min-width:250px;">';
      menuHTML += '<h3 style="margin-bottom:15px;color:#1e3c5e;">选择要添加的模块</h3>';
      menuHTML += '<div id="module-type-list">';
      moduleTypes.forEach((mt, index) => {
        menuHTML += '<button data-type="' + mt.type + '" data-title="' + mt.title + '" style="display:block;width:100%;padding:10px;margin:5px 0;border:1px solid #e0e0e0;background:white;border-radius:6px;cursor:pointer;text-align:left;transition:all 0.2s;">';
        menuHTML += '<span style="vertical-align:middle;margin-right:8px;">' + getModuleIcon(mt.type) + '</span>';
        menuHTML += mt.title;
        menuHTML += '</button>';
      });
      menuHTML += '</div>';
      menuHTML += '<button onclick="closeAddModuleMenu()" style="display:block;width:100%;padding:10px;margin-top:10px;border:none;background:#f0f0f0;border-radius:6px;cursor:pointer;">取消</button>';
      menuHTML += '</div>';
      menuHTML += '<div id="modal-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.3);z-index:999;" onclick="closeAddModuleMenu()"></div>';

      document.body.insertAdjacentHTML('beforeend', menuHTML);
      
      // 绑定点击事件
      document.querySelectorAll('#module-type-list button').forEach(btn => {
        btn.onclick = function() {
          const type = this.getAttribute('data-type');
          const title = this.getAttribute('data-title');
          addModule(type, title);
        };
      });
    }

    // 获取模块图标
    function getModuleIcon(type) {
      const icons = {
        basic: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/></svg>',
        education: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917zM8 8.46 1.758 5.965 8 3.052l6.242 2.913z"/><path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46z"/></svg>',
        work: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5m1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0M1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5"/></svg>',
        project: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5m1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0M1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5"/></svg>',
        skills: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139q.323-.119.684-.12h5.396z"/></svg>',
        evaluation: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1"/></svg>',
        campus: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917zM8 8.46 1.758 5.965 8 3.052l6.242 2.913z"/><path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46z"/></svg>',
        awards: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/></svg>'
      };
      return icons[type] || icons['basic'];
    }

    // 关闭添加模块菜单
    function closeAddModuleMenu() {
      document.getElementById('add-module-modal')?.remove();
      document.getElementById('modal-overlay')?.remove();
    }

    function addModule(type, title) {
      const container = document.getElementById('modules-container');
      const moduleId = 'module_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const index = container.children.length;

      const moduleHTML = '<div class="resume-module" data-module-id="' + moduleId + '" data-module-type="' + type + '" data-sort-index="' + index + '">' +
        '<div class="module-header">' +
          '<div class="module-drag-handle" title="拖动调整位置">☰</div>' +
          '<div class="module-icon">' + getModuleIcon(type) + '</div>' +
          '<h2 class="module-title" contenteditable="true">' + title + '</h2>' +
          '<div class="module-actions">' +
            '<button class="module-btn module-up" onclick="moveModule(' + "'" + moduleId + "'" + ', -1)" title="上移">↑</button>' +
            '<button class="module-btn module-down" onclick="moveModule(' + "'" + moduleId + "'" + ', 1)" title="下移">↓</button>' +
            '<button class="module-btn module-delete" onclick="deleteModule(' + "'" + moduleId + "'" + ')" title="删除">×</button>' +
          '</div>' +
        '</div>' +
        '<div class="module-content">' +
          '<p class="module-text" contenteditable="true">点击此处编辑内容...</p>' +
        '</div>' +
      '</div>';

      container.insertAdjacentHTML('beforeend', moduleHTML);

      // 移除菜单
      closeAddModuleMenu();

      // 重新初始化拖拽
      initDragAndDrop();
      updateModuleIndices();
    }



    // 触摸事件优化
    function isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // 初始化
    document.addEventListener('DOMContentLoaded', function() {
      initDragAndDrop();
      
      // 移动端优化触摸体验
      if (isMobile()) {
        // 防止双击缩放
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
          const now = Date.now();
          if (now - lastTouchEnd <= 300) {
            event.preventDefault();
          }
          lastTouchEnd = now;
        }, false);
        
        // 改进按钮点击反馈
        document.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
          });
          btn.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
          });
          btn.addEventListener('touchcancel', function() {
            this.style.transform = 'scale(1)';
          });
        });
      }
    });
  \u003C/script\u003E
<\/body>
<\/html>`

      return html
    },
    generateFullHTMLContent() {
      const data = this.resumeData
      const name = data.profile.name || '求职者'
      
      // 生成完整的独立HTML文件，包含样式和PDF/打印功能
      let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - 个人简历</title>

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'SimSun', 'Microsoft YaHei', serif;
      background: #f5f5f5;
      padding: 20px;
      line-height: 1.6;
    }
    
    .resume-container {
      width: 794px;
      max-width: 794px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      position: relative;
      box-sizing: border-box;
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
    
    .contact-icon {
      width: 16px;
      height: 16px;
      color: #2f5785;
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
      white-space: nowrap;
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
      flex-wrap: wrap;
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
      body {
        background: white;
        padding: 0;
        margin: 0;
      }

      .resume-container {
        box-shadow: none;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 15mm 20mm !important;
      }

      .resume-actions {
        display: none;
      }

      @page {
        margin: 0;
        size: A4 portrait;
      }
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        padding: 20px;
      }
      
      .contact-details {
        grid-template-columns: 1fr;
      }
      
      .resume-body {
        padding: 15px 20px;
      }
      
      .edu-details,
      .work-description,
      .project-description {
        padding-left: 0;
      }
      
      .edu-header,
      .work-header,
      .project-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
      }
    }
  </style>
</head>
<body>
  <div class="resume-container" id="resume">
    <div class="resume-header">
      <div class="header-top-bar"></div>
      <div class="header-content">
        <div class="personal-info">
          <h1 class="name">${data.profile.name || '姓名'}</h1>
          <p class="position">${data.profile.positionTitle || '应聘岗位'}</p>
          
          <div class="contact-details">
            ${data.profile.mobile ? `
            <div class="contact-item">
              <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>${data.profile.mobile}</span>
            </div>` : ''}
            ${data.profile.email ? `
            <div class="contact-item">
              <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>${data.profile.email}</span>
            </div>` : ''}
            ${data.profile.workPlace ? `
            <div class="contact-item">
              <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>${data.profile.workPlace}</span>
            </div>` : ''}
            ${data.profile.github ? `
            <div class="contact-item">
              <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
              <span>${data.profile.github}</span>
            </div>` : ''}
          </div>
        </div>
        
        <div class="photo-placeholder">
          <div class="photo-box">
            <span class="photo-text">照片</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="resume-body">`
      
      // 教育背景
      const hasEducation = data.educationList && data.educationList.length > 0 && data.educationList.some(edu => edu.school && edu.school.trim() !== '')
      if (hasEducation) {
        html += `
      <div class="section">
        <div class="section-header">
          <div class="section-icon">&#127891;</div>
          <h2 class="section-title">教育背景 (Education)</h2>
          <div class="section-line"></div>
        </div>
        
        <div class="education-list">`
        data.educationList.forEach(edu => {
          if (edu.school) {
            // 处理教育时间格式（支持数组和字符串）
            let timeStr = ''
            if (edu.edu_time) {
              if (Array.isArray(edu.edu_time)) {
                timeStr = `${edu.edu_time[0] || ''} - ${edu.edu_time[1] || '至今'}`
              } else if (typeof edu.edu_time === 'string') {
                timeStr = edu.edu_time
              }
            }
            
            html += `
          <div class="education-item">
            <div class="edu-header">
              <span class="edu-dates">${timeStr}</span>
              <span class="edu-school">${edu.school}</span>
              <span class="edu-major">${edu.major || ''}</span>
            </div>
            <div class="edu-details">
              ${edu.college ? `<span>${edu.college}</span>` : ''}
              ${edu.academic_degree ? `<span>${edu.college ? ' · ' : ''}${edu.academic_degree}</span>` : ''}
            </div>
          </div>`
          }
        })
        html += `
        </div>
      </div>`
      }
      
      // 工作经历
      const hasWork = data.workExpList && data.workExpList.length > 0 && data.workExpList.some(work => work.company_name && work.company_name.trim() !== '')
      if (hasWork) {
        html += `
      <div class="section">
        <div class="section-header">
          <div class="section-icon">&#128188;</div>
          <h2 class="section-title">实习经历 (Internship)</h2>
          <div class="section-line"></div>
        </div>
        
        <div class="work-list">`
        data.workExpList.forEach(work => {
          if (work.company_name) {
            // 处理工作时间格式（支持数组和字符串）
            let timeStr = ''
            if (work.work_time) {
              if (Array.isArray(work.work_time)) {
                timeStr = `${work.work_time[0] || ''} - ${work.work_time[1] || '至今'}`
              } else if (typeof work.work_time === 'string') {
                timeStr = work.work_time
              }
            }
            
            // 处理工作描述
            let descHtml = ''
            if (work.work_desc) {
              const descLines = typeof work.work_desc === 'string'
                ? work.work_desc.split('\n').filter(line => line.trim())
                : [work.work_desc]
              if (descLines.length > 0) {
                descHtml = `
            <div class="work-description">
              <ul>
                ${descLines.map(line => `<li>${line.trim().replace(/^[\s\-\•]*/, '')}</li>`).join('\n                ')}
              </ul>
            </div>`
              }
            }
            
            html += `
          <div class="work-item">
            <div class="work-header">
              <span class="work-dates">${timeStr}</span>
              <span class="work-company">${work.company_name}</span>
              <span class="work-position">${work.department_name || ''}</span>
            </div>${descHtml}
          </div>`
          }
        })
        html += `
        </div>
      </div>`
      }
      
      // 项目经历
      const hasProjects = data.projectList && data.projectList.length > 0 && data.projectList.some(project => project.project_name && project.project_name.trim() !== '')
      if (hasProjects) {
        html += `
      <div class="section">
        <div class="section-header">
          <div class="section-icon">&#127979;</div>
          <h2 class="section-title">项目经历 (Projects)</h2>
          <div class="section-line"></div>
        </div>
        
        <div class="project-list">`
        data.projectList.forEach(project => {
          if (project.project_name) {
            // 处理项目时间格式（支持数组和字符串）
            let timeStr = ''
            if (project.project_time) {
              if (Array.isArray(project.project_time)) {
                timeStr = `${project.project_time[0] || ''} - ${project.project_time[1] || '至今'}`
              } else if (typeof project.project_time === 'string') {
                timeStr = project.project_time
              }
            }
            
            // 处理项目描述（支持字符串和数组）
            let descHtml = ''
            if (project.project_desc) {
              const descLines = typeof project.project_desc === 'string' 
                ? project.project_desc.split('\n').filter(line => line.trim())
                : [project.project_desc]
              if (descLines.length > 0) {
                descHtml = `
            <div class="project-description">
              <ul>
                ${descLines.map(line => `<li>${line.trim().replace(/^[\s\-\•]*/, '')}</li>`).join('\n                ')}
              </ul>
            </div>`
              }
            }
            
            html += `
          <div class="project-item">
            <div class="project-header">
              <span class="project-dates">${timeStr}</span>
              <span class="project-company">${project.project_name}</span>
              <span class="project-position">${project.project_skills || ''}</span>
            </div>${descHtml}
          </div>`
          }
        })
        html += `
        </div>
      </div>`
      }
      
      // 专业技能
      const hasSkills = data.skillList && data.skillList.some(skill => skill.skill_name)
      if (hasSkills) {
        html += `
      <div class="section">
        <div class="section-header">
          <div class="section-icon">&#128295;</div>
          <h2 class="section-title">技能证书 (Skills)</h2>
          <div class="section-line"></div>
        </div>
        
        <div class="skills-list">`
        data.skillList.forEach(skill => {
          if (skill.skill_name) {
            html += `
          <div class="skill-item">
            <span class="skill-name">${skill.skill_name}</span>
            ${skill.skill_desc ? `<span> · ${skill.skill_desc}</span>` : ''}
          </div>`
          }
        })
        html += `
        </div>
      </div>`
      }
      
      // 自我评价
      if (data.aboutme && data.aboutme.aboutme_desc) {
        html += `
      <div class="section">
        <div class="section-header">
          <div class="section-icon">&#128221;</div>
          <h2 class="section-title">自我评价 (Self-assessment)</h2>
          <div class="section-line"></div>
        </div>
        
        <div class="about-me">
          <p>${data.aboutme.aboutme_desc}</p>
        </div>
      </div>`
      }
      
      html += `
    </div>
    
    <div class="resume-actions">
      <button class="action-btn print-btn" onclick="window.print()">
        &#128424; 打印简历
      </button>
      <button class="action-btn pdf-btn" onclick="downloadPDF()">
        &#128196; 导出PDF
      </button>
    </div>
  </div>

  \u003Cscript\u003E
    function downloadPDF() {
      // 临时隐藏按钮
      const actionsDiv = document.getElementById('resume-actions');
      if (actionsDiv) {
        actionsDiv.style.display = 'none';
      }
      
      // 使用resume-container作为导出元素，只导出简历内容
      const element = document.querySelector('.resume-container');
      // 设置元素宽度为A4纸像素宽度(96dpi下210mm=794px)
      element.style.width = '794px';
      element.style.maxWidth = '794px';
      element.style.margin = '0';
      element.style.padding = '40px 56px';
      const opt = {
        margin: 0,
        filename: '${name}_简历.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#ffffff',
          scrollY: 0,
          scrollX: 0,
          width: 794,
          windowWidth: 794
        },
        jsPDF: {
          unit: 'px',
          format: [794, 1123],
          orientation: 'portrait',
          hotfixes: ['px_scaling']
        }
      };
      
      html2pdf().set(opt).from(element).save().then(() => {
        // 恢复按钮显示
        if (actionsDiv) {
          actionsDiv.style.display = 'flex';
        }
      }).catch((error) => {
        console.error('PDF导出失败:', error);
        // 发生错误时也要恢复按钮显示
        if (actionsDiv) {
          actionsDiv.style.display = 'flex';
        }
      });
    }
  \u003C/script\u003E
<\/body>
<\/html>`
      
      return html
    },
    downloadResumeWord() {
      // 显示加载状态
      this.loading = true
      this.loadingMessage = '正在准备Word文档...'
      
      // 先确保有resumeData
      if (!this.resumeData || !this.resumeData.profile.name) {
        this.prepareResumeDataForBuilder()
      }
      
      // 直接生成Word文档，不跳转到简历生成器页面
      this.generateWordDirectly()
    },
    generateWordDirectly() {
      if (this.resumeData) {
        // 动态导入docx库
        import('docx').then(({ Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType }) => {
          // 创建Word文档
          const doc = this.createWordDocumentDirectly(Document, Paragraph, TextRun, HeadingLevel, AlignmentType);

          // 生成Word文档并下载
          Packer.toBlob(doc).then((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${this.resumeData.profile.name || '简历'}_简历.docx`;
            link.click();
            URL.revokeObjectURL(url);
            this.loading = false;
          }).catch(error => {
            console.error('生成Word文档失败:', error);
            this.loading = false;
          });
        }).catch(error => {
          console.error('导入docx库失败:', error);
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    },
    createWordDocumentDirectly(Document, Paragraph, TextRun, HeadingLevel, AlignmentType) {
      const children = [];
      const data = this.resumeData;
      
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
              text: '个人简历',
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
              text: `姓名: `,
              bold: true,
              size: 20,
              font: 'Arial',
            }),
            new TextRun({
              text: data.profile.name || '求职者',
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
              text: `应聘岗位: `,
              bold: true,
              size: 20,
              font: 'Arial',
            }),
            new TextRun({
              text: data.profile.positionTitle || '求职岗位',
              size: 20,
              font: 'Arial',
            }),
          ],
        })
      );
      
      if (data.profile.mobile) {
        children.push(
          new Paragraph({
            spacing: {
              after: 100,
            },
            children: [
              new TextRun({
                text: `电话: `,
                bold: true,
                size: 20,
                font: 'Arial',
              }),
              new TextRun({
                text: data.profile.mobile,
                size: 20,
                font: 'Arial',
              }),
            ],
          })
        );
      }
      
      if (data.profile.email) {
        children.push(
          new Paragraph({
            spacing: {
              after: 100,
            },
            children: [
              new TextRun({
                text: `邮箱: `,
                bold: true,
                size: 20,
                font: 'Arial',
              }),
              new TextRun({
                text: data.profile.email,
                size: 20,
                font: 'Arial',
              }),
            ],
          })
        );
      }
      
      if (data.profile.workPlace) {
        children.push(
          new Paragraph({
            spacing: {
              after: 100,
            },
            children: [
              new TextRun({
                text: `工作地点: `,
                bold: true,
                size: 20,
                font: 'Arial',
              }),
              new TextRun({
                text: data.profile.workPlace,
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
              text: '教育背景',
              bold: true,
              size: 24,
              font: 'Arial',
            }),
          ],
        })
      );
      
      if (data.educationList && data.educationList.length > 0) {
        data.educationList.forEach(edu => {
          if (edu.school) {
            children.push(
              new Paragraph({
                spacing: {
                  before: 100,
                  after: 100,
                },
                children: [
                  new TextRun({
                    text: `${edu.edu_time[0]} - ${edu.edu_time[1] || '至今'} `,
                    bold: true,
                    size: 18,
                    font: 'Arial',
                  }),
                  new TextRun({
                    text: edu.school,
                    size: 18,
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
                    text: `${edu.major || ''} ${edu.academic_degree ? `(${edu.academic_degree})` : ''}`,
                    size: 16,
                    font: 'Arial',
                  }),
                ],
              })
            );
          }
        });
      }
      
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
              text: '工作经历',
              bold: true,
              size: 24,
              font: 'Arial',
            }),
          ],
        })
      );
      
      if (data.workExpList && data.workExpList.length > 0) {
        data.workExpList.forEach(work => {
          if (work.company_name) {
            const startTime = (work.work_time && Array.isArray(work.work_time) && work.work_time[0]) ? work.work_time[0] : ''
            const endTime = (work.work_time && Array.isArray(work.work_time) && work.work_time[1]) ? work.work_time[1] : '至今'
            children.push(
              new Paragraph({
                spacing: {
                  before: 100,
                  after: 100,
                },
                children: [
                  new TextRun({
                    text: `${startTime} - ${endTime} `,
                    bold: true,
                    size: 18,
                    font: 'Arial',
                  }),
                  new TextRun({
                    text: work.company_name,
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
                    after: 100,
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
      }
      
      // 项目经历
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 200,
            after: 150,
          },
          children: [
            new TextRun({
              text: '项目经历',
              bold: true,
              size: 24,
              font: 'Arial',
            }),
          ],
        })
      );
      
      if (data.projectList && data.projectList.length > 0) {
        data.projectList.forEach(project => {
          if (project.project_name) {
            children.push(
              new Paragraph({
                spacing: {
                  before: 100,
                  after: 100,
                },
                children: [
                  new TextRun({
                    text: project.project_name,
                    bold: true,
                    size: 18,
                    font: 'Arial',
                  }),
                ],
              })
            );
            
            if (project.project_time) {
              children.push(
                new Paragraph({
                  spacing: {
                    after: 100,
                  },
                  children: [
                    new TextRun({
                      text: project.project_time,
                      size: 16,
                      font: 'Arial',
                    }),
                  ],
                })
              );
            }
            
            if (project.project_role) {
              children.push(
                new Paragraph({
                  spacing: {
                    after: 100,
                  },
                  children: [
                    new TextRun({
                      text: `角色: ${project.project_role}`,
                      size: 16,
                      font: 'Arial',
                    }),
                  ],
                })
              );
            }
            
            if (project.project_desc) {
              children.push(
                new Paragraph({
                  spacing: {
                    after: 100,
                  },
                  children: [
                    new TextRun({
                      text: project.project_desc,
                      size: 16,
                      font: 'Arial',
                    }),
                  ],
                })
              );
            }
            
            if (project.project_content) {
              children.push(
                new Paragraph({
                  spacing: {
                    after: 100,
                  },
                  children: [
                    new TextRun({
                      text: project.project_content,
                      size: 16,
                      font: 'Arial',
                    }),
                  ],
                })
              );
            }
          }
        });
      }
      
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
              text: '专业技能',
              bold: true,
              size: 24,
              font: 'Arial',
            }),
          ],
        })
      );
      
      if (data.skillList && data.skillList.length > 0) {
        data.skillList.forEach(skill => {
          if (skill.skill_name) {
            children.push(
              new Paragraph({
                spacing: {
                  before: 100,
                  after: 100,
                },
                children: [
                  new TextRun({
                    text: skill.skill_name,
                    bold: true,
                    size: 18,
                    font: 'Arial',
                  }),
                  new TextRun({
                    text: skill.skill_desc ? ` - ${skill.skill_desc}` : '',
                    size: 18,
                    font: 'Arial',
                  }),
                ],
              })
            );
          }
        });
      }
      
      // 自我介绍
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 200,
            after: 150,
          },
          children: [
            new TextRun({
              text: '自我介绍',
              bold: true,
              size: 24,
              font: 'Arial',
            }),
          ],
        })
      );
      
      if (data.aboutme && data.aboutme.aboutme_desc) {
        children.push(
          new Paragraph({
            spacing: {
              before: 100,
              after: 100,
            },
            children: [
              new TextRun({
                text: data.aboutme.aboutme_desc,
                size: 16,
                font: 'Arial',
              }),
            ],
          })
        );
      }
      
      // 创建文档
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: children,
          },
        ],
      });
      
      return doc;
    },
    downloadResumePDF() {
      // 显示加载状态
      this.loading = true
      this.loadingMessage = '正在准备PDF文档...'
      
      // 先确保有resumeData
      if (!this.resumeData || !this.resumeData.profile.name) {
        this.prepareResumeDataForBuilder()
      }
      
      // 直接生成PDF，不跳转到简历生成器页面
      this.generatePDFDirectly()
    },
    generatePDFDirectly() {
      if (this.resumeData) {
        // 导入html2pdf库
        import('html2pdf.js').then(html2pdf => {
          // 创建一个临时容器，用于生成PDF
          const tempContainer = document.createElement('div');
          tempContainer.style.width = '210mm';
          tempContainer.style.padding = '40px';
          tempContainer.style.margin = '0 auto';
          tempContainer.style.backgroundColor = '#fff';
          tempContainer.style.fontFamily = 'Arial, sans-serif';
          tempContainer.style.boxShadow = '0px 2px 4px 1px rgba(0, 0, 0, 0.15)';
          
          // 生成简历HTML内容
          const resumeHTML = this.generateFullHTMLContent()
          tempContainer.innerHTML = resumeHTML;
          document.body.appendChild(tempContainer);
          
          // 配置PDF选项
          const opt = {
            margin: 0,
            filename: `${this.resumeData.profile.name || '简历'}_简历.pdf`,
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
          html2pdf.default().set(opt).from(tempContainer).save().then(() => {
            // 下载完成后移除临时容器
            document.body.removeChild(tempContainer);
            this.loading = false;
          }).catch(error => {
            console.error('生成PDF失败:', error);
            this.loading = false;
          });
        }).catch(error => {
          console.error('导入html2pdf库失败:', error);
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    },
    generateResumeHTML() {
      const data = this.resumeData;
      
      let html = `
        <div class="resume-pdf">
          <div class="header">
            <h1>${data.profile.name || '求职者'}</h1>
            <h2>${data.profile.positionTitle || '求职岗位'}</h2>
            <div class="contact-info">
              ${data.profile.mobile ? `<div class="contact-item"><img src="@/assets/icons/phone.svg" alt="电话" class="contact-icon"> ${data.profile.mobile}</div>` : ''}
              ${data.profile.email ? `<div class="contact-item"><img src="@/assets/icons/mail.svg" alt="邮箱" class="contact-icon"> ${data.profile.email}</div>` : ''}
              ${data.profile.workPlace ? `<div class="contact-item"><img src="@/assets/icons/location.svg" alt="地址" class="contact-icon"> ${data.profile.workPlace}</div>` : ''}
            </div>
          </div>
          
          <div class="content">
      `;
      
      // 教育背景
      if (data.educationList && data.educationList.length > 0) {
        html += `
          <section class="section">
            <h3>教育背景</h3>
            <div class="section-content">
        `;
        data.educationList.forEach(edu => {
          if (edu.school) {
            const startTime = (edu.edu_time && Array.isArray(edu.edu_time) && edu.edu_time[0]) ? edu.edu_time[0] : ''
            const endTime = (edu.edu_time && Array.isArray(edu.edu_time) && edu.edu_time[1]) ? edu.edu_time[1] : '至今'
            html += `
              <div class="education-item">
                <div class="item-header">
                  <strong>${edu.school}</strong>
                  <span class="time">${startTime} - ${endTime}</span>
                </div>
                <div class="item-detail">
                  ${edu.major || ''} ${edu.academic_degree ? `(${edu.academic_degree})` : ''}
                </div>
              </div>
            `;
          }
        });
        html += `
            </div>
          </section>
        `;
      }
      
      // 工作经历
      if (data.workExpList && data.workExpList.length > 0) {
        html += `
          <section class="section">
            <h3>工作经历</h3>
            <div class="section-content">
        `;
        data.workExpList.forEach(work => {
          if (work.company_name) {
            const startTime = (work.work_time && Array.isArray(work.work_time) && work.work_time[0]) ? work.work_time[0] : ''
            const endTime = (work.work_time && Array.isArray(work.work_time) && work.work_time[1]) ? work.work_time[1] : '至今'
            html += `
              <div class="work-item">
                <div class="item-header">
                  <strong>${work.company_name}</strong>
                  <span class="time">${startTime} - ${endTime}</span>
                </div>
                ${work.department_name ? `<div class="department">${work.department_name}</div>` : ''}
                ${work.work_desc ? `<div class="work-desc">${work.work_desc}</div>` : ''}
              </div>
            `;
          }
        });
        html += `
            </div>
          </section>
        `;
      }
      
      // 项目经历
      if (data.projectList && data.projectList.length > 0) {
        html += `
          <section class="section">
            <h3>项目经历</h3>
            <div class="section-content">
        `;
        data.projectList.forEach(project => {
          if (project.project_name) {
            html += `
              <div class="project-item">
                <div class="item-header">
                  <strong>${project.project_name}</strong>
                  ${project.project_time ? `<span class="time">${project.project_time}</span>` : ''}
                </div>
                ${project.project_role ? `<div class="role">${project.project_role}</div>` : ''}
                ${project.project_desc ? `<div class="project-desc">${project.project_desc}</div>` : ''}
                ${project.project_content ? `<div class="project-content">${project.project_content}</div>` : ''}
              </div>
            `;
          }
        });
        html += `
            </div>
          </section>
        `;
      }
      
      // 专业技能
      if (data.skillList && data.skillList.length > 0) {
        html += `
          <section class="section">
            <h3>专业技能</h3>
            <div class="section-content">
        `;
        data.skillList.forEach(skill => {
          if (skill.skill_name) {
            html += `
              <div class="skill-item">
                <div class="skill-name">${skill.skill_name}</div>
                ${skill.skill_desc ? `<div class="skill-desc">${skill.skill_desc}</div>` : ''}
              </div>
            `;
          }
        });
        html += `
            </div>
          </section>
        `;
      }
      
      // 自我介绍
      if (data.aboutme && data.aboutme.aboutme_desc) {
        html += `
          <section class="section">
            <h3>自我介绍</h3>
            <div class="section-content">
              <div class="aboutme-content">${data.aboutme.aboutme_desc}</div>
            </div>
          </section>
        `;
      }
      
      html += `
          </div>
        </div>
        <style>
          .resume-pdf {
            width: 100%;
            min-height: 942px;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e0e0e0;
          }
          .header h1 {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .header h2 {
            font-size: 18px;
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
          .content {
            display: flex;
            flex-direction: column;
            gap: 30px;
          }
          .section {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .section h3 {
            font-size: 20px;
            font-weight: bold;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 8px;
            color: #2f5785;
          }
          .section-content {
            display: flex;
            flex-direction: column;
            gap: 16px;
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
          .department {
            font-size: 14px;
            color: #666;
          }
          .work-desc,
          .project-desc,
          .project-content {
            font-size: 14px;
            line-height: 1.6;
            color: #333;
          }
          .role {
            font-size: 14px;
            color: #666;
          }
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
          .aboutme-content {
            font-size: 14px;
            line-height: 1.6;
            color: #333;
            text-align: justify;
          }
        </style>
      `;
      
      return html;
    },
    downloadFile(content, fileName, mimeType) {
      const element = document.createElement('a')
      element.setAttribute('href', `data:${mimeType};charset=utf-8,` + encodeURIComponent(content))
      element.setAttribute('download', fileName)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    },
    handleFileUpload(file) {
      // 显示加载状态
      this.loading = true
      this.loadingMessage = '正在读取文件...'
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        const fileName = file.name
        
        // 添加用户消息，显示已上传文件
        this.messages.push({
          text: `已上传文件: ${fileName}`,
          isUser: true,
          type: 'text'
        })
        
        // 检查是否是md文件，提供转换选项
        if (fileName.endsWith('.md')) {
          this.messages.push({
            text: `检测到Markdown文件！\n\n文件内容预览:\n${content.substring(0, 500)}${content.length > 500 ? '...' : ''}\n\n您可以：\n1. 点击下方"转换为Word"按钮将此文件转为Word文档\n2. 或者继续与我对话`,
            isUser: false,
            type: 'text'
          })
          
          // 保存上传的文件内容，用于后续转换
          this.uploadedFileContent = content
          this.uploadedFileName = fileName.replace('.md', '')
        } else {
          this.messages.push({
            text: `已读取文件内容:\n${content}`,
            isUser: false,
            type: 'text'
          })
        }
        
        // 关闭加载状态
        this.loading = false
      }
      reader.readAsText(file)
    },
    convertMarkdownToWord(markdownContent, fileName) {
      // 显示加载状态
      this.loading = true
      this.loadingMessage = '正在转换为Word文档...'
      
      // 导入docx库
      import('docx').then(({ Document, Packer, Paragraph, TextRun, HeadingLevel }) => {
        const children = []
        const lines = markdownContent.split('\n')
        
        lines.forEach(line => {
          if (line.trim() === '') {
            // 空行
            children.push(new Paragraph(''))
          } else if (line.startsWith('# ')) {
            // 一级标题
            children.push(
              new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun(line.substring(2))]
              })
            )
          } else if (line.startsWith('## ')) {
            // 二级标题
            children.push(
              new Paragraph({
                heading: HeadingLevel.HEADING_2,
                children: [new TextRun(line.substring(3))]
              })
            )
          } else if (line.startsWith('### ')) {
            // 三级标题
            children.push(
              new Paragraph({
                heading: HeadingLevel.HEADING_3,
                children: [new TextRun(line.substring(4))]
              })
            )
          } else if (line.startsWith('#### ')) {
            // 四级标题
            children.push(
              new Paragraph({
                heading: HeadingLevel.HEADING_4,
                children: [new TextRun(line.substring(5))]
              })
            )
          } else if (line.startsWith('- ') || line.startsWith('* ')) {
            // 列表项
            children.push(new Paragraph('  • ' + line.substring(2)))
          } else if (line.match(/^\d+\.\s/)) {
            // 有序列表
            children.push(new Paragraph(line))
          } else if (line.startsWith('> ')) {
            // 引用
            children.push(new Paragraph('  ' + line.substring(2)))
          } else {
            // 普通段落 - 简化处理，直接添加
            children.push(new Paragraph(line))
          }
        })
        
        const doc = new Document({
          sections: [{
            properties: {},
            children: children
          }]
        })
        
        Packer.toBlob(doc).then(blob => {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${fileName || 'document'}.docx`
          link.click()
          URL.revokeObjectURL(url)
          // 关闭加载状态
          this.loading = false
        })
      })
    },
    handleConvertToWord() {
      if (this.uploadedFileContent) {
        this.convertMarkdownToWord(this.uploadedFileContent, this.uploadedFileName || 'converted')
        this.messages.push({
          text: '已成功将Markdown文件转换为Word文档并开始下载！',
          isUser: false,
          type: 'text'
        })
      }
    },
    toggleSidebar() {
      this.showSidebar = !this.showSidebar
    },
    newChat() {
      if (confirm('您确定要开始新的对话吗？这将清除当前聊天记录。')) {
        this.messages = []
        // 使用preserveChatState=true保持聊天界面打开
        this.initWelcomeMessage(true)
        this.showChatInterface = true
      }
    },
    getImportTitle(type) {
      const titles = {
        profile: '个人资料导入',
        education: '教育经历导入',
        work: '工作经验导入',
        skills: '专业技能导入',
        projects: '项目经历导入',
        websites: '网站导入',
        accounts: '账号导入',
        bookmarks: '收藏夹导入'
      }
      return titles[type] || '导入资料'
    },
    getModuleTitle(module) {
      const titles = {
        resume: '简历生成器',
        notes: '笔记区域',
        settings: '设置'
      }
      return titles[module] || module
    },
    closeImportModal() {
      this.showImportModal = false
      this.resetImportForms()
    },
    resetImportForms() {
      this.newWebsite = {
        name: '',
        url: '',
        description: ''
      }
      this.newAccount = {
        platform: '',
        username: '',
        url: ''
      }
      this.newBookmark = {
        title: '',
        url: '',
        category: '技术'
      }
      this.importData.educationList = [
        {
          edu_time: ['', ''],
          school: '',
          major: '',
          academic_degree: ''
        }
      ]
      this.importData.workExpList = [
        {
          company_name: '',
          department_name: '',
          work_time: ['', ''],
          work_desc: ''
        }
      ]
      this.importData.skillList = [
        {
          skill_name: '',
          skill_level: 80,
          skill_desc: ''
        }
      ]
      this.importData.projectList = [
        {
          project_name: '',
          project_time: ['', ''],
          project_desc: '',
          project_skills: ''
        }
      ]
    },
    saveImportData() {
      // 确保教育经历的学校字段为广东白云学院
      if (this.importData.educationList) {
        this.importData.educationList = this.importData.educationList.map(edu => ({
          ...edu,
          school: '广东白云学院'
        }))
      }
      // 保存导入数据到本地存储
      localStorage.setItem('importData', JSON.stringify(this.importData))
      
      // 只有在聊天界面打开时才显示保存成功的消息
      if (this.showChatInterface) {
        this.messages.push({
          text: `已成功导入${this.getImportTitle(this.currentImportType)}信息`,
          isUser: false,
          type: 'text'
        })
      }
      
      // 关闭模态框
      this.closeImportModal()
    },
    addEducation() {
      this.importData.educationList.push({
        edu_time: ['', ''],
        school: '广东白云学院',
        college: '',
        major: '',
        academic_degree: ''
      })
    },
    getColleges(school) {
      const colleges = {
        '广东白云学院（西校区）': [
          '电气与信息工程学院',
          '机械工程学院',
          '建筑工程学院',
          '计算机科学与工程学院'
        ],
        '广东白云学院（北校区）': [
          '经济管理学院',
          '外国语学院',
          '艺术设计学院',
          '教育学院'
        ],
        '广东白云学院（东校区）': [
          '马克思主义学院',
          '体育学院',
          '国际学院',
          '继续教育学院'
        ]
      }
      return colleges[school] || []
    },
    getMajors(school, college) {
      const majors = {
        '广东白云学院（西校区）': {
          '电气与信息工程学院': [
            '电气工程及其自动化',
            '自动化',
            '电子信息工程',
            '通信工程',
            '物联网工程'
          ],
          '机械工程学院': [
            '机械设计制造及其自动化',
            '机械电子工程',
            '工业设计',
            '车辆工程',
            '智能制造工程'
          ],
          '建筑工程学院': [
            '土木工程',
            '工程造价',
            '建筑学',
            '城乡规划',
            '风景园林'
          ],
          '计算机科学与工程学院': [
            '计算机科学与技术',
            '软件工程',
            '数据科学与大数据技术',
            '人工智能',
            '网络工程'
          ]
        },
        '广东白云学院（北校区）': {
          '经济管理学院': [
            '金融学',
            '国际经济与贸易',
            '工商管理',
            '市场营销',
            '会计学',
            '财务管理',
            '人力资源管理'
          ],
          '外国语学院': [
            '英语',
            '日语',
            '商务英语',
            '翻译'
          ],
          '艺术设计学院': [
            '视觉传达设计',
            '环境设计',
            '产品设计',
            '服装与服饰设计',
            '数字媒体艺术'
          ],
          '教育学院': [
            '学前教育',
            '小学教育',
            '应用心理学',
            '教育技术学'
          ]
        },
        '广东白云学院（东校区）': {
          '马克思主义学院': [
            '思想政治教育'
          ],
          '体育学院': [
            '体育教育',
            '社会体育指导与管理'
          ],
          '国际学院': [
            '国际经济与贸易（国际班）',
            '工商管理（国际班）',
            '会计学（国际班）'
          ],
          '继续教育学院': [
            '成人高等教育专业'
          ]
        }
      }
      return majors[school] && majors[school][college] ? majors[school][college] : []
    },
    updateMajors(index) {
      this.importData.educationList[index].major = ''
    },
    removeEducation(index) {
      if (this.importData.educationList.length > 1) {
        this.importData.educationList.splice(index, 1)
      }
    },
    addWork() {
      this.importData.workExpList.push({
        company_name: '',
        department_name: '',
        work_time: ['', ''],
        work_desc: ''
      })
    },
    removeWork(index) {
      if (this.importData.workExpList.length > 1) {
        this.importData.workExpList.splice(index, 1)
      }
    },
    addSkill() {
      this.importData.skillList.push({
        skill_name: '',
        skill_level: 80,
        skill_desc: ''
      })
    },
    removeSkill(index) {
      if (this.importData.skillList.length > 1) {
        this.importData.skillList.splice(index, 1)
      }
    },
    addProject() {
      this.importData.projectList.push({
        project_name: '',
        project_time: ['', ''],
        project_desc: '',
        project_skills: ''
      })
    },
    removeProject(index) {
      if (this.importData.projectList.length > 1) {
        this.importData.projectList.splice(index, 1)
      }
    },
    addWebsite() {
      if (this.newWebsite.name && this.newWebsite.url) {
        this.importData.websites.push({
          name: this.newWebsite.name,
          url: this.newWebsite.url,
          description: this.newWebsite.description
        })
        this.newWebsite = {
          name: '',
          url: '',
          description: ''
        }
      }
    },
    removeWebsite(index) {
      this.importData.websites.splice(index, 1)
    },
    addAccount() {
      if (this.newAccount.platform && this.newAccount.username) {
        this.importData.accounts.push({
          platform: this.newAccount.platform,
          username: this.newAccount.username,
          url: this.newAccount.url
        })
        this.newAccount = {
          platform: '',
          username: '',
          url: ''
        }
      }
    },
    removeAccount(index) {
      this.importData.accounts.splice(index, 1)
    },
    addBookmark() {
      if (this.newBookmark.title && this.newBookmark.url) {
        this.importData.bookmarks.push({
          title: this.newBookmark.title,
          url: this.newBookmark.url,
          category: this.newBookmark.category
        })
        this.newBookmark = {
          title: '',
          url: '',
          category: '技术'
        }
      }
    },
    removeBookmark(index) {
      this.importData.bookmarks.splice(index, 1)
    }
  }
}
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

.container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* 工作区样式 */
.workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-left: 1px solid #e0e0e0;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.content-area-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.workspace-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.workspace-name {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.status {
  display: flex;
  align-items: center;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #4A90E2;
  margin-right: 8px;
}

.status-text {
  font-size: 14px;
  font-weight: 500;
  color: #4A90E2;
}

.user-switch {
  display: flex;
  gap: 10px;
}

.user-btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #fff;
  cursor: pointer;
  font-size: 14px;
}

.user-btn.active {
  background-color: #4A90E2;
  color: white;
  border-color: #4A90E2;
}

.user-btn.inactive {
  color: #666;
}

/* 聊天容器 */
.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

/* 聊天头部 */
.chat-header {
  background: linear-gradient(135deg, #4A90E2 0%, #50E3C2 100%);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px 10px 0 0;
  flex-shrink: 0;
  margin: -20px -20px 20px -20px;
}

.chat-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-chat-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-chat-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 控制按钮 */
.controls {
  display: flex;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
}

.controls button {
  padding: 10px 20px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.controls button:hover {
  background-color: #f0f0f0;
}

/* 笔记区域 */
.note-area {
  flex: 1;
  padding: 20px;
}

.note-area h3 {
  margin-bottom: 15px;
  color: #333;
}

.note-area p {
  margin-bottom: 15px;
  color: #666;
}

.note-area textarea {
  width: 100%;
  height: 300px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
}

/* 导入表单样式 */
.import-form {
  margin-bottom: 20px;
}

.import-form .form-group {
  margin-bottom: 15px;
}

.import-form .form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.import-form .form-group input,
.import-form .form-group textarea,
.import-form .form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

.import-form .form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-row {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.form-group.half {
  flex: 0.5;
}

.form-group.quarter {
  flex: 0.25;
}

.form-group.three-quarters {
  flex: 0.75;
}

.add-btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.add-btn:hover {
  background-color: #f0f0f0;
}

.import-list {
  margin-top: 20px;
}

.import-list h4 {
  margin-bottom: 10px;
  color: #333;
}

.import-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 8px;
  background-color: #f9f9f9;
}

.remove-btn {
  padding: 4px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background-color: #f0f0f0;
  color: #e53e3e;
}

/* 表单区域样式 */
.form-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-section h4 {
  margin-bottom: 15px;
  color: #333;
}

.education-item,
.work-item,
.project-item,
.skill-item {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #fff;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.form-actions button {
  padding: 10px 20px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-actions button:hover {
  background-color: #f0f0f0;
}

/* 模块页面样式 */
.module-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f9fa;
}

.module-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.exit-btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.exit-btn:hover {
  background-color: #f0f0f0;
  color: #e53e3e;
}

.module-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* 欢迎页面按钮样式 */
.welcome-buttons {
  margin-top: 30px;
  text-align: center;
}

.start-chat-btn {
  padding: 15px 40px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background-color: #4A90E2;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-chat-btn:hover {
  background-color: #357ABD;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
  
  .workspace-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .controls {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .controls::-webkit-scrollbar {
    display: none;
  }
  
  .controls button {
    flex: 0 0 auto;
    white-space: nowrap;
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .form-group.half,
  .form-group.quarter,
  .form-group.three-quarters {
    flex: 1;
  }
  
  .module-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .module-content {
    padding: 10px;
  }
  
  /* 手机端聊天容器样式 */
  .chat-container {
    padding: 10px;
    height: calc(100vh - 120px);
    max-height: calc(100vh - 120px);
  }
  
  .chat-header {
    padding: 12px 15px;
    margin: -10px -10px 10px -10px;
    border-radius: 8px 8px 0 0;
  }
  
  .chat-header h3 {
    font-size: 16px;
  }
  
  .close-chat-btn {
    width: 28px;
    height: 28px;
    font-size: 22px;
  }
}
</style>