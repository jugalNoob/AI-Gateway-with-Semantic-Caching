import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});





export const open = async (messages) => {
  const response = await client.chat.completions.create({
    model: "openai/gpt-4o",
    max_tokens: 500,
    messages,
  });

  return response;
};