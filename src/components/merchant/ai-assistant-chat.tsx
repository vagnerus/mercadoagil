
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, X, Send, Sparkles, Loader2, User, Bot, HelpCircle, Headphones, ArrowLeft, AlertCircle } from "lucide-react";
import { askAiAssistant } from "@/ai/flows/ai-assistant-flow";
import { cn } from "@/lib/utils";
import { useFirestore, addDocumentNonBlocking, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, query, where, limit } from 'firebase/firestore';
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
  const [isSupportForm, setIsSupportForm] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const [supportFormData, setSupportFormData] = useState({
    subject: "",
    reason: "",
    urgency: "normal"
  });

  const userProfileQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'platformUsers'), where('email', '==', user.email), limit(1));
  }, [db, user]);
  const { data: userProfiles } = useCollection(userProfileQuery);
  const merchantId = userProfiles?.[0]?.merchantId || 'unknown';

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
  }, [messages, isSupportForm]);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    setIsSupportForm(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

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

  const handleCreateTicket = () => {
    if (!supportFormData.subject || !supportFormData.reason || !user) {
      toast({ title: "Preencha tudo", description: "Todos os campos são obrigatórios.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    addDocumentNonBlocking(collection(db, 'supportTickets'), {
      merchantId: merchantId,
      merchantName: merchantName || 'Instância sem Nome',
      userEmail: user.email,
      userId: user.uid,
      subject: supportFormData.subject,
      reason: supportFormData.reason,
      urgency: supportFormData.urgency,
      status: 'open',
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });

    setTimeout(() => {
      setIsLoading(false);
      setIsSupportForm(false);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Chamado enviado com sucesso! Assunto: "${supportFormData.subject}". Nível de Urgência: ${supportFormData.urgency.toUpperCase()}. Nosso time master entrará em contato em breve.` 
      }]);
      setSupportFormData({ subject: "", reason: "", urgency: "normal" });
      toast({ title: "Chamado Aberto", description: "O Master Admin foi notificado." });
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-body">
      {isOpen ? (
        <Card className="w-[350px] sm:w-[400px] h-[600px] flex flex-col shadow-2xl border-none rounded-[35px] overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          <div className="bg-primary p-6 text-white flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-3">
              {isSupportForm ? (
                <Button variant="ghost" size="icon" onClick={() => setIsSupportForm(false)} className="text-white hover:bg-white/10 rounded-full h-8 w-8">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              ) : (
                <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
              )}
              <div>
                <h3 className="font-black italic text-lg leading-none">{isSupportForm ? 'Novo Chamado' : 'Ágil Assist'}</h3>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1">
                  {isAdmin ? 'Suporte Master Infra' : isSupportForm ? 'Falar com Humano' : 'Especialista de Suporte'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              {!isAdmin && !isSupportForm && (
                <Button 
                  onClick={() => setIsSupportForm(true)}
                  className="bg-white text-primary hover:bg-white/90 rounded-xl h-8 px-3 font-black text-[10px] uppercase shadow-lg"
                >
                  <Headphones className="h-3 w-3 mr-1.5" /> SUPORTE
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleClose} 
                className="text-white hover:bg-white/10 rounded-full h-8 w-8"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Sparkles className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10" />
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 no-scrollbar">
            {isSupportForm ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 shrink-0" />
                  <p className="text-[10px] font-bold text-blue-700 leading-tight">Preencha os detalhes abaixo para que um especialista Master possa intervir na sua instância.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Assunto do Chamado</Label>
                    <Input 
                      placeholder="Ex: Erro no PDV, Dúvida em Cobrança" 
                      value={supportFormData.subject}
                      onChange={e => setSupportFormData({...supportFormData, subject: e.target.value})}
                      className="rounded-2xl h-12 bg-white border-none font-bold text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nível de Urgência</Label>
                    <Select value={supportFormData.urgency} onValueChange={v => setSupportFormData({...supportFormData, urgency: v})}>
                      <SelectTrigger className="rounded-2xl h-12 bg-white border-none font-bold text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-xl">
                        <SelectItem value="normal" className="font-bold">Normal (SLA 24h)</SelectItem>
                        <SelectItem value="moderate" className="font-bold text-orange-600">Moderado (SLA 4h)</SelectItem>
                        <SelectItem value="high" className="font-bold text-red-600">Grave (SLA 1h)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Motivo da Requisição</Label>
                    <Textarea 
                      placeholder="Descreva detalhadamente o problema..."
                      value={supportFormData.reason}
                      onChange={e => setSupportFormData({...supportFormData, reason: e.target.value})}
                      className="rounded-2xl min-h-[120px] bg-white border-none font-medium text-sm italic"
                    />
                  </div>

                  <Button 
                    onClick={handleCreateTicket}
                    disabled={isLoading}
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-[25px] font-black italic shadow-xl gap-2 mt-4"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-4 w-4" /> ABRIR CHAMADO AGORA</>}
                  </Button>
                </div>
              </div>
            ) : (
              <div ref={scrollRef} className="space-y-4 h-full">
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
            )}
          </div>

          {!isSupportForm && (
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
          )}
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
