<template>
  <div class="settings-container">
    <h3>设置</h3>
    <div class="setting-item">
      <label>智能体名称:</label>
      <input type="text" v-model="agentName" />
    </div>
    <div class="setting-item">
      <label>响应速度:</label>
      <select v-model="responseSpeed">
        <option value="fast">快速</option>
        <option value="normal">正常</option>
        <option value="slow">慢速</option>
      </select>
    </div>
    <div class="setting-item">
      <label>智能体风格:</label>
      <select v-model="agentStyle">
        <option value="default">默认风格</option>
        <option value="professional">专业风格</option>
        <option value="friendly">友好风格</option>
      </select>
    </div>
    <div class="modal-buttons">
      <button @click="saveSettings" class="save-btn">保存</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsComponent',
  data() {
    return {
      agentName: '智能助手',
      responseSpeed: 'normal',
      agentStyle: 'default'
    }
  },
  methods: {
    saveSettings() {
      // 保存设置
      localStorage.setItem('agent-settings', JSON.stringify({
        agentName: this.agentName,
        responseSpeed: this.responseSpeed,
        agentStyle: this.agentStyle
      }))
      alert('设置已保存')
    }
  },
  mounted() {
    // 加载保存的设置
    const savedSettings = localStorage.getItem('agent-settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      this.agentName = settings.agentName || '智能助手'
      this.responseSpeed = settings.responseSpeed || 'normal'
      this.agentStyle = settings.agentStyle || 'default'
    }
  }
}
</script>

<style scoped>
.settings-container {
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
}

.settings-container h3 {
  margin-bottom: 25px;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.setting-item {
  margin-bottom: 20px;
}

.setting-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.setting-item input[type="text"],
.setting-item select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #E0E0E0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: #fff;
}

.setting-item input[type="text"]:focus,
.setting-item select:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.modal-buttons {
  display: flex;
  gap: 12px;
  margin-top: 30px;
  justify-content: flex-end;
}

.modal-buttons button {
  padding: 12px 28px;
  border: 2px solid #E0E0E0;
  border-radius: 10px;
  background-color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.save-btn {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%) !important;
  color: white !important;
  border-color: #4A90E2 !important;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
}

.cancel-btn:hover {
  background-color: #f5f5f5;
  border-color: #d0d0d0;
}

/* 手机端响应式 */
@media (max-width: 768px) {
  .settings-container {
    padding: 15px;
  }
  
  .settings-container h3 {
    font-size: 18px;
    margin-bottom: 20px;
  }
  
  .setting-item {
    margin-bottom: 15px;
  }
  
  .setting-item input[type="text"],
  .setting-item select {
    padding: 10px 14px;
    font-size: 13px;
  }
  
  .modal-buttons {
    flex-direction: column;
  }
  
  .modal-buttons button {
    width: 100%;
  }
}
</style>