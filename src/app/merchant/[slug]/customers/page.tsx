
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Search, Mail, Phone, MessageSquare, Star, 
  LayoutDashboard, ShoppingBag, List, Wallet, Settings, 
  Package, Megaphone, Loader2, Sparkles, Copy, Check, 
  MessageCircle, Smartphone 
} from "lucide-react";
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { generateMarketingCampaign, MarketingCampaignOutput } from "@/ai/flows/generate-marketing-campaign-flow";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';

export default function MerchantCustomers({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [isCampaignOpen, setIsCampaignOpen] = useState(false);
  const [loadingCampaign, setLoadingCampaign] = useState(false);
  const [campaign, setCampaign] = useState<MarketingCampaignOutput | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();
  const db = useFirestore();

  const merchantQuery = useMemoFirebase(() => query(
    collection(db, 'merchants'), 
    where('slug', '==', slug), 
    limit(1)
  ), [db, slug]);
  const { data: merchantData } = useCollection(merchantQuery);
  const merchant = merchantData?.[0];

  const customers = [
    { id: 'u1', name: 'João Silva', email: 'joao@email.com', phone: '11999998888', orders: 12, spent: 1450.00, rating: 4.9, status: 'Vip' },
    { id: 'u2', name: 'Maria Santos', email: 'maria@email.com', phone: '11977776666', orders: 8, spent: 920.00, rating: 5.0, status: 'Recorrente' },
    { id: 'u3', name: 'Pedro Souza', email: 'pedro@email.com', phone: '11988885555', orders: 1, spent: 45.00, rating: 4.2, status: 'Novo' },
    { id: 'u4', name: 'Ana Oliveira', email: 'ana@email.com', phone: '11966664444', orders: 5, spent: 310.00, rating: 3.5, status: 'Em Risco' },
  ];

  const handleCreateCampaign = async () => {
    setLoadingCampaign(true);
    try {
      const result = await generateMarketingCampaign({
        merchantName: merchant?.name || slug,
        promotionGoal: "Reativar clientes inativos e fidelizar os VIPs com um brinde especial.",
        featuredProducts: ["Corte Completo", "Combo Barba & Cabelo"],
        couponCode: "VOLTAPRACA10"
      });
      setCampaign(result);
      setIsCampaignOpen(true);
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao gerar campanha IA.", variant: "destructive" });
    } finally {
      setLoadingCampaign(false);
    }
  };

  const handleWhatsAppCustomer = (customer: any) => {
    const message = `Olá ${customer.name}! Tudo bem? Notamos que você é um cliente especial aqui na *${merchant?.name}*. Temos novidades para você! Como podemos te ajudar hoje?`;
    window.open(`https://wa.me/55${customer.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
    toast({ title: "Copiado!", description: "Conteúdo copiado para a área de transferência." });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg shadow-sm">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight italic uppercase">MERCADO ÁGIL</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${slug}/customers`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold">
            <Users className="h-5 w-5" /> CRM Clientes
          </Link>
          <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">CRM & WhatsApp Center</h1>
            <p className="text-slate-500 font-medium">Gestão de relacionamento e disparos de fidelização.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button 
              onClick={handleCreateCampaign} 
              disabled={loadingCampaign}
              className="bg-primary hover:bg-primary/90 rounded-2xl h-12 gap-2 font-black italic px-6 shadow-xl shadow-primary/20 text-white"
            >
              {loadingCampaign ? <Loader2 className="h-4 w-4 animate-spin" /> : <Megaphone className="h-5 w-5" />}
              Scripts IA para Whats
            </Button>
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input className="pl-12 h-12 rounded-2xl bg-white border-none shadow-sm" placeholder="Buscar cliente..." />
            </div>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="border-none shadow-sm rounded-[32px] p-6 text-center space-y-2 bg-white">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Base Ativa</p>
            <p className="text-4xl font-black italic tracking-tighter text-slate-900">1.248</p>
          </Card>
          <Card className="border-none shadow-sm rounded-[32px] p-6 text-center space-y-2 bg-green-50 border border-green-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-green-600">Instância WhatsApp</p>
            <p className="text-2xl font-black italic tracking-tighter text-green-700">CONECTADA</p>
          </Card>
          <Card className="border-none shadow-sm rounded-[32px] p-6 text-center space-y-2 bg-white">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Engajamento</p>
            <p className="text-4xl font-black italic tracking-tighter text-slate-900">68%</p>
          </Card>
          <Card className="border-none shadow-sm rounded-[32px] p-6 text-center space-y-2 bg-white">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nota Média</p>
            <p className="text-4xl font-black italic tracking-tighter text-slate-900 flex items-center justify-center gap-2"><Star className="h-6 w-6 fill-yellow-400 text-yellow-400" /> 4.9</p>
          </Card>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Cliente</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Última Venda</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Faturamento</TableHead>
                  <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Disparo Direto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c) => (
                  <TableRow key={c.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-lg uppercase italic">{c.name}</span>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase"><Mail className="h-3 w-3" /> {c.email}</span>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase"><Smartphone className="h-3 w-3" /> {c.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                       <Badge className={`rounded-full px-3 py-1 font-black text-[9px] uppercase border-none ${
                         c.status === 'Vip' ? 'bg-yellow-100 text-yellow-700' : 
                         c.status === 'Em Risco' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                       }`}>
                         {c.status}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-slate-100 text-slate-800 font-black rounded-lg px-3 py-1 border-none">{c.orders} pedidos</Badge>
                    </TableCell>
                    <TableCell className="text-center font-black italic text-primary text-lg">R$ {c.spent.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button onClick={() => handleWhatsAppCustomer(c)} size="icon" className="rounded-2xl bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-100">
                          <MessageCircle className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-200"><Settings className="h-5 w-5 text-slate-600" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isCampaignOpen} onOpenChange={setIsCampaignOpen}>
        <DialogContent className="sm:max-w-2xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden font-body">
           <div className="bg-green-600 p-10 text-white relative overflow-hidden">
              <Sparkles className="absolute -top-10 -right-10 h-40 w-40 opacity-10 animate-pulse" />
              <DialogHeader>
                <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase text-white">WhatsApp Marketing IA</DialogTitle>
                <p className="text-white/80 font-bold uppercase text-[10px] tracking-widest mt-2 border-l-2 border-white/30 pl-3">Conectado ao seu número oficial</p>
              </DialogHeader>
           </div>
           <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
              {campaign && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Abordagem Individual (Whats)</h3>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(campaign.whatsappMessage, 'wa')} className="h-8 rounded-lg gap-2 text-green-600">
                        {copied === 'wa' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        Copiar Script
                      </Button>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[32px] border border-dashed border-slate-200 whitespace-pre-wrap text-sm font-medium text-slate-600 italic">
                      {campaign.whatsappMessage}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Post de Status / Stories</h3>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(campaign.instagramCaption, 'ig')} className="h-8 rounded-lg gap-2 text-primary">
                        {copied === 'ig' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        Copiar Legenda
                      </Button>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[32px] border border-dashed border-slate-200 whitespace-pre-wrap text-sm font-medium text-slate-600 italic">
                      {campaign.instagramCaption}
                    </div>
                  </div>
                </div>
              )}
              <Button className="w-full h-16 bg-slate-900 rounded-[30px] font-black italic text-lg text-white" onClick={() => setIsCampaignOpen(false)}>CONCLUÍDO</Button>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
