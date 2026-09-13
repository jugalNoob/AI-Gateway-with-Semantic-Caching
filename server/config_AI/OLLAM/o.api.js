
import axios from "axios";

let messages = [];

export async function runAgent(userQuestion) {
  messages.push({
    role: "user",
    content: userQuestion
  });

  try {
    const response = await axios.post(
      "http://localhost:11434/api/chat",
      {
        model: "qwen2.5:1.5b",
        messages,
        stream: false,
        options: {
          temperature: 0
        }
      }
    );

    const answer = response.data.message.content;

    console.log(answer);

    return answer;

  } catch (error) {
    console.error("Ollama error:", error.message);
  }
}


runAgent('what is NATO')