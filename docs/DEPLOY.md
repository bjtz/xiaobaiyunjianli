# 部署说明

## 目录

- [环境要求](#环境要求)
- [开发环境部署](#开发环境部署)
- [生产环境部署](#生产环境部署)
- [常见问题](#常见问题)

---

## 环境要求

### 必需软件

- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0 或 **yarn**: >= 1.22.0

### 可选软件

- **Git**: 用于版本控制
- **VS Code**: 推荐的开发编辑器

---

## 开发环境部署

### 1. 克隆或下载项目

```bash
# 如果使用Git
git clone <repository-url>
cd iflowdeznt

# 或者直接下载项目压缩包并解压
```

### 2. 安装依赖

```bash
# 使用npm
npm install

# 或者使用yarn
yarn install
```

### 3. 启动开发服务器

```bash
# 使用npm
npm run dev

# 或者使用yarn
yarn dev
```

开发服务器启动后，控制台会显示类似以下信息：

```
  VITE vx.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

### 4. 访问应用

在浏览器中打开显示的本地地址（通常是 http://localhost:5173/）

### 开发服务器特性

- **热模块替换 (HMR)**: 代码修改后自动刷新页面
- **网络访问**: 可通过局域网IP访问（便于在手机上测试）
- **错误提示**: 实时显示编译错误和警告

---

## 生产环境部署

### 1. 构建生产版本

```bash
# 使用npm
npm run build

# 或者使用yarn
yarn build
```

构建完成后，会在项目根目录生成 `dist/` 文件夹，包含所有生产环境文件。

### 2. 预览生产版本

```bash
# 使用npm
npm run preview

# 或者使用yarn
yarn preview
```

这会在本地启动一个服务器来预览生产版本，确保构建的文件正常工作。

### 3. 部署到静态服务器

#### 方法一：Nginx

1. 安装Nginx（如果还没有安装）

2. 配置Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/iflowdeznt/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
```

3. 重启Nginx

```bash
sudo nginx -t
sudo nginx -s reload
```

#### 方法二：Apache

1. 配置`.htaccess`文件（在`dist/`目录下创建）

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

2. 将`dist/`目录的内容上传到Apache服务器

#### 方法三：GitHub Pages

1. 在项目根目录创建 `vite.config.js`（如果还没有）

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/your-repo-name/'
})
```

2. 构建项目

```bash
npm run build
```

3. 将`dist/`目录的内容推送到`gh-pages`分支

#### 方法四：Vercel

1. 安装Vercel CLI

```bash
npm i -g vercel
```

2. 部署

```bash
vercel
```

按照提示完成部署即可。

#### 方法五：Netlify

1. 全局安装Netlify CLI

```bash
npm install -g netlify-cli
```

2. 构建项目

```bash
npm run build
```

3. 部署

```bash
netlify deploy --prod --dir=dist
```

---

## Docker部署

### 创建Dockerfile

在项目根目录创建`Dockerfile`：

```dockerfile
# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 创建nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
```

### 构建和运行Docker容器

```bash
# 构建镜像
docker build -t iflowdeznt .

# 运行容器
docker run -d -p 80:80 --name iflowdeznt-app iflowdeznt
```

---

## 环境变量配置

### 开发环境

创建`.env.development`文件：

```env
VITE_APP_TITLE=小白云简历生成助手
VITE_APP_API_URL=http://localhost:3000/api
```

### 生产环境

创建`.env.production`文件：

```env
VITE_APP_TITLE=小白云简历生成助手
VITE_APP_API_URL=https://your-domain.com/api
```

在代码中使用环境变量：

```javascript
const apiUrl = import.meta.env.VITE_APP_API_URL
```

---

## 性能优化建议

### 1. 启用gzip压缩

在服务器配置中启用gzip压缩，可以显著减少传输文件大小。

### 2. 使用CDN

将静态资源部署到CDN，加快全球访问速度。

### 3. 图片优化

- 使用WebP格式
- 压缩图片大小
- 使用懒加载

### 4. 代码分割

Vite自动进行代码分割，按需加载。

---

## 安全建议

1. **使用HTTPS**: 生产环境必须使用HTTPS
2. **配置CSP**: 添加内容安全策略
3. **定期更新依赖**: 保持npm依赖最新
4. **隐藏敏感信息**: 不要在代码中提交API密钥等敏感信息

---

## 常见问题

### Q: 构建后页面空白？

A: 检查`vite.config.js`中的`base`配置是否正确。

### Q: 刷新页面404？

A: 需要配置服务器的重定向规则，将所有请求指向`index.html`。

### Q: 如何修改端口？

A: 在`vite.config.js`中配置：

```javascript
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### Q: 依赖安装失败？

A: 尝试：
1. 删除`node_modules`和`package-lock.json`
2. 清除npm缓存：`npm cache clean --force`
3. 重新安装：`npm install`

### Q: 如何在局域网访问？

A: 开发服务器默认允许局域网访问，使用控制台显示的Network地址即可。
