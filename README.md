# 数学核心素养AI - Netlify部署指南

## 文件说明

- `index.html` - 主页面文件
- `netlify.toml` - Netlify配置文件
- `package.json` - 项目配置文件
- `netlify/functions/chat.js` - Serverless函数（代理DeepSeek API）
- `.env.example` - 环境变量配置示例

## 部署步骤

### 1. 准备文件
将所有文件上传到Git仓库（GitHub/GitLab/Bitbucket）

### 2. 连接Netlify
- 登录 [Netlify](https://app.netlify.com/)
- 点击 "Add new site" > "Import an existing project"
- 选择你的Git仓库

### 3. 配置环境变量
在Netlify后台配置API密钥：
- 进入 Site settings > Environment variables
- 添加环境变量：
  - Key: `DEEPSEEK_API_KEY`
  - Value: 你的DeepSeek API密钥

### 4. 部署设置
Netlify会自动识别`netlify.toml`配置，无需手动设置。

### 5. 部署
点击"Deploy site"，等待部署完成。

## 工作原理

1. **隐私保护**: API密钥存储在Netlify环境变量中，不暴露在前端代码
2. **Serverless函数**: `/netlify/functions/chat.js`作为中间层代理DeepSeek API
3. **前端请求**: `index.html`通过`/.netlify/functions/chat`调用函数，函数内部使用环境变量中的API密钥

## 注意事项

- 不要将`.env`文件提交到Git仓库
- API密钥只在Netlify环境变量中配置
- 每次修改环境变量后需要重新部署

## 本地测试

如需本地测试Netlify Functions：

```bash
npm install -g netlify-cli
netlify dev
```

在根目录创建`.env`文件并添加：
```
DEEPSEEK_API_KEY=your_api_key_here
```

## 技术栈

- 前端: HTML5 + JavaScript
- 数学渲染: MathJax
- 图形绘制: Desmos API
- 后端: Netlify Serverless Functions
- AI服务: DeepSeek API
