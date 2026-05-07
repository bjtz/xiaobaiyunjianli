document.addEventListener('DOMContentLoaded', function() {
    const messagesContainer = document.getElementById('messages');
    const userInput = document.getElementById('userInput');
    const newChatBtn = document.getElementById('newChatBtn');
    const historyBtn = document.getElementById('historyBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    
    // 获取新的UI元素
    const statusText = document.querySelector('.status-text');
    const workspaceName = document.querySelector('.workspace-name');
    const navItems = document.querySelectorAll('.nav-item');
    const importOptions = document.querySelectorAll('.import-option');
    const importButtons = document.querySelectorAll('.import-btn');
    const importSection = document.querySelector('.import-section');

    // 添加消息到聊天界面
    function addMessage(text, isUser, messageType = 'text') {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'agent-message');
        messageDiv.classList.add(`${messageType}-message`);
        
        if (messageType === 'typing') {
            messageDiv.innerHTML = '<div class="typing-indicator"><div></div><div></div><div></div></div>';
        } else {
            // 创建消息内容容器
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('message-content');
            contentDiv.textContent = text;
            
            messageDiv.appendChild(contentDiv);
            
            // 添加复制按钮
            const copyBtn = document.createElement('button');
            copyBtn.classList.add('copy-btn');
            copyBtn.innerHTML = '📋';
            copyBtn.title = '复制消息';
            copyBtn.addEventListener('click', function() {
                navigator.clipboard.writeText(text).then(() => {
                    // 临时更改按钮文本以显示复制成功
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '✓';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                    }, 2000);
                });
            });
            
            contentDiv.appendChild(copyBtn);
        }
        
        messagesContainer.appendChild(messageDiv);
        
        // 滚动到底部
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        return messageDiv;
    }

    // 模拟智能体响应
    function getAgentResponse(userMessage) {
        // 模拟更复杂的响应逻辑
        const lowerMsg = userMessage.toLowerCase();
        
        if (lowerMsg.includes('你好') || lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            return "嘿！👋\n**我是MJ Mentor！** ✨🤖✨\n很高兴见到你！我是专门为您提供内容创作和音乐灵感的AI助手。\n\n我可以通过导入的资料为您生成专业的简历，只需输入'请帮我写一个申请xxx公司xxx岗位的简历'。";
        } else if (lowerMsg.includes('名字') || lowerMsg.includes('name') || lowerMsg.includes('称呼')) {
            return "我是MJ Mentor，一个专业的AI助手，专门为您在内容创作和音乐方面提供帮助。";
        } else if (lowerMsg.includes('谢谢') || lowerMsg.includes('thank')) {
            return "不客气！如果您还有其他问题，请随时告诉我，我会尽力帮助您。";
        } else if (lowerMsg.includes('再见') || lowerMsg.includes('bye') || lowerMsg.includes('拜拜')) {
            return "再见！如果您需要进一步的帮助，请随时回来找我。祝您有美好的一天！";
        } else if (lowerMsg.includes('帮助') || lowerMsg.includes('help') || lowerMsg.includes(' assistance')) {
            return "我可以帮助您回答问题、提供信息、进行计算、提供建议等。特别地，如果您需要求职方面的帮助，我还可以帮您创建专业的简历！请告诉我您需要什么帮助，我会尽力为您服务。";
        } else if (lowerMsg.includes('天气')) {
            return "我目前无法获取实时天气信息，但建议您查看当地的天气预报应用或网站以获取准确的天气信息。";
        } else if (lowerMsg.includes('时间') || lowerMsg.includes('几点')) {
            const now = new Date();
            return `当前时间是 ${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}。`;
        } else if (lowerMsg.includes('计算') || lowerMsg.includes('算') || lowerMsg.includes('+') || lowerMsg.includes('-') || lowerMsg.includes('*') || lowerMsg.includes('/')) {
            try {
                // 提取数学表达式并计算
                const mathExpr = userMessage.match(/[\d+\-*/().\s]+/g);
                if (mathExpr) {
                    // 仅计算纯数学表达式，避免执行恶意代码
                    const expr = mathExpr[0].replace(/[^0-9+\-*/().\s]/g, '');
                    if (expr && expr.length > 0) {
                        const result = eval(expr);
                        return `计算结果：${expr} = ${result}`;
                    }
                }
            } catch (e) {
                // 如果计算出错，返回一般性响应
            }
            return "我可以帮助您进行数学计算。请提供具体的数学表达式，我会为您计算结果。";
        } else if (lowerMsg.includes('简历') || lowerMsg.includes('resume') ||
                   lowerMsg.includes('求职') || lowerMsg.includes('工作') ||
                   lowerMsg.includes('申请') || lowerMsg.includes('岗位')) {
            // 如果用户请求生成简历，返回引导信息
            if (lowerMsg.includes('生成') || lowerMsg.includes('创建') || 
                lowerMsg.includes('写') || lowerMsg.includes('做')) {
                
                const response = "我了解您想创建一份简历！我可以帮您生成一份专业的简历。\n\n请提供以下信息：\n" +
                                "1. 您的姓名\n" +
                                "2. 应聘岗位\n" +
                                "3. 目标公司\n" +
                                "4. 您的工作/实习经验\n" +
                                "5. 您的技能\n" +
                                "6. 您的教育背景\n\n" +
                                "您也可以使用简历生成工具来快速创建您的简历。";
                
                return response;
            } else {
                // 其他与简历相关的普通响应
                return "关于简历方面的问题，我可以帮您提供很多帮助，包括简历模板、撰写技巧、岗位匹配建议等。如果您需要生成一份具体的简历，请提供相关个人信息，我会为您量身定制。";
            }
        } else {
            // 根据消息长度返回不同类型的响应
            if (userMessage.length < 10) {
                return "我理解您可能有简短的问题，能否提供更多细节以帮助我更好地为您服务？";
            } else if (userMessage.length < 30) {
                return "我已收到您的消息，并正在分析您的请求。这是一个很好的问题，我会为您提供详细的信息。";
            } else {
                return "感谢您提供详细的信息。我已经仔细阅读了您的消息，并会为您提供全面和准确的回答。";
            }
        }
    }

    // 发送消息
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            // 添加用户消息
            addMessage(message, true);
            userInput.value = '';
            
            // 禁用输入框和发送按钮，显示正在输入指示器
            userInput.disabled = true;
            // 更新状态为写作中
            statusText.textContent = 'WRITING...';
            statusText.style.color = '#E53E3E';
            
            // 添加智能体的"正在输入"指示器
            const typingMessage = addMessage('', false, 'typing');
            
            try {
                // 检查消息是否与简历相关
                if (message.toLowerCase().includes('简历') || message.toLowerCase().includes('resume') ||
                    message.toLowerCase().includes('求职') || message.toLowerCase().includes('工作') ||
                    message.toLowerCase().includes('申请') || message.toLowerCase().includes('岗位')) {
                    
                    // 如果是简历相关请求，调用相应的API
                    const response = await callAgentAPI(message);
                    
                    // 移除"正在输入"指示器
                    typingMessage.remove();
                    
                    // 重新启用输入框
                    userInput.disabled = false;
                    
                    // 如果响应包含简历生成提示，显示简历生成器
                    if (response.requiresResumeData) {
                        // 显示简历生成器界面
                        showResumeBuilder();
                    }
                    
                    addMessage(response.response, false);
                } else {
                    // 调用普通API获取智能体响应
                    const response = await callAgentAPI(message);
                    
                    // 移除"正在输入"指示器
                    typingMessage.remove();
                    
                    // 重新启用输入框
                    userInput.disabled = false;
                    
                    addMessage(response, false);
                }
            } catch (error) {
                // 移除"正在输入"指示器
                typingMessage.remove();
                
                // 重新启用输入框
                userInput.disabled = false;
                
                // 显示错误消息
                addMessage('抱歉，我在处理您的请求时遇到了问题。请稍后再试。', false);
                console.error('API调用错误:', error);
            }
        }
    }
    
    // 调用智能体API
    async function callAgentAPI(message) {
        const response = await fetch('/api/agent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                history: [] // 这里可以传递对话历史
            })
        });
        
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    }

    // 调用简历生成API
    async function generateResume(resumeData) {
        try {
            // 首先获取用户存储的数据
            const userDataResponse = await fetch('/api/user-data');
            if (!userDataResponse.ok) {
                throw new Error(`获取用户数据失败: ${userDataResponse.status}`);
            }
            const userDataResult = await userDataResponse.json();
            const userData = userDataResult.userData;
            
            // 将用户数据与简历数据合并
            const fullResumeData = {
                ...resumeData,
                profile: userData.profile || {},
                websites: userData.websites || [],
                accounts: userData.accounts || [],
                bookmarks: userData.bookmarks || []
            };
            
            const response = await fetch('/api/resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(fullResumeData)
            });
            
            if (!response.ok) {
                throw new Error(`简历生成请求失败: ${response.status}`);
            }
            
            const data = await response.json();
            return data.resume;
        } catch (error) {
            console.error('生成简历时出错:', error);
            throw error;
        }
    }

    // 显示简历生成器界面
    async function showResumeBuilder() {
        // 先获取用户数据
        let userData = { profile: {}, websites: [], accounts: [], bookmarks: [] };
        try {
            const response = await fetch('/api/user-data');
            if (response.ok) {
                const result = await response.json();
                userData = result.userData;
            }
        } catch (error) {
            console.error('获取用户数据时出错:', error);
        }
        
        const resumeBuilderHtml = `
            <div class="resume-builder">
                <h3>简历生成器</h3>
                <div class="resume-form">
                    <div class="form-group">
                        <label for="resumeName">姓名 *</label>
                        <input type="text" id="resumeName" placeholder="请输入您的姓名" value="${userData.profile.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="targetCompany">目标公司 *</label>
                        <input type="text" id="targetCompany" placeholder="请输入您想申请的公司名称" required>
                    </div>
                    <div class="form-group">
                        <label for="targetPosition">应聘岗位 *</label>
                        <input type="text" id="targetPosition" placeholder="请输入您想申请的职位" required>
                    </div>
                    <div class="form-group">
                        <label for="education">教育背景</label>
                        <textarea id="education" placeholder="例如：XX大学 计算机科学与技术专业 学士学位 2020-2024">${userData.education || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="experience">工作/实习经验</label>
                        <textarea id="experience" placeholder="例如：XX公司 软件开发实习生 2023.06-2023.09">${userData.experience || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="skills">专业技能</label>
                        <textarea id="skills" placeholder="例如：JavaScript, React, Node.js, 数据库设计">${userData.skills || ''}</textarea>
                    </div>
                    <div class="form-actions">
                        <button id="generateResumeBtn">生成简历</button>
                        <button id="cancelResumeBtn">取消</button>
                    </div>
                </div>
            </div>
        `;
        
        // 清空消息容器并添加简历生成器
        messagesContainer.innerHTML = resumeBuilderHtml;
        
        // 添加事件监听器
        document.getElementById('generateResumeBtn').addEventListener('click', async function() {
            const resumeData = {
                name: document.getElementById('resumeName').value,
                position: document.getElementById('targetPosition').value,
                company: document.getElementById('targetCompany').value,
                experience: document.getElementById('experience').value,
                skills: document.getElementById('skills').value,
                education: document.getElementById('education').value
            };
            
            // 验证必填字段
            if (!resumeData.name || !resumeData.position || !resumeData.company) {
                alert('请填写所有必填字段（姓名、目标公司、应聘岗位）');
                return;
            }
            
            try {
                // 显示生成过程
                messagesContainer.innerHTML = '<div class="resume-generation"><h3>正在生成您的简历...</h3><div class="typing-indicator"><div></div><div></div><div></div></div></div>';
                
                // 生成简历
                const resume = await generateResume(resumeData);
                
                // 显示生成的简历
                messagesContainer.innerHTML = `
                    <div class="generated-resume">
                        <h3>生成的简历</h3>
                        <div class="resume-content">
                            <pre>${resume}</pre>
                        </div>
                        <div class="resume-actions">
                            <button id="copyResumeBtn">复制简历</button>
                            <button id="downloadResumeBtn">下载简历</button>
                            <button id="newResumeBtn">重新生成</button>
                        </div>
                    </div>
                `;
                
                // 复制简历按钮
                document.getElementById('copyResumeBtn').addEventListener('click', function() {
                    navigator.clipboard.writeText(resume).then(() => {
                        alert('简历已复制到剪贴板');
                    });
                });
                
                // 下载简历按钮
                document.getElementById('downloadResumeBtn').addEventListener('click', function() {
                    const element = document.createElement('a');
                    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(resume));
                    element.setAttribute('download', `${resumeData.name}_简历.txt`);
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                });
                
                // 重新生成按钮
                document.getElementById('newResumeBtn').addEventListener('click', function() {
                    showResumeBuilder();
                });
                
            } catch (error) {
                console.error('生成简历时出错:', error);
                messagesContainer.innerHTML = '<div class="error">生成简历时出错，请稍后重试。</div>';
            }
        });
        
        document.getElementById('cancelResumeBtn').addEventListener('click', function() {
            addMessage('好的，您可以继续与我聊天或随时请求简历生成服务。', false);
        });
    }

    // 处理导入功能
    importOptions.forEach(option => {
        option.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            handleImport(type);
        });
    });

    // 处理导入按钮
    importButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const importType = this.getAttribute('data-import');
            handleImportType(importType);
        });
    });

    // 处理导入类型
    function handleImport(type) {
        let importData = {};
        switch(type) {
            case 'profile':
                // 显示个人资料编辑界面
                showProfileEditor();
                return;
            case 'education':
                importData = {
                    education: '北京大学 计算机科学与技术 学士学位 2018-2022\nGPA: 3.8/4.0'
                };
                break;
            case 'work':
                importData = {
                    experience: 'ABC公司 软件开发工程师 2022.06-至今\n- 负责公司核心产品后端开发\n- 参与技术架构设计和优化'
                };
                break;
        }
        
        // 尝试将导入的数据填充到简历生成器中
        fillResumeForm(importData);
        
        // 显示导入成功提示，允许用户编辑导入的数据
        addMessage(`已导入${getImportTypeName(type)}信息。您可以在简历生成器中查看和编辑这些信息。`, false);
    }
    
    // 显示个人资料编辑器
    function showProfileEditor() {
        const profileEditorHtml = `
            <div class="profile-editor">
                <h3>个人资料管理</h3>
                <div class="profile-form">
                    <div class="form-group">
                        <label for="profileName">姓名 *</label>
                        <input type="text" id="profileName" placeholder="请输入您的姓名" value="">
                    </div>
                    <div class="form-group">
                        <label for="profileEmail">邮箱 *</label>
                        <input type="email" id="profileEmail" placeholder="请输入您的邮箱" value="">
                    </div>
                    <div class="form-group">
                        <label for="profilePhone">电话</label>
                        <input type="text" id="profilePhone" placeholder="请输入您的电话" value="">
                    </div>
                    <div class="form-group">
                        <label for="profileLocation">地址</label>
                        <input type="text" id="profileLocation" placeholder="请输入您的地址" value="">
                    </div>
                    <div class="form-group">
                        <label for="profileSummary">个人简介</label>
                        <textarea id="profileSummary" placeholder="简要介绍您的专业背景和技能特长" rows="3"></textarea>
                    </div>
                    <div class="form-actions">
                        <button id="saveProfileBtn">保存资料</button>
                        <button id="cancelProfileBtn">取消</button>
                    </div>
                </div>
            </div>
        `;
        
        // 清空消息容器并添加个人资料编辑器
        messagesContainer.innerHTML = profileEditorHtml;
        
        // 从服务器加载现有资料
        loadProfileData();
        
        // 添加事件监听器
        document.getElementById('saveProfileBtn').addEventListener('click', async function() {
            const profileData = {
                name: document.getElementById('profileName').value,
                email: document.getElementById('profileEmail').value,
                phone: document.getElementById('profilePhone').value,
                location: document.getElementById('profileLocation').value,
                summary: document.getElementById('profileSummary').value
            };
            
            // 验证必填字段
            if (!profileData.name || !profileData.email) {
                alert('请填写姓名和邮箱');
                return;
            }
            
            try {
                // 保存到服务器
                const response = await fetch('/api/user-data/profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(profileData)
                });
                
                if (!response.ok) {
                    throw new Error(`保存失败: ${response.status}`);
                }
                
                const result = await response.json();
                
                // 保存成功，返回到对话页面
                messagesContainer.innerHTML = '';
                addMessage(`个人资料已成功保存！您可以继续与我聊天或随时请求简历生成服务。`, false);
            } catch (error) {
                console.error('保存个人资料时出错:', error);
                alert('保存个人资料时出错，请稍后重试。');
            }
        });
        
        document.getElementById('cancelProfileBtn').addEventListener('click', function() {
            messagesContainer.innerHTML = '';
            addMessage('已取消个人资料编辑。您可以继续与我聊天或随时请求简历生成服务。', false);
        });
    }
    
    // 从服务器加载个人资料
    async function loadProfileData() {
        try {
            const response = await fetch('/api/user-data');
            if (!response.ok) {
                throw new Error(`加载失败: ${response.status}`);
            }
            
            const result = await response.json();
            const profile = result.userData.profile;
            
            if (profile) {
                document.getElementById('profileName').value = profile.name || '';
                document.getElementById('profileEmail').value = profile.email || '';
                document.getElementById('profilePhone').value = profile.phone || '';
                document.getElementById('profileLocation').value = profile.location || '';
                document.getElementById('profileSummary').value = profile.summary || '';
            }
        } catch (error) {
            console.error('加载个人资料时出错:', error);
        }
    }

    // 处理特定导入类型
    function handleImportType(importType) {
        if (importType === 'websites') {
            // 网站导入功能
            const importHtml = `
                <div class="import-modal">
                    <h3>导入网站信息</h3>
                    <div class="import-instructions">
                        <p>您可以从以下途径导入网站信息，或手动添加：</p>
                    </div>
                    <div class="import-options-list">
                        <div class="import-option-item" data-type="github">
                            <i>🐱</i> GitHub
                        </div>
                        <div class="import-option-item" data-type="linkedin">
                            <i>👔</i> LinkedIn
                        </div>
                        <div class="import-option-item" data-type="blog">
                            <i>📝</i> 个人博客
                        </div>
                        <div class="import-option-item" data-type="portfolio">
                            <i>🖼️</i> 作品集网站
                        </div>
                    </div>
                    <div class="import-manual">
                        <h4>手动添加网站</h4>
                        <div class="form-group">
                            <label>网站名称</label>
                            <input type="text" id="manualSiteName" placeholder="例如：GitHub">
                        </div>
                        <div class="form-group">
                            <label>网站链接</label>
                            <input type="text" id="manualSiteUrl" placeholder="https://example.com">
                        </div>
                        <div class="form-group">
                            <label>描述</label>
                            <input type="text" id="manualSiteDesc" placeholder="简要描述网站内容">
                        </div>
                        <button id="addManualSiteBtn" class="add-btn">添加网站</button>
                    </div>
                    <div class="import-actions">
                        <button id="importSitesBtn">确认导入</button>
                        <button id="cancelImportBtn">取消</button>
                    </div>
                </div>
            `;
            
            showImportModal(importHtml, 'websites');
        } else if (importType === 'accounts') {
            // 账号导入功能
            const importHtml = `
                <div class="import-modal">
                    <h3>导入账号信息</h3>
                    <div class="import-instructions">
                        <p>您可以从以下平台导入账号信息，或手动添加：</p>
                    </div>
                    <div class="import-options-list">
                        <div class="import-option-item" data-type="github">
                            <i>🐱</i> GitHub
                        </div>
                        <div class="import-option-item" data-type="stackoverflow">
                            <i>️</i> Stack Overflow
                        </div>
                        <div class="import-option-item" data-type="linkedin">
                            <i>👔</i> LinkedIn
                        </div>
                        <div class="import-option-item" data-type="dribbble">
                            <i>🎨</i> Dribbble
                        </div>
                    </div>
                    <div class="import-manual">
                        <h4>手动添加账号</h4>
                        <div class="form-group">
                            <label>平台名称</label>
                            <input type="text" id="manualAccountPlatform" placeholder="例如：GitHub">
                        </div>
                        <div class="form-group">
                            <label>用户名</label>
                            <input type="text" id="manualAccountUsername" placeholder="您的用户名">
                        </div>
                        <div class="form-group">
                            <label>链接（可选）</label>
                            <input type="text" id="manualAccountUrl" placeholder="https://example.com/username">
                        </div>
                        <button id="addManualAccountBtn" class="add-btn">添加账号</button>
                    </div>
                    <div class="import-actions">
                        <button id="importAccountsBtn">确认导入</button>
                        <button id="cancelImportAccountsBtn">取消</button>
                    </div>
                </div>
            `;
            
            showImportModal(importHtml, 'accounts');
        } else if (importType === 'bookmarks') {
            // 收藏夹导入功能
            const importHtml = `
                <div class="import-modal">
                    <h3>导入收藏夹</h3>
                    <div class="import-instructions">
                        <p>您可以从浏览器收藏夹导入，或手动添加重要链接：</p>
                    </div>
                    <div class="import-options-list">
                        <div class="import-option-item" data-type="tech">
                            <i>💻</i> 技术网站
                        </div>
                        <div class="import-option-item" data-type="design">
                            <i>🎨</i> 设计资源
                        </div>
                        <div class="import-option-item" data-type="course">
                            <i>🎓</i> 在线课程
                        </div>
                        <div class="import-option-item" data-type="tool">
                            <i>🛠️</i> 实用工具
                        </div>
                    </div>
                    <div class="import-manual">
                        <h4>手动添加收藏</h4>
                        <div class="form-group">
                            <label>标题</label>
                            <input type="text" id="manualBookmarkTitle" placeholder="网站标题">
                        </div>
                        <div class="form-group">
                            <label>链接</label>
                            <input type="text" id="manualBookmarkUrl" placeholder="https://example.com">
                        </div>
                        <div class="form-group">
                            <label>分类</label>
                            <select id="manualBookmarkCategory">
                                <option value="技术">技术</option>
                                <option value="设计">设计</option>
                                <option value="产品">产品</option>
                                <option value="管理">管理</option>
                                <option value="其他">其他</option>
                            </select>
                        </div>
                        <button id="addManualBookmarkBtn" class="add-btn">添加收藏</button>
                    </div>
                    <div class="import-actions">
                        <button id="importBookmarksBtn">确认导入</button>
                        <button id="cancelImportBookmarksBtn">取消</button>
                    </div>
                </div>
            `;
            
            showImportModal(importHtml, 'bookmarks');
        }
    }

    // 更新处理网站导入事件函数，添加保存到服务器的功能
    async function handleWebsiteImportEvents(overlay) {
        const optionItems = overlay.querySelectorAll('.import-option-item');
        optionItems.forEach(item => {
            item.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                let siteData = {};
                
                switch(type) {
                    case 'github':
                        siteData = { name: 'GitHub', url: 'https://github.com/username', description: '代码托管和个人作品展示' };
                        break;
                    case 'linkedin':
                        siteData = { name: 'LinkedIn', url: 'https://linkedin.com/in/username', description: '职业社交网络' };
                        break;
                    case 'blog':
                        siteData = { name: '个人博客', url: 'https://blog.example.com', description: '技术分享和个人见解' };
                        break;
                    case 'portfolio':
                        siteData = { name: '作品集', url: 'https://portfolio.example.com', description: '个人项目和作品展示' };
                        break;
                }
                
                // 将数据添加到临时存储
                if (!window.temporaryImportData) window.temporaryImportData = [];
                window.temporaryImportData.push(siteData);
                
                // 高亮选中的项目
                this.classList.toggle('selected');
            });
        });
        
        // 添加手动输入网站事件
        document.getElementById('addManualSiteBtn')?.addEventListener('click', function() {
            const name = document.getElementById('manualSiteName').value;
            const url = document.getElementById('manualSiteUrl').value;
            const desc = document.getElementById('manualSiteDesc').value;
            
            if (name && url) {
                const siteData = { name, url, description: desc || '个人网站' };
                
                // 将数据添加到临时存储
                if (!window.temporaryImportData) window.temporaryImportData = [];
                window.temporaryImportData.push(siteData);
                
                // 清空输入框
                document.getElementById('manualSiteName').value = '';
                document.getElementById('manualSiteUrl').value = '';
                document.getElementById('manualSiteDesc').value = '';
                
                alert('网站已添加到导入列表');
            } else {
                alert('请填写网站名称和链接');
            }
        });
        
        // 导入确认事件
        document.getElementById('importSitesBtn')?.addEventListener('click', async function() {
            if (window.temporaryImportData && window.temporaryImportData.length > 0) {
                try {
                    // 保存到服务器
                    const response = await fetch('/api/user-data/websites', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(window.temporaryImportData)
                    });
                    
                    if (!response.ok) {
                        throw new Error(`保存网站信息失败: ${response.status}`);
                    }
                    
                    const result = await response.json();
                    addMessage(`已导入 ${window.temporaryImportData.length} 个网站信息`, false);
                    
                    // 清空临时数据
                    window.temporaryImportData = [];
                    
                    overlay.remove();
                } catch (error) {
                    console.error('保存网站信息时出错:', error);
                    alert('保存网站信息时出错，请稍后重试。');
                }
            } else {
                alert('请先选择或添加要导入的网站');
            }
        });
    }

    // 更新处理账号导入事件函数，添加保存到服务器的功能
    async function handleAccountImportEvents(overlay) {
        const optionItems = overlay.querySelectorAll('.import-option-item');
        optionItems.forEach(item => {
            item.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                let accountData = {};
                
                switch(type) {
                    case 'github':
                        accountData = { platform: 'GitHub', username: 'username', url: 'https://github.com/username' };
                        break;
                    case 'stackoverflow':
                        accountData = { platform: 'Stack Overflow', username: 'username', url: 'https://stackoverflow.com/users/username' };
                        break;
                    case 'linkedin':
                        accountData = { platform: 'LinkedIn', username: 'username', url: 'https://linkedin.com/in/username' };
                        break;
                    case 'dribbble':
                        accountData = { platform: 'Dribbble', username: 'username', url: 'https://dribbble.com/username' };
                        break;
                }
                
                // 将数据添加到临时存储
                if (!window.temporaryImportData) window.temporaryImportData = [];
                window.temporaryImportData.push(accountData);
                
                // 高亮选中的项目
                this.classList.toggle('selected');
            });
        });
        
        // 添加手动输入账号事件
        document.getElementById('addManualAccountBtn')?.addEventListener('click', function() {
            const platform = document.getElementById('manualAccountPlatform').value;
            const username = document.getElementById('manualAccountUsername').value;
            const url = document.getElementById('manualAccountUrl').value;
            
            if (platform && username) {
                const accountData = { platform, username, url: url || '' };
                
                // 将数据添加到临时存储
                if (!window.temporaryImportData) window.temporaryImportData = [];
                window.temporaryImportData.push(accountData);
                
                // 清空输入框
                document.getElementById('manualAccountPlatform').value = '';
                document.getElementById('manualAccountUsername').value = '';
                document.getElementById('manualAccountUrl').value = '';
                
                alert('账号已添加到导入列表');
            } else {
                alert('请填写平台名称和用户名');
            }
        });
        
        // 导入确认事件
        document.getElementById('importAccountsBtn')?.addEventListener('click', async function() {
            if (window.temporaryImportData && window.temporaryImportData.length > 0) {
                try {
                    // 保存到服务器
                    const response = await fetch('/api/user-data/accounts', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(window.temporaryImportData)
                    });
                    
                    if (!response.ok) {
                        throw new Error(`保存账号信息失败: ${response.status}`);
                    }
                    
                    const result = await response.json();
                    addMessage(`已导入 ${window.temporaryImportData.length} 个专业账号`, false);
                    
                    // 清空临时数据
                    window.temporaryImportData = [];
                    
                    overlay.remove();
                } catch (error) {
                    console.error('保存账号信息时出错:', error);
                    alert('保存账号信息时出错，请稍后重试。');
                }
            } else {
                alert('请先选择或添加要导入的账号');
            }
        });
    }

    // 更新处理收藏夹导入事件函数，添加保存到服务器的功能
    async function handleBookmarkImportEvents(overlay) {
        const optionItems = overlay.querySelectorAll('.import-option-item');
        optionItems.forEach(item => {
            item.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                let bookmarkData = {};
                
                switch(type) {
                    case 'tech':
                        bookmarkData = { title: '技术参考网站', url: 'https://example.com', category: '技术' };
                        break;
                    case 'design':
                        bookmarkData = { title: '设计灵感网站', url: 'https://example.com', category: '设计' };
                        break;
                    case 'course':
                        bookmarkData = { title: '在线学习课程', url: 'https://example.com', category: '学习' };
                        break;
                    case 'tool':
                        bookmarkData = { title: '实用工具网站', url: 'https://example.com', category: '工具' };
                        break;
                }
                
                // 将数据添加到临时存储
                if (!window.temporaryImportData) window.temporaryImportData = [];
                window.temporaryImportData.push(bookmarkData);
                
                // 高亮选中的项目
                this.classList.toggle('selected');
            });
        });
        
        // 添加手动输入收藏事件
        document.getElementById('addManualBookmarkBtn')?.addEventListener('click', function() {
            const title = document.getElementById('manualBookmarkTitle').value;
            const url = document.getElementById('manualBookmarkUrl').value;
            const category = document.getElementById('manualBookmarkCategory').value;
            
            if (title && url) {
                const bookmarkData = { title, url, category };
                
                // 将数据添加到临时存储
                if (!window.temporaryImportData) window.temporaryImportData = [];
                window.temporaryImportData.push(bookmarkData);
                
                // 清空输入框
                document.getElementById('manualBookmarkTitle').value = '';
                document.getElementById('manualBookmarkUrl').value = '';
                
                alert('收藏已添加到导入列表');
            } else {
                alert('请填写标题和链接');
            }
        });
        
        // 导入确认事件
        document.getElementById('importBookmarksBtn')?.addEventListener('click', async function() {
            if (window.temporaryImportData && window.temporaryImportData.length > 0) {
                try {
                    // 保存到服务器
                    const response = await fetch('/api/user-data/bookmarks', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(window.temporaryImportData)
                    });
                    
                    if (!response.ok) {
                        throw new Error(`保存收藏信息失败: ${response.status}`);
                    }
                    
                    const result = await response.json();
                    addMessage(`已导入 ${window.temporaryImportData.length} 个参考资料`, false);
                    
                    // 清空临时数据
                    window.temporaryImportData = [];
                    
                    overlay.remove();
                } catch (error) {
                    console.error('保存收藏信息时出错:', error);
                    alert('保存收藏信息时出错，请稍后重试。');
                }
            } else {
                alert('请先选择或添加要导入的收藏');
            }
        });
    }

    // 显示导入模态框
    function showImportModal(content, importType) {
        // 创建模态框覆盖层
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = content;
        document.body.appendChild(overlay);
        
        // 添加事件监听器
        if (importType === 'websites') {
            handleWebsiteImportEvents(overlay);
        } else if (importType === 'accounts') {
            handleAccountImportEvents(overlay);
        } else if (importType === 'bookmarks') {
            handleBookmarkImportEvents(overlay);
        }
        
        // 通用取消事件
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        
        document.getElementById('cancelImportBtn')?.addEventListener('click', function() {
            overlay.remove();
        });
        document.getElementById('cancelImportAccountsBtn')?.addEventListener('click', function() {
            overlay.remove();
        });
        document.getElementById('cancelImportBookmarksBtn')?.addEventListener('click', function() {
            overlay.remove();
        });
    }

    // 处理网站导入事件
    function handleWebsiteImportEvents(overlay) {
        const optionItems = overlay.querySelectorAll('.import-option-item');
        optionItems.forEach(item => {
            item.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                let siteData = {};
                
                switch(type) {
                    case 'github':
                        siteData = { name: 'GitHub', url: 'https://github.com/username', description: '代码托管和个人作品展示' };
                        break;
                    case 'linkedin':
                        siteData = { name: 'LinkedIn', url: 'https://linkedin.com/in/username', description: '职业社交网络' };
                        break;
                    case 'blog':
                        siteData = { name: '个人博客', url: 'https://blog.example.com', description: '技术分享和个人见解' };
                        break;
                    case 'portfolio':
                        siteData = { name: '作品集', url: 'https://portfolio.example.com', description: '个人项目和作品展示' };
                        break;
                }
                
                // 将数据添加到临时存储
                if (!window.temporaryImportData) window.temporaryImportData = [];
                window.temporaryImportData.push(siteData);
                
                // 高亮选中的项目
                this.classList.toggle('selected');
            });
        });
        
        // 添加手动输入网站事件
        document.getElementById('addManualSiteBtn')?.addEventListener('click', function() {
            const name = document.getElementById('manualSiteName').value;
            const url = document.getElementById('manualSiteUrl').value;
            const desc = document.getElementById('manualSiteDesc').value;
            
            if (name && url) {
                const siteData = { name, url, description: desc || '个人网站' };
                
                // 将数据添加到临时存储
                if (!window.temporaryImportData) window.temporaryImportData = [];
                window.temporaryImportData.push(siteData);
                
                // 清空输入框
                document.getElementById('manualSiteName').value = '';
                document.getElementById('manualSiteUrl').value = '';
                document.getElementById('manualSiteDesc').value = '';
                
                alert('网站已添加到导入列表');
            } else {
                alert('请填写网站名称和链接');
            }
        });
        
        // 导入确认事件
        document.getElementById('importSitesBtn')?.addEventListener('click', function() {
            if (window.temporaryImportData && window.temporaryImportData.length > 0) {
                let websitesText = '个人网站/社交媒体:\n';
                window.temporaryImportData.forEach(site => {
                    websitesText += `- ${site.name}: ${site.url} (${site.description})\n`;
                });
                
                fillResumeForm({ links: websitesText });
                addMessage(`已导入 ${window.temporaryImportData.length} 个网站信息`, false);
                
                // 清空临时数据
                window.temporaryImportData = [];
                
                overlay.remove();
            } else {
                alert('请先选择或添加要导入的网站');
            }
        });
    }

    // 处理账号导入事件
    function handleAccountImportEvents(overlay) {
        const optionItems = overlay.querySelectorAll('.import-option-item');
        optionItems.forEach(item => {
            item.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                let accountData = {};
                
                switch(type) {
                    case 'github':
                        accountData = { platform: 'GitHub', username: 'username', url: 'https://github.com/username' };
                        break;
                    case 'stackoverflow':
                        accountData = { platform: 'Stack Overflow', username: 'username', url: 'https://stackoverflow.com/users/username' };
                        break;
                    case 'linkedin':
                        accountData = { platform: 'LinkedIn', username: 'username', url: 'https://linkedin.com/in/username' };
                        break;
                    case 'dribbble':
                        accountData = { platform: 'Dribbble', username: 'username', url: 'https://dribbble.com/username' };
                        break;
                }
                
                // 将数据添加到临时存储
                if (!window.temporaryImportData) window.temporaryImportData = [];
                window.temporaryImportData.push(accountData);
                
                // 高亮选中的项目
                this.classList.toggle('selected');
            });
        });
        
        // 添加手动输入账号事件
        document.getElementById('addManualAccountBtn')?.addEventListener('click', function() {
            const platform = document.getElementById('manualAccountPlatform').value;
            const username = document.getElementById('manualAccountUsername').value;
            const url = document.getElementById('manualAccountUrl').value;
            
            if (platform && username) {
                const accountData = { platform, username, url: url || '' };
                
                // 将数据添加到临时存储
                if (!window.temporaryImportData) window.temporaryImportData = [];
                window.temporaryImportData.push(accountData);
                
                // 清空输入框
                document.getElementById('manualAccountPlatform').value = '';
                document.getElementById('manualAccountUsername').value = '';
                document.getElementById('manualAccountUrl').value = '';
                
                alert('账号已添加到导入列表');
            } else {
                alert('请填写平台名称和用户名');
            }
        });
        
        // 导入确认事件
        document.getElementById('importAccountsBtn')?.addEventListener('click', function() {
            if (window.temporaryImportData && window.temporaryImportData.length > 0) {
                let accountsText = '专业账号:\n';
                window.temporaryImportData.forEach(acc => {
                    const urlPart = acc.url ? ` - ${acc.url}` : '';

                    accountsText += `- ${acc.platform}: ${acc.username}${urlPart}\n`;
                });
                
                fillResumeForm({ profiles: accountsText });
                addMessage(`已导入 ${window.temporaryImportData.length} 个专业账号`, false);
                
                // 清空临时数据
                window.temporaryImportData = [];
                
                overlay.remove();
            } else {
                alert('请先选择或添加要导入的账号');
            }
        });
    }

    // 处理收藏夹导入事件
    function handleBookmarkImportEvents(overlay) {
        const optionItems = overlay.querySelectorAll('.import-option-item');
        optionItems.forEach(item => {
            item.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                let bookmarkData = {};
                
                switch(type) {
                    case 'tech':
                        bookmarkData = { title: '技术参考网站', url: 'https://example.com', category: '技术' };
                        break;
                    case 'design':
                        bookmarkData = { title: '设计灵感网站', url: 'https://example.com', category: '设计' };
                        break;
                    case 'course':
                        bookmarkData = { title: '在线学习课程', url: 'https://example.com', category: '学习' };
                        break;
                    case 'tool':
                        bookmarkData = { title: '实用工具网站', url: 'https://example.com', category: '工具' };
                        break;
                }
                
                // 将数据添加到临时存储
                if (!window.temporaryImportData) window.temporaryImportData = [];
                window.temporaryImportData.push(bookmarkData);
                
                // 高亮选中的项目
                this.classList.toggle('selected');
            });
        });
        
        // 添加手动输入收藏事件
        document.getElementById('addManualBookmarkBtn')?.addEventListener('click', function() {
            const title = document.getElementById('manualBookmarkTitle').value;
            const url = document.getElementById('manualBookmarkUrl').value;
            const category = document.getElementById('manualBookmarkCategory').value;
            
            if (title && url) {
                const bookmarkData = { title, url, category };
                
                // 将数据添加到临时存储
                if (!window.temporaryImportData) window.temporaryImportData = [];
                window.temporaryImportData.push(bookmarkData);
                
                // 清空输入框
                document.getElementById('manualBookmarkTitle').value = '';
                document.getElementById('manualBookmarkUrl').value = '';
                
                alert('收藏已添加到导入列表');
            } else {
                alert('请填写标题和链接');
            }
        });
        
        // 导入确认事件
        document.getElementById('importBookmarksBtn')?.addEventListener('click', function() {
            if (window.temporaryImportData && window.temporaryImportData.length > 0) {
                let bookmarksText = '重要参考资料:\n';
                window.temporaryImportData.forEach(bm => {
                    bookmarksText += `- [${bm.category}] ${bm.title}: ${bm.url}\n`;
                });
                
                fillResumeForm({ resources: bookmarksText });
                addMessage(`已导入 ${window.temporaryImportData.length} 个参考资料`, false);
                
                // 清空临时数据
                window.temporaryImportData = [];
                
                overlay.remove();
            } else {
                alert('请先选择或添加要导入的收藏');
            }
        });
    }

    // 填充简历表单
    function fillResumeForm(data) {
        if (document.querySelector('.resume-builder')) {
            Object.keys(data).forEach(key => {
                const field = document.getElementById(key);
                if (field) {
                    if (field.value) {
                        field.value += '\n' + data[key]; // 如果已有内容则追加
                    } else {
                        field.value = data[key]; // 否则直接填充
                    }
                }
            });
        } else {
            // 如果当前不在简历生成器界面，则提示用户切换
            if (confirm('需要切换到简历生成界面才能导入数据，是否现在切换？')) {
                // 显示简历生成器
                showResumeBuilder();
                // 延迟填充数据
                setTimeout(() => {
                    Object.keys(data).forEach(key => {
                        const field = document.getElementById(key);
                        if (field) {
                            if (field.value) {
                                field.value += '\n' + data[key];
                            } else {
                                field.value = data[key];
                            }
                        }
                    });
                }, 300);
            }
        }
    }
    
    // 获取导入类型名称
    function getImportTypeName(type) {
        switch(type) {
            case 'profile': return '个人资料';
            case 'education': return '教育经历';
            case 'work': return '工作经验';
            default: return '资料';
        }
    }

    // 导航菜单功能
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有活动状态
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // 为当前点击的项目添加活动状态
            this.classList.add('active');
            
            // 根据点击的菜单项执行不同操作
            const navText = this.querySelector('span').textContent.trim();
            if (navText === '对话') {
                // 保持当前对话界面
                if (messagesContainer.querySelector('.note-area') || 
                    messagesContainer.querySelector('.data-area') ||
                    messagesContainer.querySelector('.resume-builder') ||
                    messagesContainer.querySelector('.profile-editor')) {
                    // 如果当前在其他界面，则返回到对话界面
                    messagesContainer.innerHTML = '';
                    const messages = document.querySelectorAll('.message');
                    if (messages.length === 0) {
                        // 如果没有消息，显示欢迎消息
                        addMessage('哈喽！很荣幸能以这样的方式与你交流\n我是智能助手，一个专门为您提供帮助的AI助手。\n\n如果您需要创作方面的帮助，我可以提供各种内容创作和策划建议！', false);
                    }
                }
            } else if (navText === '笔记') {
                // 创建笔记界面
                messagesContainer.innerHTML = '<div class="note-area"><h3>笔记区域</h3><p>您可以在这里记录重要的信息和想法。</p><textarea placeholder="输入您的笔记..." style="width:100%; height:300px; padding:10px; margin-top:10px; border:1px solid #ddd; border-radius:4px;"></textarea></div>';
            } else if (navText === '简历') {
                // 显示简历生成器
                showResumeBuilder();
            } else if (navText === '设置') {
                // 打开设置界面
                settingsBtn.click();
            }
        });
    });

    // 为输入区域添加事件监听器
    const inputArea = document.querySelector('.input-area');
    if (inputArea) {
        // 添加一个发送按钮到输入区域
        const sendBtn = document.createElement('button');
        sendBtn.id = 'sendBtn';
        sendBtn.textContent = '发送';
        sendBtn.style.padding = '8px 16px';
        sendBtn.style.border = 'none';
        sendBtn.style.borderRadius = '6px';
        sendBtn.style.backgroundColor = '#FF4D6D';
        sendBtn.style.color = 'white';
        sendBtn.style.cursor = 'pointer';
        sendBtn.style.fontSize = '14px';
        sendBtn.style.fontWeight = '500';
        
        inputArea.appendChild(sendBtn);
        
        // 添加发送按钮事件
        sendBtn.addEventListener('click', sendMessage);
        
        // 为输入框添加Enter键事件
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    newChatBtn.addEventListener('click', function() {
        if (confirm('您确定要开始新的对话吗？这将清除当前聊天记录。')) {
            messagesContainer.innerHTML = '';
            addMessage('哈喽！很荣幸能以这样的方式与你交流\n我是智能助手，一个专门为您提供帮助的AI助手。\n\n如果您需要创作方面的帮助，我可以提供各种内容创作和策划建议！', false);
        }
    });

    historyBtn.addEventListener('click', function() {
        // 创建一个简单的对话历史模态框
        const historyHtml = `
            <div class="modal-overlay">
                <div class="modal-content history-modal">
                    <h3>对话历史</h3>
                    <div class="history-list">
                        <div class="history-item">
                            <div class="history-title">项目讨论</div>
                            <div class="history-date">2026-03-14 10:30</div>
                            <div class="history-preview">关于项目的下一步计划...</div>
                        </div>
                        <div class="history-item">
                            <div class="history-title">技术问题</div>
                            <div class="history-date">2026-03-14 09:15</div>
                            <div class="history-preview">JavaScript错误修复...</div>
                        </div>
                        <div class="history-item">
                            <div class="history-title">日常闲聊</div>
                            <div class="history-date">2026-03-13 16:45</div>
                            <div class="history-preview">今天天气如何？...</div>
                        </div>
                    </div>
                    <div class="modal-buttons">
                        <button id="loadHistory">加载选中项</button>
                        <button id="closeHistory">关闭</button>
                    </div>
                </div>
            </div>
        `;
        
        // 添加历史模态框到页面
        document.body.insertAdjacentHTML('beforeend', historyHtml);
        
        // 添加模态框事件监听器
        document.getElementById('closeHistory').addEventListener('click', function() {
            document.querySelector('.modal-overlay').remove();
        });
        
        document.getElementById('loadHistory').addEventListener('click', function() {
            alert('功能演示：将加载选中的对话历史');
            document.querySelector('.modal-overlay').remove();
        });
        
        // 点击模态框外部关闭
        document.querySelector('.modal-overlay').addEventListener('click', function(e) {
            if (e.target === this) {
                this.remove();
            }
        });
    });

    settingsBtn.addEventListener('click', function() {
        // 获取当前风格设置
        fetch('/api/agent-styles')
            .then(response => response.json())
            .then(data => {
                const currentStyle = data.currentStyle;
                const styles = data.styles;
                
                // 创建一个包含风格设置的设置模态框
                let stylesOptions = '';
                for (const [id, style] of Object.entries(styles)) {
                    stylesOptions += `<option value="${id}" ${id === currentStyle ? 'selected' : ''}>${style.name} - ${style.description}</option>`;
                }
                
                const settingsHtml = `
                    <div class="modal-overlay">
                        <div class="modal-content" style="max-width: 600px;">
                            <h3>设置</h3>
                            <div class="setting-item">
                                <label>智能体名称:</label>
                                <input type="text" id="agentName" value="智能助手" />
                            </div>
                            <div class="setting-item">
                                <label>响应速度:</label>
                                <select id="responseSpeed">
                                    <option value="fast">快速</option>
                                    <option value="normal" selected>正常</option>
                                    <option value="slow">慢速</option>
                                </select>
                            </div>
                            <div class="setting-item">
                                <label>智能体风格:</label>
                                <select id="agentStyle">
                                    ${stylesOptions}
                                </select>
                            </div>
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="enableSounds" checked> 启用声音提示
                                </label>
                            </div>
                            <div class="setting-item">
                                <button id="openCustomStyleBtn" style="background-color: #4a6cf7; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">自定义风格</button>
                            </div>
                            <div class="modal-buttons">
                                <button id="saveSettings">保存</button>
                                <button id="closeSettings">关闭</button>
                            </div>
                        </div>
                    </div>
                `;
                
                // 添加设置模态框到页面
                document.body.insertAdjacentHTML('beforeend', settingsHtml);
                
                // 添加模态框事件监听器
                document.getElementById('closeSettings').addEventListener('click', function() {
                    document.querySelector('.modal-overlay').remove();
                });
                
                document.getElementById('saveSettings').addEventListener('click', function() {
                    const agentName = document.getElementById('agentName').value;
                    const responseSpeed = document.getElementById('responseSpeed').value;
                    const selectedStyle = document.getElementById('agentStyle').value;
                    
                    // 保存风格设置
                    fetch('/api/agent-style', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ styleId: selectedStyle })
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            workspaceName.textContent = `${agentName} · 智能助手`;
                            alert(`设置已保存！\n智能体名称: ${agentName}\n响应速度: ${responseSpeed}\n当前风格: ${styles[selectedStyle].name}`);
                            document.querySelector('.modal-overlay').remove();
                        } else {
                            alert('保存风格设置时出错');
                        }
                    })
                    .catch(error => {
                        console.error('保存风格设置时出错:', error);
                        alert('保存风格设置时出错');
                    });
                });
                
                // 自定义风格按钮事件
                document.getElementById('openCustomStyleBtn').addEventListener('click', function() {
                    showCustomStyleEditor();
                });
                
                // 点击模态框外部关闭
                document.querySelector('.modal-overlay').addEventListener('click', function(e) {
                    if (e.target === this) {
                        this.remove();
                    }
                });
            })
            .catch(error => {
                console.error('获取风格设置时出错:', error);
                alert('获取风格设置时出错');
            });
    });

    // 显示自定义风格编辑器
    function showCustomStyleEditor() {
        // 首先获取当前所有风格
        fetch('/api/agent-styles')
            .then(response => response.json())
            .then(data => {
                const styles = data.styles;
                
                // 创建自定义风格编辑界面
                const customStyleHtml = `
                    <div class="modal-overlay">
                        <div class="modal-content custom-style-editor" style="max-width: 900px; max-height: 85vh; overflow: hidden;">
                            <div class="custom-style-header">
                                <h3>自定义智能体风格</h3>
                                <button id="closeCustomStyleBtn" class="close-btn" title="关闭">×</button>
                            </div>
                            <div class="custom-style-body" style="overflow-y: auto; max-height: calc(85vh - 120px); padding-right: 10px;">
                                <div class="setting-item">
                                    <label>风格ID (用于标识，如: my_custom_style):</label>
                                    <input type="text" id="customStyleId" placeholder="例如: my_custom_style" />
                                </div>
                                
                                <div class="setting-item">
                                    <label>风格名称:</label>
                                    <input type="text" id="customStyleName" placeholder="例如: 我的自定义风格" />
                                </div>
                                
                                <div class="setting-item">
                                    <label>风格描述:</label>
                                    <input type="text" id="customStyleDescription" placeholder="简要描述此风格的特点" />
                                </div>
                                
                                <div class="setting-item">
                                    <label>问候语:</label>
                                    <textarea id="customGreeting" placeholder="当用户问候时的回复">${styles.default.responses.greeting}</textarea>
                                </div>
                                
                                <div class="setting-item">
                                    <label>自我介绍:</label>
                                    <textarea id="customName" placeholder="如何介绍自己">${styles.default.responses.name}</textarea>
                                </div>
                                
                                <div class="setting-item">
                                    <label>告别语:</label>
                                    <textarea id="customFarewell" placeholder="告别时的回复">${styles.default.responses.farewell}</textarea>
                                </div>
                                
                                <div class="setting-item">
                                    <label>帮助说明:</label>
                                    <textarea id="customHelp" placeholder="提供帮助时的说明">${styles.default.responses.help}</textarea>
                                </div>
                                
                                <div class="setting-item">
                                    <label>简短问题回复:</label>
                                    <textarea id="customShortQuery" placeholder="对简短问题的回复">${styles.default.responses.shortQuery}</textarea>
                                </div>
                                
                                <div class="setting-item">
                                    <label>中等问题回复:</label>
                                    <textarea id="customMediumQuery" placeholder="对中等长度问题的回复">${styles.default.responses.mediumQuery}</textarea>
                                </div>
                                
                                <div class="setting-item">
                                    <label>详细问题回复:</label>
                                    <textarea id="customLongQuery" placeholder="对详细问题的回复">${styles.default.responses.longQuery}</textarea>
                                </div>
                                
                                <div class="setting-item">
                                    <label>简历介绍:</label>
                                    <textarea id="customResumeIntro" placeholder="介绍简历功能时的回复">${styles.default.responses.resumeIntro}</textarea>
                                </div>
                                
                                <div class="setting-item">
                                    <label>简历帮助:</label>
                                    <textarea id="customResumeHelp" placeholder="提供简历帮助时的回复">${styles.default.responses.resumeHelp}</textarea>
                                </div>
                            </div>
                            <div class="custom-style-footer">
                                <div class="modal-buttons">
                                    <button id="saveCustomStyle">保存自定义风格</button>
                                    <button id="closeCustomStyleEditor">返回</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                // 替换当前模态框内容
                document.querySelector('.modal-overlay').outerHTML = customStyleHtml;
                
                // 添加事件监听器
                document.getElementById('closeCustomStyleBtn').addEventListener('click', function() {
                    // 移除模态框
                    document.querySelector('.modal-overlay').remove();
                });
                
                document.getElementById('closeCustomStyleEditor').addEventListener('click', function() {
                    // 重新打开设置界面
                    settingsBtn.click();
                });
                
                document.getElementById('saveCustomStyle').addEventListener('click', function() {
                    const styleId = document.getElementById('customStyleId').value;
                    const name = document.getElementById('customStyleName').value;
                    const description = document.getElementById('customStyleDescription').value;
                    
                    if (!styleId || !name) {
                        alert('请填写风格ID和名称');
                        return;
                    }
                    
                    const responses = {
                        greeting: document.getElementById('customGreeting').value || styles.default.responses.greeting,
                        name: document.getElementById('customName').value || styles.default.responses.name,
                        farewell: document.getElementById('customFarewell').value || styles.default.responses.farewell,
                        help: document.getElementById('customHelp').value || styles.default.responses.help,
                        shortQuery: document.getElementById('customShortQuery').value || styles.default.responses.shortQuery,
                        mediumQuery: document.getElementById('customMediumQuery').value || styles.default.responses.mediumQuery,
                        longQuery: document.getElementById('customLongQuery').value || styles.default.responses.longQuery,
                        resumeIntro: document.getElementById('customResumeIntro').value || styles.default.responses.resumeIntro,
                        resumeHelp: document.getElementById('customResumeHelp').value || styles.default.responses.resumeHelp
                    };
                    
                    // 保存自定义风格
                    fetch('/api/custom-agent-style', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ styleId, name, description, responses })
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            alert('自定义风格已保存！现在可以在设置中选择使用它。');
                            // 重新打开设置界面以显示新风格
                            setTimeout(() => {
                                settingsBtn.click();
                            }, 500);
                        } else {
                            alert('保存自定义风格时出错: ' + result.message);
                        }
                    })
                    .catch(error => {
                        console.error('保存自定义风格时出错:', error);
                        alert('保存自定义风格时出错');
                    });
                });
                
                // 点击模态框外部关闭
                document.querySelector('.modal-overlay').addEventListener('click', function(e) {
                    if (e.target === this) {
                        this.remove();
                    }
                });
            })
            .catch(error => {
                console.error('获取风格数据时出错:', error);
                alert('获取风格数据时出错');
            });
    }

    // 初始化欢迎消息
    // 首先获取当前风格并使用对应欢迎消息
    fetch('/api/agent-styles')
        .then(response => response.json())
        .then(data => {
            const currentStyle = data.styles[data.currentStyle] || data.styles.default;
            addMessage(currentStyle.responses.greeting + '\n\n您还可以通过左侧的"导入资料"功能导入个人资料，然后让我帮您创建专业的简历！', false);
        })
        .catch(() => {
            // 如果获取风格失败，使用默认消息
            addMessage('您好！我是智能助手，很高兴为您服务。我可以帮助您回答问题、提供信息或协助处理各种任务。\n\n特别地，如果您需要求职方面的帮助，我还可以帮您创建专业的简历！请告诉我您需要什么帮助，我会尽力为您服务。\n\n您还可以通过左侧的"导入资料"功能导入个人资料，然后让我帮您创建专业的简历！', false);
        });
    
    // 初始化状态为在线
    statusText.textContent = 'ONLINE';
    statusText.style.color = '#FF4D6D';
});