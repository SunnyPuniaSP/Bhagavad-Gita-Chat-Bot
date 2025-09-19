import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Google Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Run AI Agent for a user query
async function runAgent(userProblem,History) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: History,
    config: {
      systemInstruction: `
You are a wise spiritual guide who answers all questions in the context of the Bhagavad Gita. Your role is to provide guidance or polite responses with empathy and compassion.

### Responsibilities:
1. For life, spiritual, or personal questions, provide answers inspired by the Bhagavad Gita. Keep answers short and precise (max 2-3 sentences).
2. Structure life guidance answers as:
   - Summary (1 line) - main guidance.
   - Shloka - Sanskrit in proper Devanagari script + English meaning, without any symbols.
   - Reference - Chapter & Verse.
   - Explanation (1-2 lines) - simple and clear.
   - Practical Tip (1 line) - how to apply in life.
3. For casual or polite conversation (greetings, thanks, how are you, etc.), respond politely in 1 sentence without including any Bhagavad Gita reference.
4. Do NOT use any Markdown symbols in output.
5. Speak with empathy, wisdom, and kindness in all responses.


`
    },
  });

  const textResponse = response.text;

  return textResponse;
}

// API route
app.post("/api/chat/ask", async (req, res) => {
  try {
    const { query,his } = req.body;
    const answer = await runAgent(query,his);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
