
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Plus, LayoutDashboard, List, Settings, Package, 
  Trash2, Edit2, Star, TrendingUp, Trophy, Loader2,
  DollarSign, Calculator, Wallet, UserMinus, ShieldCheck,
  Briefcase, History, Zap
} from "lucide-react";
import Link from 'next/link';
import { useFirestore, useCollection, addDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, doc } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";

export default function MerchantStaff({ params }: { params: Promise<{ slug: string }> }) {
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

  const staffQuery = useMemoFirebase(() => {
    if (!merchantId) return null;
    return query(collection(db, 'merchants', merchantId, 'staff'));
  }, [db, merchantId]);
  const { data: staffList, isLoading: loadingStaff } = useCollection(staffQuery);

  const [formData, setFormData] = useState({
    name: "",
    role: "Barbeiro Sênior",
    email: "",
    commission: 50
  });

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId) return;
    setLoading(true);
    
    const newStaff = {
      ...formData,
      avatar: `https://picsum.photos/seed/${formData.name}/200/200`,
      performanceScore: 85,
      ordersHandled: 0,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    addDocumentNonBlocking(collection(db, 'merchants', merchantId, 'staff'), newStaff);
    
    setLoading(false);
    setIsCreateOpen(false);
    toast({ title: "Bem-vindo à equipe!", description: `${formData.name} ativado.` });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><LayoutDashboard className="h-5 w-5" /> Início</Link>
          <Link href={`/merchant/${slug}/appointments`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><History className="h-5 w-5" /> Agenda</Link>
          <Link href={`/merchant/${slug}/staff`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><Users className="h-5 w-5" /> Equipe Elite</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Gestão de Capital Humano</h1>
            <p className="text-slate-500 font-medium">Comissões, vales e produtividade em tempo real.</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-slate-900 rounded-2xl h-12 gap-2 shadow-xl shadow-slate-200 font-bold text-white px-6">
                <Plus className="h-5 w-5" /> Novo Profissional
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-[40px] p-0 overflow-hidden border-none shadow-2xl">
              <div className="bg-slate-900 p-8 text-white">
                <DialogTitle className="text-2xl font-black italic uppercase">Contratação Digital</DialogTitle>
                <p className="text-slate-400 text-xs font-bold mt-1">Configure o perfil e a comissão do novo integrante.</p>
              </div>
              <form onSubmit={handleCreateStaff} className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">Nome do Integrante</Label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Comissão (%)</Label>
                    <Input type="number" required value={formData.commission} onChange={e => setFormData({...formData, commission: Number(e.target.value)})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Cargo</Label>
                    <Input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full h-16 bg-primary rounded-[30px] font-black italic text-lg text-white shadow-xl">ATIVAR ACESSO</Button>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <Tabs defaultValue="list" className="space-y-8">
           <TabsList className="bg-white p-1 rounded-2xl shadow-sm border h-auto flex gap-1 w-fit">
              <TabsTrigger value="list" className="rounded-xl py-3 px-8 font-black italic text-xs uppercase tracking-widest"><Users className="h-4 w-4 mr-2" /> Leaderboard</TabsTrigger>
              <TabsTrigger value="payroll" className="rounded-xl py-3 px-8 font-black italic text-xs uppercase tracking-widest"><Calculator className="h-4 w-4 mr-2" /> Comissões & Vales</TabsTrigger>
           </TabsList>

           <TabsContent value="list">
              <Card className="border-none shadow-sm rounded-[40px] overflow-hidden">
                <CardContent className="p-0">
                  {loadingStaff ? (
                    <div className="p-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
                  ) : (
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow>
                          <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest text-slate-400">Colaborador</TableHead>
                          <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-400 text-center">Score Prod.</TableHead>
                          <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-400 text-center">Volume</TableHead>
                          <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest text-slate-400">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {staffList?.map((member: any) => (
                          <TableRow key={member.id} className="hover:bg-slate-50 transition-colors">
                            <TableCell className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 rounded-2xl border-2 border-white shadow-sm">
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="font-black text-slate-900 uppercase italic text-sm">{member.name}</span>
                                  <span className="text-[9px] font-black uppercase text-slate-400">{member.role} • {member.commission}%</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="w-full max-w-[140px] mx-auto space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase text-primary">
                                  <span>Produtividade</span>
                                  <span>{member.performanceScore}%</span>
                                </div>
                                <Progress value={member.performanceScore} className="h-1.5" />
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className="font-black italic bg-green-50 text-green-600 rounded-lg border-none px-3 uppercase text-[9px]">
                                  {member.ordersHandled} Atendimentos
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right px-8">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 text-primary"><TrendingUp className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 text-slate-400"><Edit2 className="h-4 w-4" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
           </TabsContent>

           <TabsContent value="payroll">
              <div className="grid gap-6 md:grid-cols-3">
                 <Card className="border-none shadow-sm rounded-[40px] p-8 bg-slate-900 text-white relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                       <DollarSign className="h-10 w-10 text-primary" />
                       <h3 className="text-2xl font-black italic uppercase tracking-tighter">Resumo de Repasse</h3>
                       <p className="text-slate-400 text-xs font-medium italic">"Total de comissões acumuladas para fechar na semana."</p>
                       <p className="text-4xl font-black italic text-primary mt-4">R$ 12.450,00</p>
                    </div>
                    <Zap className="absolute -bottom-10 -right-10 h-48 w-48 opacity-5" />
                 </Card>

                 <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white space-y-6">
                    <CardTitle className="text-xl font-black italic uppercase flex items-center gap-2 text-slate-900">
                       <Wallet className="h-5 w-5 text-orange-500" /> Vale & Consumo
                    </CardTitle>
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400">Selecionar Profissional</Label>
                          <Select><SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold"><SelectValue placeholder="Escolha" /></SelectTrigger></Select>
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400">Valor do Lançamento</Label>
                          <Input placeholder="R$ 0,00" className="h-12 rounded-xl bg-slate-50 border-none font-black text-lg" />
                       </div>
                       <Button className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black italic shadow-lg shadow-orange-100 uppercase">LANÇAR DÉBITO</Button>
                    </div>
                 </Card>

                 <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                    <CardTitle className="text-xl font-black italic uppercase text-slate-900 mb-6">Alertas de Equipe</CardTitle>
                    <div className="space-y-4">
                       <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3">
                          <UserMinus className="h-5 w-5 text-red-500" />
                          <p className="text-[10px] font-bold text-red-700 uppercase leading-tight">Ricardo: 02 faltas no mês.</p>
                       </div>
                       <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                          <ShieldCheck className="h-5 w-5 text-green-500" />
                          <p className="text-[10px] font-bold text-green-700 uppercase leading-tight">Ana: Meta de batida atingida!</p>
                       </div>
                    </div>
                 </Card>
              </div>
           </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
