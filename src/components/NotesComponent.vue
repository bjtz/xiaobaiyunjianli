<template>
  <div class="note-area">
    <h3>笔记区域</h3>
    <p>您可以在这里记录重要的信息和想法。</p>
    <textarea 
      v-model="note" 
      placeholder="输入您的笔记..."
      class="note-textarea"
    ></textarea>
    <div class="note-actions">
      <button @click="saveNote">保存笔记</button>
      <button @click="clearNote">清空</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotesComponent',
  data() {
    return {
      note: ''
    }
  },
  mounted() {
    // 从本地存储加载笔记
    const savedNote = localStorage.getItem('agent-note')
    if (savedNote) {
      this.note = savedNote
    }
  },
  methods: {
    saveNote() {
      localStorage.setItem('agent-note', this.note)
      alert('笔记已保存')
    },
    clearNote() {
      if (confirm('确定要清空笔记吗？')) {
        this.note = ''
        localStorage.removeItem('agent-note')
      }
    }
  }
}
</script>

<style scoped>
.note-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: calc(100vh - 200px);
}

.note-textarea {
  flex: 1;
  min-height: 150px;
  max-height: 400px;
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  overflow-y: auto;
}

.note-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

/* 手机端适配 */
@media (max-width: 768px) {
  .note-area {
    max-height: calc(100vh - 150px);
    padding: 10px;
  }
  
  .note-textarea {
    min-height: 120px;
    max-height: 250px;
  }
  
  .note-actions {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .note-actions::-webkit-scrollbar {
    display: none;
  }
  
  .note-actions button {
    flex: 0 0 auto;
    white-space: nowrap;
  }
}
</style>