
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Sparkles, Loader2, User, Bot, HelpCircle, Headphones } from "lucide-react";
import { askAiAssistant } from "@/ai/flows/ai-assistant-flow";
import { cn } from "@/lib/utils";
import { useFirestore, addDocumentNonBlocking, useUser } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AiAssistantChat({ 
  merchantName, 
  segment, 
  uiMode = 'advanced',
  isAdmin = false
}: { 
  merchantName?: string, 
  segment?: string, 
  uiMode?: 'easy' | 'advanced',
  isAdmin?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { 
          role: 'assistant', 
          content: isAdmin 
            ? "Olá, Master Admin! Sou o suporte técnico da infraestrutura Ágil. Como posso ajudar com a gestão dos clusters, tenants ou faturamento global hoje?" 
            : `Olá! Eu sou o Ágil Assist. Sou especialista na plataforma Mercado Ágil. Como posso ajudar na gestão da sua unidade ${merchantName || ''} hoje?` 
        }
      ]);
    }
  }, [isAdmin, merchantName, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    // Detectar solicitação de atendimento humano
    const needsHuman = userMsg.toLowerCase().match(/(atendimento|suporte|humano|falar com alguém|especialista)/);

    if (needsHuman && !isAdmin && user) {
      // Criar Ticket no Firestore para o Master Admin
      addDocumentNonBlocking(collection(db, 'supportTickets'), {
        merchantName: merchantName || 'Desconhecido',
        userEmail: user.email,
        userId: user.uid,
        lastMessage: userMsg,
        status: 'open',
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp()
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Entendi perfeitamente. Acabei de encaminhar sua solicitação para um especialista humano no nosso Centro de Comando Master. Eles entrarão em contato via e-mail ou diretamente por este canal em breve." 
      }]);
      setIsLoading(false);
      return;
    }

    try {
      const result = await askAiAssistant({
        message: isAdmin ? `[CONTEXTO MASTER ADMIN] ${userMsg}` : userMsg,
        merchantName,
        segment,
        uiMode
      });
      setMessages(prev => [...prev, { role: 'assistant', content: result.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Desculpe, tive um pequeno problema técnico na conexão. Poderia repetir sua dúvida?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-body">
      {isOpen ? (
        <Card className="w-[350px] sm:w-[400px] h-[550px] flex flex-col shadow-2xl border-none rounded-[35px] overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          <div className="bg-primary p-6 text-white flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-black italic text-lg leading-none">Ágil Assist</h3>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1">
                  {isAdmin ? 'Suporte Master Infra' : 'Especialista de Suporte'}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose} 
              className="text-white hover:bg-white/10 rounded-full h-10 w-10 z-20"
            >
              <X className="h-6 w-6" />
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
                  "p-4 rounded-2xl text-sm font-medium shadow-sm max-w-[85%] whitespace-pre-wrap leading-relaxed",
                  msg.role === 'user' ? "bg-white text-slate-700 rounded-tr-none" : "bg-primary/10 text-slate-800 rounded-tl-none"
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
                  <span className="text-xs font-bold text-primary italic">Consultando conhecimento...</span>
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
                placeholder="Como faço para..." 
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
            <p className="text-[8px] text-center text-slate-400 mt-3 font-bold uppercase tracking-widest italic">Suporte Mercado Ágil v3.2</p>
          </div>
        </Card>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 bg-primary text-white rounded-[24px] shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group relative border-4 border-white"
        >
          <MessageCircle className="h-8 w-8 group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-2 -right-2 h-6 w-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
            <div className="h-2 w-2 bg-white rounded-full animate-ping"></div>
          </div>
          <span className="absolute right-20 bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest pointer-events-none italic shadow-2xl">
            SUPORTE ÁGIL
          </span>
        </button>
      )}
    </div>
  );
}
