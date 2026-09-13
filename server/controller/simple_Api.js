
app.get("/ai", async (req, res) => {
  
  try {
    const question = req.query.question;

    let sessionId = req.cookies.sessionId;

    // Create session if not available
    if (!sessionId) {
      sessionId = crypto.randomUUID();

      res.cookie("sessionId", sessionId, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      });
    }

    const redisKey = `question:${sessionId}:${question}`;

    // 1. Check Redis
    const cachedAnswer = await redisClient.get(redisKey);

    if (cachedAnswer) {
      console.log("✅ Redis cache hit");

      return res.send(JSON.parse(cachedAnswer));
    }

    console.log("❌ Redis cache miss");

    // 2. AI call
    const answer = await runAgent(question, sessionId);

    // 3. Save answer in Redis
    await redisClient.set(
     redisKey,
    JSON.stringify(answer),
    "EX",
  100
  );

    // 4. Send response
    return res.send(answer);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 
