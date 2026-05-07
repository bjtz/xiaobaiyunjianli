// 用户数据模型
class User {
  constructor(data = {}) {
    this.profile = {
      name: data.profile?.name || '',
      mobile: data.profile?.mobile || '',
      email: data.profile?.email || '',
      gender: data.profile?.gender || '',
      birth: data.profile?.birth || '',
      location: data.profile?.location || '',
      position: data.profile?.position || '',
      start_work: data.profile?.start_work || '',
      self_intro: data.profile?.self_intro || ''
    };
    
    this.educationList = data.educationList || [];
    this.workExpList = data.workExpList || [];
    this.projectList = data.projectList || [];
    this.skillList = data.skillList || [];
    this.websites = data.websites || [];
    this.accounts = data.accounts || [];
    this.bookmarks = data.bookmarks || [];
  }

  /**
   * 验证用户数据
   * @returns {boolean} - 数据是否有效
   */
  isValid() {
    return this.profile.name && this.profile.mobile;
  }

  /**
   * 添加教育经历
   * @param {object} education - 教育经历对象
   */
  addEducation(education) {
    this.educationList.push(education);
  }

  /**
   * 删除教育经历
   * @param {number} index - 索引
   */
  removeEducation(index) {
    if (index >= 0 && index < this.educationList.length) {
      this.educationList.splice(index, 1);
    }
  }

  /**
   * 添加工作经历
   * @param {object} work - 工作经历对象
   */
  addWork(work) {
    this.workExpList.push(work);
  }

  /**
   * 删除工作经历
   * @param {number} index - 索引
   */
  removeWork(index) {
    if (index >= 0 && index < this.workExpList.length) {
      this.workExpList.splice(index, 1);
    }
  }

  /**
   * 添加项目经历
   * @param {object} project - 项目经历对象
   */
  addProject(project) {
    this.projectList.push(project);
  }

  /**
   * 删除项目经历
   * @param {number} index - 索引
   */
  removeProject(index) {
    if (index >= 0 && index < this.projectList.length) {
      this.projectList.splice(index, 1);
    }
  }

  /**
   * 添加技能
   * @param {object} skill - 技能对象
   */
  addSkill(skill) {
    this.skillList.push(skill);
  }

  /**
   * 删除技能
   * @param {number} index - 索引
   */
  removeSkill(index) {
    if (index >= 0 && index < this.skillList.length) {
      this.skillList.splice(index, 1);
    }
  }

  /**
   * 添加网站
   * @param {string} website - 网站URL
   */
  addWebsite(website) {
    this.websites.push(website);
  }

  /**
   * 删除网站
   * @param {number} index - 索引
   */
  removeWebsite(index) {
    if (index >= 0 && index < this.websites.length) {
      this.websites.splice(index, 1);
    }
  }

  /**
   * 添加账号
   * @param {string} account - 账号信息
   */
  addAccount(account) {
    this.accounts.push(account);
  }

  /**
   * 删除账号
   * @param {number} index - 索引
   */
  removeAccount(index) {
    if (index >= 0 && index < this.accounts.length) {
      this.accounts.splice(index, 1);
    }
  }

  /**
   * 添加收藏夹
   * @param {string} bookmark - 收藏内容
   */
  addBookmark(bookmark) {
    this.bookmarks.push(bookmark);
  }

  /**
   * 删除收藏夹
   * @param {number} index - 索引
   */
  removeBookmark(index) {
    if (index >= 0 && index < this.bookmarks.length) {
      this.bookmarks.splice(index, 1);
    }
  }

  /**
   * 转换为JSON对象
   * @returns {object} - JSON对象
   */
  toJSON() {
    return {
      profile: this.profile,
      educationList: this.educationList,
      workExpList: this.workExpList,
      projectList: this.projectList,
      skillList: this.skillList,
      websites: this.websites,
      accounts: this.accounts,
      bookmarks: this.bookmarks
    };
  }
}

export default User;