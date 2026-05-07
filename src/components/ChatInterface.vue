<template>
  <div class="chat-interface">
    <div class="messages" ref="messagesContainer">
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        class="message"
        :class="{ 'user-message': message.isUser, 'agent-message': !message.isUser, [`${message.type}-message`]: true }"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="message-left-border"></div>
        <div class="message-right-border"></div>
        <template v-if="message.type === 'typing'">
          <div class="typing-indicator">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </template>
        <template v-else>
          <div class="message-content">
            {{ message.text }}
            <button class="copy-btn" @click="copyMessage(message.text)">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="icon" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
              </svg>
            </button>
          </div>
        </template>
      </div>
    </div>
    
    <!-- 输入区域 -->
    <div class="input-area">
      <!-- 左侧加号菜单 -->
      <div class="menu-wrapper" :class="{ open: showMenu }">
        <button class="menu-btn" @click="toggleMenu">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        
        <!-- 下拉菜单 -->
        <div class="dropdown-menu" v-if="showMenu">
          <div class="menu-item" @click="handleFileUploadClick">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 6h-8l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"/>
            </svg>
            <span>导入文件</span>
          </div>
          <div class="menu-item" @click="exportHTML">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12H7a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2zm0 8H7v-4h2v4zm5-8h-2v2h2v-2zm0 4h-2v2h2v-2zm5-8h-2v2h2v-2zm0 4h-2v2h2v-2zm0-8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm0 8h-2v-4h2v4z"/>
            </svg>
            <span>导出HTML</span>
          </div>
          <div class="menu-divider"></div>
          <div class="menu-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span>选择模板</span>
            <select class="template-select" @change="selectTemplate" @click.stop v-model="selectedTemplate">
              <option value="html">HTML简历模板</option>
              <option value="artistic-blue">艺术蓝色模板</option>
              <option value="sidebar-pink">侧边栏粉色模板</option>
              <option value="red-simple">红色简洁模板</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- 隐藏的文件输入 -->
      <input
        id="file-upload"
        type="file"
        accept=".md,.txt"
        @change="handleFileUpload"
        ref="fileInput"
        style="display: none;"
      >
      
      <!-- 输入框 -->
      <div class="input-wrapper">
        <input
          type="text"
          v-model="userInput"
          placeholder="请输入您的请求..."
          @keypress.enter="sendMessage"
          class="message-input"
          :disabled="isRecording"
        >
      </div>
      
      <!-- 右侧语音按钮 -->
      <div class="voice-input-wrapper">
        <button class="voice-btn" :class="{ active: isRecording }" @click="toggleVoiceInput">
          <svg v-if="!isRecording" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
          <div v-else class="recording-indicator">
            <span class="pulse"></span>
          </div>
        </button>
      </div>
      
      <!-- 发送按钮 -->
      <button @click="sendMessage" class="send-btn">
        <span class="send-icon">发送</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatInterface',
  props: {
    messages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      userInput: '',
      showQuickActions: false,
      showMenu: false,
      isRecording: false,
      recognition: null,
      selectedTemplate: 'html'
    }
  },
  computed: {
    hasMessages() {
      return this.messages.length > 1
    }
  },
  watch: {
    messages() {
      this.scrollToBottom()
    }
  },
  mounted() {
    this.scrollToBottom()
    this.initSpeechRecognition()
    // 点击外部关闭菜单
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    handleClickOutside(event) {
      const menuWrapper = this.$el.querySelector('.menu-wrapper')
      if (menuWrapper && !menuWrapper.contains(event.target)) {
        this.showMenu = false
      }
    },
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    handleFileUploadClick() {
      this.$refs.fileInput.click()
      this.showMenu = false
    },
    selectTemplate(event) {
      this.$emit('select-template', this.selectedTemplate)
    },
    exportHTML() {
      this.$emit('export-html', this.selectedTemplate)
      this.showMenu = false
    },
    initSpeechRecognition() {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        this.recognition = new SpeechRecognition()
        this.recognition.continuous = false
        this.recognition.interimResults = true
        this.recognition.lang = 'zh-CN'
        
        this.recognition.onstart = () => {
          this.isRecording = true
        }
        
        this.recognition.onresult = (event) => {
          let transcript = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript
          }
          this.userInput = transcript
        }
        
        this.recognition.onerror = (event) => {
          console.error('语音识别错误:', event.error)
          this.isRecording = false
          
          // 处理特定错误
          switch(event.error) {
            case 'not-allowed':
              alert('麦克风权限被拒绝。请在浏览器设置中允许麦克风访问，或使用HTTPS/localhost环境。')
              break
            case 'no-speech':
              alert('未检测到语音，请重试。')
              break
            case 'audio-capture':
              alert('无法访问麦克风设备，请检查麦克风是否连接。')
              break
            case 'network':
              alert('网络错误，请检查网络连接后重试。')
              break
            default:
              alert('语音识别出错: ' + event.error)
          }
        }
        
        this.recognition.onend = () => {
          this.isRecording = false
        }
      }
    },
    toggleVoiceInput() {
      if (!this.recognition) {
        alert('您的浏览器不支持语音识别功能，请使用Chrome浏览器')
        return
      }
      
      if (this.isRecording) {
        this.recognition.stop()
      } else {
        this.recognition.start()
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        if (file.name.endsWith('.md') || file.name.endsWith('.txt')) {
          this.$emit('upload-file', file)
          // 清空文件输入，允许重复上传同一文件
          this.$refs.fileInput.value = ''
        } else {
          alert('请上传 .md 或 .txt 文件')
        }
      }
    },
    sendMessage() {
      const message = this.userInput.trim()
      if (message) {
        this.$emit('send-message', message)
        this.userInput = ''
      }
    },

    copyMessage(text) {
      navigator.clipboard.writeText(text).then(() => {
        console.log('消息已复制到剪贴板')
      })
    },
    scrollToBottom() {
      setTimeout(() => {
        const container = this.$refs.messagesContainer
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      }, 100)
    }
  }
}
</script>

<style scoped>
.chat-interface {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  height: 100%;
}

.messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #e0e0e0 #f0f0f0;
  min-height: 200px;
  max-height: 100%;
}

.messages::-webkit-scrollbar {
  width: 6px;
}

.messages::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 3px;
}

.messages::-webkit-scrollbar-thumb {
  background: #E0E0E0;
  border-radius: 3px;
}

.messages::-webkit-scrollbar-thumb:hover {
  background: #D0D0D0;
}

.message {
  max-width: 100%;
  position: relative;
  animation: fadeIn 0.6s ease forwards;
  opacity: 0;
  transform: translateY(5px);
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 0;
}

.message::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #4A90E2 0%, transparent 20%, #4A90E2 40%, transparent 60%, #4A90E2 80%, transparent 100%);
  z-index: 1;
}

.message::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, #4A90E2 20%, transparent 40%, #4A90E2 60%, transparent 80%, #4A90E2 100%);
  z-index: 1;
}

.message {
  position: relative;
}

.message .message-left-border {
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, #4A90E2 0%, transparent 20%, #4A90E2 40%, transparent 60%, #4A90E2 80%, transparent 100%);
  z-index: 1;
}

.message .message-right-border {
  position: absolute;
  top: 0;
  right: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, transparent 0%, #4A90E2 20%, transparent 40%, #4A90E2 60%, transparent 80%, #4A90E2 100%);
  z-index: 1;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-message,
.agent-message {
  color: #333333;
  padding: 5px 0;
  font-size: 15px;
  line-height: 1.6;
  text-align: left;
  font-family: SimSun, serif;
}

.message-content {
  position: relative;
  word-wrap: break-word;
  white-space: pre-wrap;
  padding: 15px 20px;
  z-index: 2;
  line-height: 1.6;
  font-size: 15px;
  font-family: SimSun, serif;
}

.copy-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-btn .icon {
  width: 14px;
  height: 14px;
}

.message:hover .copy-btn {
  opacity: 1;
}

.typing-indicator {
  display: flex;
  gap: 5px;
  padding: 10px 0;
}

.typing-indicator div {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #50E3C2;
  animation: typing 1.4s infinite ease-in-out both;
}

.typing-indicator div:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator div:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.input-area {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border: 2px solid #e0e0e0;
  border-radius: 28px;
  background-color: #ffffff;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  margin: 0 20px 20px 20px;
}

.input-area:focus-within {
  border-color: #4A90E2;
  box-shadow: 0 6px 18px rgba(74, 144, 226, 0.25);
  transform: translateY(-2px);
}

/* 菜单相关样式 */
.menu-wrapper {
  position: relative;
  flex-shrink: 0;
}

.menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #f8f9fa;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  color: #6c757d;
}

.menu-btn:hover {
  background-color: #4A90E2;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.menu-wrapper.open .menu-btn {
  background-color: #4A90E2;
  color: white;
}

.menu-btn svg {
  width: 20px;
  height: 20px;
}

.dropdown-menu {
  position: absolute;
  bottom: 60px;
  left: 0;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 180px;
  z-index: 100;
  animation: dropdownOpen 0.3s ease-out;
}

@keyframes dropdownOpen {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #333;
  font-family: SimSun, serif;
}

.menu-item:hover {
  background-color: #f0f7ff;
  color: #4A90E2;
}

.menu-item svg {
  width: 18px;
  height: 18px;
}

.menu-divider {
  height: 1px;
  background-color: #e9ecef;
  margin: 4px 0;
}

.voice-input-wrapper {
  position: relative;
  flex-shrink: 0;
}

.voice-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #f8f9fa;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  color: #6c757d;
}

.voice-btn:hover {
  background-color: #4A90E2;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.voice-btn.active {
  background-color: #e74c3c;
  border-color: #c0392b;
  color: white;
  animation: pulse-glow 1.5s infinite;
}

.voice-btn svg {
  width: 20px;
  height: 20px;
}

.recording-indicator {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulse {
  width: 14px;
  height: 14px;
  background-color: white;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(231, 76, 60, 0);
  }
}

.input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
}

.message-input {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  padding: 10px 0;
  color: #2c3e50;
  line-height: 1.6;
  font-weight: 500;
  font-family: SimSun, serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.message-input::placeholder {
  color: #adb5bd;
  font-size: 15px;
  font-weight: 400;
}

.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  border: none;
  border-radius: 24px;
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  color: white;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
  border: 1px solid #357ABD;
  font-family: SimSun, serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.send-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(74, 144, 226, 0.4);
  background: linear-gradient(135deg, #357ABD 0%, #29629E 100%);
}

.send-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
}

/* 手机端响应式样式 */
@media (max-width: 768px) {
  .messages {
    padding: 10px;
    gap: 10px;
  }
  
  .message {
    max-width: 90%;
  }
  
  .user-message,
  .agent-message {
    padding: 10px 0;
    font-size: 14px;
  }
  
  .input-area {
    padding: 12px 16px;
    gap: 10px;
    border-radius: 24px;
    margin: 0 10px 10px 10px;
  }
  
  .menu-btn {
    width: 40px;
    height: 40px;
  }
  
  .menu-btn svg {
    width: 18px;
    height: 18px;
  }
  
  .dropdown-menu {
    bottom: 55px;
    min-width: 160px;
  }
  
  .menu-item {
    padding: 10px 14px;
    font-size: 13px;
  }
  
  .menu-item svg {
    width: 16px;
    height: 16px;
  }
  
  .voice-btn {
    width: 40px;
    height: 40px;
  }
  
  .voice-btn svg {
    width: 18px;
    height: 18px;
  }
  
  .message-input {
    font-size: 15px;
    padding: 8px 0;
  }
  
  .send-btn {
    padding: 10px 24px;
    font-size: 14px;
    border-radius: 20px;
  }
}

/* 模板选择器样式 */
.menu-item {
  flex-wrap: wrap;
}

.menu-item .template-select {
  margin-left: 8px;
  padding: 6px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: white;
  font-size: 13px;
  cursor: pointer;
  min-width: 120px;
}

.template-select:focus {
  outline: none;
  border-color: #4A90E2;
}

.menu-divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 4px 0;
}
</style>