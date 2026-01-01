import { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading || !GEMINI_API_KEY) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `EcoTravel Assistant (Bangalore-based). Short answers (2-3 sentences). Context: sustainable travel, carbon calculator, green hotels, trains/flights. User: ${userMsg}`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 250
            }
          })
        }
      );

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const botReply = data.candidates[0].content.parts[0].text;

      setMessages(prev => [...prev, { role: "bot", content: botReply }]);
    } catch (error) {
      console.error("Chatbot:", error);
      setMessages(prev => [...prev, { 
        role: "bot", 
        content: `Error: ${error.message}. Check console or API key.` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!GEMINI_API_KEY) {
    return (
      <button className="chat-fab" title="API Key Missing">
        🔑
      </button>
    );
  }

  return (
    <>
      <button 
  className="chatbot-toggle" 
  onClick={toggleChatbot}  // ✅ This must exist
>
  💬
</button>

      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <span>🌿 EcoTravel Assistant</span>
            <button className="chat-close" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chat-messages">
            <div className="welcome-msg">
              Hi from Bengaluru! 👋 Ask about eco-hotels, green transport, or trip planning. 🌍
            </div>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                <div>{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-message bot">
                <div className="typing">🤖 Thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="e.g., Best trains from BLR to Mysore?"
              className="chat-input"
              disabled={loading}
            />
            <button 
              onClick={sendMessage} 
              disabled={loading || !input.trim()}
              className="chat-send"
            >
              {loading ? "⏳" : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
