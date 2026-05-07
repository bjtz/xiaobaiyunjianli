// 本地存储操作类
class LocalStorageManager {
  constructor() {
    this.KEYS = {
      IMPORT_DATA: 'importData',
      USER_SETTINGS: 'userSettings',
      NOTES: 'notes'
    };
  }

  /**
   * 保存数据到本地存储
   * @param {string} key - 存储键名
   * @param {any} data - 要存储的数据
   * @returns {boolean} - 操作是否成功
   */
  save(key, data) {
    try {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(key, jsonData);
      return true;
    } catch (error) {
      console.error('保存数据失败:', error);
      return false;
    }
  }

  /**
   * 从本地存储读取数据
   * @param {string} key - 存储键名
   * @returns {any|null} - 读取的数据或null
   */
  load(key) {
    try {
      const jsonData = localStorage.getItem(key);
      return jsonData ? JSON.parse(jsonData) : null;
    } catch (error) {
      console.error('读取数据失败:', error);
      return null;
    }
  }

  /**
   * 从本地存储删除数据
   * @param {string} key - 存储键名
   * @returns {boolean} - 操作是否成功
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('删除数据失败:', error);
      return false;
    }
  }

  /**
   * 清空所有本地存储数据
   * @returns {boolean} - 操作是否成功
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('清空数据失败:', error);
      return false;
    }
  }

  // 导入数据相关操作
  saveImportData(data) {
    return this.save(this.KEYS.IMPORT_DATA, data);
  }

  loadImportData() {
    return this.load(this.KEYS.IMPORT_DATA);
  }

  removeImportData() {
    return this.remove(this.KEYS.IMPORT_DATA);
  }

  // 用户设置相关操作
  saveUserSettings(settings) {
    return this.save(this.KEYS.USER_SETTINGS, settings);
  }

  loadUserSettings() {
    return this.load(this.KEYS.USER_SETTINGS);
  }

  // 笔记相关操作
  saveNotes(notes) {
    return this.save(this.KEYS.NOTES, notes);
  }

  loadNotes() {
    return this.load(this.KEYS.NOTES);
  }
}

// 导出单例实例
export default new LocalStorageManager();