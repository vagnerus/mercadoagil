"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Sparkles, Loader2, User, Bot, HelpCircle } from "lucide-react";
import { askAiAssistant } from "@/ai/flows/ai-assistant-flow";
import { cn } from "@/lib/utils";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AiAssistantChat({ merchantName, segment }: { merchantName?: string, segment?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Olá! Eu sou o Ágil Assist. Como posso ajudar na sua loja ${merchantName || ''} hoje?` }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const result = await askAiAssistant({
        message: userMsg,
        merchantName,
        segment
      });
      setMessages(prev => [...prev, { role: 'assistant', content: result.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Desculpe, tive um problema técnico. Pode repetir?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-body">
      {isOpen ? (
        <Card className="w-[350px] sm:w-[400px] h-[500px] flex flex-col shadow-2xl border-none rounded-[35px] overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          <div className="bg-primary p-6 text-white flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-black italic text-lg leading-none">Ágil Assist</h3>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1">IA de Suporte Ativa</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 rounded-full">
              <X className="h-5 w-5" />
            </Button>
            <Sparkles className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10" />
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 no-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                <div className={cn(
                  "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                  msg.role === 'user' ? "bg-slate-200 text-slate-600" : "bg-primary text-white"
                )}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl text-sm font-medium shadow-sm max-w-[80%]",
                  msg.role === 'user' ? "bg-white text-slate-700" : "bg-primary/10 text-slate-800"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-xl bg-primary text-white flex items-center justify-center animate-pulse">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="p-4 bg-primary/10 rounded-2xl flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-xs font-bold text-primary italic">Pensando...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t">
            <div className="relative">
              <Input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Como posso ajudar?" 
                className="h-12 rounded-2xl bg-slate-50 border-none font-bold pr-12 focus:ring-primary"
              />
              <Button 
                onClick={handleSend}
                disabled={isLoading}
                size="icon" 
                className="absolute right-1.5 top-1.5 h-9 w-9 bg-primary hover:bg-primary/90 rounded-xl"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 bg-primary text-white rounded-[24px] shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group relative"
        >
          <MessageCircle className="h-8 w-8 group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-2 -right-2 h-6 w-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
            <div className="h-2 w-2 bg-white rounded-full animate-ping"></div>
          </div>
          <span className="absolute right-20 bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest pointer-events-none italic">
            Falar com IA
          </span>
        </button>
      )}
    </div>
  );
}
