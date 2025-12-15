# 🚀 Netlify 部署说明

## 📋 部署步骤

### 1. 准备项目文件
确保你的项目包含以下文件：
- `index.html`
- `assets/css/style.css`
- `assets/js/main.js`
- `assets/img/` 目录（包含 cover.jpg 等图片）
- `netlify.toml`（已创建）

### 2. 上传到 GitHub
1. 在 GitHub 上创建新仓库
2. 将项目文件上传到仓库
3. 确保仓库是公开的

### 3. 在 Netlify 上部署
1. 访问 [netlify.com](https://netlify.com)
2. 点击 "Sign up" 注册账号（可以用 GitHub 账号登录）
3. 点击 "New site from Git"
4. 选择 "GitHub" 作为 Git 提供商
5. 选择你的婚礼请柬仓库
6. 保持默认设置，点击 "Deploy site"

### 4. 配置域名
部署完成后，Netlify 会给你一个随机域名，格式如：
`https://random-name-123456.netlify.app`

## 🔧 微信分享配置

### 1. 更新 meta 标签
部署完成后，你需要将 HTML 中的相对路径改为完整的 Netlify 域名：

```html
<meta property="og:image" content="https://你的域名.netlify.app/assets/img/cover.jpg" />
<meta property="og:url" content="https://你的域名.netlify.app/" />
```

### 2. 更新 JavaScript 中的图片 URL
在 `main.js` 中，将：
```javascript
imgUrl: window.location.origin + '/assets/img/cover.jpg'
```
改为：
```javascript
imgUrl: 'https://你的域名.netlify.app/assets/img/cover.jpg'
```

## 📱 微信分享测试

### 1. 在微信中打开
- 将你的 Netlify 链接发送到微信
- 在微信中打开链接
- 检查页面是否正常显示

### 2. 测试分享功能
- 点击右上角 "..." 按钮
- 选择 "分享给朋友" 或 "分享到朋友圈"
- 检查分享的标题、描述和图片

## ⚠️ 注意事项

### 1. 图片要求
- `cover.jpg` 建议尺寸 300x300 像素以上
- 图片文件大小建议小于 1MB
- 确保图片路径正确

### 2. HTTPS 支持
- Netlify 自动提供 HTTPS 证书
- 微信分享要求 HTTPS 链接
- 确保所有资源都使用 HTTPS

### 3. 域名限制
- 免费版 Netlify 使用 `.netlify.app` 域名
- 如果需要自定义域名，需要升级到付费版
- 微信分享对域名没有特殊要求

## 🔍 常见问题

### 1. 图片不显示
- 检查图片文件是否上传到 `assets/img/` 目录
- 确认图片文件名和路径正确
- 检查 Netlify 部署日志

### 2. 分享图片不正确
- 确保 `cover.jpg` 文件存在
- 检查 meta 标签中的图片路径
- 使用微信开发者工具测试分享效果

### 3. 页面样式问题
- 检查 CSS 文件路径
- 确认 `netlify.toml` 配置正确
- 清除浏览器缓存

## 🎯 部署完成后的效果

- ✅ 支持 HTTPS 访问
- ✅ 微信分享功能正常
- ✅ 自动 CDN 加速
- ✅ 全球访问
- ✅ 免费托管

现在你的婚礼请柬就可以在微信中正常分享和打开了！
