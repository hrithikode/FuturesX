import dotenv from 'dotenv';
dotenv.config();


import express from "express";
import http from "http";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from 'cookie-parser';
import balanceRouter from './routes/balance.routes.js'
import errorHandler from './middleware/error.middleware.js';
import tradeRouter from './routes/trade.routes.js';
import { startWebSocketServer } from "./ws.js";

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}))
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use("/balance", balanceRouter);
app.use('/trade', tradeRouter);


app.use(errorHandler);

startWebSocketServer(server).catch((error) => {
  console.error("Failed to start WebSocket server:", error);
});

server.listen(4000, () => {
  console.log("server is running on port 4000");
});