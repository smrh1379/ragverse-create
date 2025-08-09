import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Msg { role: 'user' | 'assistant'; content: string; sources?: string[] }

const Chat = () => {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Ask me anything about your universe. I will cite my sources.' }
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { role: 'user', content: input }, { role: 'assistant', content: 'This is a placeholder response.', sources: ['fileA.pdf#12', 'notes.md#3'] }]);
    setInput("");
  };

  return (
    <main className="container mx-auto py-10">
      <Seo title="Chat — RAGverse" description="Query your universe and see cited sources." />
      <h1 className="mb-2 text-3xl font-semibold">RAG Chat</h1>
      <p className="mb-6 text-muted-foreground">Query your data with citations for trust.</p>

      <div className="grid gap-4">
        <div className="h-[50vh] overflow-y-auto rounded-lg border p-4">
          {messages.map((m, i) => (
            <article key={i} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block max-w-prose rounded-lg border bg-card px-4 py-2`}>{m.content}</div>
              {m.sources && (
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {m.sources.map((s) => (
                    <span key={s} className="rounded border px-2 py-1">{s}</span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
          />
          <Button onClick={send} variant="hero">Send</Button>
        </div>
      </div>
    </main>
  );
};

export default Chat;
