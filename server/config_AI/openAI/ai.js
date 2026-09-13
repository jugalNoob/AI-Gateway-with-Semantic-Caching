import "dotenv/config";
import OpenAI from "openai";
import redisClient from '../config/redis.js'; // Fixed spelling



const client = new OpenAI({ 
  baseURL: "https://openrouter.ai/api/v1", 
  apiKey:OPENROUTER_API_KEY
 });


let messages = [];

let totalUsedTokens = 0;
const TOKEN_LIMIT = 2500;

export const test = async (question, sessionId) => {

  const blockedWords = ["df", "delete", "dont"];


    const key = `conversation:${sessionId}`;
  
    const oldMessages = await redisClient.get(key);
  

    const messages = oldMessages
    ? JSON.parse(oldMessages)
    : [];


  // Add user message first
  messages.push({
    role: "user",
    content: question
  });

  try {

    // Get words from current question
    const words = question
      .toLowerCase()
      .split(/\s+/);

    const removedWords = words.filter(word =>
      blockedWords.includes(word)
    );

    const cleanWords = words.filter(word =>
      !blockedWords.includes(word)
    );

    if (
      words.length > 1 &&
      words.length < 30 &&
      removedWords.length > 0
    ) {

      console.log("block", removedWords);

      messages[messages.length - 1].content =
        cleanWords.join(" ");

      console.log(
        "Removed:",
        removedWords
      );

      console.log(
        "Sending:",
        messages[messages.length - 1].content
      );

      return "Blocked words removed.";

    } else {

      // Check token limit
      if (totalUsedTokens >= TOKEN_LIMIT) {

        console.log("Token limit reached");

        return "Token limit reached.";

      } else {

        const response =
          await client.chat.completions.create({

            model: "openai/gpt-4o",

            max_tokens: 500,

            messages: messages
          });

        const input =
          response.usage.prompt_tokens;

        const output =
          response.usage.completion_tokens;

        const total =
          response.usage.total_tokens;

        totalUsedTokens += total;

        const answer =
          response.choices[0].message.content;

        messages.push({
          role: "assistant",
          content: answer
        });

        console.log("Input:", input);
        console.log("Output:", output);
        console.log("This request:", total);
        console.log(
          "All requests:",
          totalUsedTokens
        );

        console.log(
          "Remaining:",
          Math.max(
            0,
            TOKEN_LIMIT - totalUsedTokens
          )
        );

        console.log("AI:", answer);
  await redisClient.set(
    key,
    JSON.stringify(messages),
    "EX",
    86400
  );
        return answer;
      }
    }

  } catch (error) {

    console.error("AI Error:", error);

    throw error;
  }
};


