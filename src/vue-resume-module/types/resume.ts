/**
 * 简历配置类型定义
 * 从 React 项目提取并适配 Vue
 */

/** 头像配置 */
export interface AvatarConfig {
  src?: string;
  shape?: 'circle' | 'square';
  size?: 'large' | 'default' | 'small' | number;
  hidden?: boolean;
}

/** 个人信息 */
export interface ProfileConfig {
  name: string;
  mobile?: string;
  email?: string;
  github?: string;
  zhihu?: string;
  /** 工作经验 xx 年 */
  workExpYear?: string;
  /** 期望工作地 */
  workPlace?: string;
  /** 职位 */
  positionTitle?: string;
}

/** 标题名称映射 */
export interface TitleNameMap {
  /** 默认: 教育背景 */
  educationList?: string;
  /** 默认: 工作经历 */
  workExpList?: string;
  /** 默认: 项目经历 */
  projectList?: string;
  /** 默认: 个人技能 */
  skillList?: string;
  /** 默认: 更多信息 */
  awardList?: string;
  /** 默认: 作品 */
  workList?: string;
  /** 自我介绍 */
  aboutme?: string;
}

/** 教育背景 */
export interface EducationItem {
  edu_time: [string | undefined, string | number | null];
  school: string;
  major?: string;
  /** 学历 */
  academic_degree?: string;
}

/** 工作经历 */
export interface WorkExpItem {
  company_name: string;
  department_name: string;
  work_time?: [string | undefined, string | number | null];
  work_desc: string;
}

/** 项目经历 */
export interface ProjectItem {
  /** 项目名称 */
  project_name: string;
  /** 担任角色 */
  project_role: string;
  /** 描述 */
  project_desc?: string;
  /** 项目内容，负责内容 */
  project_content?: string;
  /** 项目时间 */
  project_time?: string;
}

/** 个人技能 */
export interface SkillItem {
  /** 技能项 */
  skill_name?: string;
  /** 掌握程度 (0-100) */
  skill_level?: number;
  /** 技能描述 */
  skill_desc?: string;
}

/** 奖项/更多信息 */
export interface AwardItem {
  award_info: string;
  award_time?: string;
}

/** 作品 */
export interface WorkItem {
  work_name?: string;
  work_desc?: string;
  visit_link?: string;
}

/** 自我介绍 */
export interface AboutMe {
  aboutme_desc: string;
}

/** 简历完整配置 */
export interface ResumeConfig {
  /** 头像 */
  avatar?: AvatarConfig;
  /** 个人信息 */
  profile?: ProfileConfig;
  /** 标题名称映射 */
  titleNameMap?: TitleNameMap;
  /** 教育背景 */
  educationList?: EducationItem[];
  /** 工作经历 */
  workExpList?: WorkExpItem[];
  /** 项目经历 */
  projectList?: ProjectItem[];
  /** 个人技能 */
  skillList?: SkillItem[];
  /** 更多信息 */
  awardList?: AwardItem[];
  /** 作品 */
  workList?: WorkItem[];
  /** 自我介绍 */
  aboutme?: AboutMe;
  /** 国际化配置 */
  locales?: Record<string, ResumeConfig>;
  /** 模板选择 */
  template?: string;
}

/**
 * 主题配置
 */
export interface ThemeConfig {
  /** 主题色 */
  color: string;
  /** Tag 标签色 */
  tagColor: string;
}

/** 模板类型 */
export type TemplateType = 'template1' | 'template2' | 'template3' | 'template4' | 'template5' | 'html' | 'artistic-blue' | 'sidebar-pink' | 'red-simple' | 'blue-business' | 'modern-simple';
