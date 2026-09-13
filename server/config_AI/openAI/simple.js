import "dotenv/config";
import OpenAI from "openai";
import redisClient from '../config/redis.js'; // Fixed spelling



const client = new OpenAI({ 
  baseURL: "https://openrouter.ai/api/v1", 
  apiKey:OPENROUTER_API_KEY
 });


export const test = async (question, sessionId) => {


  // Add user message first
  messages.push({
    role: "user",
    content: question
  });

  try {



        const response =
          await client.chat.completions.create({

            model: "openai/gpt-4o",

            max_tokens: 500,

            messages: messages
          });

     
          response.choices[0].message.content;

        messages.push({
          role: "assistant",
          content: answer
        });

        return answer;
      
    

  } catch (error) {

    console.error("AI Error:", error);

    throw error;
  }
};


