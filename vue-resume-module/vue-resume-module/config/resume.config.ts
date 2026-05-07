import type { ResumeConfig, ThemeConfig, TitleNameMap } from '../types/resume';

/**
 * 默认标题映射
 */
export const getDefaultTitleNameMap = (locale: string = 'zh-CN'): TitleNameMap => {
  const maps: Record<string, TitleNameMap> = {
    'zh-CN': {
      educationList: '教育背景',
      workExpList: '工作经历',
      projectList: '项目经历',
      skillList: '专业技能',
      awardList: '更多信息',
      workList: '个人作品',
      aboutme: '自我介绍',
    },
    'en-US': {
      educationList: 'Education',
      workExpList: 'Work Experience',
      projectList: 'Projects',
      skillList: 'Skills',
      awardList: 'Awards',
      workList: 'Works',
      aboutme: 'About Me',
    },
  };
  return maps[locale] || maps['zh-CN'];
};

/**
 * 默认主题配置
 */
export const defaultTheme: ThemeConfig = {
  color: '#2f5785',
  tagColor: '#2f5785',
};

/**
 * 默认简历配置
 */
export const defaultResumeConfig: ResumeConfig = {
  avatar: {
    src: undefined,
    hidden: false,
    shape: 'circle',
    size: 84,
  },
  profile: {
    name: '姓名',
    email: 'example@email.com',
    mobile: '138****8888',
    github: 'https://github.com/username',
    zhihu: '',
    workExpYear: '3年',
    workPlace: '北京',
    positionTitle: '前端工程师',
  },
  educationList: [
    {
      edu_time: ['2014.09.01', '2018.06.30'],
      school: '某某大学',
      major: '计算机科学与技术',
      academic_degree: '本科',
    },
  ],
  workExpList: [
    {
      company_name: '某某科技有限公司',
      department_name: '技术部',
      work_time: ['2018.07', null],
      work_desc: '负责公司核心产品的前端开发工作，使用 Vue/React 技术栈，参与组件库建设和性能优化。',
    },
  ],
  projectList: [
    {
      project_name: '企业管理系统',
      project_role: '前端负责人',
      project_time: '2019.04 - 2020.06',
      project_desc: '面向企业内部的管理系统，提供一站式数据管理和分析功能。',
      project_content: '1. 项目从0到1的框架设计和开发\n2. 组件库建设和文档编写\n3. 性能优化，首屏加载时间减少50%',
    },
  ],
  skillList: [
    {
      skill_name: 'HTML / CSS',
      skill_desc: '熟练掌握 HTML5、CSS3，能够编写响应式页面',
      skill_level: 90,
    },
    {
      skill_name: 'JavaScript / TypeScript',
      skill_desc: '熟悉 ES6+，有 TypeScript 项目经验',
      skill_level: 85,
    },
    {
      skill_name: 'Vue.js',
      skill_desc: '熟练使用 Vue 2/3，熟悉 Vue 生态系统',
      skill_level: 90,
    },
    {
      skill_name: 'React',
      skill_desc: '熟悉 React 开发，有大型项目经验',
      skill_level: 75,
    },
  ],
  awardList: [
    {
      award_info: '优秀员工奖',
      award_time: '2020',
    },
    {
      award_info: '技术分享会最佳讲师',
      award_time: '2021',
    },
  ],
  workList: [],
  aboutme: {
    aboutme_desc: '热爱前端开发，关注新技术发展，具有良好的团队协作能力和沟通能力。',
  },
  titleNameMap: getDefaultTitleNameMap(),
};

/**
 * 简历配置验证
 */
export const validateResumeConfig = (config: Partial<ResumeConfig>): ResumeConfig => {
  return {
    ...defaultResumeConfig,
    ...config,
    profile: {
      ...defaultResumeConfig.profile,
      ...config.profile,
    },
    avatar: {
      ...defaultResumeConfig.avatar,
      ...config.avatar,
    },
    titleNameMap: {
      ...defaultResumeConfig.titleNameMap,
      ...config.titleNameMap,
    },
  };
};
