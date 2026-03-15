
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
import { 
  Calendar as CalendarIcon, Clock, User, Plus, 
  LayoutDashboard, Settings, Users, Scissors, 
  MoreVertical, CheckCircle2, AlertCircle, Phone, 
  History, TrendingUp, Wallet, Bell, Loader2, MessageCircle,
  Smartphone
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

  const staffQuery = useMemoFirebase(() => {
    if (!merchantId) return null;
    return query(collection(db, 'merchants', merchantId, 'staff'));
  }, [db, merchantId]);
  const { data: staffList } = useCollection(staffQuery);

  const servicesQuery = useMemoFirebase(() => {
    if (!merchantId) return null;
    return query(collection(db, 'merchants', merchantId, 'services'));
  }, [db, merchantId]);
  const { data: servicesList } = useCollection(servicesQuery);

  const [formData, setFormData] = useState({
    customer: "",
    phone: "",
    serviceId: "",
    staffId: "",
    time: "14:00"
  });

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId) return;
    setLoading(true);
    
    const service = servicesList?.find(s => s.id === formData.serviceId);
    const staff = staffList?.find(s => s.id === formData.staffId);

    const newAppointment = {
      customer: formData.customer,
      phone: formData.phone,
      service: service?.name || "Serviço",
      staff: staff?.name || "Profissional",
      time: formData.time,
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
    
    if (merchant?.settings?.whatsapp) {
      const cleanPhone = ap.phone.replace(/\D/g, '');
      const message = `Olá *${ap.customer}*! Passando para confirmar seu horário de *${ap.service}* aqui na *${merchant.name}*.\n\n📅 Data: *${new Date(ap.date).toLocaleDateString('pt-BR')}*\n⏰ Hora: *${ap.time}*\n💈 Profissional: *${ap.staff}*\n\nEstamos te esperando! Caso precise desmarcar, nos avise por aqui.`;
      const waUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
      toast({ title: "Disparando Confirmação", description: "Enviando mensagem oficial via seu WhatsApp." });
    } else {
      toast({ title: "Status Atualizado", description: "Agendamento confirmado internamente." });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><LayoutDashboard className="h-5 w-5" /> Início</Link>
          <Link href={`/merchant/${slug}/appointments`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><CalendarIcon className="h-5 w-5" /> Agenda Global</Link>
          <Link href={`/merchant/${slug}/staff`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Users className="h-5 w-5" /> Profissionais</Link>
          <Link href={`/merchant/${slug}/services`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Scissors className="h-5 w-5" /> Serviços</Link>
        </nav>
      </aside>

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Agenda Operacional</h1>
            <p className="text-slate-500 font-medium">Gestão integrada com disparos de WhatsApp.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <Button variant="outline" className="rounded-2xl h-12 flex-1 md:flex-none font-bold border-slate-200"><History className="h-4 w-4 mr-2" /> Histórico</Button>
             
             <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-slate-900 rounded-2xl h-12 flex-1 md:flex-none gap-2 font-bold shadow-xl shadow-slate-200 text-white"><Plus className="h-4 w-4" /> Novo Horário</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-[40px] p-0 overflow-hidden border-none shadow-2xl">
                  <div className="bg-primary p-8 text-white">
                    <DialogTitle className="text-2xl font-black italic uppercase text-white">Novo Agendamento</DialogTitle>
                    <p className="text-white/70 text-xs font-bold mt-1">Reserve um horário manualmente na agenda.</p>
                  </div>
                  <form onSubmit={handleCreateAppointment} className="p-8 space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400">Cliente</Label>
                      <Input required value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" placeholder="Nome Completo" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400">WhatsApp</Label>
                      <Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" placeholder="11999998888" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400">Serviço</Label>
                        <Select onValueChange={v => setFormData({...formData, serviceId: v})}>
                          <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold">
                            <SelectValue placeholder="Escolha" />
                          </SelectTrigger>
                          <SelectContent>
                            {servicesList?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400">Hora</Label>
                        <Input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400">Profissional</Label>
                      <Select onValueChange={v => setFormData({...formData, staffId: v})}>
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold">
                          <SelectValue placeholder="Selecione o Profissional" />
                        </SelectTrigger>
                        <SelectContent>
                          {staffList?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full h-16 bg-slate-900 rounded-[30px] font-black italic text-lg text-white">
                      {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'CONFIRMAR RESERVA'}
                    </Button>
                  </form>
                </DialogContent>
             </Dialog>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {staffList?.map(staff => (
                   <Card key={staff.id} className="border-none shadow-sm rounded-3xl p-4 bg-white flex items-center gap-3 hover:ring-2 ring-primary transition-all cursor-pointer">
                      <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                         <img src={staff.avatar || `https://picsum.photos/seed/${staff.id}/100/100`} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                         <p className="font-black text-[10px] text-slate-900 truncate uppercase">{staff.name.split(' ')[0]}</p>
                         <p className="text-[8px] font-bold text-slate-400 uppercase">Online</p>
                      </div>
                   </Card>
                 ))}
              </div>

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
                                    <p className="text-[9px] font-black text-slate-400 uppercase">Início</p>
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
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-green-100 text-green-700 border-none font-black italic uppercase text-[9px] px-4 py-2 rounded-xl">Disparado</Badge>
                                    <Button variant="ghost" size="icon" className="text-green-600" onClick={() => handleConfirm(ap)}>
                                      <MessageCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                                <Button variant="ghost" size="icon" className="rounded-xl"><MoreVertical className="h-4 w-4 text-slate-400" /></Button>
                              </div>
                          </div>
                        ))}
                        {appointments?.length === 0 && (
                          <div className="p-20 text-center text-slate-400 font-bold italic uppercase tracking-widest text-xs">Nenhum agendamento para hoje.</div>
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
                    <div className="h-14 w-14 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-500">
                       <Smartphone className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tighter">WhatsApp Center</h3>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed italic">"Suas mensagens estão sendo enviadas via dispositivo conectado em configurações."</p>
                 </div>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
