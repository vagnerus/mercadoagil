
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
import { Users, Plus, LayoutDashboard, List, Settings, Package, Trash2, Edit2, Star, TrendingUp, Trophy, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useFirestore, useCollection, addDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
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
    role: "Barbeiro",
    email: "",
    avatar: ""
  });

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId) return;
    setLoading(true);
    
    const newStaff = {
      name: formData.name,
      role: formData.role,
      email: formData.email,
      avatar: formData.avatar || `https://picsum.photos/seed/${formData.name}/200/200`,
      performanceScore: 85,
      ordersHandled: 0,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    addDocumentNonBlocking(collection(db, 'merchants', merchantId, 'staff'), newStaff);
    
    setLoading(false);
    setIsCreateOpen(false);
    toast({ title: "Bem-vindo à equipe!", description: `${formData.name} foi adicionado com sucesso.` });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${slug}/staff`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold">
            <Users className="h-5 w-5" /> Equipe
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Gestão de Equipe</h1>
            <p className="text-slate-500 font-medium">Leaderboard de performance e produtividade.</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-slate-900 rounded-2xl h-12 gap-2 shadow-xl shadow-slate-200 font-bold text-white px-6">
                <Plus className="h-5 w-5" /> Novo Integrante
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-[40px] p-0 overflow-hidden border-none shadow-2xl">
              <div className="bg-slate-900 p-8 text-white">
                <DialogTitle className="text-2xl font-black italic uppercase text-white">Novo Profissional</DialogTitle>
                <p className="text-slate-400 text-xs font-bold mt-1">Adicione um novo membro à sua equipe de especialistas.</p>
              </div>
              <form onSubmit={handleCreateStaff} className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">Nome do Integrante</Label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" placeholder="Ex: Ricardo Barber" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">Cargo / Função</Label>
                  <Input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" placeholder="Ex: Barbeiro Sênior" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">E-mail Profissional</Label>
                  <Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" placeholder="email@empresa.com" />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-16 bg-primary rounded-[30px] font-black italic text-lg text-white">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'ATIVAR ACESSO'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden">
          <CardContent className="p-0">
            {loadingStaff ? (
              <div className="p-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Colaborador</TableHead>
                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Performance</TableHead>
                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Volume</TableHead>
                    <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffList?.map((member: any, index: number) => (
                    <TableRow key={member.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 rounded-2xl shadow-sm border-2 border-white">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900">{member.name}</span>
                            <span className="text-[9px] font-black uppercase text-slate-400">{member.role}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-full max-w-[140px] space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase">
                            <span>Score</span>
                            <span className="text-primary">{member.performanceScore}%</span>
                          </div>
                          <Progress value={member.performanceScore} className="h-1.5" />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="font-black italic bg-slate-100 text-slate-600 rounded-lg px-3 border-none">
                            {member.ordersHandled} atendimentos
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-200"><TrendingUp className="h-4 w-4 text-slate-400" /></Button>
                          <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-200"><Edit2 className="h-4 w-4 text-slate-400" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {staffList?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-40 text-center text-slate-400 font-bold italic uppercase tracking-widest text-xs">Nenhum integrante na equipe ainda.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
