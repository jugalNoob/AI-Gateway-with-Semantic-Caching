
import React, { useState } from "react";
import axios from "axios";
import "./Aisearch.css";

function  Aisearch() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [source, setSource] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const askQuestion = async (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    try {
      setLoading(true);
      setAnswer("");
      setSource("");
      setScore(null);

    const response = await axios.post(
  "https://ai-gateway-with-semantic-caching.onrender.com/ai",
  {
    question,
  },
  {
    withCredentials: true,
  }
);

      setAnswer(response.data.answer);
      setSource(response.data.source);
      setScore(response.data.score);

    } catch (error) {
      console.error(error);

      setAnswer(
        error.response?.data?.error ||
        "Something went wrong. Please try again."
      );

      setSource("error");

    } finally {
      setLoading(false);
    }
  };

  const getSourceName = () => {
    switch (source) {
      case "redis":
        return "Redis Cache";

      case "exact-cache":
        return "Exact Cache";

      case "semantic-cache":
        return "Semantic Cache";

      case "llm":
        return "AI Provider";

      case "error":
        return "Error";

      default:
        return "";
    }
  };

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">✦</span>
          AI Cache
        </div>

        <div className="status">
          <span className="status-dot"></span>
          System Online
        </div>
      </nav>


      {/* Main */}
      <main className="container">

        <div className="hero">
          <div className="badge">
            ⚡ AI Gateway + Semantic Cache
          </div>

          <h1>
            Ask anything.
            <br />
            <span>Get intelligent answers.</span>
          </h1>

          <p>
            Your question is checked against Redis and semantic cache
            before calling the AI provider.
          </p>
        </div>


        {/* Question Box */}
        <form className="question-box" onSubmit={askQuestion}>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your question..."
            rows="4"
          />

          <div className="input-footer">

            <span className="hint">
              Semantic search enabled
            </span>

            <button
              type="submit"
              disabled={loading || !question.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Thinking...
                </>
              ) : (
                <>
                  Ask AI
                  <span>→</span>
                </>
              )}
            </button>

          </div>

        </form>


        {/* Answer */}
        {answer && (
          <div className="answer-card">

            <div className="answer-header">

              <div>
                <span className="answer-label">
                  RESPONSE
                </span>

                <h2>AI Answer</h2>
              </div>

              {source && (
                <div className={`source ${source}`}>
                  <span className="source-dot"></span>
                  {getSourceName()}
                </div>
              )}

            </div>


            <div className="answer-content">
              {answer}
            </div>


            {/* Similarity */}
            {source === "semantic-cache" &&
              score !== null && (
                <div className="similarity">

                  <div className="similarity-top">
                    <span>Semantic similarity</span>

                    <strong>
                      {(score * 100).toFixed(1)}%
                    </strong>
                  </div>

                  <div className="progress">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${score * 100}%`,
                      }}
                    ></div>
                  </div>

                </div>
              )}

          </div>
        )}


        {/* Architecture */}
        <section className="architecture">

          <h3>How your request works</h3>

          <div className="flow">

            <div className="flow-item">
              <div className="flow-icon">01</div>
              <strong>Question</strong>
              <span>Your request</span>
            </div>

            <div className="arrow">→</div>

            <div className="flow-item">
              <div className="flow-icon">02</div>
              <strong>Redis</strong>
              <span>Fast cache</span>
            </div>

            <div className="arrow">→</div>

            <div className="flow-item">
              <div className="flow-icon">03</div>
              <strong>Embedding</strong>
              <span>Meaning search</span>
            </div>

            <div className="arrow">→</div>

            <div className="flow-item">
              <div className="flow-icon">04</div>
              <strong>AI</strong>
              <span>Final fallback</span>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Aisearch

