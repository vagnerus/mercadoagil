
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, Clock, User, Plus, 
  ChevronLeft, ChevronRight, LayoutDashboard, 
  Settings, Users, Scissors, MoreVertical, 
  CheckCircle2, AlertCircle, Phone, Smartphone, Filter
} from "lucide-react";
import Link from 'next/link';
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { MOCK_STAFF } from "@/lib/mock-data";

const appointments = [
  { id: 'ap1', customer: 'João Silva', service: 'Corte Degradê', time: '14:00', duration: 45, staff: 'Ricardo Barber', status: 'confirmed' },
  { id: 'ap2', customer: 'Maria Santos', service: 'Coloração Pro', time: '15:30', duration: 90, staff: 'Ana Estética', status: 'pending' },
  { id: 'ap3', customer: 'Pedro Souza', service: 'Barba Terapia', time: '16:00', duration: 30, staff: 'Ricardo Barber', status: 'confirmed' },
];

export default function MerchantAppointments({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const handleConfirm = (id: string) => {
    toast({ title: "Agendamento Confirmado", description: "O cliente receberá uma notificação no WhatsApp." });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
          <Link href={`/merchant/${slug}/appointments`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><CalendarIcon className="h-5 w-5" /> Agenda Global</Link>
          <Link href={`/merchant/${slug}/services`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Scissors className="h-5 w-5" /> Serviços & Preços</Link>
          <Link href={`/merchant/${slug}/staff`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Users className="h-5 w-5" /> Profissionais</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Controle de Agenda</h1>
              <p className="text-slate-500 font-medium">Gestão de horários e produtividade da equipe.</p>
            </div>
            <Button className="bg-slate-900 rounded-2xl h-12 gap-2 font-bold px-6 shadow-xl shadow-slate-200">
              <Plus className="h-4 w-4" /> Novo Horário
            </Button>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
             {MOCK_STAFF.map(staff => (
               <Card key={staff.id} className="border-none shadow-sm rounded-[30px] p-4 bg-white flex items-center gap-3 hover:ring-2 ring-primary transition-all cursor-pointer">
                  <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary/20">
                     <img src={staff.avatar} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="font-black text-xs text-slate-900 truncate uppercase">{staff.name.split(' ')[0]}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase">08 Agendamentos</p>
                  </div>
               </Card>
             ))}
          </div>

          <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
            <CardHeader className="p-8 border-b bg-slate-50/30 flex flex-row items-center justify-between">
               <CardTitle className="text-xl font-black italic">Agenda do Dia</CardTitle>
               <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl h-10 font-bold"><Filter className="h-4 w-4 mr-2" /> Filtrar Profissional</Button>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y">
                  {appointments.map(ap => (
                    <div key={ap.id} className="p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                       <div className="flex items-center gap-6">
                          <div className="text-center w-16">
                             <p className="text-2xl font-black italic text-slate-900">{ap.time}</p>
                             <p className="text-[9px] font-black text-slate-400 uppercase">{ap.duration} MIN</p>
                          </div>
                          <div className="h-10 w-1 bg-primary/20 rounded-full"></div>
                          <div>
                             <p className="font-black text-slate-900 italic text-lg uppercase">{ap.customer}</p>
                             <div className="flex items-center gap-3 mt-1">
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-black text-[9px] uppercase border-none">{ap.service}</Badge>
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><User className="h-3 w-3" /> {ap.staff}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          {ap.status === 'pending' ? (
                            <Button size="sm" onClick={() => handleConfirm(ap.id)} className="bg-green-500 hover:bg-green-600 rounded-xl h-10 px-4 font-black italic text-xs gap-2">
                               <CheckCircle2 className="h-4 w-4" /> Confirmar
                            </Button>
                          ) : (
                            <Badge className="bg-green-100 text-green-700 border-none font-black italic uppercase text-[9px] px-3 py-1">Confirmado</Badge>
                          )}
                          <Button variant="ghost" size="icon" className="rounded-xl"><MoreVertical className="h-4 w-4 text-slate-400" /></Button>
                       </div>
                    </div>
                  ))}
               </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <Card className="border-none shadow-sm rounded-[40px] p-6 bg-white overflow-hidden">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border-none p-0 mx-auto"
              />
           </Card>

           <Card className="border-none shadow-sm rounded-[40px] p-8 bg-slate-900 text-white relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                 <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Smartphone className="h-8 w-8 text-primary" />
                 </div>
                 <h3 className="text-2xl font-black italic tracking-tighter">Lembretes Automatizados</h3>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    Nossa IA envia mensagens automáticas de confirmação via WhatsApp 24h antes do atendimento, reduzindo faltas em até 45%.
                 </p>
                 <Button className="w-full h-14 bg-white text-slate-900 font-black italic rounded-2xl hover:bg-slate-50 transition-all shadow-2xl">Ativar Notificações</Button>
              </div>
           </Card>

           <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
              <h3 className="text-xl font-black italic mb-6">Alertas Críticos</h3>
              <div className="space-y-4">
                 <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                       <p className="text-xs font-black text-orange-700 uppercase">Conflito de Recurso</p>
                       <p className="text-[10px] font-bold text-orange-600 mt-1">Sala de Estética 01 possui 2 agendamentos para às 14:00.</p>
                    </div>
                 </div>
                 <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-500" />
                    <p className="text-xs font-bold text-blue-700">03 clientes aguardando confirmação manual.</p>
                 </div>
              </div>
           </Card>
        </div>
      </main>
    </div>
  );
}
