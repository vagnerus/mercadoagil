
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  BrainCircuit, TrendingUp, Megaphone, BarChart3, 
  Sparkles, Loader2, Copy, Check, MessageSquare,
  Zap, Globe, Wallet, Target
} from "lucide-react";
import { getBusinessAdvice } from "@/ai/flows/business-advisor-flow";
import { generateMarketingCampaign } from "@/ai/flows/generate-marketing-campaign-flow";
import { useToast } from "@/hooks/use-toast";

export function AiBusinessHub({ merchantName }: { merchantName: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateBI = async () => {
    setLoading('bi');
    try {
      const data = await getBusinessAdvice({
        merchantName,
        salesData: [
          { date: '2024-03-20', total: 1200, itemCount: 12 },
          { date: '2024-03-21', total: 1500, itemCount: 15 }
        ],
        topProducts: [
          { name: 'Serviço Master', quantity: 45 },
          { name: 'Produto Elite', quantity: 32 }
        ]
      });
      setResult({ type: 'bi', data });
    } catch (e) {
      toast({ title: "Erro", description: "Falha ao gerar insights de BI.", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateMarketing = async () => {
    setLoading('mkt');
    try {
      const data = await generateMarketingCampaign({
        merchantName,
        promotionGoal: "Aumentar vendas no final de semana e atrair novos clientes via indicação.",
        featuredProducts: ["Combo VIP", "Serviço Completo"]
      });
      setResult({ type: 'mkt', data });
    } catch (e) {
      toast({ title: "Erro", description: "Falha ao gerar campanha.", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
    toast({ title: "Copiado!" });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary rounded-2xl h-12 gap-2 shadow-xl shadow-primary/20 font-black italic px-8 text-white group">
          <BrainCircuit className="h-5 w-5 group-hover:rotate-12 transition-transform" /> 
          BUSINESS HUB IA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl p-0 rounded-[45px] border-none shadow-2xl overflow-hidden font-body bg-white">
        <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <Badge className="bg-primary text-white border-none font-black italic mb-4">MERCADO ÁGIL INTELLIGENCE</Badge>
            <DialogTitle className="text-4xl font-black italic uppercase tracking-tighter">Business Elite Hub</DialogTitle>
            <p className="text-slate-400 font-medium italic mt-2">Extraordinária suite de gestão e growth movida por IA.</p>
          </div>
          <Sparkles className="absolute -bottom-10 -right-10 h-64 w-64 opacity-5" />
        </div>

        <div className="p-10 grid md:grid-cols-12 gap-8 max-h-[70vh] overflow-y-auto no-scrollbar">
          <div className="md:col-span-4 space-y-4">
            <button 
              onClick={handleGenerateBI}
              className={cn(
                "w-full p-6 rounded-[35px] text-left transition-all border-2",
                loading === 'bi' ? "border-primary animate-pulse" : "border-slate-50 bg-slate-50 hover:border-primary/20"
              )}
            >
              <BarChart3 className="h-8 w-8 text-primary mb-4" />
              <h4 className="font-black italic uppercase text-sm">Dashboard BI IA</h4>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Análise de dados e insights preditivos.</p>
            </button>

            <button 
              onClick={handleGenerateMarketing}
              className={cn(
                "w-full p-6 rounded-[35px] text-left transition-all border-2",
                loading === 'mkt' ? "border-accent animate-pulse" : "border-slate-50 bg-slate-50 hover:border-accent/20"
              )}
            >
              <Megaphone className="h-8 w-8 text-accent mb-4" />
              <h4 className="font-black italic uppercase text-sm">Marketing Generator</h4>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Scripts de vendas e legendas sociais.</p>
            </button>

            <div className="p-6 rounded-[35px] bg-slate-900 text-white flex flex-col items-center text-center space-y-4">
               <Zap className="h-10 w-10 text-primary" />
               <p className="text-[10px] font-black uppercase text-slate-400">Status da Engine</p>
               <Badge className="bg-green-500/20 text-green-500 border-none font-black italic">ULTRA-PERFORMANCE</Badge>
            </div>
          </div>

          <div className="md:col-span-8">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-slate-100 rounded-[45px] p-10">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center">
                  <BrainCircuit className="h-10 w-10 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-xl font-black italic text-slate-900 uppercase">Aguardando Comando</h3>
                  <p className="text-sm text-slate-400 font-medium italic mt-2">Selecione uma ferramenta extraordinária à esquerda para começar.</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="font-black italic text-slate-400 uppercase tracking-widest">Processando Inteligência...</p>
              </div>
            )}

            {result?.type === 'bi' && (
              <div className="space-y-8 animate-in fade-in zoom-in-95">
                <div className="p-8 bg-primary/5 rounded-[40px] border border-primary/10">
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-black italic uppercase text-primary">Performance Summary</h3>
                  </div>
                  <p className="text-slate-700 font-medium italic leading-relaxed">{result.data.summary}</p>
                </div>

                <div className="grid gap-4">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-4">Conselhos Estratégicos</h4>
                  {result.data.advice.map((advice: string, i: number) => (
                    <div key={i} className="p-5 bg-white border rounded-3xl flex gap-4 items-start shadow-sm">
                      <div className="h-8 w-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black italic shrink-0">{i+1}</div>
                      <p className="text-sm font-bold text-slate-600 italic">{advice}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result?.type === 'mkt' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">WhatsApp Sales Script</h4>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.data.whatsappMessage, 'wa')} className="text-green-600 gap-2 font-bold italic">
                      {copied === 'wa' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copiar
                    </Button>
                  </div>
                  <div className="p-8 bg-green-50 rounded-[40px] border border-green-100 text-sm font-medium text-slate-700 whitespace-pre-wrap italic">
                    {result.data.whatsappMessage}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Instagram Caption</h4>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.data.instagramCaption, 'ig')} className="text-primary gap-2 font-bold italic">
                      {copied === 'ig' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copiar
                    </Button>
                  </div>
                  <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 text-sm font-medium text-slate-700 whitespace-pre-wrap italic">
                    {result.data.instagramCaption}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
