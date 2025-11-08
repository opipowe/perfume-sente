const fetch = require('node-fetch');

// 🔑 ЗАМЕНИТЕ ЭТОТ КЛЮЧ НА ВАШ OPENAI API КЛЮЧ
const API_KEY = 'sk-ваш-настоящий-ключ-тут';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { answers = [] } = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Ты эксперт по парфюмерии. На основе ответов пользователя: ${JSON.stringify(answers)}
            Порекомендуй идеальный аромат. Опиши:
            - Креативное название аромата
            - Основные ноты (верхние, средние, базовые)
            - Характер и настроение аромата  
            - Почему он подходит именно этому пользователю
            - В каких ситуациях лучше его использовать
            
            Будь детальным, убедительным и креативным!`
          },
          {
            role: 'user',
            content: 'Проанализируй мои ответы и порекомендуй идеальный аромат'
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    res.status(200).json(data);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Ошибка при генерации результата' 
    });
  }
};
