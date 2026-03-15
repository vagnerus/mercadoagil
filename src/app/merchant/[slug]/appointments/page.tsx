
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, Clock, User, Plus, 
  LayoutDashboard, Settings, Users, Scissors, 
  MoreVertical, CheckCircle2, AlertCircle, Phone, 
  Smartphone, Filter, ChevronLeft, ChevronRight,
  TrendingUp, Wallet, Bell, History
} from "lucide-react";
import Link from 'next/link';
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { MOCK_STAFF, MOCK_SERVICES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const appointments = [
  { id: 'ap1', customer: 'João Silva', service: 'Corte Degradê', time: '14:00', duration: 45, staff: 'Ricardo Barber', status: 'confirmed', phone: '(11) 99999-8888' },
  { id: 'ap2', customer: 'Maria Santos', service: 'Coloração Pro', time: '15:30', duration: 90, staff: 'Ana Estética', status: 'pending', phone: '(11) 97777-6666' },
  { id: 'ap3', customer: 'Pedro Souza', service: 'Barba Terapia', time: '16:00', duration: 30, staff: 'Ricardo Barber', status: 'confirmed', phone: '(11) 98888-5555' },
];

export default function MerchantAppointments({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'daily' | 'weekly'>('daily');
  const { toast } = useToast();

  const handleConfirm = (id: string) => {
    toast({ title: "Agendamento Confirmado", description: "Notificação enviada via WhatsApp." });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      {/* Sidebar Mobile Otimizada */}
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><LayoutDashboard className="h-5 w-5" /> Início</Link>
          <Link href={`/merchant/${slug}/appointments`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><CalendarIcon className="h-5 w-5" /> Agenda Global</Link>
          <Link href={`/merchant/${slug}/staff`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Users className="h-5 w-5" /> Profissionais</Link>
          <Link href={`/merchant/${slug}/services`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Scissors className="h-5 w-5" /> Serviços</Link>
          <Link href={`/merchant/${slug}/finance`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Wallet className="h-5 w-5" /> Financeiro</Link>
        </nav>
      </aside>

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Controle de Agenda Mobile</h1>
            <p className="text-slate-500 font-medium">Gestão enterprise de horários e profissionais.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <Button variant="outline" className="rounded-2xl h-12 flex-1 md:flex-none font-bold border-slate-200"><History className="h-4 w-4 mr-2" /> Histórico</Button>
             <Button className="bg-slate-900 rounded-2xl h-12 flex-1 md:flex-none gap-2 font-bold shadow-xl shadow-slate-200"><Plus className="h-4 w-4" /> Novo Horário</Button>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
           {/* Agenda Central */}
           <div className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {MOCK_STAFF.map(staff => (
                   <Card key={staff.id} className="border-none shadow-sm rounded-3xl p-4 bg-white flex items-center gap-3 hover:ring-2 ring-primary transition-all cursor-pointer">
                      <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                         <img src={staff.avatar} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                         <p className="font-black text-[10px] text-slate-900 truncate uppercase">{staff.name.split(' ')[0]}</p>
                         <p className="text-[8px] font-bold text-slate-400 uppercase">08 Marcados</p>
                      </div>
                   </Card>
                 ))}
              </div>

              <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
                 <CardHeader className="p-8 border-b bg-slate-50/30 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                       <CardTitle className="text-xl font-black italic">Agenda do Dia</CardTitle>
                       <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase">{date?.toLocaleDateString()}</Badge>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="ghost" size="icon" className="rounded-xl"><ChevronLeft className="h-5 w-5" /></Button>
                       <Button variant="ghost" size="icon" className="rounded-xl"><ChevronRight className="h-5 w-5" /></Button>
                    </div>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                       {appointments.map(ap => (
                         <div key={ap.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between group hover:bg-slate-50 transition-colors gap-6">
                            <div className="flex items-center gap-6">
                               <div className="text-center w-16">
                                  <p className="text-2xl font-black italic text-slate-900">{ap.time}</p>
                                  <p className="text-[9px] font-black text-slate-400 uppercase">{ap.duration} MIN</p>
                               </div>
                               <div className="h-12 w-1 bg-primary/20 rounded-full hidden md:block"></div>
                               <div>
                                  <div className="flex items-center gap-2">
                                     <p className="font-black text-slate-900 italic text-lg uppercase">{ap.customer}</p>
                                     <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-black text-[8px] uppercase border-none h-5 px-2">{ap.service}</Badge>
                                  </div>
                                  <div className="flex items-center gap-4 mt-1">
                                     <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase"><User className="h-3 w-3" /> {ap.staff}</span>
                                     <span className="text-[10px] font-bold text-primary flex items-center gap-1 uppercase"><Phone className="h-3 w-3" /> {ap.phone}</span>
                                  </div>
                               </div>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                               {ap.status === 'pending' ? (
                                 <Button size="sm" onClick={() => handleConfirm(ap.id)} className="bg-green-500 hover:bg-green-600 rounded-xl h-10 flex-1 md:flex-none px-6 font-black italic text-xs gap-2">
                                    <CheckCircle2 className="h-4 w-4" /> Confirmar
                                 </Button>
                               ) : (
                                 <Badge className="bg-green-100 text-green-700 border-none font-black italic uppercase text-[9px] px-4 py-2 rounded-xl">Confirmado</Badge>
                               )}
                               <Button variant="ghost" size="icon" className="rounded-xl"><MoreVertical className="h-4 w-4 text-slate-400" /></Button>
                            </div>
                         </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>
           </div>

           {/* Painel Lateral / Calendário */}
           <div className="lg:col-span-4 space-y-8">
              <Card className="border-none shadow-sm rounded-[40px] p-6 bg-white overflow-hidden">
                 <Calendar mode="single" selected={date} onSelect={setDate} className="mx-auto" />
              </Card>

              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-slate-900 text-white relative overflow-hidden">
                 <div className="relative z-10 space-y-6">
                    <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                       <TrendingUp className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tighter">Taxa de Ocupação</h3>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest">
                          <span>Hoje (Meta 85%)</span>
                          <span className="text-primary">92%</span>
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[92%] rounded-full animate-pulse"></div>
                       </div>
                    </div>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed italic">"Seu salão está operando acima da média nacional de produtividade."</p>
                 </div>
              </Card>

              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                 <h3 className="text-xl font-black italic mb-6">Alertas Críticos</h3>
                 <div className="space-y-4">
                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-3">
                       <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
                       <div className="flex-1">
                          <p className="text-xs font-black text-orange-700 uppercase">Conflito de Profissional</p>
                          <p className="text-[10px] font-bold text-orange-600 mt-1">Ricardo Barber possui 2 agendamentos para às 14:00.</p>
                       </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                       <Bell className="h-5 w-5 text-blue-500 shrink-0" />
                       <p className="text-[10px] font-bold text-blue-700 uppercase">03 clientes pediram lembrete WhatsApp.</p>
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
