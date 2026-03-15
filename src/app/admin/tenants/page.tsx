
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Store, Search, ShieldCheck, LogOut, LayoutDashboard, Building2, LayoutGrid, Database, Server, MoreHorizontal, Plus, Loader2, Monitor } from "lucide-react";
import Link from 'next/link';
import { SYSTEM_PLANS } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';

export default function AdminTenants() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const db = useFirestore();
  
  const merchantsQuery = collection(db, 'merchants');
  const { data: merchants, isLoading: loadingMerchants } = useCollection(merchantsQuery);

  const [formData, setCustomerInfo] = useState({
    name: "",
    slug: "",
    planId: "p_free",
    email: "",
    ownerName: ""
  });

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addDocumentNonBlocking(collection(db, 'merchants'), {
        ...formData,
        status: 'active',
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp(),
        mrr: formData.planId === 'p_free' ? 0 : (formData.planId === 'p_pro' ? 150 : 300)
      });

      setIsCreateOpen(false);
      toast({ title: "Loja Criada!", description: "O novo lojista já pode acessar o painel." });
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao criar loja.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
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
            <LayoutDashboard className="h-5 w-5" /> Global
          </Link>
          <Link href="/admin/franchises" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Building2 className="h-5 w-5" /> Gestão de Franquias
          </Link>
          <Link href="/admin/tenants" className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-semibold">
            <LayoutGrid className="h-5 w-5" /> Multi-Tenancy
          </Link>
          <Link href="/admin/audit" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Database className="h-5 w-5" /> Auditoria SaaS
          </Link>
          <Link href="/admin/infra" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Server className="h-5 w-5" /> Infraestrutura
          </Link>
        </nav>
        <div className="p-4 border-t">
          <div className="px-4 py-3 bg-slate-900 rounded-2xl mb-4 flex items-center gap-3">
             <Monitor className="h-4 w-4 text-primary" />
             <div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Platform v2.9</p>
                <p className="text-[8px] font-bold text-slate-400">Desktop App Ready</p>
             </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2 hover:text-red-500" asChild>
            <Link href="/"><LogOut className="h-4 w-4" /> Sair</Link>
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Multi-Tenancy</h1>
            <p className="text-slate-500 font-medium">Monitoramento individual de cada lojista (tenant).</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                   <Button className="bg-primary rounded-2xl h-12 gap-2 font-black italic shadow-xl shadow-primary/20 px-6">
                      <Plus className="h-5 w-5" /> Cadastrar Loja
                   </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden font-body">
                   <div className="bg-primary p-10 text-white relative overflow-hidden">
                      <div className="relative z-10">
                         <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase">Nova Loja & Usuário</DialogTitle>
                         <p className="text-white/80 font-bold mt-2 uppercase text-[10px] tracking-widest">Configuração de novo lojista na plataforma.</p>
                      </div>
                      <Store className="absolute -bottom-10 -right-10 h-40 w-40 opacity-10" />
                   </div>
                   <form onSubmit={handleCreateStore} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-2">Dados da Loja</h3>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nome da Loja</Label>
                               <Input 
                                placeholder="Ex: Pizzaria Roma" 
                                className="h-12 rounded-xl bg-slate-50 border-none font-bold" 
                                required 
                                value={formData.name}
                                onChange={e => setCustomerInfo({...formData, name: e.target.value})}
                               />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Slug / URL</Label>
                               <div className="flex items-center">
                                  <Input 
                                    placeholder="pizzaria-roma" 
                                    className="h-12 rounded-l-xl bg-slate-50 border-none font-bold border-r border-slate-200" 
                                    required 
                                    value={formData.slug}
                                    onChange={e => setCustomerInfo({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                                  />
                                  <div className="h-12 px-3 bg-slate-100 flex items-center rounded-r-xl text-[10px] font-black text-slate-400">.agil.com</div>
                               </div>
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Plano Mercado Ágil</Label>
                               <Select value={formData.planId} onValueChange={v => setCustomerInfo({...formData, planId: v})}>
                                  <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold">
                                     <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-2xl border-none shadow-xl">
                                     {SYSTEM_PLANS.map(p => (
                                       <SelectItem key={p.id} value={p.id} className="font-bold">
                                          {p.name} - {p.price === 0 ? 'Grátis (30 dias)' : `R$ ${p.price}/mês`}
                                       </SelectItem>
                                     ))}
                                  </SelectContent>
                               </Select>
                            </div>
                         </div>
                         <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-2">Usuário Master Lojista</h3>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nome Completo</Label>
                               <Input 
                                placeholder="Ricardo Silva" 
                                className="h-12 rounded-xl bg-slate-50 border-none font-bold" 
                                required 
                                value={formData.ownerName}
                                onChange={e => setCustomerInfo({...formData, ownerName: e.target.value})}
                               />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">E-mail de Acesso</Label>
                               <Input 
                                type="email" 
                                placeholder="ricardo@email.com" 
                                className="h-12 rounded-xl bg-slate-50 border-none font-bold" 
                                required 
                                value={formData.email}
                                onChange={e => setCustomerInfo({...formData, email: e.target.value})}
                               />
                            </div>
                         </div>
                      </div>
                      <Button type="submit" disabled={loading} className="w-full h-16 bg-slate-900 rounded-[30px] font-black italic text-lg shadow-2xl">
                         {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Confirmar Cadastro'}
                      </Button>
                   </form>
                </DialogContent>
             </Dialog>
             <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input className="pl-12 h-12 rounded-2xl bg-white border-none shadow-sm font-medium" placeholder="Buscar lojista..." />
             </div>
          </div>
        </header>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
          <CardContent className="p-0">
            {loadingMerchants ? (
              <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary h-10 w-10" /></div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Lojista / Slug</TableHead>
                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Plano Atual</TableHead>
                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Criado em</TableHead>
                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {merchants?.map((m: any) => {
                    const plan = SYSTEM_PLANS.find(p => p.id === m.planId);
                    const isExpired = plan?.name === 'Free' && (Date.now() - new Date(m.createdAt).getTime() > 30 * 24 * 60 * 60 * 1000);
                    return (
                      <TableRow key={m.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="px-8 py-6">
                           <div className="flex flex-col">
                              <span className="font-black text-slate-900 text-lg italic">{m.name}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.slug}.mercadoagil.com</span>
                           </div>
                        </TableCell>
                        <TableCell>
                           <Badge className={`font-black italic border-none ${
                             plan?.name === 'Pro II' ? 'bg-orange-100 text-orange-700' : 
                             plan?.name === 'Pro' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                           }`}>
                             {plan?.name || 'Personalizado'}
                           </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-slate-400 text-xs">
                           {new Date(m.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                           <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${isExpired ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                              <span className={`font-black text-[10px] uppercase ${isExpired ? 'text-red-500' : 'text-slate-600'}`}>
                                 {isExpired ? 'Desativada (Expira Free)' : 'Ativa'}
                              </span>
                           </div>
                        </TableCell>
                        <TableCell className="text-right px-8">
                           <Button variant="ghost" size="icon" className="rounded-xl"><MoreHorizontal className="h-5 w-5 text-slate-400" /></Button>
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
