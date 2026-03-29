
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Star, MessageSquare, BrainCircuit, TrendingUp, 
  LayoutDashboard, Users, Target, ArrowUpRight, 
  Sparkles, Loader2, ThumbsUp, ThumbsDown, 
  PieChart, History, Settings, Megaphone
} from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

const reviews = [
  { id: 'rv1', customer: 'João Silva', rating: 5, comment: 'Excelente atendimento e o corte ficou perfeito!', sentiment: 'Positive', date: '2 horas atrás' },
  { id: 'rv2', customer: 'Maria Santos', rating: 4, comment: 'Muito bom, mas demorou um pouco na recepção.', sentiment: 'Neutral', date: '5 horas atrás' },
  { id: 'rv3', customer: 'Ricardo O.', rating: 2, comment: 'O ambiente estava muito barulhento hoje.', sentiment: 'Negative', date: '1 dia atrás' },
];

export default function MerchantFeedback({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const { toast } = useToast();
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  const handleAiReply = (id: string) => {
    setAnalyzing(id);
    setTimeout(() => {
      setAnalyzing(null);
      toast({ title: "Resposta IA Gerada", description: "A IA criou uma resposta empática e profissional." });
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
      <aside className="w-64 border-r dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">
            MERCADO ÁGIL
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Início
          </Link>
          <Link href={`/merchant/${slug}/feedback`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold">
            <Star className="h-5 w-5" /> Sentiment AI
          </Link>
          <Link href={`/merchant/${slug}/customers`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium">
            <Users className="h-5 w-5" /> Clientes
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-4 lg:p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">Sentiment & CX Monitor</h1>
            <p className="text-slate-500 font-medium">Análise de reviews via processamento de linguagem natural.</p>
          </div>
          <div className="flex gap-2">
             <Badge className="bg-green-500 text-white border-none font-black italic px-4 py-2 rounded-xl text-[10px]">IA ENGINE ACTIVE</Badge>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-4 mb-10">
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white dark:bg-slate-900 flex flex-col items-center text-center">
              <Star className="h-8 w-8 text-yellow-400 mb-3 fill-yellow-400" />
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nota Média Global</p>
              <p className="text-3xl font-black italic text-slate-900 dark:text-white">4.82</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white dark:bg-slate-900 flex flex-col items-center text-center border-2 border-green-100 dark:border-green-900">
              <ThumbsUp className="h-8 w-8 text-green-500 mb-3" />
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sentimento Positivo</p>
              <p className="text-3xl font-black italic text-green-600">92%</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white dark:bg-slate-900 flex flex-col items-center text-center">
              <Megaphone className="h-8 w-8 text-primary mb-3" />
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">NPS Score</p>
              <p className="text-3xl font-black italic text-primary">84</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-slate-900 text-white flex flex-col items-center text-center">
              <History className="h-8 w-8 text-primary mb-3" />
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Response Rate</p>
              <p className="text-3xl font-black italic">100%</p>
           </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
           <Card className="lg:col-span-8 border-none shadow-sm rounded-[40px] overflow-hidden bg-white dark:bg-slate-900">
              <CardHeader className="p-8 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                 <CardTitle className="text-xl font-black italic dark:text-white">Últimas Avaliações & Sentiment Hub</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y dark:divide-slate-800">
                    {reviews.map(rv => (
                      <div key={rv.id} className="p-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                            <div className="flex items-center gap-4">
                               <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400">
                                  {rv.customer[0]}
                               </div>
                               <div>
                                  <p className="font-black text-slate-900 dark:text-white italic uppercase">{rv.customer}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                     {[...Array(rv.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                                  </div>
                               </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <Badge className={cn(
                                 "border-none font-black italic text-[8px] uppercase px-3 py-1",
                                 rv.sentiment === 'Positive' ? "bg-green-100 text-green-600" : 
                                 rv.sentiment === 'Negative' ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600"
                               )}>
                                  {rv.sentiment}
                               </Badge>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rv.date}</span>
                            </div>
                         </div>
                         <p className="text-sm font-medium text-slate-600 dark:text-slate-400 italic mb-6 leading-relaxed">"{rv.comment}"</p>
                         <div className="flex justify-end">
                            <Button 
                              onClick={() => handleAiReply(rv.id)}
                              disabled={analyzing === rv.id}
                              className="bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl h-10 font-black italic text-xs gap-2 px-6"
                            >
                               {analyzing === rv.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                               GERAR RESPOSTA IA
                            </Button>
                         </div>
                      </div>
                    ))}
                 </div>
              </CardContent>
           </Card>

           <div className="lg:col-span-4 space-y-6">
              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-slate-900 text-white relative overflow-hidden">
                 <div className="relative z-10 space-y-6">
                    <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                       <Target className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-tight">Insight Corretivo</h3>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed italic">
                       "Detectamos um padrão recorrente de reclamações sobre 'Barulho na Recepção'. Recomendamos isolamento acústico ou ajuste na trilha sonora ambiente."
                    </p>
                    <Badge className="bg-primary text-white border-none font-black italic">AÇÃO RECOMENDADA</Badge>
                 </div>
                 <Sparkles className="absolute -bottom-10 -right-10 h-40 w-40 opacity-5" />
              </Card>

              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white dark:bg-slate-900">
                 <CardTitle className="text-lg font-black italic mb-6 dark:text-white uppercase">Cloud Sentiment Mix</CardTitle>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                          <span>Alegria / Satisfação</span>
                          <span className="text-green-500">82%</span>
                       </div>
                       <Progress value={82} className="h-1.5 bg-slate-100 dark:bg-slate-800" />
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                          <span>Dúvida / Incerteza</span>
                          <span className="text-blue-500">12%</span>
                       </div>
                       <Progress value={12} className="h-1.5 bg-slate-100 dark:bg-slate-800" />
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                          <span>Irritação / Pressa</span>
                          <span className="text-red-500">6%</span>
                       </div>
                       <Progress value={6} className="h-1.5 bg-slate-100 dark:bg-slate-800" />
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
