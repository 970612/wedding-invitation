# Google Apps Script 修改说明

## 🔧 需要添加的代码

在你的Google Apps Script项目中，需要添加以下代码来支持读取留言功能：

```javascript
function doPost(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'read_guestbook') {
      // 读取留言板数据
      return readGuestbookData();
    } else {
      // 原有的提交RSVP功能
      return handleRSVPSubmission(e);
    }
  } catch (error) {
    console.error('Error:', error);
    return ContentService.createTextOutput('Error: ' + error.toString());
  }
}

// 读取留言板数据
function readGuestbookData() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return ContentService.createTextOutput('[]');
    }
    
    const messages = [];
    
    // 从第二行开始读取数据（跳过标题行）
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // 检查是否有姓名和留言
      if (row[1] && row[4] && row[1] !== '姓名' && row[4] !== '留言') {
        messages.push({
          name: row[1],        // 姓名列 (B列)
          message: row[4]      // 留言列 (E列)
        });
      }
    }
    
    // 返回JSON格式的数据
    return ContentService.createTextOutput(JSON.stringify(messages))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('读取留言板数据失败:', error);
    return ContentService.createTextOutput('[]');
  }
}

// 原有的RSVP处理函数（重命名）
function handleRSVPSubmission(e) {
  // 把你原有的RSVP处理代码放在这里
  // ...
}
```

## 📊 数据结构说明

根据你的表格结构：
- **A列**: 填写时间
- **B列**: 姓名 ← 读取这个
- **C列**: 人数
- **D列**: 手机号码
- **E列**: 留言 ← 读取这个
- **F列**: 数据汇总

## 🚀 部署步骤

1. 打开你的Google Apps Script项目
2. 将上述代码添加到项目中
3. 保存并重新部署
4. 测试读取功能

## 🔍 测试方法

1. 在留言板中添加一条测试留言
2. 刷新页面，查看是否从Google Sheets加载了数据
3. 检查浏览器控制台是否有错误信息

## ⚠️ 注意事项

- 确保Google Apps Script有权限访问你的表格
- 如果读取失败，页面会保持预设留言
- 新添加的留言仍然会保存到Google Sheets
