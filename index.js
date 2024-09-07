const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.winmeen.com/6th-tamil-unit-1-questions/2/'; 

axios.get(url)
  .then(response => {
    const html = response.data;

    const $ = cheerio.load(html);

    const questions = [];
    $('p').each((i, el) => {
      const questionText = $(el).text().trim();
      
      if (questionText.match(/^\d+\./)) {
        const question = {
          question_number: i + 1,
          question_text: questionText,
          options: [],
          answer: '', 
          explanation: ''
        };
        
        $(el).nextAll('p').each((j, optionEl) => {
          const optionText = $(optionEl).text().trim();
          
          const match = optionText.match(/^([A-D]\))\s+(.*)/);
          if (match) {
            const prefix = match[1]; 
            const text = match[2];   
            
            const formattedOption = `${prefix} ${text}`;
            const isAnswer = $(optionEl).find('strong').length > 0;
            
            question.options.push(formattedOption);
            
            if (isAnswer) {
              question.answer = formattedOption; 
            }
          } else {
            return false; 
          }
        });
        
        questions.push(question);
      }
    });

    console.log(JSON.stringify(questions, null, 2));
  })
  .catch(error => {
    console.error('Error fetching the webpage:', error);
  });