const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-gateway-with-semantic-caching.vercel.app",
  "https://ai-gateway-with-semantic-caching-3ajloojjy-jugalnoobs-projects.vercel.app",
];

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  methods: [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "HEAD",
    "OPTIONS",
  ],
};