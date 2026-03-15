
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Scissors, Plus, Search, Edit2, Trash2, 
  Clock, DollarSign, Users, LayoutDashboard, 
  Calendar as CalendarIcon, Briefcase, Sparkles
} from "lucide-react";
import Link from 'next/link';
import { MOCK_SERVICES, Service } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export default function MerchantServices({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    toast({ title: "Serviço Removido", description: "O item foi excluído do catálogo de serviços." });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
          <Link href={`/merchant/${slug}/appointments`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><CalendarIcon className="h-5 w-5" /> Agenda</Link>
          <Link href={`/merchant/${slug}/services`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><Scissors className="h-5 w-5" /> Serviços & Preços</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Gestão de Serviços</h1>
            <p className="text-slate-500 font-medium">Configuração de durações, comissões e precificação por vertical.</p>
          </div>
          <Button className="bg-slate-900 rounded-2xl h-12 gap-2 font-bold px-6 shadow-xl shadow-slate-200">
            <Plus className="h-4 w-4" /> Novo Serviço
          </Button>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
           <div className="lg:col-span-2 space-y-6">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                 <Input className="pl-12 h-14 bg-white border-none rounded-2xl shadow-sm font-bold" placeholder="Buscar serviços por nome ou categoria..." />
              </div>

              <div className="grid gap-4">
                 {services.map(service => (
                   <Card key={service.id} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:ring-2 ring-primary transition-all">
                      <CardContent className="p-6 flex items-center justify-between">
                         <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                               <Scissors className="h-8 w-8" />
                            </div>
                            <div>
                               <p className="font-black text-slate-900 italic text-xl uppercase leading-tight">{service.name}</p>
                               <div className="flex items-center gap-4 mt-2">
                                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase"><Clock className="h-3.5 w-3.5" /> {service.duration} min</span>
                                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase"><DollarSign className="h-3.5 w-3.5" /> Comissão: {service.commission}%</span>
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-6">
                            <div className="text-right">
                               <p className="text-2xl font-black text-primary italic">R$ {service.price.toFixed(2)}</p>
                               <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[8px] uppercase mt-1">Ativo na Vitrine</Badge>
                            </div>
                            <div className="flex flex-col gap-2">
                               <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-slate-100"><Edit2 className="h-4 w-4 text-slate-400" /></Button>
                               <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)} className="rounded-xl h-10 w-10 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4 text-slate-400" /></Button>
                            </div>
                         </div>
                      </CardContent>
                   </Card>
                 ))}
              </div>
           </div>

           <div className="space-y-8">
              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-primary text-white relative overflow-hidden">
                 <div className="relative z-10 space-y-6">
                    <Sparkles className="h-10 w-10 text-white/40" />
                    <h3 className="text-2xl font-black italic tracking-tighter">AI Commission Optimizer</h3>
                    <p className="text-white/70 text-sm font-medium leading-relaxed">
                       Nossa IA analisa a margem de lucro e sugere comissões ideais para motivar sua equipe sem prejudicar o caixa.
                    </p>
                    <Button className="w-full h-14 bg-white text-primary font-black italic rounded-2xl shadow-2xl">Otimizar Comissões</Button>
                 </div>
                 <DollarSign className="absolute -bottom-10 -right-10 h-40 w-40 opacity-5" />
              </Card>

              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                 <h3 className="text-xl font-black italic mb-6">Categorias Pro</h3>
                 <div className="space-y-3">
                    {['Corte & Barba', 'Tratamentos', 'Químicas', 'Pacotes VIP'].map(cat => (
                      <div key={cat} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-dashed hover:border-primary transition-all cursor-pointer">
                         <span className="font-bold text-xs text-slate-700 uppercase tracking-widest">{cat}</span>
                         <Badge variant="secondary" className="font-black text-[10px] bg-white">12 Itens</Badge>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full h-12 rounded-xl border-dashed gap-2 font-bold mt-2"><Plus className="h-4 w-4" /> Nova Categoria</Button>
                 </div>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
