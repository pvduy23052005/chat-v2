import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import allRoute from "./presentation/http/routes/index.route";
import { connectDatabase } from "./infrastructure/config/database";
import cookieParser from "cookie-parser"
import cors from "cors";
import { errorHandle } from "./presentation/http/middlewares/error.middleware";

import http from "http";
import { socketInit } from "./infrastructure/socket";

const port: string | number = process.env.PORT || 5000;
const app: Express = express();

const corsOptions = {
  origin: process.env.URL_FRONTEND || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

connectDatabase();
allRoute(app);
socketInit(server);

app.use(errorHandle);

server.listen(port, () => {
  console.log(`Server is running ${port}`);
})