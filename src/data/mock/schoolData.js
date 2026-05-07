// 学校数据模拟
const schoolData = {
  "广东白云学院（西校区）": {
    "电气与信息工程学院": ["电气工程及其自动化", "电子信息工程", "通信工程", "自动化"],
    "机械工程学院": ["机械设计制造及其自动化", "车辆工程", "机器人工程"],
    "计算机科学与工程学院": ["计算机科学与技术", "软件工程", "数据科学与大数据技术", "人工智能"],
    "建筑工程学院": ["土木工程", "工程造价", "建筑学"],
    "管理学院": ["工商管理", "市场营销", "会计学", "财务管理"],
    "艺术设计学院": ["视觉传达设计", "环境设计", "产品设计"],
    "外国语学院": ["英语", "日语", "商务英语"]
  },
  "广东白云学院（东校区）": {
    "经济与金融学院": ["金融学", "国际经济与贸易", "经济统计学"],
    "教育学院": ["学前教育", "小学教育"],
    "应用技术学院": ["应用电子技术", "计算机应用技术", "数控技术"]
  }
};

// 导出学校数据
export default schoolData;

// 导出获取学校列表的函数
export function getSchools() {
  return Object.keys(schoolData);
}

// 导出获取学院列表的函数
export function getColleges(school) {
  return schoolData[school] ? Object.keys(schoolData[school]) : [];
}

// 导出获取专业列表的函数
export function getMajors(school, college) {
  return schoolData[school]?.[college] || [];
}