
export async function EmbeddingOlloma(text) {

        const response = await axios.post(
            "http://localhost:11434/api/embeddings",
            {
                model: "nomic-embed-text",
                prompt: text
            }
        );
}

