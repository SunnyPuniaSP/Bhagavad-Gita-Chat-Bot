import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    const inp=input;
    setInput("");
    setLoading(true);
    if (!input.trim()) return;

    const newHistory = [...history, {
      role: "user",
      parts: [{ text: inp }],
    }];
    setHistory(newHistory);

    try {
      const response = await axios.post("https://bhagavad-gita-chat-bot-2.onrender.com/api/chat/ask", { query: inp , his:newHistory});
      const botText = response?.data?.answer || "⚠️ No response from server.";
      setLoading(false);
      setHistory((prev) => [...prev, {
        role: "bot",
        parts: [{ text: botText }],
      }]);
    } catch (error) {
      setHistory((prev) => [
        ...prev,
        {
        role: "bot",
        parts: [{ text: "⚠️ Error fetching response." }],
      },
      ]);
    }

  };

  return (
    <div className="app-container">
      <div className="chat-wrapper">
        <h1 className="chat-header">🕉️ Bhagavad Gita Chatbot</h1>

        <div className="chat-box">
          {history.map((msg, ind) => (
            <div
              key={ind}
              className={`chat-message ${msg.role === "user" ? "user" : "bot"}`}
            >
              <pre className="chat-text">{msg.parts[0].text}</pre>
            </div>
          ))}
          {loading && (
   <div className="chat-message bot loading">
  <div className="loader">
    <div className="dot"></div>
    <div className="dot"></div>
    <div className="dot"></div>
  </div>
</div>
  )}
        </div>

        <form className="chat-input-container" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Ask your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="chat-input"
          />
          <button type="submit" className="chat-button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
