import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    setInput("");
    setLoading(true);
    if (!input.trim()) return;

    setHistory((prev) => [...prev, { sender: "user", text: input }]);

    try {
      const response = await axios.post("/api/chat/ask", { query: input });
      const botText = response?.data?.answer || "⚠️ No response from server.";
      setLoading(false);
      setHistory((prev) => [...prev, { sender: "bot", text: botText }]);
    } catch (error) {
      setHistory((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error fetching response." },
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
              className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
            >
              <pre className="chat-text">{msg.text}</pre>
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
