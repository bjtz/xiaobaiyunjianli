# 大模型接口文档

本文档说明本项目中与大模型相关的接口，包括前端可调用接口和服务端上游模型调用方式。

## 1) 聊天接口

- 方法: `POST`
- 路径: `/api/chat`
- 说明: 通用对话接口，支持携带本地资料上下文。

### 请求体

```json
{
  "messages": [
    { "role": "user", "content": "请根据我的资料优化简历" }
  ],
  "localContext": "姓名: 张三\n学历: 本科\n技能: JavaScript, Vue"
}
```

### 成功响应

```json
{
  "response": "这是模型返回的对话内容"
}
```

### 失败响应

```json
{
  "error": "请求失败，请检查API配置",
  "fallback": "本地兜底回复内容"
}
```

### curl 示例

```bash
curl -X POST "http://localhost:3001/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "messages":[{"role":"user","content":"请帮我完善简历"}],
    "localContext":"姓名: 张三, 求职方向: 前端开发"
  }'
```

---

## 2) 简历扩写接口

- 方法: `POST`
- 路径: `/api/expand-resume`
- 说明: 根据输入信息和本地资料进行结构化简历扩写。

### 请求体

```json
{
  "message": "请扩写我的项目经历并突出结果",
  "localContext": "项目: 电商后台\n职责: 前端开发\n成果: 性能提升30%"
}
```

### 成功响应

```json
{
  "success": true,
  "response": "扩写后的简历内容"
}
```

### 失败响应

```json
{
  "success": false,
  "error": "扩写失败，请检查API配置",
  "fallback": "本地兜底扩写内容"
}
```

### curl 示例

```bash
curl -X POST "http://localhost:3001/api/expand-resume" \
  -H "Content-Type: application/json" \
  -d '{
    "message":"请按STAR法则扩写这段经历",
    "localContext":"实习公司: XX科技, 岗位: 前端实习生"
  }'
```

---

## 3) 健康检查接口

- 方法: `GET`
- 路径: `/api/health`
- 说明: 查看服务状态和当前模型提供方。

### 成功响应

```json
{
  "status": "ok",
  "hasApiKey": true,
  "currentProvider": "zhipuai"
}
```

`currentProvider` 可能值:

- `zhipuai`
- `openai`
- `local`

### curl 示例

```bash
curl "http://localhost:3001/api/health"
```

---

## 4) 服务端上游大模型调用

服务端内部会按优先级调用上游模型接口:

1. 智谱 AI
2. OpenAI
3. 本地兜底回复

### 4.1 智谱 AI (ZhipuAI)

- URL: `${ZHIPUAI_API_BASE}/chat/completions`
- 默认 `ZHIPUAI_API_BASE`: `https://open.bigmodel.cn/api/paas/v4`
- Header:
  - `Content-Type: application/json`
  - `Authorization: Bearer ${ZHIPUAI_API_KEY}`
- 请求体关键字段:
  - `model`
  - `messages`
  - `temperature`
  - `max_tokens`

### 4.2 OpenAI

- URL: `${OPENAI_API_BASE}/chat/completions`
- 默认 `OPENAI_API_BASE`: `https://api.openai.com/v1`
- Header:
  - `Content-Type: application/json`
  - `Authorization: Bearer ${OPENAI_API_KEY}`
- 请求体关键字段:
  - `model`
  - `messages`
  - `temperature`
  - `max_tokens`

---

## 5) 环境变量配置

可参考 `.env.example`:

- `ZHIPUAI_API_KEY`
- `ZHIPUAI_API_BASE` (可选)
- `ZHIPUAI_MODEL` (默认 `glm-4`)
- `OPENAI_API_KEY`
- `OPENAI_API_BASE` (可选，默认 `https://api.openai.com/v1`)
- `OPENAI_MODEL` (默认 `gpt-3.5-turbo`)

示例:

```env
ZHIPUAI_API_KEY=your_zhipuai_api_key_here
ZHIPUAI_API_BASE=https://open.bigmodel.cn/api/paas/v4
ZHIPUAI_MODEL=glm-4
```

---

## 6) 调用顺序与兜底逻辑

- 若已配置 `ZHIPUAI_API_KEY`，优先调用智谱。
- 否则若已配置 `OPENAI_API_KEY`，调用 OpenAI。
- 两者都未配置时，返回本地兜底内容，保证接口可用性。
