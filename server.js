import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3010; // 更改为3010端口

// 内存中存储用户数据（实际应用中应使用数据库）
let userData = {
    profile: {},
    websites: [],
    accounts: [],
    bookmarks: []
};

// 智能体风格配置
let agentStyle = {
    currentStyle: 'default', // 默认风格
    styles: {
        default: {
            name: '默认风格',
            description: '通用的智能助手风格',
            responses: {
                greeting: "您好！我是智能助手，很高兴为您服务。我可以帮助您回答问题、提供信息或协助处理各种任务。\n\n特别地，如果您需要求职方面的帮助，我还可以帮您创建专业的简历！请告诉我您需要什么帮助，我会尽力为您服务。",
                name: "我是智能助手，一个AI助手，可以为您提供各种帮助。",
                farewell: "再见！如果您需要进一步的帮助，请随时回来找我。祝您有美好的一天！",
                help: "我可以帮助您回答问题、提供信息、进行计算、提供建议等。特别地，如果您需要求职方面的帮助，我还可以帮您创建专业的简历！请告诉我您需要什么帮助，我会尽力为您服务。",
                shortQuery: "我理解您可能有简短的问题，能否提供更多细节以帮助我更好地为您服务？",
                mediumQuery: "我已收到您的消息，并正在分析您的请求。这是一个很好的问题，我会为您提供详细的信息。",
                longQuery: "感谢您提供详细的信息。我已经仔细阅读了您的消息，并会为您提供全面和准确的回答。",
                resumeIntro: "我了解您想创建一份简历！我可以帮您生成一份专业的简历。\n\n请提供以下信息：\n1. 您的姓名\n2. 应聘岗位\n3. 目标公司\n4. 您的工作/实习经验\n5. 您的技能\n6. 您的教育背景\n\n您也可以使用简历生成工具来快速创建您的简历。",
                resumeHelp: "关于简历方面的问题，我可以帮您提供很多帮助，包括简历模板、撰写技巧、岗位匹配建议等。如果您需要生成一份具体的简历，请提供相关个人信息，我会为您量身定制。"
            }
        },
        professional: {
            name: '专业风格',
            description: '正式、专业的商务风格',
            responses: {
                greeting: "尊敬的用户，您好！我是您的专业智能助手。我具备丰富的知识库和高效的处理能力，能够协助您完成各类任务。\n\n如有任何需求，请随时告知，我将竭诚为您服务。",
                name: "我是您的专业智能助手，专注于提供高质量、准确的信息服务。",
                farewell: "感谢您的咨询。期待再次为您提供服务。",
                help: "我可以协助您处理各类问题，包括但不限于信息查询、数据分析、文档生成等。请具体描述您的需求，我将为您提供专业解决方案。",
                shortQuery: "为更好地满足您的需求，请提供更详尽的信息。",
                mediumQuery: "我已接收您的请求，正在为您整理相关信息。",
                longQuery: "收到您的详细需求，我将为您提供全面的分析和解决方案。",
                resumeIntro: "我为您提供专业的简历撰写服务。\n请提供：\n1. 个人基本信息\n2. 应聘目标职位\n3. 相关工作经历\n4. 技能特长\n5. 教育背景\n我将为您打造专业简历。",
                resumeHelp: "我可以提供专业的简历优化建议，包括结构布局、内容完善、行业匹配度提升等方面。"
            }
        },
        friendly: {
            name: '亲切风格',
            description: '友好、轻松的交流风格',
            responses: {
                greeting: "嗨！很高兴认识你！我是你的智能小伙伴，随时准备帮你解决问题。\n\n有什么需要帮忙的吗？无论是日常问题还是专业需求，我都很乐意为你效劳！",
                name: "我是你的AI小伙伴，一个乐于助人的智能助手！",
                farewell: "拜拜！希望我们很快能再见面！有需要随时来找我哦～",
                help: "我可是个万能小助手呢！帮你解答问题、提供信息、做计算都不在话下。特别擅长制作简历哦！告诉我你需要什么，我会尽力帮你！",
                shortQuery: "你的问题很有趣呢！能多告诉我一些细节吗？这样我能更好地帮助你～",
                mediumQuery: "收到啦！我正在认真思考你的问题，马上给你一个满意的答复！",
                longQuery: "哇，你提供了这么多有用的信息！我会仔细分析，给你一个详细而有用的回复。",
                resumeIntro: "要制作简历吗？太棒啦！\n请告诉我：\n1. 你的名字\n2. 想申请的职位\n3. 目标公司\n4. 工作经验\n5. 技能\n6. 教育背景\n我们一起打造完美简历！",
                resumeHelp: "关于简历，我可以给你很多建议哦！模板推荐、写作技巧、岗位匹配建议都可以！需要的话直接告诉我～"
            }
        },
        formal: {
            name: '正式风格',
            description: '严谨、规范的官方风格',
            responses: {
                greeting: "您好！本系统为智能辅助平台，已准备就绪。本助手可为您提供信息查询、文档处理、数据分析等服务。\n\n如需协助，请明确表述您的需求，系统将为您提供相应支持。",
                name: "本系统为智能辅助程序，代号为助手，可为您提供相关信息服务。",
                farewell: "服务结束。感谢您的使用。如需再次获取支持，请重新启动对话。",
                help: "本系统支持以下功能：信息检索、数据处理、文档生成、计算分析等。如需具体服务，请详细描述您的需求。",
                shortQuery: "信息不足，无法准确处理。请提供更详尽的描述。",
                mediumQuery: "已接收请求，正在处理中。分析完成后将返回结果。",
                longQuery: "已接收完整信息，正在执行深度分析。",
                resumeIntro: "系统提供简历生成服务。\n请按以下格式提交信息：\n1. 姓名\n2. 申请职位\n3. 目标公司\n4. 工作经历\n5. 技能信息\n6. 教育背景",
                resumeHelp: "系统可提供简历格式化、内容优化、规范性检查等服务。"
            }
        }
    }
};

// 中间件
app.use(express.json());
app.use(express.static(__dirname));

// 主页
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// 简历生成API端点
app.post('/api/resume', (req, res) => {
    const { name, position, company, experience, skills, education } = req.body;
    
    setTimeout(() => {
        // 创建一个包含所有用户数据的简历
        const profileInfo = userData.profile;
        const websites = userData.websites;
        const accounts = userData.accounts;
        const bookmarks = userData.bookmarks;
        
        // 构建联系方式部分
        let contactInfo = '';
        if (profileInfo.phone) contactInfo += '- 联系电话：' + profileInfo.phone + '\n';
        if (profileInfo.email) contactInfo += '- 邮箱：' + profileInfo.email + '\n';
        if (profileInfo.location) contactInfo += '- 地址：' + profileInfo.location + '\n';
        if (contactInfo === '') contactInfo = '- 联系方式：[请填写您的联系电话]\n- 邮箱：[请填写您的邮箱地址]\n- 地址：[请填写您的现居地址]\n';
        
        // 构建网站链接部分
        let websitesSection = '';
        if (websites.length > 0) {
            websitesSection = '个人网站与社交媒体\n';
            websites.forEach(site => {
                websitesSection += '- [' + site.name + '](' + site.url + ') - ' + site.description + '\n';
            });
            websitesSection += '\n---\n\n';
        }
        
        // 构建专业账号部分
        let accountsSection = '';
        if (accounts.length > 0) {
            accountsSection = '专业账号\n';
            accounts.forEach(acc => {
                const urlPart = acc.url ? ' | [链接](' + acc.url + ')' : '';
                accountsSection += '- ' + acc.platform + '：' + acc.username + urlPart + '\n';
            });
            accountsSection += '\n---\n\n';
        }
        
        // 构建参考资料部分
        let resourcesSection = '';
        if (bookmarks.length > 0) {
            resourcesSection = '重要参考资料\n';
            bookmarks.forEach(bm => {
                resourcesSection += '- [' + bm.title + '](' + bm.url + ') [' + bm.category + ']\n';
            });
            resourcesSection += '\n---\n\n';
        }
        
        // 按照图片排版的简历模板
        const defaultEducation = '2005.07-2009.06 | 大学 | 市场营销 (本科)\n主修课程：管理学、微观经济学、宏观经济学、管理信息系统、统计学、会计学、财务管理、市场营销、经济法、消费者行为学、国际市场营销';
        const defaultExperience = '2012.04-至今 | 信息科技有限公司 | 市场营销 (实习生)\n• 负责公司线上端资源的销售工作（以开拓客户为主），公司主要资源以广点通、智汇推、百度、小米、360、深户平等\n• 实时了解行业的变化，跟踪客户的详细数据，为客户制定更完善的投放计划\n\n2010.03-2012.03 | 信息科技有限公司 | 软件工程师\n• 负责公司业务系统的设计及改进，参与公司网上商城系统产品功能设计及实施工作\n• 负责客户调研、客户需求分析、方案写作等工作，参与公司多个大型电子商务项目的策划工作';
        
        const resumeTemplate = '个人简历 | Personal resume\n\n基本信息\n姓名：' + name + '\n民族：汉\n电话：' + (profileInfo.phone || '13500000000') + '\n邮箱：' + (profileInfo.email || 'example@example.com') + '\n住址：' + (profileInfo.location || '北京市') + '\n出生年月：' + (profileInfo.birthDate || '1995.01') + '\n身高：' + (profileInfo.height || '170cm') + '\n政治面貌：' + (profileInfo.politicalStatus || '共青团员') + '\n学历：' + (profileInfo.education || '本科') + '\n\n教育背景\n' + (education || defaultEducation) + '\n\n实习经历\n' + (experience || defaultExperience) + '\n\n校园经历\n2009.03-2011.06 | 信息科技有限公司 | 校园大使主席\n• 目标带领自己的团队，辅助完成在高院校的优龙计划，向全球顶尖的VA金融公司推送实习生资源\n• 整体运营前期开展了相关的线上线下宣传活动，中期为进行咨询，人员提供，后期进行了项目的维护阶段，保证了整个项目的完整性\n\n技能证书\n• 普通话一级甲等\n• 大学英语四/六级 (CET-4/6)，良好的听说读写能力，快速浏览英语专业文件及书籍\n• 通过全国计算机二级考试，熟练操作office、PS等软件\n\n自我评价\n深度互联网从业人员，对互联网产品有高度的敏感性和关注度，熟悉产品开发流程，有很强的产品规划、需求分析、交互设计能力，能独立承担APP和WEB项目的管控工作，善于沟通，贴近用户。\n\n*此简历由智能助手生成，建议根据具体岗位要求进一步调整优化。*\n*生成时间：' + new Date().toLocaleString() + '*';

        res.json({
            resume: resumeTemplate,
            success: true,
            timestamp: new Date().toISOString()
        });
    }, 1500);
});

// 获取智能体风格
app.get('/api/agent-styles', (req, res) => {
    res.json({
        styles: agentStyle.styles,
        currentStyle: agentStyle.currentStyle,
        success: true,
        timestamp: new Date().toISOString()
    });
});

// 设置智能体风格
app.post('/api/agent-style', (req, res) => {
    const { styleId } = req.body;
    
    if (agentStyle.styles[styleId]) {
        agentStyle.currentStyle = styleId;
        res.json({
            message: '已切换到' + agentStyle.styles[styleId].name + '风格',
            currentStyle: agentStyle.currentStyle,
            success: true,
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(400).json({
            message: '无效的风格ID',
            success: false,
            timestamp: new Date().toISOString()
        });
    }
});

// 添加自定义风格
app.post('/api/custom-agent-style', (req, res) => {
    const { styleId, name, description, responses } = req.body;
    
    if (!styleId || !name || !responses) {
        return res.status(400).json({
            message: '缺少必需的参数',
            success: false,
            timestamp: new Date().toISOString()
        });
    }
    
    agentStyle.styles[styleId] = {
        name,
        description,
        responses
    };
    
    res.json({
        message: '自定义风格已添加',
        styleId,
        success: true,
        timestamp: new Date().toISOString()
    });
});

// 用户资料管理API端点
app.get('/api/user-data', (req, res) => {
    res.json({
        userData: userData,
        success: true,
        timestamp: new Date().toISOString()
    });
});

app.post('/api/user-data/profile', (req, res) => {
    const profileData = req.body;
    userData.profile = { ...userData.profile, ...profileData };
    
    res.json({
        message: '个人资料保存成功',
        userData: userData.profile,
        success: true,
        timestamp: new Date().toISOString()
    });
});

app.post('/api/user-data/websites', (req, res) => {
    const websiteData = req.body;
    if (Array.isArray(websiteData)) {
        userData.websites = [...userData.websites, ...websiteData];
    } else {
        userData.websites.push(websiteData);
    }
    
    res.json({
        message: '网站信息保存成功',
        userData: userData.websites,
        success: true,
        timestamp: new Date().toISOString()
    });
});

app.post('/api/user-data/accounts', (req, res) => {
    const accountData = req.body;
    if (Array.isArray(accountData)) {
        userData.accounts = [...userData.accounts, ...accountData];
    } else {
        userData.accounts.push(accountData);
    }
    
    res.json({
        message: '账号信息保存成功',
        userData: userData.accounts,
        success: true,
        timestamp: new Date().toISOString()
    });
});

app.post('/api/user-data/bookmarks', (req, res) => {
    const bookmarkData = req.body;
    if (Array.isArray(bookmarkData)) {
        userData.bookmarks = [...userData.bookmarks, ...bookmarkData];
    } else {
        userData.bookmarks.push(bookmarkData);
    }
    
    res.json({
        message: '收藏夹信息保存成功',
        userData: userData.bookmarks,
        success: true,
        timestamp: new Date().toISOString()
    });
});

// 智能体API端点 - 模拟AI响应
app.post('/api/agent', (req, res) => {
    const { message, history } = req.body;
    const currentStyle = agentStyle.styles[agentStyle.currentStyle] || agentStyle.styles.default;
    
    // 检查消息是否与简历相关
    if (message.toLowerCase().includes('简历') || message.toLowerCase().includes('resume') ||
        message.toLowerCase().includes('求职') || message.toLowerCase().includes('工作') ||
        message.toLowerCase().includes('申请') || message.toLowerCase().includes('岗位')) {
        
        setTimeout(() => {
            // 如果用户请求生成简历，返回引导信息
            if (message.toLowerCase().includes('生成') || message.toLowerCase().includes('创建') || 
                message.toLowerCase().includes('写') || message.toLowerCase().includes('做')) {
                
                const response = currentStyle.responses.resumeIntro;
                
                res.json({ 
                    response: response,
                    timestamp: new Date().toISOString(),
                    success: true,
                    requiresResumeData: true
                });
            } else {
                // 其他与简历相关的普通响应
                const response = currentStyle.responses.resumeHelp;
                
                res.json({ 
                    response: response,
                    timestamp: new Date().toISOString(),
                    success: true 
                });
            }
        }, 1000);
        
        return; // 提前返回，不执行后续代码
    }
    
    // 模拟AI处理延迟
    setTimeout(() => {
        // 这里可以替换为真实的AI服务调用
        let response;
        
        if (message.toLowerCase().includes('你好') || message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
            response = currentStyle.responses.greeting;
        } else if (message.toLowerCase().includes('名字') || message.toLowerCase().includes('name') || message.toLowerCase().includes('称呼')) {
            response = currentStyle.responses.name;
        } else if (message.toLowerCase().includes('谢谢') || message.toLowerCase().includes('thank')) {
            response = currentStyle.responses.farewell.replace('再见', '不客气').replace('感谢您的咨询', '不客气');
        } else if (message.toLowerCase().includes('再见') || message.toLowerCase().includes('bye') || message.toLowerCase().includes('拜拜')) {
            response = currentStyle.responses.farewell;
        } else if (message.toLowerCase().includes('帮助') || message.toLowerCase().includes('help') || message.toLowerCase().includes(' assistance')) {
            response = currentStyle.responses.help;
        } else if (message.toLowerCase().includes('天气')) {
            response = "我目前无法获取实时天气信息，但建议您查看当地的天气预报应用或网站以获取准确的天气信息。";
        } else if (message.toLowerCase().includes('时间') || message.toLowerCase().includes('几点')) {
            const now = new Date();
            response = '当前时间是 ' + now.getFullYear() + '年' + (now.getMonth()+1) + '月' + now.getDate() + '日 ' + now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0') + '。';
        } else if (message.toLowerCase().includes('申请') && (message.toLowerCase().includes('公司') || message.toLowerCase().includes('岗位'))) {
            // 处理"请帮我写一个申请xxx公司xxx岗位的简历"这样的请求
            const companyMatch = message.match(/申请(\S+)公司/);
            const positionMatch = message.match(/申请(\S+)岗位/);
            const company = companyMatch ? companyMatch[1] : '目标公司';
            const position = positionMatch ? positionMatch[1] : '应聘岗位';
            
            // 返回引导信息并提示用户使用简历生成器
            const response = '好的，我将为您生成申请' + company + '的' + position + '岗位的简历！\n\n您可以使用左侧的\"简历\"菜单项进入简历生成器，我将帮助您创建一份专业的简历。\n\n在简历生成器中，您需要提供：\n1. 您的姓名\n2. 您的工作/实习经验\n3. 您的技能\n4. 您的教育背景\n\n您也可以通过左侧的\"导入资料\"功能导入您的信息，然后我将为您生成专业的简历。';
            
            res.json({ 
                response: response,
                timestamp: new Date().toISOString(),
                success: true,
                requiresResumeData: true
            });
        } else {
            // 根据消息长度返回不同类型的响应
            if (message.length < 10) {
                response = currentStyle.responses.shortQuery;
            } else if (message.length < 30) {
                response = currentStyle.responses.mediumQuery;
            } else {
                response = currentStyle.responses.longQuery;
            }
        }
        
        res.json({ 
            response: response,
            timestamp: new Date().toISOString(),
            success: true 
        });
    }, 1000 + Math.random() * 1000); // 随机延迟模拟真实API调用
});
// 健康检查端点
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('智能体界面运行在 http://localhost:' + PORT);
    console.log('API端点: http://localhost:' + PORT + '/api/agent');
    console.log('健康检查: http://localhost:' + PORT + '/api/health');
    console.log('请在浏览器中打开上面的地址访问智能体');
});
