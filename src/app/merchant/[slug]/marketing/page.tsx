
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Megaphone, MessageCircle, Instagram, Mail, TrendingUp, Sparkles, Plus, Search, Filter, Copy, Check, MousePointer2 } from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

export default function MerchantMarketing({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast({ title: "Copiado!", description: "Conteúdo pronto para postar." });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary">
            MERCADO ÁGIL
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <TrendingUp className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${slug}/marketing`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold">
            <Megaphone className="h-5 w-5" /> Central de Growth
          </Link>
          <Link href={`/merchant/${slug}/coupons`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <MousePointer2 className="h-5 w-5" /> Cupons & Ofertas
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Marketing & Vendas IA</h1>
            <p className="text-slate-500 font-medium">Ecossistema de aquisição e recuperação de clientes.</p>
          </div>
          <div className="flex gap-3">
             <Button className="bg-slate-900 rounded-2xl h-12 gap-2 font-bold shadow-xl shadow-slate-200">
                <Plus className="h-4 w-4" /> Nova Campanha
             </Button>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
           <div className="lg:col-span-2 space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                 <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white">
                    <div className="bg-green-100 h-12 w-12 rounded-2xl flex items-center justify-center mb-4">
                       <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Conversão WhatsApp</p>
                    <p className="text-2xl font-black italic text-slate-900 mt-1">12.5%</p>
                 </Card>
                 <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white">
                    <div className="bg-pink-100 h-12 w-12 rounded-2xl flex items-center justify-center mb-4">
                       <Instagram className="h-6 w-6 text-pink-600" />
                    </div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Reach Orgânico</p>
                    <p className="text-2xl font-black italic text-slate-900 mt-1">4.2k</p>
                 </Card>
                 <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white">
                    <div className="bg-blue-100 h-12 w-12 rounded-2xl flex items-center justify-center mb-4">
                       <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email Open Rate</p>
                    <p className="text-2xl font-black italic text-slate-900 mt-1">24.8%</p>
                 </Card>
              </div>

              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                 <CardTitle className="text-2xl font-black italic mb-8 flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-primary" /> Sugestões AI para Hoje
                 </CardTitle>
                 <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-[35px] border-2 border-dashed border-slate-200 relative">
                       <Badge className="absolute -top-3 left-8 bg-primary text-white font-black italic border-none px-4">Recuperação de Carrinho</Badge>
                       <p className="text-sm font-bold text-slate-600 leading-relaxed mb-6 italic pt-2">
                         "Oi [NOME]! Notamos que você deixou algo especial no seu carrinho no Burger King do Zé. Use o cupom VOLTEI10 para garantir 10% de desconto e frete grátis nos próximos 30 minutos! 🍔🔥"
                       </p>
                       <div className="flex justify-end">
                          <Button 
                            onClick={() => copyToClipboard("Oi! Notamos que você deixou algo especial...", "c1")}
                            variant="ghost" 
                            className="rounded-xl gap-2 font-black italic text-primary"
                          >
                             {copied === 'c1' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                             Copiar Script
                          </Button>
                       </div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-[35px] border-2 border-dashed border-slate-200 relative">
                       <Badge className="absolute -top-3 left-8 bg-accent text-white font-black italic border-none px-4">Post Instagram (Legenda)</Badge>
                       <p className="text-sm font-bold text-slate-600 leading-relaxed mb-6 italic pt-2">
                         "Sextou com S de SUCULÊNCIA! 🤤 O nosso X-Tudo Monstro está esperando por você. O verdadeiro sabor artesanal que derrete na boca. Peça agora pelo link na bio e receba em casa com embalagem térmica! #MercadoAgil #BurgerGourmet #Sextou"
                       </p>
                       <div className="flex justify-end">
                          <Button 
                            onClick={() => copyToClipboard("Sextou com S de SUCULÊNCIA!...", "c2")}
                            variant="ghost" 
                            className="rounded-xl gap-2 font-black italic text-accent"
                          >
                             {copied === 'c2' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                             Copiar Script
                          </Button>
                       </div>
                    </div>
                 </div>
              </Card>
           </div>

           <div className="space-y-8">
              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-primary text-white relative overflow-hidden">
                 <div className="relative z-10 space-y-6">
                    <div className="bg-white/20 h-14 w-14 rounded-2xl flex items-center justify-center">
                       <MousePointer2 className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tighter leading-tight">Campanhas Inteligentes</h3>
                    <p className="text-white/70 text-sm font-medium leading-relaxed">
                       Nossa IA analisa o comportamento dos seus clientes e cria campanhas automáticas de recompra. Ative hoje e aumente seu faturamento em até 35%.
                    </p>
                    <Button className="w-full h-14 bg-white text-primary font-black italic rounded-2xl shadow-2xl hover:bg-slate-50 transition-all">Ativar Automação Pro</Button>
                 </div>
                 <Sparkles className="absolute -bottom-10 -right-10 h-40 w-40 opacity-10" />
              </Card>

              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                 <CardTitle className="text-xl font-black italic mb-6">Metas de Growth</CardTitle>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>Novos Clientes</span>
                          <span className="text-primary">82/100</span>
                       </div>
                       <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[82%] rounded-full"></div>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>Taxa de Retorno</span>
                          <span className="text-accent">65/70%</span>
                       </div>
                       <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-accent w-[92%] rounded-full"></div>
                       </div>
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
