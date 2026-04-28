import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import authRoutes from "./routes/auth.routes";

const app = express();

app.post("/api/v1/hello", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.use('/api/auth', authRoutes);



app.listen(3000, () => {
  console.log("server is running on port 3000");
});