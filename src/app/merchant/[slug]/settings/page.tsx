
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutDashboard, ShoppingBag, List, Settings, Package, Bell, Store, Shield, Globe, Wallet, Palette } from "lucide-react";
import Link from 'next/link';

export default function MerchantSettings({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary">
            MERCADO ÁGIL
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 max-w-6xl">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Configurações Enterprise</h1>
          <p className="text-slate-500 font-medium">Personalize cada detalhe da sua infraestrutura digital.</p>
        </header>

        <Tabs defaultValue="store" className="space-y-8">
          <TabsList className="bg-white p-1 rounded-2xl shadow-sm border h-auto w-full md:w-auto grid grid-cols-2 md:flex overflow-x-auto no-scrollbar">
            <TabsTrigger value="store" className="rounded-xl py-3 px-6 data-[state=active]:bg-primary data-[state=active]:text-white font-black italic">
              <Store className="h-4 w-4 mr-2" /> Minha Loja
            </TabsTrigger>
            <TabsTrigger value="localization" className="rounded-xl py-3 px-6 data-[state=active]:bg-primary data-[state=active]:text-white font-black italic">
              <Globe className="h-4 w-4 mr-2" /> Global & Multi-Moeda
            </TabsTrigger>
            <TabsTrigger value="branding" className="rounded-xl py-3 px-6 data-[state=active]:bg-primary data-[state=active]:text-white font-black italic">
              <Palette className="h-4 w-4 mr-2" /> Branding Pro
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl py-3 px-6 data-[state=active]:bg-primary data-[state=active]:text-white font-black italic">
              <Shield className="h-4 w-4 mr-2" /> Segurança & ACL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="store">
            <div className="grid gap-8 lg:grid-cols-3">
               <div className="lg:col-span-2 space-y-8">
                  <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                    <CardTitle className="text-xl font-black italic mb-8">Identidade do Negócio</CardTitle>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Nome da Instância</Label>
                        <Input defaultValue="Burger King do Zé" className="rounded-2xl h-14 bg-slate-50 border-none font-bold" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Subdomínio (.mercadoagil.com)</Label>
                        <Input defaultValue={slug} className="rounded-2xl h-14 bg-slate-50 border-none font-bold text-primary" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Descrição Pública (SEO)</Label>
                        <Input defaultValue="O melhor burger artesanal da região com entrega rápida." className="rounded-2xl h-14 bg-slate-50 border-none font-bold" />
                      </div>
                    </div>
                  </Card>

                  <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                    <CardTitle className="text-xl font-black italic mb-8">Políticas de Operação</CardTitle>
                    <div className="space-y-6">
                       {[
                         { title: 'Aceitar Pedidos Agendados', desc: 'Permite que clientes escolham horário de entrega futuro.' },
                         { title: 'Exibir Estoque em Tempo Real', desc: 'Mostra quantidade exata para o cliente final.' },
                         { title: 'Checkout como Convidado', desc: 'Permite compras rápidas sem criação de conta.' },
                       ].map((item, i) => (
                         <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-dashed">
                            <div className="space-y-1">
                               <p className="font-black text-slate-900 italic">{item.title}</p>
                               <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                            </div>
                            <Switch defaultChecked />
                         </div>
                       ))}
                    </div>
                  </Card>
               </div>

               <div className="space-y-8">
                  <Card className="border-none shadow-sm rounded-[40px] p-8 bg-slate-900 text-white relative overflow-hidden">
                     <div className="relative z-10 space-y-6">
                        <div className="bg-primary/20 h-14 w-14 rounded-2xl flex items-center justify-center">
                           <Shield className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-black italic tracking-tighter">Status da Instância</h3>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-400">Plano Atual</span>
                              <Badge className="bg-primary text-white border-none italic font-black">SaaS Pro II</Badge>
                           </div>
                           <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-400">Próxima Fatura</span>
                              <span className="text-white">12/04/2024</span>
                           </div>
                           <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-400">Storage Utilizado</span>
                              <span className="text-white">1.2 GB / 10 GB</span>
                           </div>
                        </div>
                        <Button className="w-full h-14 bg-white text-slate-900 font-black italic rounded-2xl hover:bg-slate-50 transition-all">Upgrade para Enterprise</Button>
                     </div>
                  </Card>
               </div>
            </div>
          </TabsContent>

          <TabsContent value="localization">
             <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                <CardTitle className="text-2xl font-black italic mb-8">Configurações Globais</CardTitle>
                <div className="grid md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Idioma da Vitrine</Label>
                         <Select defaultValue="pt-BR">
                            <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold">
                               <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                               <SelectItem value="pt-BR" className="font-bold italic">Português (Brasil)</SelectItem>
                               <SelectItem value="en-US" className="font-bold italic">English (US)</SelectItem>
                               <SelectItem value="es-ES" className="font-bold italic">Español</SelectItem>
                            </SelectContent>
                         </Select>
                      </div>
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Moeda Padrão</Label>
                         <Select defaultValue="BRL">
                            <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold">
                               <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                               <SelectItem value="BRL" className="font-bold italic">R$ - Real Brasileiro</SelectItem>
                               <SelectItem value="USD" className="font-bold italic">$ - Dólar Americano</SelectItem>
                               <SelectItem value="EUR" className="font-bold italic">€ - Euro</SelectItem>
                            </SelectContent>
                         </Select>
                      </div>
                   </div>
                   <div className="p-8 bg-slate-50 rounded-[35px] border-2 border-dashed flex flex-col items-center justify-center text-center space-y-4">
                      <Globe className="h-12 w-12 text-slate-300" />
                      <div>
                         <p className="font-black text-slate-900 italic">Venda Internacional</p>
                         <p className="text-xs text-slate-400 font-medium max-w-[200px] mt-1">Ao ativar múltiplas moedas, o sistema converterá os preços automaticamente via API Central.</p>
                      </div>
                      <Button variant="outline" className="rounded-xl font-black italic">Habilitar Multi-Moeda</Button>
                   </div>
                </div>
             </Card>
          </TabsContent>
        </Tabs>
        <div className="mt-10 flex justify-end">
           <Button className="h-16 px-12 bg-primary hover:bg-primary/90 text-white font-black italic text-lg rounded-[30px] shadow-2xl shadow-primary/20">Salvar Mudanças Globais</Button>
        </div>
      </main>
    </div>
  );
}
