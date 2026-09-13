import redisClient from '../config/redis/redis.js'

import { Cache } from "../models/cache.js";
import { runAgent } from "../config_AI/MAIN_USE_AI_API/final_APi/final_api.js"
import {createEmbedding,} from '../config_AI/MAIN_USE_AI_API/open.api/open_Embedding.js'
import {cosineSimilarity} from './Conisne_Math.js'
import crypto from "crypto";

export const cachesemantic = async (req, res) => {
  try {
    const { question } = req.body;

      let sessionId = req.cookies.sessionId;

    // Create session if not available
    if (!sessionId) {
      sessionId = crypto.randomUUID();

      res.cookie("sessionId", sessionId, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      });
    }
    

    if (!question || !question.trim()) {
      return res.status(400).json({
        error: "Question is required",
      });
    }

    // Clean question
    const cleanQuestion = question
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");


      
    const redisKey = `question:${sessionId}:${question}`;

    // 1. Check Redis
    const cachedAnswer = await redisClient.get(redisKey);


       if (cachedAnswer) {
      console.log("✅ Redis cache hit");

      return res.send(JSON.parse(cachedAnswer));
    }

    console.log("❌ Redis cache miss");

    // =========================================
    // 1. EXACT CACHE
    // =========================================

    const exactMatch = await Cache.findOne({
      question: cleanQuestion,
    });

    if (exactMatch) {
      console.log("⚡ EXACT CACHE HIT");

      return res.json({
        source: "exact-cache",
        score: 1,
        answer: exactMatch.answer,
      });
    }


    // =========================================
    // 2. CREATE EMBEDDING
    // =========================================

    const embedding = await createEmbedding(cleanQuestion);

    console.log("Embedding length:", embedding.length);


    // =========================================
    // 3. SEMANTIC CACHE
    // =========================================

    const cachedItems = await Cache.find(
      {},
      {
        question: 1,
        answer: 1,
        embedding: 1,
      }
    );

    let bestMatch = null;
    let highestScore = -1;


    for (const item of cachedItems) {

      if (
        item.embedding &&
        item.embedding.length === embedding.length
      ) {

        const score = cosineSimilarity(
          embedding,
          item.embedding
        );

        if (score > highestScore) {
          highestScore = score;
          bestMatch = item;
        }
      }
    }


    console.log(
      "Top similarity:",
      highestScore.toFixed(4)
    );


    // =========================================
    // 4. SEMANTIC CACHE HIT
    // =========================================

    const SIMILARITY_THRESHOLD = 0.82;

    if (
      bestMatch &&
      highestScore >= SIMILARITY_THRESHOLD
    ) {

      console.log("✅ SEMANTIC CACHE HIT");

      return res.json({
        source: "semantic-cache",
        score: highestScore,
        matchedQuestion: bestMatch.question,
        answer: bestMatch.answer,
      });
    }


    // =========================================
    // 5. CACHE MISS → CALL AI
    // =========================================

    console.log("❌ CACHE MISS → CALLING AI");

    const answer = await  runAgent(cleanQuestion, sessionId);


    // =========================================
    // 6. SAVE TO CACHE
    // =========================================

    await Cache.create({
      question: cleanQuestion,
      answer,
      embedding,
    });

      // 3. Save answer in Redis
    await redisClient.set(
     redisKey,
    JSON.stringify(answer),
    "EX",
  100
  );



    // =========================================
    // 7. RETURN AI ANSWER
    // =========================================

    return res.json({
      source: "llm",
      answer,
    });

  } catch (error) {

    console.error("Pipeline Error:", error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
