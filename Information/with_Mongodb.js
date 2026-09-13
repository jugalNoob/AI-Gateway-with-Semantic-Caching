```js
import { Cache } from "../models/cache.js";
import { createEmbedding } from "../confIg/Ai.js";

export const cachesemantic = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "Question is required",
      });
    }

    // 1. Create embedding for the user's question
    const embedding = await createEmbedding(question);

    console.log("Embedding length:", embedding.length);

    // 2. Search semantic cache
    const results = await Cache.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: embedding,
          numCandidates: 100,
          limit: 1,
        },
      },
      {
        $project: {
          question: 1,
          answer: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ]);

    console.log("Vector Search Result:", results);

    // 3. Cache hit
    if (results.length > 0 && results[0].score >= 0.90) {
      console.log("✅ SEMANTIC CACHE HIT");

      return res.json({
        source: "semantic-cache",
        score: results[0].score,
        answer: results[0].answer,
      });
    }

    console.log("❌ CACHE MISS");

    // 4. Fake LLM answer
    const answer = `AI answer for: ${question}`;

    // 5. Save question + answer + embedding
    const saved = await Cache.create({
      question,
      answer,
      embedding,
    });

    console.log("Saved cache:", saved._id);

    return res.json({
      source: "llm",
      answer,
    });
  } catch (error) {
    console.error("ERROR:", error);

    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};
```
