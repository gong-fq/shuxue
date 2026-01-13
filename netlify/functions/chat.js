exports.handler = async function(event, context) {
  // 只允许POST请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // 从环境变量获取API密钥
  const API_KEY = process.env.DEEPSEEK_API_KEY;
  
  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API密钥未配置' })
    };
  }

  try {
    const requestBody = JSON.parse(event.body);
    
    // 发起请求到DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    // 处理流式响应
    if (requestBody.stream) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        },
        body: result
      };
    } else {
      // 非流式响应
      const data = await response.json();
      
      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };
    }

  } catch (error) {
    console.error('API请求错误:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: '服务器内部错误',
        message: error.message 
      })
    };
  }
};
