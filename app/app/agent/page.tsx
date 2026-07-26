"use client";

import { useState } from "react";
import { AgentMessageCard } from "@/components/agent/agent-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildProfileContext } from "@/lib/demo/seed";
import { useTransitStore } from "@/lib/store/use-transit-store";

export default function AgentPage() {
  const messages = useTransitStore((s) => s.messages);
  const addMessage = useTransitStore((s) => s.addMessage);
  const profile = useTransitStore((s) => s.profile);
  const conditions = useTransitStore((s) => s.conditions);
  const medications = useTransitStore((s) => s.medications);
  const allergies = useTransitStore((s) => s.allergies);
  const documents = useTransitStore((s) => s.documents);
  const unresolvedQuestions = useTransitStore((s) => s.unresolvedQuestions);
  const continuityPriorities = useTransitStore((s) => s.continuityPriorities);
  const corridorBrief = useTransitStore((s) => s.corridorBrief);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(question: string) {
    if (!question.trim()) return;
    setLoading(true);
    setInput("");
    addMessage({ role: "user", content: question });

    try {
      const context = buildProfileContext({
        profile,
        conditions,
        medications,
        allergies,
        documents,
        unresolvedQuestions,
        continuityPriorities,
        corridorBrief,
      });
      const response = await fetch("/api/ai/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `${question}\n\nReply briefly and specifically for this patient's origin → destination route.`,
          context,
        }),
      });
      if (!response.ok) throw new Error("Agent request failed");
      const data = await response.json();
      addMessage({
        role: "assistant",
        content: data.answer,
        whyItMatters: data.whyItMatters,
        nextAction: data.nextAction,
        sourceStatus: data.sourceStatus,
        actions: (data.actions || []).slice(0, 2).map(
          (action: { label: string; type: string }, index: number) => ({
            id: `api-${index}`,
            label: action.label,
            type: action.type,
          })
        ),
      });
    } catch {
      addMessage({
        role: "assistant",
        content: "I couldn’t answer just now. Try Home and do the next step.",
        nextAction: "Go back to Home",
        actions: [
          {
            id: "home",
            label: "Home",
            type: "home",
            href: "/app/overview",
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-4xl">Ask Transit</h1>
        <p className="mt-2 text-muted-foreground">What do you need?</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          "What should I do next?",
          "What’s important for my route?",
          "What’s missing?",
        ].map((prompt) => (
          <Button
            key={prompt}
            size="sm"
            variant="secondary"
            onClick={() => void submit(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>

      <div className="min-h-[240px] space-y-3 rounded-[1.75rem] border border-border bg-card p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">Ask anything about your move.</p>
        ) : null}
        {messages.map((message) => (
          <AgentMessageCard
            key={message.id}
            message={message}
            onAction={(label) => void submit(label)}
          />
        ))}
        {loading ? (
          <p className="text-sm text-muted-foreground">Thinking…</p>
        ) : null}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void submit(input);
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here"
          aria-label="Ask Transit"
        />
        <Button type="submit" disabled={loading}>
          Send
        </Button>
      </form>
    </div>
  );
}
