"use client";
import { useState, useRef, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { SendIcon, ExternalLinkIcon, SparklesIcon } from "@/components/icons";

const SUGGESTIONS = [
  "What schemes am I eligible for as a farmer?",
  "Documents needed for a ration card",
  "Senior citizen pension schemes",
  "How to apply for Ayushman Bharat?",
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <span className="typing-dot w-2 h-2 rounded-full bg-[var(--muted-fg)]" />
      <span className="typing-dot w-2 h-2 rounded-full bg-[var(--muted-fg)]" />
      <span className="typing-dot w-2 h-2 rounded-full bg-[var(--muted-fg)]" />
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

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
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.reply || data.error,
          sources: data.sources || [],
        },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8 flex flex-col" style={{ minHeight: "calc(100vh - 8rem)" }}>
      <PageHeader
        title="Ask Nagrik AI"
        description="Get answers on government services, schemes, and documents — grounded in verified data."
      />

      <Card className="flex-1 flex flex-col overflow-hidden mb-4">
        <div
          ref={scrollRef}
          role="log"
          aria-live="polite"
          className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto chat-scroll min-h-[420px] max-h-[calc(100vh - 22rem)]"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] mb-4">
                <SparklesIcon className="w-7 h-7" />
              </div>
              <p className="font-medium text-[var(--foreground)]">How can I help you today?</p>
              <p className="text-sm text-[var(--muted-fg)] mt-1 max-w-sm">
                Ask about schemes, documents, eligibility, or how to apply for government services.
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex animate-fade-in ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  m.role === "user"
                    ? "bg-[var(--primary)] text-white rounded-br-md"
                    : "bg-[var(--muted)] text-[var(--foreground)] rounded-bl-md"
                }`}
              >
                {m.role === "ai" && (
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)] mb-1.5">
                    Nagrik AI
                  </p>
                )}
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.text}</p>

                {m.sources?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[var(--border)]">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-fg)] mb-2">
                      Official Sources
                    </p>
                    <ul className="space-y-1.5">
                      {m.sources.map((s) => (
                        <li key={s.id}>
                          <a
                            href={s.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline"
                          >
                            {s.title}
                            <ExternalLinkIcon className="w-3 h-3" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-[var(--muted)] rounded-2xl rounded-bl-md">
                <TypingIndicator />
              </div>
            </div>
          )}
        </div>

        {messages.length === 0 && (
          <div className="px-4 sm:px-6 pb-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setInput(q)}
                className="text-xs sm:text-sm border border-[var(--border)] rounded-full px-3.5 py-1.5 text-[var(--muted-fg)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/5 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={sendMessage} className="border-t border-[var(--border)] p-4 flex gap-2">
          <label htmlFor="chat-input" className="sr-only">Type your question</label>
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask in English, Hindi, Telugu, or any language..."
            className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]"
          />
          <Button type="submit" disabled={loading || !input.trim()} size="md" className="shrink-0">
            <SendIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>
      </Card>

      <p className="text-xs text-center text-[var(--muted-fg)]">
        Answers are grounded in verified government scheme data. Always confirm details on official portals.
      </p>
    </main>
  );
}
