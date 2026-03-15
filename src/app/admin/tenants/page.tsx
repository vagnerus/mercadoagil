
"use client";

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Store, Search, ShieldCheck, LogOut, LayoutDashboard, Building2, 
  LayoutGrid, Database, Server, MoreHorizontal, Plus, Loader2, 
  Monitor, ShoppingBag, Briefcase, Zap, Pill, CreditCard, 
  Activity, ArrowUpRight, CheckCircle2, Globe
} from "lucide-react";
import Link from 'next/link';
import { SYSTEM_PLANS, MerchantSegment } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, addDocumentNonBlocking, setDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, query, orderBy, doc } from 'firebase/firestore';

const SEGMENTS: { value: MerchantSegment; label: string; icon: any }[] = [
  { value: 'RESTAURANT', label: 'Restaurante / Food', icon: ShoppingBag },
  { value: 'RETAIL', label: 'Varejo / Loja', icon: Briefcase },
  { value: 'SERVICE', label: 'Serviços / Agenda', icon: Zap },
  { value: 'GROCERY', label: 'Mercado / Hortifruti', icon: ShoppingBag },
  { value: 'PHARMACY', label: 'Farmácia / Saúde', icon: Pill },
];

export default function AdminTenants() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const db = useFirestore();
  
  const merchantsQuery = useMemoFirebase(() => query(collection(db, 'merchants'), orderBy('createdAt', 'desc')), [db]);
  const { data: merchants, isLoading: loadingMerchants } = useCollection(merchantsQuery);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    segment: "RESTAURANT" as MerchantSegment,
    planId: "p_free",
    email: "",
    ownerName: ""
  });

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const plan = SYSTEM_PLANS.find(p => p.id === formData.planId);
    const merchantId = Math.random().toString(36).substring(7);
    
    addDocumentNonBlocking(collection(db, 'merchants'), {
      id: merchantId,
      ...formData,
      status: 'active',
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp(),
      planName: plan?.name || 'Free',
      mrr: formData.planId === 'p_free' ? 0 : (formData.planId === 'p_pro' ? 150 : 300)
    });

    const userRef = doc(db, 'platformUsers', formData.email.replace(/[.@]/g, '_'));
    setDocumentNonBlocking(userRef, {
      email: formData.email,
      firstName: formData.ownerName.split(' ')[0],
      lastName: formData.ownerName.split(' ').slice(1).join(' '),
      role: 'MERCHANT_ADMIN',
      merchantId: merchantId,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });

    setIsCreateOpen(false);
    setFormData({ name: "", slug: "", segment: "RESTAURANT", planId: "p_free", email: "", ownerName: "" });
    setLoading(false);
    toast({ 
      title: "Provisionamento Concluído!", 
      description: `A instância ${formData.segment} para ${formData.name} foi ativada.` 
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">Master Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Global Dashboard
          </Link>
          <Link href="/admin/tenants" className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-semibold">
            <LayoutGrid className="h-5 w-5" /> Multi-Tenancy
          </Link>
          <Link href="/admin/infra" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Server className="h-5 w-5" /> Infraestrutura Cloud
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2 hover:text-red-500" asChild>
            <Link href="/"><LogOut className="h-4 w-4" /> Sair</Link>
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Gestão de Multi-Tenancy</h1>
            <p className="text-slate-500 font-medium">Provisionamento de instâncias, monitoramento de saúde e billing.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                   <Button className="bg-primary rounded-2xl h-12 gap-2 font-black italic shadow-xl shadow-primary/20 px-6">
                      <Plus className="h-5 w-5" /> Novo Lojista
                   </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden font-body">
                   <div className="bg-primary p-10 text-white relative overflow-hidden">
                      <div className="relative z-10">
                         <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase">Provisionar Instância</DialogTitle>
                         <p className="text-white/80 font-bold mt-2 uppercase text-[10px] tracking-widest">Configuração de ambiente sandbox e prod.</p>
                      </div>
                      <Globe className="absolute -bottom-10 -right-10 h-40 w-40 opacity-10" />
                   </div>
                   <form onSubmit={handleCreateStore} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-2">Ambiente & Segmento</h3>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Nome da Empresa</Label>
                               <Input 
                                placeholder="Ex: Boutique Chic" 
                                className="h-12 rounded-xl bg-slate-50 border-none font-bold" 
                                required 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                               />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Subdomínio / Slug</Label>
                               <Input 
                                placeholder="boutique-chic" 
                                className="h-12 rounded-xl bg-slate-50 border-none font-bold" 
                                required 
                                value={formData.slug}
                                onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                               />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Segmento</Label>
                               <Select value={formData.segment} onValueChange={v => setFormData({...formData, segment: v as MerchantSegment})}>
                                  <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold">
                                     <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-2xl border-none shadow-xl">
                                     {SEGMENTS.map(s => (
                                       <SelectItem key={s.value} value={s.value} className="font-bold">
                                          <div className="flex items-center gap-2">
                                             <s.icon className="h-4 w-4" /> {s.label}
                                          </div>
                                       </SelectItem>
                                     ))}
                                  </SelectContent>
                               </Select>
                            </div>
                         </div>
                         <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-2">Usuário & Billing</h3>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Owner Name</Label>
                               <Input 
                                placeholder="Ricardo Silva" 
                                className="h-12 rounded-xl bg-slate-50 border-none font-bold" 
                                required 
                                value={formData.ownerName}
                                onChange={e => setFormData({...formData, ownerName: e.target.value})}
                               />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Owner Email</Label>
                               <Input 
                                type="email" 
                                placeholder="lojista@email.com" 
                                className="h-12 rounded-xl bg-slate-50 border-none font-bold" 
                                required 
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                               />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Plano SaaS</Label>
                               <Select value={formData.planId} onValueChange={v => setFormData({...formData, planId: v})}>
                                  <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold">
                                     <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-2xl border-none shadow-xl">
                                     {SYSTEM_PLANS.map(p => (
                                       <SelectItem key={p.id} value={p.id} className="font-bold">
                                          {p.name} - R$ {p.price}/mês
                                       </SelectItem>
                                     ))}
                                  </SelectContent>
                               </Select>
                            </div>
                         </div>
                      </div>
                      <Button type="submit" disabled={loading} className="w-full h-16 bg-slate-900 rounded-[30px] font-black italic text-lg shadow-2xl">
                         {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Executar Provisionamento'}
                      </Button>
                   </form>
                </DialogContent>
             </Dialog>
             <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input className="pl-12 h-12 rounded-2xl bg-white border-none shadow-sm font-medium" placeholder="Buscar instância..." />
             </div>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
           <Card className="border-none shadow-sm p-8 rounded-[40px] bg-white flex flex-col justify-center text-center space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Global Health Score</p>
              <div className="flex items-center justify-center gap-3">
                 <p className="text-4xl font-black italic text-slate-900">99.9%</p>
                 <Badge className="bg-green-100 text-green-700 border-none font-black italic">OPTIMAL</Badge>
              </div>
           </Card>
           <Card className="border-none shadow-sm p-8 rounded-[40px] bg-white flex flex-col justify-center text-center space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Databases</p>
              <p className="text-4xl font-black italic text-slate-900">{merchants?.length || 0}</p>
           </Card>
           <Card className="border-none shadow-sm p-8 rounded-[40px] bg-slate-900 text-white flex flex-col justify-center text-center space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Provisioning Rate</p>
              <p className="text-4xl font-black italic text-primary">+12 <span className="text-xs">/ day</span></p>
           </Card>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
          <CardContent className="p-0">
            {loadingMerchants ? (
              <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary h-10 w-10" /></div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Tenant / Infrastructure</TableHead>
                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Plan & Billing</TableHead>
                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Health & Usage</TableHead>
                    <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {merchants?.map((m: any) => {
                    const plan = SYSTEM_PLANS.find(p => p.id === m.planId);
                    const segment = SEGMENTS.find(s => s.value === m.segment);
                    return (
                      <TableRow key={m.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="px-8 py-6">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                 {segment ? <segment.icon className="h-5 w-5 text-slate-600" /> : <Store className="h-5 w-5 text-slate-600" />}
                              </div>
                              <div className="flex flex-col">
                                 <span className="font-black text-slate-900 text-lg italic">{m.name}</span>
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cluster: SA-EAST-1 • {m.slug}.mercadoagil.com</span>
                              </div>
                           </div>
                        </TableCell>
                        <TableCell>
                           <div className="flex flex-col gap-1">
                              <Badge className={`w-fit font-black italic border-none ${
                                plan?.name === 'Pro II' ? 'bg-orange-100 text-orange-700' : 
                                plan?.name === 'Pro' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {plan?.name || 'Enterprise'}
                              </Badge>
                              <span className="text-[9px] font-bold text-green-600 flex items-center gap-1"><CreditCard className="h-2 w-2" /> Billing in Day</span>
                           </div>
                        </TableCell>
                        <TableCell>
                           <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                 <div className="h-2 w-2 rounded-full bg-green-500" />
                                 <span className="font-black text-[9px] uppercase text-slate-600">Active</span>
                              </div>
                              <div className="flex gap-2 items-center">
                                 <Activity className="h-3 w-3 text-slate-300" />
                                 <div className="h-1 w-20 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[35%]"></div>
                                 </div>
                                 <span className="text-[8px] font-bold text-slate-400">35% Load</span>
                              </div>
                           </div>
                        </TableCell>
                        <TableCell className="text-right px-8">
                           <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" className="rounded-xl"><ArrowUpRight className="h-5 w-5 text-slate-400" /></Button>
                              <Button variant="ghost" size="icon" className="rounded-xl"><MoreHorizontal className="h-5 w-5 text-slate-400" /></Button>
                           </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
