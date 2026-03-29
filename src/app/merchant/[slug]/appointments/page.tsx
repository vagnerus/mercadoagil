
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, Clock, User, Plus, 
  LayoutDashboard, Settings, Users, Scissors, 
  MoreVertical, CheckCircle2, AlertCircle, Phone, 
  History, TrendingUp, Wallet, Bell, Loader2, MessageCircle,
  Smartphone, ListFilter, Sparkles, UserPlus
} from "lucide-react";
import Link from 'next/link';
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, addDocumentNonBlocking, updateDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, where, limit } from 'firebase/firestore';

export default function MerchantAppointments({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const db = useFirestore();

  const merchantQuery = useMemoFirebase(() => query(
    collection(db, 'merchants'), 
    where('slug', '==', slug), 
    limit(1)
  ), [db, slug]);
  const { data: merchantData } = useCollection(merchantQuery);
  const merchant = merchantData?.[0];
  const merchantId = merchant?.id;

  const appointmentsQuery = useMemoFirebase(() => {
    if (!merchantId) return null;
    return query(collection(db, 'merchants', merchantId, 'appointments'), orderBy('time', 'asc'));
  }, [db, merchantId]);
  const { data: appointments, isLoading: loadingAppointments } = useCollection(appointmentsQuery);

  const [formData, setFormData] = useState({
    customer: "",
    phone: "",
    service: "Corte Degradê",
    staff: "Ricardo Barber",
    time: "14:00"
  });

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId) return;
    setLoading(true);
    
    const newAppointment = {
      ...formData,
      date: date?.toISOString().split('T')[0],
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    addDocumentNonBlocking(collection(db, 'merchants', merchantId, 'appointments'), newAppointment);
    
    setLoading(false);
    setIsCreateOpen(false);
    toast({ title: "Horário Marcado!", description: `Agendamento para ${formData.customer} realizado.` });
  };

  const handleConfirm = (ap: any) => {
    if (!merchantId) return;
    const docRef = doc(db, 'merchants', merchantId, 'appointments', ap.id);
    updateDocumentNonBlocking(docRef, { status: 'confirmed' });
    
    // Simulação de disparo de WhatsApp
    toast({ title: "WhatsApp Enviado!", description: "Confirmação enviada automaticamente para o cliente." });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><LayoutDashboard className="h-5 w-5" /> Início</Link>
          <Link href={`/merchant/${slug}/appointments`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><CalendarIcon className="h-5 w-5" /> Agenda Global</Link>
          <Link href={`/merchant/${slug}/staff`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Users className="h-5 w-5" /> Profissionais</Link>
        </nav>
      </aside>

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Gestão da Agenda</h1>
            <p className="text-slate-500 font-medium">Controle automatizado, encaixes e lista de espera.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <Button variant="outline" className="rounded-2xl h-12 flex-1 md:flex-none font-bold border-slate-200"><Settings className="h-4 w-4 mr-2" /> Jornadas</Button>
             
             <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-slate-900 rounded-2xl h-12 flex-1 md:flex-none gap-2 font-bold shadow-xl shadow-slate-200 text-white"><Plus className="h-4 w-4" /> Novo Horário</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-[40px] p-0 overflow-hidden border-none shadow-2xl">
                  <div className="bg-primary p-8 text-white">
                    <DialogTitle className="text-2xl font-black italic uppercase text-white">Novo Agendamento</DialogTitle>
                    <p className="text-white/70 text-xs font-bold mt-1">Reserve um horário ou crie um encaixe manual.</p>
                  </div>
                  <form onSubmit={handleCreateAppointment} className="p-8 space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400">Cliente</Label>
                      <Input required value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400">WhatsApp</Label>
                      <Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" placeholder="11999998888" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400">Hora</Label>
                        <Input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400">Profissional</Label>
                        <Select onValueChange={v => setFormData({...formData, staff: v})}>
                          <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold"><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent><SelectItem value="Ricardo Barber">Ricardo</SelectItem><SelectItem value="Ana Estética">Ana</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full h-16 bg-slate-900 rounded-[30px] font-black italic text-lg text-white">
                      {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'CONFIRMAR RESERVA'}
                    </Button>
                  </form>
                </DialogContent>
             </Dialog>
          </div>
        </header>

        <Tabs defaultValue="schedule" className="space-y-8">
           <TabsList className="bg-white p-1 rounded-2xl shadow-sm border h-auto flex gap-1 w-fit">
              <TabsTrigger value="schedule" className="rounded-xl py-3 px-8 font-black italic text-xs uppercase tracking-widest"><CalendarIcon className="h-4 w-4 mr-2" /> Visão Diária</TabsTrigger>
              <TabsTrigger value="waitlist" className="rounded-xl py-3 px-8 font-black italic text-xs uppercase tracking-widest text-orange-600"><ListFilter className="h-4 w-4 mr-2" /> Lista de Espera</TabsTrigger>
           </TabsList>

           <TabsContent value="schedule">
              <div className="grid lg:grid-cols-12 gap-8">
                 <div className="lg:col-span-8 space-y-8">
                    <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
                       <CardHeader className="p-8 border-b bg-slate-50/30 flex flex-row items-center justify-between">
                          <div className="flex items-center gap-4">
                             <CardTitle className="text-xl font-black italic">Agenda do Dia</CardTitle>
                             <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase">{date?.toLocaleDateString('pt-BR')}</Badge>
                          </div>
                       </CardHeader>
                       <CardContent className="p-0">
                          {loadingAppointments ? (
                            <div className="p-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
                          ) : (
                            <div className="divide-y divide-slate-50">
                              {appointments?.map((ap: any) => (
                                <div key={ap.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between group hover:bg-slate-50 transition-colors gap-6">
                                    <div className="flex items-center gap-6">
                                      <div className="text-center w-16">
                                          <p className="text-2xl font-black italic text-slate-900">{ap.time}</p>
                                          <p className="text-[9px] font-black text-slate-400 uppercase">Horário</p>
                                      </div>
                                      <div className="h-12 w-1 bg-primary/20 rounded-full hidden md:block"></div>
                                      <div>
                                          <div className="flex items-center gap-2">
                                            <p className="font-black text-slate-900 italic text-lg uppercase">{ap.customer}</p>
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-black text-[8px] uppercase border-none h-5 px-2">{ap.service}</Badge>
                                          </div>
                                          <div className="flex items-center gap-4 mt-1">
                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase"><User className="h-3 w-3" /> {ap.staff}</span>
                                            <span className="text-[10px] font-bold text-green-600 flex items-center gap-1 uppercase"><MessageCircle className="h-3 w-3" /> {ap.phone}</span>
                                          </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                      {ap.status === 'pending' ? (
                                        <Button size="sm" onClick={() => handleConfirm(ap)} className="bg-green-500 hover:bg-green-600 rounded-xl h-10 flex-1 md:flex-none px-6 font-black italic text-xs gap-2 text-white">
                                            <CheckCircle2 className="h-4 w-4" /> Confirmar & Whats
                                        </Button>
                                      ) : (
                                        <Badge className="bg-green-100 text-green-700 border-none font-black italic uppercase text-[9px] px-4 py-2 rounded-xl">Disparado</Badge>
                                      )}
                                      <Button variant="ghost" size="icon" className="rounded-xl"><MoreVertical className="h-4 w-4 text-slate-400" /></Button>
                                    </div>
                                </div>
                              ))}
                              {appointments?.length === 0 && (
                                <div className="p-20 text-center text-slate-400 font-bold italic uppercase tracking-widest text-xs">Agenda livre para hoje.</div>
                              )}
                            </div>
                          )}
                       </CardContent>
                    </Card>
                 </div>

                 <div className="lg:col-span-4 space-y-8">
                    <Card className="border-none shadow-sm rounded-[40px] p-6 bg-white overflow-hidden">
                       <Calendar mode="single" selected={date} onSelect={setDate} className="mx-auto" />
                    </Card>

                    <Card className="border-none shadow-sm rounded-[40px] p-8 bg-slate-900 text-white relative overflow-hidden">
                       <div className="relative z-10 space-y-6">
                          <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                             <Bell className="h-8 w-8" />
                          </div>
                          <h3 className="text-2xl font-black italic tracking-tighter">Lembretes IA</h3>
                          <p className="text-slate-400 text-xs font-medium leading-relaxed italic">"Estamos monitorando a agenda. 03 clientes receberão lembrete via WhatsApp em 1 hora."</p>
                          <Badge className="bg-green-500/20 text-green-500 border-none font-black italic">AUTOMAÇÃO ATIVA</Badge>
                       </div>
                       <Sparkles className="absolute -bottom-10 -right-10 h-40 w-40 opacity-5" />
                    </Card>
                 </div>
              </div>
           </TabsContent>

           <TabsContent value="waitlist">
              <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
                 <CardHeader className="p-8 border-b bg-orange-50/30">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                          <ListFilter className="h-6 w-6" />
                       </div>
                       <div>
                          <CardTitle className="text-xl font-black italic text-orange-900">Lista de Espera Digital</CardTitle>
                          <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mt-1">Clientes aguardando desistências para hoje.</p>
                       </div>
                    </div>
                 </CardHeader>
                 <CardContent className="p-20 text-center space-y-6">
                    <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-slate-200">
                       <UserPlus className="h-10 w-10 text-slate-300" />
                    </div>
                    <div className="max-w-xs mx-auto">
                       <p className="font-black italic text-slate-400 uppercase tracking-widest text-sm leading-relaxed">Ninguém na espera. Ative o link público para permitir que clientes se inscrevam!</p>
                    </div>
                    <Button variant="outline" className="rounded-xl font-black italic text-xs border-orange-200 text-orange-600">ATIVAR LINK DE ESPERA</Button>
                 </CardContent>
              </Card>
           </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
