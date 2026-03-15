
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Star, Gift, Users, Trophy, Sparkles, Settings, Wallet, Crown, Flame, Zap } from "lucide-react";
import Link from 'next/link';

export default function MerchantLoyalty({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);

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
            <Zap className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${slug}/loyalty`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold">
            <Crown className="h-5 w-5" /> Fidelidade & Cashback
          </Link>
          <Link href={`/merchant/${slug}/customers`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Users className="h-5 w-5" /> CRM
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Engine de Recompensas</h1>
            <p className="text-slate-500 font-medium">Gamificação e retenção ativa de clientes recorrentes.</p>
          </div>
          <Button className="bg-primary rounded-2xl h-12 gap-2 font-black italic shadow-xl shadow-primary/20 px-8">
            <Sparkles className="h-5 w-5" /> Ativar Booster de Vendas
          </Button>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
           <div className="lg:col-span-2 space-y-8">
              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                 <CardTitle className="text-2xl font-black italic mb-8 flex items-center gap-3">
                    <Wallet className="h-6 w-6 text-primary" /> Configuração de Cashback
                 </CardTitle>
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border">
                          <div className="space-y-1">
                             <p className="font-black text-slate-900 italic">Habilitar Cashback</p>
                             <p className="text-xs text-slate-400 font-medium">Retorno de parte do valor para a carteira.</p>
                          </div>
                          <Switch defaultChecked />
                       </div>
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Porcentagem de Retorno (%)</Label>
                          <Input type="number" defaultValue="5" className="h-14 rounded-2xl bg-slate-50 border-none font-black text-xl text-primary" />
                       </div>
                    </div>
                    <div className="p-8 bg-primary rounded-[35px] text-white flex flex-col justify-center relative overflow-hidden">
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Previsão AI de Retenção</p>
                       <p className="text-4xl font-black italic mt-4">+28%</p>
                       <p className="text-xs font-bold mt-2 opacity-70">Aumento estimado em pedidos recorrentes nos próximos 60 dias.</p>
                       <Flame className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10" />
                    </div>
                 </div>
              </Card>

              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                 <CardTitle className="text-2xl font-black italic mb-8 flex items-center gap-3">
                    <Trophy className="h-6 w-6 text-yellow-500" /> Níveis de Fidelidade (Tiers)
                 </CardTitle>
                 <div className="space-y-4">
                    {[
                      { name: 'Bronze', color: 'bg-orange-100 text-orange-700', points: '0 - 500', perk: 'Badge exclusiva' },
                      { name: 'Silver', color: 'bg-slate-100 text-slate-700', points: '501 - 2000', perk: '5% de desconto extra' },
                      { name: 'Gold', color: 'bg-yellow-100 text-yellow-700', points: '2001+', perk: 'Itens exclusivos & Frete Grátis' },
                    ].map((tier) => (
                      <div key={tier.name} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-dashed hover:border-primary transition-all group">
                         <div className="flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black ${tier.color}`}>
                               {tier.name[0]}
                            </div>
                            <div>
                               <p className="font-black text-slate-900">{tier.name}</p>
                               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{tier.points} pontos</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <Badge className={`${tier.color} border-none font-black italic`}>{tier.perk}</Badge>
                         </div>
                      </div>
                    ))}
                 </div>
              </Card>
           </div>

           <div className="space-y-8">
              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-slate-900 text-white relative overflow-hidden">
                 <div className="relative z-10 space-y-6">
                    <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                       <Gift className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tighter">Brindes Automáticos</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                       Configure itens que são adicionados automaticamente ao carrinho de clientes VIP quando atingem um valor mínimo de compra.
                    </p>
                    <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 text-white font-black hover:bg-white hover:text-slate-900 transition-all">Configurar Brindes</Button>
                 </div>
                 <Sparkles className="absolute -bottom-10 -right-10 h-40 w-40 opacity-5" />
              </Card>

              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white h-fit">
                 <CardTitle className="text-xl font-black italic mb-6">Top Clientes (Mês)</CardTitle>
                 <div className="space-y-4">
                    {[
                      { name: 'João Silva', points: 4250, tier: 'Gold' },
                      { name: 'Maria Santos', points: 1840, tier: 'Silver' },
                      { name: 'Ricardo Oliveira', points: 1200, tier: 'Silver' },
                    ].map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                         <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-slate-400 w-4">#{i+1}</span>
                            <p className="text-sm font-bold text-slate-700">{c.name}</p>
                         </div>
                         <Badge variant="outline" className="text-[8px] font-black border-slate-200">{c.points} pts</Badge>
                      </div>
                    ))}
                 </div>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
