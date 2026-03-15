
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Scissors, Plus, Search, Edit2, Trash2, 
  Clock, DollarSign, LayoutDashboard, 
  Calendar as CalendarIcon, Sparkles, Loader2
} from "lucide-react";
import Link from 'next/link';
import { useFirestore, useCollection, addDocumentNonBlocking, deleteDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, query, doc, where, limit } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";

export default function MerchantServices({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
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
  const merchantId = merchantData?.[0]?.id;

  const servicesQuery = useMemoFirebase(() => {
    if (!merchantId) return null;
    return query(collection(db, 'merchants', merchantId, 'services'));
  }, [db, merchantId]);
  const { data: services, isLoading: loadingServices } = useCollection(servicesQuery);

  const [formData, setFormData] = useState({
    name: "",
    duration: 30,
    price: 0,
    commission: 50
  });

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId) return;
    setLoading(true);
    
    const newService = {
      name: formData.name,
      duration: Number(formData.duration),
      price: Number(formData.price),
      commission: Number(formData.commission),
      isActive: true,
      createdAt: new Date().toISOString()
    };

    addDocumentNonBlocking(collection(db, 'merchants', merchantId, 'services'), newService);
    
    setLoading(false);
    setIsCreateOpen(false);
    toast({ title: "Serviço Adicionado", description: `${formData.name} já está disponível na vitrine.` });
  };

  const handleDelete = (id: string) => {
    if (!merchantId) return;
    deleteDocumentNonBlocking(doc(db, 'merchants', merchantId, 'services', id));
    toast({ title: "Serviço Removido", description: "O item foi excluído do catálogo." });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
          <Link href={`/merchant/${slug}/services`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><Scissors className="h-5 w-5" /> Serviços & Preços</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Gestão de Serviços</h1>
            <p className="text-slate-500 font-medium">Configuração de durações e precificação da vitrine.</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-slate-900 rounded-2xl h-12 gap-2 font-bold px-6 shadow-xl shadow-slate-200 text-white">
                <Plus className="h-4 w-4" /> Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-[40px] p-0 overflow-hidden border-none shadow-2xl">
              <div className="bg-primary p-8 text-white">
                <DialogTitle className="text-2xl font-black italic uppercase text-white">Criar Serviço</DialogTitle>
                <p className="text-white/70 text-xs font-bold mt-1">Defina o que será oferecido aos seus clientes.</p>
              </div>
              <form onSubmit={handleCreateService} className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">Nome do Serviço</Label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" placeholder="Ex: Corte Degradê" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Preço (R$)</Label>
                    <Input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Duração (min)</Label>
                    <Input type="number" required value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">Comissão do Profissional (%)</Label>
                  <Input type="number" required value={formData.commission} onChange={e => setFormData({...formData, commission: Number(e.target.value)})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-16 bg-slate-900 rounded-[30px] font-black italic text-lg text-white">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'PUBLICAR SERVIÇO'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid gap-4">
          {loadingServices ? (
            <div className="p-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
          ) : (
            services?.map((service: any) => (
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
                          <Badge className="bg-green-50 text-green-600 border-none font-black text-[8px] uppercase mt-1">Ativo</Badge>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)} className="rounded-xl h-10 w-10 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4 text-slate-400" /></Button>
                    </div>
                  </CardContent>
              </Card>
            ))
          )}
          {services?.length === 0 && !loadingServices && (
            <div className="p-20 text-center text-slate-400 font-bold italic uppercase tracking-widest text-xs">Nenhum serviço cadastrado.</div>
          )}
        </div>
      </main>
    </div>
  );
}
