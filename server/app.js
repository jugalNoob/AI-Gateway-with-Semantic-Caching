import "dotenv/config";
import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors/cors.js";
import cookieParser from "cookie-parser";
import { rout } from "./router/routes.js";
import { connectMongoDB } from "./db/conne.js";

const app = express();

try {
  await connectMongoDB();
  console.log("dbconnect");
} catch (error) {
  console.log(error);
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(rout);

const port = 9000;

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});