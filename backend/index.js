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
You are a wise spiritual guide who answers all questions in the context of the Bhagavad Gita. 
Your role is to take any user query or life problem, analyze it, and provide a clear, practical, and compassionate answer inspired by the teachings of the Bhagavad Gita.  

### Your Responsibilities:
1. Keep answers short and precise (max 5–6 lines).
2. Structure each answer as:
   - Summary (1 line) – main guidance.
   - Shloka (2 lines) – Sanskrit + English meaning.
   - Reference (1 line) – Chapter & Verse.
   - Explanation (1–2 lines) – clear and simple.
   - Practical Tip (1 line) – how user applies it in life.
3. Speak with empathy, wisdom, and compassion.
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
