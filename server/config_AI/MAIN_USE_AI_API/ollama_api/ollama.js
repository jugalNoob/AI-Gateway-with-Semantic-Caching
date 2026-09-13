import axios from "axios";




export async function EmbeddingOlloma(text) {

        const response = await axios.post(
            "http://localhost:11434/api/embeddings",
            {
                model: "nomic-embed-text",
                prompt: text
            }
        );
}




export const ollam = async (messages) => {

  const response = await axios.post(
    "http://localhost:11434/api/chat",
    {
      model: "qwen2.5:1.5b",
      messages: messages,
      stream: false,
      options: {
        temperature: 0
      }
    }
  );

  return response;
};