const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 模拟学校和专业数据
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

// 本地存储模拟（实际项目中可使用数据库）
let importDataStore = null;

app.post('/api/resume/chat', async (req, res) => {
  try {
    const { messages, localContext } = req.body;
    
    console.log('收到聊天请求');
    console.log('用户消息:', messages[messages.length - 1]?.content);
    console.log('本地资料:', localContext ? '有资料' : '无资料');
    
    let systemPrompt = `你是小白云简历生成助手，一个专业的AI助手，专门为用户提供简历生成服务。

你需要：
1. 根据用户导入的本地资料来回答问题
2. 如果没有本地资料，使用你的专业知识
3. 保持友好、专业的语气
4. 专注于简历相关的问题

本地资料：
${localContext || '暂无本地资料'}
`;

    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    let response;
    
    // 优先使用智谱AI
    if (process.env.ZHIPUAI_API_KEY && process.env.ZHIPUAI_API_KEY !== 'your_zhipuai_api_key_here') {
      console.log('正在调用智谱AI...');
      response = await callZhipuAI(fullMessages);
      console.log('智谱AI调用成功');
    } else if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      console.log('正在调用OpenAI...');
      response = await callOpenAI(fullMessages);
      console.log('OpenAI调用成功');
    } else {
      console.log('使用本地响应（未配置API密钥）');
      response = generateLocalResponse(messages, localContext);
    }

    // 移除所有Markdown格式的星号
    response = response.replace(/\*\*(.*?)\*\*/g, '$1');

    res.json({ code: 0, data: { response }, message: '' });
  } catch (error) {
    console.error('API Error:', error);
    const fallback = generateLocalResponse(req.body.messages, req.body.localContext);
    res.status(500).json({ 
      code: 500,
      data: { response: fallback },
      message: '请求失败，请检查API配置'
    });
  }
});

async function callZhipuAI(messages) {
  const fetch = require('node-fetch');
  
  const apiBase = process.env.ZHIPUAI_API_BASE || 'https://open.bigmodel.cn/api/paas/v4';
  const model = process.env.ZHIPUAI_MODEL || 'glm-4';

  console.log('智谱AI API地址:', apiBase);
  console.log('使用模型:', model);
  
  const response = await fetch(`${apiBase}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ZHIPUAI_API_KEY}`
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('智谱AI API调用失败:', response.status, errorText);
    throw new Error(`智谱AI API调用失败: ${response.status}`);
  }

  const data = await response.json();
  console.log('智谱AI响应:', data.choices ? '有响应' : '无响应');
  return data.choices[0].message.content;
}

async function callOpenAI(messages) {
  const fetch = require('node-fetch');
  
  const apiBase = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
  const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

  const response = await fetch(`${apiBase}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

function generateLocalResponse(messages, localContext) {
  const lastMessage = messages[messages.length - 1];
  const userMessage = lastMessage.content.toLowerCase();

  if (userMessage.includes('你好') || userMessage.includes('hello') || userMessage.includes('hi')) {
    return "嘿！\n我是小白云简历生成助手！\n很高兴见到你！我是专门为您提供专业简历生成服务的AI助手。\n\n我可以通过导入的资料为您生成专业的简历，帮您扩写简历内容，和输出求职简历的样子。只需告诉我您的需求，例如：'请帮我写一个申请xxx公司xxx岗位的简历'。";
  } else if (userMessage.includes('简历') || userMessage.includes('resume')) {
    if (localContext) {
      return `根据您导入的资料，我可以帮您生成专业的简历！\n\n本地资料已加载，请告诉我您需要：\n1. 生成完整简历\n2. 扩写简历内容\n3. 查看简历预览`;
    } else {
      return "关于简历方面的问题，我可以帮您提供很多帮助，包括简历模板、撰写技巧、岗位匹配建议等。请先导入您的个人资料，我会为您量身定制专业简历！";
    }
  } else if (userMessage.includes('扩写')) {
    if (localContext) {
      return "好的！我将根据您的本地资料为您扩写简历内容。请稍等，我正在为您生成...";
    } else {
      return "请先导入您的个人资料，然后我就可以帮您扩写简历了！";
    }
  } else {
    return "感谢您的消息！我是小白云简历生成助手，专注于帮您创建专业的简历。请告诉我您的需求，或者先导入您的个人资料开始使用！";
  }
}

app.get('/api/resume/health', (req, res) => {
  const hasZhipuAI = !!process.env.ZHIPUAI_API_KEY && process.env.ZHIPUAI_API_KEY !== 'your_zhipuai_api_key_here';
  const hasOpenAI = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';
  res.json({ 
    code: 0, 
    data: {
      status: 'ok', 
      hasApiKey: hasZhipuAI || hasOpenAI,
      currentProvider: hasZhipuAI ? 'zhipuai' : (hasOpenAI ? 'openai' : 'local')
    },
    message: ''
  });
});

// 数据管理API
app.post('/api/resume/import-data', (req, res) => {
  try {
    const data = req.body;
    importDataStore = data;
    console.log('保存导入数据成功');
    res.json({ code: 0, data: {}, message: '数据保存成功' });
  } catch (error) {
    console.error('保存数据失败:', error);
    res.status(500).json({ code: 500, data: {}, message: '保存数据失败' });
  }
});

app.get('/api/resume/import-data', (req, res) => {
  try {
    console.log('读取导入数据');
    res.json({ code: 0, data: importDataStore, message: '' });
  } catch (error) {
    console.error('读取数据失败:', error);
    res.status(500).json({ code: 500, data: {}, message: '读取数据失败' });
  }
});

app.delete('/api/resume/import-data', (req, res) => {
  try {
    importDataStore = null;
    console.log('重置导入数据成功');
    res.json({ code: 0, data: {}, message: '数据已重置' });
  } catch (error) {
    console.error('重置数据失败:', error);
    res.status(500).json({ code: 500, data: {}, message: '重置数据失败' });
  }
});

// 学校和专业数据API
app.get('/api/resume/schools', (req, res) => {
  try {
    const schools = Object.keys(schoolData);
    res.json({ code: 0, data: { schools }, message: '' });
  } catch (error) {
    console.error('获取学校列表失败:', error);
    res.status(500).json({ code: 500, data: {}, message: '获取学校列表失败' });
  }
});

app.get('/api/resume/colleges', (req, res) => {
  try {
    const { school } = req.query;
    if (!school) {
      return res.status(400).json({ code: 400, data: {}, message: '缺少school参数' });
    }
    
    const colleges = schoolData[school] ? Object.keys(schoolData[school]) : [];
    res.json({ code: 0, data: { colleges }, message: '' });
  } catch (error) {
    console.error('获取学院列表失败:', error);
    res.status(500).json({ code: 500, data: {}, message: '获取学院列表失败' });
  }
});

app.get('/api/resume/majors', (req, res) => {
  try {
    const { school, college } = req.query;
    if (!school || !college) {
      return res.status(400).json({ code: 400, data: {}, message: '缺少school或college参数' });
    }
    
    const majors = schoolData[school]?.[college] || [];
    res.json({ code: 0, data: { majors }, message: '' });
  } catch (error) {
    console.error('获取专业列表失败:', error);
    res.status(500).json({ code: 500, data: {}, message: '获取专业列表失败' });
  }
});

// 智能扩写API
app.post('/api/resume/expand-resume', async (req, res) => {
  try {
    const { message, localContext } = req.body;
    
    console.log('收到简历扩写请求');
    console.log('用户消息:', message);
    console.log('本地资料:', localContext ? '有资料' : '无资料');
    
    let systemPrompt = `你是小白云简历生成助手，专门负责根据用户的个人资料扩写简历内容。

你需要：
1. 分析用户导入的本地资料
2. 基于资料生成专业、详细的简历内容
3. 突出用户的优势和亮点
4. 保持专业、客观的语气
5. 结构化输出，便于用户直接使用

本地资料：
${localContext || '暂无本地资料'}
`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ];

    let response;
    
    // 优先使用智谱AI
    if (process.env.ZHIPUAI_API_KEY && process.env.ZHIPUAI_API_KEY !== 'your_zhipuai_api_key_here') {
      console.log('正在调用智谱AI进行简历扩写...');
      response = await callZhipuAI(messages);
      console.log('智谱AI扩写成功');
    } else if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      console.log('正在调用OpenAI进行简历扩写...');
      response = await callOpenAI(messages);
      console.log('OpenAI扩写成功');
    } else {
      console.log('使用本地响应进行简历扩写');
      response = generateLocalExpandResponse(message, localContext);
    }

    // 移除所有Markdown格式的星号
    response = response.replace(/\*\*(.*?)\*\*/g, '$1');

    res.json({ code: 0, data: { response }, message: '' });
  } catch (error) {
    console.error('简历扩写失败:', error);
    const fallback = generateLocalExpandResponse(req.body.message, req.body.localContext);
    res.status(500).json({ 
      code: 500,
      data: { response: fallback },
      message: '扩写失败，请检查API配置'
    });
  }
});

function generateLocalExpandResponse(message, localContext) {
  if (localContext) {
    return `根据您的个人资料，我为您扩写了简历内容：

个人简历 | Personal resume

基本信息
根据您的个人资料，我已为您整理了详细的个人信息。

教育背景
根据您的教育经历，我已为您整理了详细的教育背景信息，包括学校、专业、学位和主修课程。

实习经历
基于您的工作经历，我已为您突出了关键的工作成果和技能，强调了您在实习期间的贡献。

校园经历
根据您的校园活动，我已为您整理了校园经历，展示了您的领导能力和团队合作精神。

技能证书
基于您的技能列表，我已为您展示了专业技能水平和相关证书。

自我评价
根据您的整体背景，我已为您撰写了专业的自我评价，突出您的优势和职业目标。

请告诉我您对扩写内容的反馈，我可以进一步优化！`;
  } else {
    return "请先导入您的个人资料，然后我就可以帮您扩写简历了！";
  }
}

app.listen(PORT, () => {
  console.log(`后端服务器运行在 http://localhost:${PORT}`);
  
  const hasZhipuAI = !!process.env.ZHIPUAI_API_KEY && process.env.ZHIPUAI_API_KEY !== 'your_zhipuai_api_key_here';
  const hasOpenAI = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';
  
  if (hasZhipuAI) {
    console.log(`API状态: 已配置智谱AI (BigModel)`);
  } else if (hasOpenAI) {
    console.log(`API状态: 已配置OpenAI`);
  } else {
    console.log(`API状态: 请配置API密钥（推荐智谱AI）`);
  }
});
