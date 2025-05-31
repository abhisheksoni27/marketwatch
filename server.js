import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());

app.get("/positions", async (req, res) => {
  const token = req.header("access-token");
  if (!token) {
    return res.status(400).json({ error: "Missing access-token header" });
  }
  try {
    const resp = await fetch("https://api.dhan.co/v2/positions", {
      headers: {
        "Content-Type": "application/json",
        "access-token": token,
      },
    });
    const data = await resp.json();
    res.status(resp.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
