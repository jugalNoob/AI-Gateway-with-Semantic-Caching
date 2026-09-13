Instead, your resume/project story becomes:

AI Gateway with Multi-Provider Failover and Semantic Caching

And you can demonstrate metrics such as:

1000 requests

700 → exact/semantic cache hits
300 → AI API calls

Cache hit rate: 70%
AI API calls reduced: 70%
Average latency reduced: XX%
Provider failure recovery: Provider B

That shows backend engineering + GenAI + distributed-system thinking, which is much more impressive than simply integrating an AI API.




1 .

AI Gateway with Semantic Caching | React.js, Node.js, Express.js, MongoDB, Redis, OpenRouter, Embeddings

Built a full-stack AI application using React.js, Node.js,
 and Express.js with REST APIs.


Implemented embedding-based semantic caching with cosine
 similarity to reuse answers for similar questions and reduce AI API calls.


Used MongoDB to store questions, responses, and embeddings,
 with Redis for fast cache retrieval.


Built a request pipeline with Redis cache, exact MongoDB 
lookup, semantic search, and AI API fallback.

Added monitoring for token usage, response latency, 
AI provider, and cache source.



2 . 

**AI Gateway with Semantic Caching** | React.js, Node.js, Express.js, MongoDB, Redis, OpenRouter, Embeddings

* Built a full-stack AI application with a React.js frontend and Node.js/Express.js REST API for submitting and processing user questions.
* Implemented **semantic caching using embeddings and cosine similarity** to find previously answered questions with similar meaning and reduce unnecessary AI API calls.
* Stored questions, AI responses, and embeddings in **MongoDB**, with **Redis caching** for fast repeated-request responses.
* Designed a multi-stage request pipeline: **Redis cache → MongoDB exact match → semantic similarity search → AI API fallback**.
* Integrated an AI API through OpenRouter and added request monitoring for **provider, response time, token usage, and cache source**.
* Built the system to return whether a response came from **Redis, exact cache, semantic cache, or the AI provider**, making the caching behavior easy to monitor.
