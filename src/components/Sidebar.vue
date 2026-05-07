<template>
  <div class="sidebar">
    <!-- 项目卡片 -->
    <div class="project-card">
      <div class="simple-header">
        <div class="logo-icon">AI</div>
        <div class="progress-indicator">
          <div class="progress-dot dot-left"></div>
          <div class="progress-dot dot-center"></div>
          <div class="progress-dot dot-right"></div>
        </div>
        <div class="version-tag">V1.0</div>
      </div>
    </div>
    
    <!-- 主功能区 -->
    <div class="nav-menu">
      <div 
        v-for="item in navItems" 
        :key="item.id"
        class="nav-item"
        :class="{ active: activeNav === item.id }"
        @click="navigate(item.id)"
      >
        <svg v-if="item.id === 'chat'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="icon" viewBox="0 0 16 16">
          <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
        </svg>
        <svg v-else-if="item.id === 'notes'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="icon" viewBox="0 0 16 16">
          <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5M5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z"/>
          <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1"/>
        </svg>
        <svg v-else-if="item.id === 'resume'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="icon" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
        </svg>
        <svg v-else-if="item.id === 'settings'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="icon" viewBox="0 0 16 16">
          <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
          <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
        </svg>
        <span>{{ item.label }}</span>
      </div>
    </div>
    
    <!-- 导入资料模块 -->
    <div class="import-section">
      <div class="section-header">
        <span class="section-indicator"></span>
        <span>导入资料</span>
      </div>
      <div class="import-options">
        <div 
          v-for="option in importOptions" 
          :key="option.type"
          class="import-option"
          :data-type="option.type"
          @click="handleImport(option.type)"
        >
          <svg v-if="option.type === 'profile'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="icon" style="color: #7E57C2;" viewBox="0 0 16 16">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
          </svg>
          <svg v-else-if="option.type === 'education'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="icon" style="color: #7E57C2;" viewBox="0 0 16 16">
            <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917zM8 8.46 1.758 5.965 8 3.052l6.242 2.913z"/>
            <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46z"/>
          </svg>
          <svg v-else-if="option.type === 'work'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="icon" style="color: #7E57C2;" viewBox="0 0 16 16">
            <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5m1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0M1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5"/>
          </svg>
          <svg v-else-if="option.type === 'projects'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="icon" style="color: #7E57C2;" viewBox="0 0 16 16">
            <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139q.323-.119.684-.12h5.396z"/>
          </svg>
          <svg v-else-if="option.type === 'skills'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="icon" style="color: #7E57C2;" viewBox="0 0 16 16">
            <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1"/>
          </svg>
          <span>{{ option.label }}</span>
        </div>
      </div>
    </div>
    
    <!-- 导入按钮区域 -->
    <div class="import-actions">
      <div 
        v-for="btn in importButtons" 
        :key="btn.type"
        class="import-btn"
        :data-import="btn.type"
        @click="handleImportType(btn.type)"
      >{{ btn.label }}</div>
    </div>
    

  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      activeNav: 'chat',
      navItems: [
          { id: 'chat', label: '对话' },
          { id: 'notes', label: '笔记' },
          { id: 'resume', label: '简历' },
          { id: 'settings', label: '设置' }
        ],
        importOptions: [
          { type: 'profile', label: '个人资料' },
          { type: 'education', label: '教育经历' },
          { type: 'work', label: '工作经验' },
          { type: 'projects', label: '项目经历' },
          { type: 'skills', label: '专业技能' }
        ],
      importButtons: [
        // 暂时隐藏以下三个模块
        // { type: 'websites', label: '导入网站' },
        // { type: 'accounts', label: '导入账号' },
        // { type: 'bookmarks', label: '导入收藏夹' }
      ]
    }
  },
  methods: {
    navigate(navId) {
      this.activeNav = navId
      this.$emit('navigate', navId)
    },
    handleImport(type) {
      this.$emit('import-data', type, null)
    },
    handleImportType(type) {
      this.$emit('import-data', type, null)
    }
  }
}
</script>

<style scoped>
/* 样式已在全局styles.css中定义 */
</style>