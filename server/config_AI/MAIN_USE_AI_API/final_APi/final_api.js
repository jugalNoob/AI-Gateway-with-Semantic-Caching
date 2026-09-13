import { open } from "../open.api/openAI.js";
import { ollam } from "../ollama_api/ollama.js";
import { aiMonitor } from '../monitoring/monitoring.js';
import redisClient from '../../../config/redis/redis.js'


let total_openapi = 0;
let total_ollama = 0;

let totalUsedTokens = 0;
const TOKEN_LIMIT = 2500;




export const runAgent = async (question,sessionId) => {

    const blockedWords = ["df", "delete", "dont"];
  
      const key = `conversation:${sessionId}`;
    
      const oldMessages = await redisClient.get(key);
    
      const messages = oldMessages
      ? JSON.parse(oldMessages)
      : [];

        messages.push({
    role: "user",
    content: question
  });

  // =========================
  // OpenRouter
  // =========================

  const openStart = Date.now();
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

           const response = await open(messages);

           console.log(response)
         // Token usage from OpenRouter
    const inputTokens =
      response.usage?.prompt_tokens || 0;

    const outputTokens =
      response.usage?.completion_tokens || 0;

    const requestTokens =
      response.usage?.total_tokens || 0;

    totalUsedTokens += requestTokens;

    console.log("Input tokens :", inputTokens);
    console.log("Output tokens:", outputTokens);
    console.log("Request tokens:", requestTokens);
    console.log("Total tokens :", totalUsedTokens);
    console.log(
      "Remaining tokens:",
      Math.max(0, TOKEN_LIMIT - totalUsedTokens)
    );

    const answer =
      response.choices[0].message.content;

    messages.push({
      role: "assistant",
      content: answer
    });


        console.log("AI:", answer);
  await redisClient.set(
    key,
    JSON.stringify(messages),
    "EX",
    86400
  );

  let monitor=  aiMonitor({
        provider: "OpenRouter",
        startTime: openStart,
        success: true,
        total: ++total_openapi
      });

      await redisClient.lpush(
  "ai:monitoring",
  JSON.stringify(monitor)
);


        return answer;
      }
    }

  } catch (error) {

    aiMonitor({
      provider: "OpenRouter",
      startTime: openStart,
      success: false,
      error
    });

    console.log("➡️ Switching to Ollama...");

    // =========================
    // Ollama
    // =========================

    const ollamaStart = Date.now();

    try {
          const key = `conversation:${sessionId}`;

  const oldMessages = await redisClient.get(key);

  const messages = oldMessages
    ? JSON.parse(oldMessages)
    : [];


      messages.push({
    role: "user",
    content: question
  });


      const response = await ollam(messages);

      const answer = response.data.message.content;

      messages.push({
        role: "assistant",
        content: answer
      });

    

      await redisClient.set(
        key,
        JSON.stringify(messages),
        "EX",
        86400
      );

     let monitor= aiMonitor({
        provider: "Ollama",
        startTime: ollamaStart,
        success: true,
        total: ++total_ollama
      });

      await redisClient.lpush(
  "ai:monitoring",
  JSON.stringify(monitor)
);

      return answer;

    } catch (error) {

      aiMonitor({
        provider: "Ollama",
        startTime: ollamaStart,
        success: false,
        error
      });

      throw new Error("Both OpenRouter and Ollama failed");
    }
  }
};