
"use client";

import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Truck, MapPin, Navigation, Clock, 
  CheckCircle2, AlertTriangle, Users, 
  Settings, Phone, ShoppingBag, LayoutDashboard, Plus, Search, Activity, Monitor
} from "lucide-react";
import Link from 'next/link';
import { MOCK_STAFF } from "@/lib/mock-data";

const fleetData = [
  { id: 'f1', driver: 'Marcos Motoboy', status: 'In Delivery', target: 'Rua das Flores, 123', eta: '12 min', battery: '85%' },
  { id: 'f2', driver: 'Carla Entregas', status: 'Available', target: 'Restaurante', eta: '0 min', battery: '92%' },
  { id: 'f3', driver: 'João Rápido', status: 'In Delivery', target: 'Av. Paulista, 1500', eta: '24 min', battery: '12%' },
];

export default function MerchantLogistics({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary">
            MERCADO ÁGIL
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${slug}/logistics`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold">
            <Truck className="h-5 w-5" /> Logística & Frota
          </Link>
          <Link href={`/merchant/${slug}/pdv`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Monitor className="h-5 w-5 text-primary" /> PDV Cloud
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Gestão de Frota Própria</h1>
            <p className="text-slate-500 font-medium">Monitoramento de entregadores, rotas e tempo de despacho.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-2xl h-12 gap-2 font-bold px-6"><Settings className="h-4 w-4" /> Config. Taxas</Button>
            <Button className="bg-slate-900 rounded-2xl h-12 gap-2 font-bold px-6 shadow-xl shadow-slate-200">
              <Plus className="h-4 w-4" /> Novo Entregador
            </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-4 mb-10">
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tempo Médio Despacho</p>
              <p className="text-3xl font-black italic mt-2 text-slate-900">8.4 min</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entregadores Ativos</p>
              <div className="flex items-center gap-3 mt-2">
                 <p className="text-3xl font-black italic text-slate-900">12</p>
                 <Badge className="bg-green-100 text-green-700 font-black border-none px-3">Capacidade 100%</Badge>
              </div>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-primary text-white relative overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Em Trânsito</p>
              <p className="text-4xl font-black italic mt-2">08 Rotas</p>
              <Navigation className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10" />
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-slate-900 text-white">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Custo Logístico (Mês)</p>
              <p className="text-3xl font-black italic mt-2 text-primary">R$ 4.250</p>
           </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
           <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black italic">Monitor de Rotas Ativas</h2>
                    <Badge variant="outline" className="animate-pulse gap-2 font-black italic border-primary text-primary">
                       <Activity className="h-3 w-3" /> LIVE TRACKING
                    </Badge>
                 </div>
                 <div className="space-y-4">
                    {fleetData.map(fleet => (
                      <div key={fleet.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[35px] border border-dashed border-slate-200">
                         <div className="flex items-center gap-4">
                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${fleet.status === 'Available' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                               <Truck className="h-6 w-6" />
                            </div>
                            <div>
                               <p className="font-black text-slate-900 italic uppercase">{fleet.driver}</p>
                               <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-1">
                                  <MapPin className="h-3 w-3" /> {fleet.target}
                               </p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="font-black text-primary italic text-xl">{fleet.eta}</p>
                            <Badge className={`mt-1 border-none font-black text-[8px] uppercase ${fleet.status === 'Available' ? 'bg-green-500' : 'bg-blue-500'}`}>
                               {fleet.status}
                            </Badge>
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
                       <Navigation className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tighter">AI Fleet Dispatcher</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                       Nossa IA agrupa pedidos por proximidade geográfica automaticamente para economizar 30% em combustível e tempo.
                    </p>
                    <Button className="w-full h-14 bg-white text-slate-900 font-black italic rounded-2xl hover:bg-slate-50 transition-all shadow-2xl">Ativar Roteirização IA</Button>
                 </div>
              </Card>

              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                 <h3 className="text-xl font-black italic mb-6">Suporte & Alertas</h3>
                 <div className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3">
                       <AlertTriangle className="h-5 w-5 text-red-500" />
                       <p className="text-xs font-bold text-red-700">Entregador 'João Rápido' com bateria baixa (12%)</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                       <Users className="h-5 w-5 text-blue-500" />
                       <p className="text-xs font-bold text-blue-700">Pico de demanda: Sugerimos chamar reforço logístico.</p>
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
