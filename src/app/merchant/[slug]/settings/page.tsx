
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Store, Shield, Palette, QrCode, Globe, Key, 
  LayoutDashboard, Settings, Smartphone, Zap, Code
} from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

export default function MerchantSettings({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const { toast } = useToast();

  const handleSaveIntegrations = () => {
    toast({ title: "Configurações Salvas", description: "Pixels e integrações foram atualizados." });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
          <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><Settings className="h-5 w-5" /> Configurações</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 max-w-6xl">
        <header className="mb-10 flex justify-between items-end">
          <div><h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Configurações Enterprise</h1><p className="text-slate-500 font-medium">Gestão técnica, anúncios e infraestrutura.</p></div>
          <Badge className="bg-green-100 text-green-700 border-none px-4 py-2 font-black italic">ESTADO: ONLINE</Badge>
        </header>

        <Tabs defaultValue="integrations" className="space-y-8">
          <TabsList className="bg-white p-1 rounded-2xl shadow-sm border h-auto flex overflow-x-auto no-scrollbar">
            <TabsTrigger value="store" className="rounded-xl py-3 px-6 font-black italic text-xs"><Store className="h-4 w-4 mr-2" /> Loja</TabsTrigger>
            <TabsTrigger value="integrations" className="rounded-xl py-3 px-6 font-black italic text-xs"><Code className="h-4 w-4 mr-2" /> Anúncios & Pixel</TabsTrigger>
            <TabsTrigger value="infra" className="rounded-xl py-3 px-6 font-black italic text-xs"><Shield className="h-4 w-4 mr-2" /> Segurança</TabsTrigger>
          </TabsList>

          <TabsContent value="integrations">
             <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                <CardTitle className="text-2xl font-black italic mb-8">Tráfego Pago & Rastreamento</CardTitle>
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Facebook Pixel ID</Label>
                         <Input placeholder="ex: 123456789012345" className="h-14 rounded-2xl bg-slate-50 border-none font-mono" />
                      </div>
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Google Analytics (G-ID)</Label>
                         <Input placeholder="ex: G-XXXXXXX" className="h-14 rounded-2xl bg-slate-50 border-none font-mono" />
                      </div>
                      <Button onClick={handleSaveIntegrations} className="w-full h-16 bg-slate-900 rounded-[30px] font-black italic text-lg shadow-2xl">Salvar Integrações</Button>
                   </div>
                   <div className="p-8 bg-blue-50 rounded-[40px] border border-blue-100 space-y-4">
                      <Zap className="h-10 w-10 text-primary" />
                      <h3 className="font-black italic text-slate-900">Por que integrar?</h3>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">Conectando seus Pixels, você pode criar campanhas de remarketing para clientes que abandonaram o carrinho e medir o ROI real de cada anúncio no Instagram e Google.</p>
                   </div>
                </div>
             </Card>
          </TabsContent>

          <TabsContent value="store">
             <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                <CardTitle className="text-xl font-black italic mb-8">Identidade do Negócio</CardTitle>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-slate-400 px-1">Nome da Instância</Label><Input defaultValue="Burger King do Zé" className="rounded-2xl h-14 bg-slate-50 border-none font-bold" /></div>
                  <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-slate-400 px-1">Subdomínio (.mercadoagil.com)</Label><Input defaultValue={slug} className="rounded-2xl h-14 bg-slate-50 border-none font-bold text-primary" /></div>
                </div>
             </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
