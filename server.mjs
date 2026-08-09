import "dotenv/config";
import express from "express";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set.");
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    if (!message) return res.status(400).json({ error: "پیغام خالی ہے۔" });

    const response = await client.responses.create({
      model: "gpt-5",
      instructions:
        "You are Roshi AI, a friendly personal AI assistant. Reply in the same language as the user. Prefer simple Urdu when the user writes Urdu or Roman Urdu. Be helpful, clear, and age-appropriate.",
      input: message
    });

    res.json({ reply: response.output_text || "معذرت، جواب نہیں ملا۔" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "AI سے رابطہ نہیں ہو سکا۔ API key اور server settings چیک کریں۔"
    });
  }
});

app.listen(port, () => {
  console.log(`Roshi AI running at http://localhost:${port}`);
});
