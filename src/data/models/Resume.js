// 简历数据模型
class Resume {
  constructor(data = {}) {
    this.user = data.user || null;
    this.template = data.template || 'template1';
    this.locale = data.locale || 'zh-CN';
    this.content = data.content || '';
  }

  /**
   * 设置用户数据
   * @param {User} user - 用户对象
   */
  setUser(user) {
    this.user = user;
  }

  /**
   * 设置模板
   * @param {string} template - 模板名称
   */
  setTemplate(template) {
    this.template = template;
  }

  /**
   * 设置语言
   * @param {string} locale - 语言代码
   */
  setLocale(locale) {
    this.locale = locale;
  }

  /**
   * 设置内容
   * @param {string} content - 简历内容
   */
  setContent(content) {
    this.content = content;
  }

  /**
   * 生成简历文本
   * @returns {string} - 简历文本
   */
  generateText() {
    if (!this.user) {
      return '请先导入个人资料';
    }

    const user = this.user;
    let text = '';

    // 个人信息
    text += `个人信息\n`;
    text += `姓名: ${user.profile.name}\n`;
    text += `电话: ${user.profile.mobile}\n`;
    text += `邮箱: ${user.profile.email}\n`;
    if (user.profile.gender) text += `性别: ${user.profile.gender}\n`;
    if (user.profile.birth) text += `出生日期: ${user.profile.birth}\n`;
    if (user.profile.location) text += `所在地: ${user.profile.location}\n`;
    if (user.profile.position) text += `求职意向: ${user.profile.position}\n`;
    if (user.profile.start_work) text += `工作年限: ${user.profile.start_work}\n`;
    if (user.profile.self_intro) text += `个人简介: ${user.profile.self_intro}\n`;
    text += '\n';

    // 教育经历
    if (user.educationList.length > 0) {
      text += `教育经历\n`;
      user.educationList.forEach((edu, index) => {
        text += `${index + 1}. ${edu.school} - ${edu.college} - ${edu.major}\n`;
        text += `   时间: ${edu.edu_time[0]} 至 ${edu.edu_time[1]}\n`;
        text += `   学历: ${edu.academic_degree}\n`;
      });
      text += '\n';
    }

    // 工作经历
    if (user.workExpList.length > 0) {
      text += `工作经历\n`;
      user.workExpList.forEach((work, index) => {
        text += `${index + 1}. ${work.company_name} - ${work.department_name}\n`;
        text += `   时间: ${work.work_time[0]} 至 ${work.work_time[1]}\n`;
        text += `   描述: ${work.work_desc}\n`;
      });
      text += '\n';
    }

    // 项目经历
    if (user.projectList.length > 0) {
      text += `项目经历\n`;
      user.projectList.forEach((project, index) => {
        text += `${index + 1}. ${project.project_name}\n`;
        text += `   时间: ${project.project_time[0]} 至 ${project.project_time[1]}\n`;
        text += `   描述: ${project.project_desc}\n`;
        text += `   技能: ${project.project_skills}\n`;
      });
      text += '\n';
    }

    // 专业技能
    if (user.skillList.length > 0) {
      text += `专业技能\n`;
      user.skillList.forEach((skill, index) => {
        text += `${index + 1}. ${skill.skill_name} - 熟练度: ${skill.skill_level}/5\n`;
        if (skill.skill_desc) text += `   描述: ${skill.skill_desc}\n`;
      });
      text += '\n';
    }

    // 其他信息
    if (user.websites.length > 0) {
      text += `个人网站\n`;
      user.websites.forEach((website, index) => {
        text += `${index + 1}. ${website}\n`;
      });
      text += '\n';
    }

    if (user.accounts.length > 0) {
      text += `账号信息\n`;
      user.accounts.forEach((account, index) => {
        text += `${index + 1}. ${account}\n`;
      });
    }

    return text;
  }

  /**
   * 转换为JSON对象
   * @returns {object} - JSON对象
   */
  toJSON() {
    return {
      user: this.user ? this.user.toJSON() : null,
      template: this.template,
      locale: this.locale,
      content: this.content
    };
  }
}

export default Resume;