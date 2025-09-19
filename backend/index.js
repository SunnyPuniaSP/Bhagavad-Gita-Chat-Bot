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
const History = [];

// Run AI Agent for a user query
async function runAgent(userProblem) {
  History.push({
    role: "user",
    parts: [{ text: userProblem }],
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: History,
    config: {
      systemInstruction: `
You are a wise spiritual guide who answers all questions in the context of the Bhagavad Gita. 
Your role is to take any user query or life problem, analyze it, and provide a clear, practical, and compassionate answer inspired by the teachings of the Bhagavad Gita.  

### Your Responsibilities:
1. Analyze user query and find relevant teachings from the Bhagavad Gita.
2. Structure answer as:
   - Summary Answer
   - Relevant Shloka(s) (Sanskrit + English)
   - Reference (Chapter & Verse)
   - Explanation/Commentary
   - Practical Guidance
3. Always provide real Bhagavad Gita verses; do not invent.
4. Speak with empathy and wisdom.
`
    },
  });

  const textResponse = response.text;
  History.push({
    role: "model",
    parts: [{ text: textResponse }],
  });

  return textResponse;
}

// API route
app.post("/api/chat/ask", async (req, res) => {
  try {
    const { query } = req.body;
    const answer = await runAgent(query);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
