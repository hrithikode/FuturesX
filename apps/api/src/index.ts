import express from "express";

const app = express();

app.post("/api/v1/hello", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.listen(3000);