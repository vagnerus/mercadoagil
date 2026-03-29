
"use client";

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Store, ShieldCheck, LogOut, LayoutDashboard, LayoutGrid, 
  Server, Plus, Loader2, Search, Copy, CheckCircle2, XCircle, 
  Building2, Globe, ArrowUpRight, Headphones, Settings2,
  Save, Landmark, MapPin, Clock, Smartphone
} from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, updateDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminTenants() {
  const { toast } = useToast();
  const db = useFirestore();
  const [editingMerchant, setEditingMerchant] = useState<any>(null);
  
  const merchantsQuery = useMemoFirebase(() => query(collection(db, 'merchants'), orderBy('createdAt', 'desc')), [db]);
  const { data: merchants, isLoading: loadingMerchants } = useCollection(merchantsQuery);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    updateDocumentNonBlocking(doc(db, 'merchants', id), { status: newStatus });
    toast({ 
      title: newStatus === 'active' ? "Instância Ativada!" : "Instância Bloqueada",
      description: `O status foi alterado para ${newStatus.toUpperCase()}.`
    });
  };

  const handleSaveEdit = () => {
    if (!editingMerchant) return;
    updateDocumentNonBlocking(doc(db, 'merchants', editingMerchant.id), editingMerchant);
    toast({ title: "Dados Atualizados", description: "As informações da unidade foram salvas pelo Master Admin." });
    setEditingMerchant(null);
  };

  const copyStoreLink = (slug: string) => {
    const url = `${window.location.origin}/store/${slug}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link Copiado!" });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
      <aside className="w-64 border-r dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg shadow-sm">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl dark:text-white tracking-tight italic uppercase">Master Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl transition-colors font-medium"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
          <Link href="/admin/tenants" className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><LayoutGrid className="h-5 w-5" /> Gestão Multi-Tenant</Link>
          <Link href="/admin/support" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Headphones className="h-5 w-5" /> Chamados</Link>
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2" asChild><Link href="/"><LogOut className="h-4 w-4" /> Sair</Link></Button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">Gestão de Instâncias</h1>
            <p className="text-slate-500 font-medium">Controle de ativação, auditoria e edição master.</p>
          </div>
        </header>

        {loadingMerchants ? (
          <div className="p-20 text-center"><Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" /></div>
        ) : (
          <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white dark:bg-slate-900">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                  <TableRow className="dark:border-slate-800">
                    <TableHead className="px-8 h-16 font-black uppercase text-[10px]">Unidade / Merchant</TableHead>
                    <TableHead className="h-16 font-black uppercase text-[10px]">Dados Legais (CNPJ)</TableHead>
                    <TableHead className="h-16 font-black uppercase text-[10px] text-center">Status</TableHead>
                    <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px]">Ações Master</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {merchants?.map((m: any) => (
                    <TableRow key={m.id} className="dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black italic">{m.name[0]}</div>
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 dark:text-white italic uppercase text-sm">{m.name}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.slug}.agil.com</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <p className="font-black text-slate-700 dark:text-slate-300 text-xs italic">{m.legal?.razaoSocial || 'N/A'}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">CNPJ: {m.legal?.cnpj || 'N/A'}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "rounded-lg border-none font-black italic text-[8px] uppercase px-3 py-1",
                          m.status === 'active' ? "bg-green-100 text-green-600" : 
                          m.status === 'pending_approval' ? "bg-orange-100 text-orange-600 animate-pulse" : "bg-red-100 text-red-600"
                        )}>
                          {m.status === 'pending_approval' ? 'AGUARDANDO AUDITORIA' : m.status === 'blocked' ? 'BLOQUEADO' : m.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => copyStoreLink(m.slug)} className="rounded-xl font-bold h-9 border-slate-200 dark:border-slate-800 shadow-sm"><Globe className="h-3.5 w-3.5 mr-2" /> Link</Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setEditingMerchant(m)} className="rounded-xl font-bold h-9 border-slate-200 dark:border-slate-800 shadow-sm"><Settings2 className="h-3.5 w-3.5 mr-2" /> Gerenciar</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-3xl rounded-[40px] p-0 overflow-hidden border-none shadow-2xl font-body">
                               <div className="bg-primary p-8 text-white">
                                  <DialogTitle className="text-2xl font-black italic uppercase">Master Edit: {m.name}</DialogTitle>
                                  <p className="text-white/70 text-xs font-bold mt-1">Alteração direta de parâmetros da instância SaaS.</p>
                               </div>
                               <div className="p-8">
                                  <Tabs defaultValue="legal" className="space-y-6">
                                     <TabsList className="bg-slate-50 p-1 rounded-xl w-fit">
                                        <TabsTrigger value="legal" className="rounded-lg font-black italic text-[10px] uppercase">Jurídico</TabsTrigger>
                                        <TabsTrigger value="operation" className="rounded-lg font-black italic text-[10px] uppercase">Operação</TabsTrigger>
                                        <TabsTrigger value="financial" className="rounded-lg font-black italic text-[10px] uppercase">Financeiro</TabsTrigger>
                                     </TabsList>

                                     <TabsContent value="legal" className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                           <div className="space-y-2">
                                              <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Razão Social</Label>
                                              <Input value={editingMerchant?.legal?.razaoSocial || ""} onChange={e => setEditingMerchant({...editingMerchant, legal: {...editingMerchant.legal, razaoSocial: e.target.value}})} className="rounded-xl bg-slate-50 border-none font-bold" />
                                           </div>
                                           <div className="space-y-2">
                                              <Label className="text-[10px] font-black uppercase text-slate-400 px-1">CNPJ</Label>
                                              <Input value={editingMerchant?.legal?.cnpj || ""} onChange={e => setEditingMerchant({...editingMerchant, legal: {...editingMerchant.legal, cnpj: e.target.value}})} className="rounded-xl bg-slate-50 border-none font-bold" />
                                           </div>
                                        </div>
                                        <div className="space-y-2">
                                           <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Endereço Unidade</Label>
                                           <Input value={editingMerchant?.contact?.address || ""} onChange={e => setEditingMerchant({...editingMerchant, contact: {...editingMerchant.contact, address: e.target.value}})} className="rounded-xl bg-slate-50 border-none font-bold" />
                                        </div>
                                     </TabsContent>

                                     <TabsContent value="operation" className="space-y-4">
                                        <div className="grid grid-cols-3 gap-4">
                                           <div className="space-y-2">
                                              <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Qtd Cadeiras</Label>
                                              <Input type="number" value={editingMerchant?.operation?.chairs || 1} onChange={e => setEditingMerchant({...editingMerchant, operation: {...editingMerchant.operation, chairs: Number(e.target.value)}})} className="rounded-xl bg-slate-50 border-none font-bold" />
                                           </div>
                                           <div className="space-y-2">
                                              <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Tolerância (min)</Label>
                                              <Input type="number" value={editingMerchant?.operation?.delayTolerance || 15} onChange={e => setEditingMerchant({...editingMerchant, operation: {...editingMerchant.operation, delayTolerance: Number(e.target.value)}})} className="rounded-xl bg-slate-50 border-none font-bold" />
                                           </div>
                                           <div className="space-y-2">
                                              <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Plano SaaS</Label>
                                              <Input value={editingMerchant?.planName || "Pro"} onChange={e => setEditingMerchant({...editingMerchant, planName: e.target.value})} className="rounded-xl bg-slate-50 border-none font-bold" />
                                           </div>
                                        </div>
                                     </TabsContent>

                                     <TabsContent value="financial" className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                           <div className="space-y-2">
                                              <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Taxa Crédito (%)</Label>
                                              <Input type="number" step="0.01" value={editingMerchant?.financial?.creditFee || 2.99} onChange={e => setEditingMerchant({...editingMerchant, financial: {...editingMerchant.financial, creditFee: Number(e.target.value)}})} className="rounded-xl bg-slate-50 border-none font-bold" />
                                           </div>
                                           <div className="space-y-2">
                                              <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Chave PIX</Label>
                                              <Input value={editingMerchant?.financial?.pixKey || ""} onChange={e => setEditingMerchant({...editingMerchant, financial: {...editingMerchant.financial, pixKey: e.target.value}})} className="rounded-xl bg-slate-50 border-none font-bold" />
                                           </div>
                                        </div>
                                     </TabsContent>
                                  </Tabs>
                                  <Button onClick={handleSaveEdit} className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black italic mt-8 gap-2">
                                     <Save className="h-4 w-4" /> SALVAR ALTERAÇÕES MASTER
                                  </Button>
                               </div>
                            </DialogContent>
                          </Dialog>

                          {m.status === 'pending_approval' && (
                            <Button onClick={() => handleUpdateStatus(m.id, 'active')} size="sm" className="bg-green-600 hover:bg-green-700 rounded-xl h-9 px-4 font-black italic text-[10px] text-white gap-2 shadow-sm">
                               <CheckCircle2 className="h-3.5 w-3.5" /> APROVAR
                            </Button>
                          )}
                          {m.status === 'active' && (
                            <Button onClick={() => handleUpdateStatus(m.id, 'blocked')} size="sm" variant="destructive" className="rounded-xl h-9 px-4 font-black italic text-[10px] gap-2 shadow-sm">
                               <XCircle className="h-3.5 w-3.5" /> BLOQUEAR
                            </Button>
                          )}
                          {m.status === 'blocked' && (
                            <Button onClick={() => handleUpdateStatus(m.id, 'active')} size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-xl h-9 px-4 font-black italic text-[10px] text-white gap-2 shadow-sm">
                               <CheckCircle2 className="h-3.5 w-3.5" /> DESBLOQUEAR
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
