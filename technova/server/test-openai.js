import 'dotenv/config';
import OpenAI from 'openai';

const testOpenAI = async () => {
  console.log('Testing OpenAI Key:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use 3.5 turbo as it's universally available
      messages: [{ role: "user", content: "Say hello!" }],
      max_tokens: 10,
    });
    console.log('Success:', response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI Error:', error.message);
    if (error.response) {
      console.error(error.response.data);
    }
  }
};

testOpenAI();
