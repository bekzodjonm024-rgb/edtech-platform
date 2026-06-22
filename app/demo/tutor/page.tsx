"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Send, Bot, Sparkles } from "lucide-react";

type Msg = { role: "user" | "ai"; text: string };

export default function TutorPage() {
  const { d, s, locale } = useI18n();
  const [messages, setMessages] = useState<Msg[]>([{ role: "ai", text: s.tutor.greeting }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text: string) => {
    const value = text.trim();
    if (!value) return;
    const history: Msg[] = [...messages, { role: "user", text: value }];
    setMessages(history);
    setInput("");
    setTyping(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, language: locale }),
      });
      if (!res.ok || !res.body) throw new Error("fallback");

      // Stream tokens into a fresh AI bubble.
      setTyping(false);
      setMessages((p) => [...p, { role: "ai", text: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { value: chunk, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(chunk, { stream: true });
        setMessages((p) => {
          const next = [...p];
          next[next.length - 1] = { role: "ai", text: acc };
          return next;
        });
      }
      if (!acc.trim()) {
        setMessages((p) => {
          const next = [...p];
          next[next.length - 1] = { role: "ai", text: s.tutor.canned };
          return next;
        });
      }
    } catch {
      // No API key or request failed — fall back to a canned reply.
      setMessages((p) => [...p, { role: "ai", text: s.tutor.canned }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <DashboardShell role="student" userName="Ali Valiyev" userRole={d.studentRole}>
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
          <Bot className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold">{s.tutor.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{s.tutor.subtitle}</p>
        </div>
      </div>

      <Card className="flex h-[60vh] flex-col p-0">
        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : ""}`}
            >
              {m.role === "ai" && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </span>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-white"
                    : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                {m.text}
              </div>
            </motion.div>
          ))}

          {typing && (
            <div className="flex gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bot className="h-4 w-4" />
              </span>
              <div className="flex items-center gap-1 rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-2 border-t border-slate-200 px-5 pt-3 dark:border-slate-800">
          {[s.tutor.suggest1, s.tutor.suggest2].map((sug) => (
            <button
              key={sug}
              onClick={() => send(sug)}
              className="flex items-center gap-1.5 rounded-pill border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300"
            >
              <Sparkles className="h-3 w-3" /> {sug}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2 p-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={s.tutor.placeholder}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary dark:border-slate-700 dark:bg-slate-800"
          />
          <button
            type="submit"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            disabled={!input.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </Card>
    </DashboardShell>
  );
}
