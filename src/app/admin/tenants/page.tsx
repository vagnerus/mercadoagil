
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
  Store, ShieldCheck, LogOut, LayoutDashboard, LayoutGrid, 
  Server, Plus, Loader2, Scissors, Stethoscope, 
  Wrench, Dog, GraduationCap, HeartHandshake, ShoppingBag, 
  Briefcase, Zap, ArrowUpRight
} from "lucide-react";
import Link from 'next/link';
import { MerchantSegment } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, addDocumentNonBlocking, setDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, query, orderBy, doc } from 'firebase/firestore';

const SEGMENTS: { value: MerchantSegment; label: string; icon: any }[] = [
  { value: 'BEAUTY', label: 'Barbearia / Estética', icon: Scissors },
  { value: 'HEALTH', label: 'Saúde / Clínicas', icon: Stethoscope },
  { value: 'RESTAURANT', label: 'Restaurante / Food', icon: ShoppingBag },
  { value: 'RETAIL', label: 'Varejo / Loja', icon: Briefcase },
  { value: 'MAINTENANCE', label: 'Manutenção / T.I.', icon: Wrench },
  { value: 'AUTO', label: 'Automotivo / Oficina', icon: Zap },
  { value: 'PET', label: 'Pets / Veterinária', icon: Dog },
  { value: 'EDUCATION', label: 'Educação / Aulas', icon: GraduationCap },
  { value: 'SERVICE', label: 'Consultoria / Advogados', icon: HeartHandshake },
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
    segment: "RETAIL" as MerchantSegment,
    planId: "p_pro",
    email: "",
    ownerName: ""
  });

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const merchantId = `m_${Math.random().toString(36).substring(7)}`;
    
    // Configurações padrão por segmento
    const initialSettings = {
      enableWallet: true,
      enableCashback: true,
      cashbackPercentage: 5,
      appointmentInterval: formData.segment === 'BEAUTY' || formData.segment === 'HEALTH' ? 30 : 0
    };

    const merchantData = {
      id: merchantId,
      name: formData.name,
      slug: formData.slug,
      segment: formData.segment,
      email: formData.email,
      status: 'active',
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp(),
      planName: 'Pro',
      mrr: 150,
      settings: initialSettings,
      logoUrl: `https://picsum.photos/seed/${formData.segment}/200/200`,
      bannerUrl: `https://picsum.photos/seed/${formData.slug}/1200/400`
    };

    addDocumentNonBlocking(collection(db, 'merchants'), merchantData);

    const userRef = doc(db, 'platformUsers', formData.email.replace(/[.@]/g, '_'));
    setDocumentNonBlocking(userRef, {
      id: formData.email.replace(/[.@]/g, '_'),
      email: formData.email,
      firstName: formData.ownerName.split(' ')[0],
      lastName: formData.ownerName.split(' ').slice(1).join(' '),
      role: 'MERCHANT_ADMIN',
      merchantId: merchantId,
      merchantSlug: formData.slug,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });

    setIsCreateOpen(false);
    setLoading(false);
    toast({ 
      title: "Vertical Ativada!", 
      description: `Instância para ${formData.name} criada com sucesso.` 
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg shadow-sm">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">Master Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><LayoutDashboard className="h-5 w-5" /> Global</Link>
          <Link href="/admin/tenants" className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><LayoutGrid className="h-5 w-5" /> Tenants</Link>
          <Link href="/admin/infra" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Server className="h-5 w-5" /> Infra</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Provisionamento SaaS</h1>
            <p className="text-slate-500 font-medium">Criação de instâncias isoladas por segmento.</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-slate-900 rounded-2xl h-12 gap-2 font-black italic px-6 shadow-xl"><Plus className="h-5 w-5" /> Nova Loja</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl rounded-[40px] p-0 overflow-hidden border-none shadow-2xl">
              <div className="bg-primary p-8 text-white">
                <DialogTitle className="text-2xl font-black italic uppercase">Escolha a Vertical</DialogTitle>
                <p className="text-white/70 text-xs font-bold mt-1">O sistema será configurado conforme o nicho.</p>
              </div>
              <form onSubmit={handleCreateStore} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Nome do Negócio</Label>
                    <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Segmento</Label>
                    <Select value={formData.segment} onValueChange={v => setFormData({...formData, segment: v as MerchantSegment})}>
                      <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-xl">
                        {SEGMENTS.map(s => (
                          <SelectItem key={s.value} value={s.value} className="font-bold">
                            <div className="flex items-center gap-2"><s.icon className="h-4 w-4" /> {s.label}</div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">E-mail do Proprietário</Label>
                  <Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">Subdomínio (Ex: barbearia-do-ze)</Label>
                  <Input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="h-12 rounded-xl bg-slate-50 border-none font-bold text-primary" />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-16 bg-slate-900 rounded-[30px] font-black italic text-lg">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'ATIVAR INSTÂNCIA'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="px-8 h-16 font-black uppercase text-[10px]">Loja / Vertical</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px]">Proprietário</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px]">Plano</TableHead>
                  <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px]">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {merchants?.map((m: any) => (
                  <TableRow key={m.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                          <Store className="h-5 w-5 text-slate-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 italic uppercase">{m.name}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.segment} • {m.slug}.agil.com</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-500">{m.email}</TableCell>
                    <TableCell><Badge className="bg-primary/10 text-primary border-none font-black italic uppercase text-[9px]">{m.planName || 'Pro'}</Badge></TableCell>
                    <TableCell className="text-right px-8">
                      <Button variant="ghost" size="icon" asChild className="rounded-xl">
                        <Link href={`/merchant/${m.slug}/dashboard`}><ArrowUpRight className="h-5 w-5 text-slate-300" /></Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
