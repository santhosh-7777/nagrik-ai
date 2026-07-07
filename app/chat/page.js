"use client";
import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    const updatedMessages = [...messages, { role: "user", text: userMessage }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: updatedMessages.slice(0, -1),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.reply || data.error }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Ask Nagrik AI</h1>

      <div
        role="log"
        aria-live="polite"
        className="flex-1 border rounded-lg p-4 mb-4 min-h-[400px] space-y-3 overflow-y-auto"
      >
        {messages.length === 0 && (
          <p className="text-gray-500">Ask about government services, schemes, or required documents.</p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-[80%] ${
              m.role === "user" ? "bg-blue-100 ml-auto" : "bg-gray-100"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && <p className="text-gray-500">Nagrik AI is typing...</p>}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {[
          "What schemes am I eligible for as a farmer?",
          "Documents needed for a ration card",
          "Senior citizen pension schemes",
        ].map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => setInput(q)}
            className="text-sm border rounded-full px-3 py-1 hover:bg-gray-100"
          >
            {q}
          </button>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <label htmlFor="chat-input" className="sr-only">Type your question</label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. What documents do I need for a ration card?"
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-5 py-2 rounded-lg">
          Send
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-2 text-center">
        Ask in English, Hindi, Telugu, or any language you're comfortable with.
      </p>
    </main>
  );
}