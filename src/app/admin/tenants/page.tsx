
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
  Save, Landmark, MapPin, Clock, Smartphone, ShieldAlert,
  AlertCircle, ChevronRight, CheckCircle, Database, ExternalLink
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
      description: `O status foi alterado para ${newStatus.toUpperCase()} pelo Master Admin.`
    });
  };

  const handleSaveEdit = () => {
    if (!editingMerchant) return;
    updateDocumentNonBlocking(doc(db, 'merchants', editingMerchant.id), editingMerchant);
    toast({ title: "Dados Atualizados", description: "Alterações master salvas no cluster." });
    setEditingMerchant(null);
  };

  const copyStoreLink = (slug: string) => {
    const url = `${window.location.origin}/store/${slug}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link Copiado!", description: "URL da vitrine na área de transferência." });
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
          <Link href="/admin/tenants" className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><LayoutGrid className="h-5 w-5" /> Gestão de Tenants</Link>
          <Link href="/admin/billing" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Landmark className="h-5 w-5" /> Faturamento</Link>
          <Link href="/admin/support" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Headphones className="h-5 w-5" /> Chamados</Link>
        </nav>
        <div className="p-4 border-t dark:border-slate-800">
          <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2" asChild><Link href="/"><LogOut className="h-4 w-4" /> Sair</Link></Button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">Multi-Tenancy Command</h1>
            <p className="text-slate-500 font-medium">Controle de ativação, conformidade e auditoria de instâncias.</p>
          </div>
          <div className="flex gap-2">
             <Badge className="bg-primary text-white font-black italic px-4 py-2 rounded-xl">TOTAL: {merchants?.length || 0}</Badge>
          </div>
        </header>

        {loadingMerchants ? (
          <div className="p-20 text-center"><Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" /></div>
        ) : (
          <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white dark:bg-slate-900">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                  <TableRow className="dark:border-slate-800">
                    <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Loja / Merchant</TableHead>
                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Conformidade (CNPJ)</TableHead>
                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                    <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Ações Master</TableHead>
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
                         <div className="flex items-center gap-2">
                            <ShieldCheck className={cn("h-4 w-4", m.legal?.cnpj ? "text-green-500" : "text-slate-300")} />
                            <p className="font-black text-slate-700 dark:text-slate-300 text-xs italic">{m.legal?.razaoSocial || 'Não Auditado'}</p>
                         </div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">CNPJ: {m.legal?.cnpj || 'PENDENTE'}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "rounded-lg border-none font-black italic text-[8px] uppercase px-3 py-1",
                          m.status === 'active' ? "bg-green-100 text-green-600" : 
                          m.status === 'pending_approval' ? "bg-orange-100 text-orange-600 animate-pulse" : "bg-red-100 text-red-600"
                        )}>
                          {m.status === 'pending_approval' ? 'AUDITORIA PENDENTE' : m.status === 'blocked' ? 'SUSPENSO' : m.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild className="rounded-xl font-bold h-9 border-slate-200 dark:border-slate-800 shadow-sm">
                            <Link href={`/store/${m.slug}`} target="_blank">
                              <ExternalLink className="h-3.5 w-3.5 mr-2" /> Vitrine
                            </Link>
                          </Button>

                          <Button variant="outline" size="sm" asChild className="rounded-xl font-bold h-9 border-primary/20 text-primary shadow-sm">
                            <Link href={`/merchant/${m.slug}/dashboard`}>
                              <LayoutDashboard className="h-3.5 w-3.5 mr-2" /> Painel
                            </Link>
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setEditingMerchant(m)} className="rounded-xl font-bold h-9 border-slate-200 dark:border-slate-800 shadow-sm"><Settings2 className="h-3.5 w-3.5 mr-2" /> Config</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-3xl rounded-[40px] p-0 overflow-hidden border-none shadow-2xl font-body">
                               <div className="bg-slate-900 p-8 text-white relative">
                                  <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Master Unit Control: {m.name}</DialogTitle>
                                  <p className="text-slate-400 text-xs font-bold mt-1 uppercase">Acesso direto ao cluster do tenant.</p>
                                  <Database className="absolute -bottom-4 -right-4 h-24 w-24 opacity-5" />
                               </div>
                               <div className="p-8">
                                  <Tabs defaultValue="legal" className="space-y-6">
                                     <TabsList className="bg-slate-50 dark:bg-slate-800 p-1 rounded-xl w-fit">
                                        <TabsTrigger value="legal" className="rounded-lg font-black italic text-[10px] uppercase">Compliance</TabsTrigger>
                                        <TabsTrigger value="operation" className="rounded-lg font-black italic text-[10px] uppercase">Operacional</TabsTrigger>
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
                                              <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Capacidade (Cadeiras)</Label>
                                              <Input type="number" value={editingMerchant?.operation?.chairs || 1} onChange={e => setEditingMerchant({...editingMerchant, operation: {...editingMerchant.operation, chairs: Number(e.target.value)}})} className="rounded-xl bg-slate-50 border-none font-bold" />
                                           </div>
                                           <div className="space-y-2">
                                              <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Tolerância (min)</Label>
                                              <Input type="number" value={editingMerchant?.operation?.delayTolerance || 15} onChange={e => setEditingMerchant({...editingMerchant, operation: {...editingMerchant.operation, delayTolerance: Number(e.target.value)}})} className="rounded-xl bg-slate-50 border-none font-bold" />
                                           </div>
                                           <div className="space-y-2">
                                              <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Plano Ativo</Label>
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
                                              <Input value={editingMerchant?.financial?.pixKey || ""} onChange={e => setEditingMerchant({...editingMerchant, financial: {...editingMerchant.financial, pixKey: e.target.value}})} className="rounded-xl bg-slate-50 border-none font-bold text-green-600" />
                                           </div>
                                        </div>
                                     </TabsContent>
                                  </Tabs>
                                  <Button onClick={handleSaveEdit} className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black italic mt-8 gap-2 shadow-xl shadow-slate-200">
                                     <Save className="h-4 w-4" /> ATUALIZAR PARÂMETROS MASTER
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
