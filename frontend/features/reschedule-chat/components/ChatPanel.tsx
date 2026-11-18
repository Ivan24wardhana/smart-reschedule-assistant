"use client";

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { MessageBubble } from "./MessageBubble";
import { ProposedSlotList } from "./ProposedSlotList";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizontal, Loader2 } from "lucide-react";

export function ChatPanel() {
  const { messages, isTyping, analysisStatus, sendMessage } = useChatStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages, isTyping, analysisStatus]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const clientMessageId = crypto.randomUUID();
    sendMessage(input, clientMessageId);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isFirstUserMessage =
    messages.filter((m) => m.role === "user").length === 0;
  const suggestedPrompts = [
    "Bisa pindah besok pagi?",
    "Jadwal sore minggu ini ada?",
    "Batalkan sesi ini saja.",
  ];

  return (
    <div className="flex flex-col h-[340px] justify-between">
      <ScrollArea className="flex-1 pr-2" ref={scrollRef}>
        <div className="space-y-1.5 pb-2">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#64748B] ml-2 mt-2">
              <Loader2 className="animate-spin" size={13} />
              Memproses permintaan Anda...
            </div>
          )}

          <ProposedSlotList />
        </div>
      </ScrollArea>

      {/* Area Komposer (Bawah) */}
      <div className="pt-2 border-t border-[#E2E8F0] mt-1 shrink-0">
        {isFirstUserMessage && (
          <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setInput(prompt)}
                className="whitespace-nowrap text-[11px] bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] px-2.5 py-1 rounded-full hover:bg-[#F1F5F9] transition-colors cursor-pointer">
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik permintaan perubahan jadwal..."
            className="min-h-[42px] max-h-[80px] resize-none bg-[#F8FAFC] text-xs py-2.5"
            disabled={isTyping || analysisStatus === "pending"}
          />
          <Button
            className="h-[42px] w-[42px] bg-[#65C466] hover:bg-[#52A353] flex-shrink-0 cursor-pointer"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}>
            <SendHorizontal size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
