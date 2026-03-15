"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, ShoppingBag, List, Settings, Package, Bell, Store, Shield } from "lucide-react";
import Link from 'next/link';

export default function MerchantSettings({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-accent p-1.5 rounded-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">Painel Lojista</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${slug}/orders`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <ShoppingBag className="h-5 w-5" /> Pedidos
          </Link>
          <Link href={`/merchant/${slug}/catalog`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <List className="h-5 w-5" /> Catálogo
          </Link>
          <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 bg-accent/10 text-accent rounded-xl font-bold">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
          <p className="text-slate-500 mt-1">Ajuste os detalhes da sua loja e conta.</p>
        </header>

        <Tabs defaultValue="store" className="space-y-6">
          <TabsList className="bg-white p-1 rounded-2xl shadow-sm border h-auto">
            <TabsTrigger value="store" className="rounded-xl py-3 px-6 data-[state=active]:bg-slate-100 data-[state=active]:shadow-none">
              <Store className="h-4 w-4 mr-2" /> Minha Loja
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl py-3 px-6 data-[state=active]:bg-slate-100 data-[state=active]:shadow-none">
              <Bell className="h-4 w-4 mr-2" /> Notificações
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl py-3 px-6 data-[state=active]:bg-slate-100 data-[state=active]:shadow-none">
              <Shield className="h-4 w-4 mr-2" /> Segurança
            </TabsTrigger>
          </TabsList>

          <TabsContent value="store">
            <Card className="border-none shadow-sm rounded-3xl p-6">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-400">Nome da Loja</Label>
                    <Input defaultValue="Burger King do Zé" className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-400">Subdomínio (URL)</Label>
                    <div className="flex items-center">
                      <Input defaultValue={slug} className="rounded-l-xl h-12 border-r-0" />
                      <div className="h-12 flex items-center px-4 bg-slate-100 border border-slate-200 rounded-r-xl text-slate-400 font-medium">.mercadoagil.com</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-400">Tempo Médio de Preparo</Label>
                    <Input type="number" defaultValue="35" className="rounded-xl h-12" />
                  </div>
                </div>
                
                <div className="space-y-6 p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                   <h3 className="font-bold text-slate-800">Status de Operação</h3>
                   <div className="flex items-center justify-between p-4 bg-white rounded-2xl border">
                      <div className="space-y-0.5">
                        <p className="font-bold text-sm">Loja Aberta</p>
                        <p className="text-xs text-slate-500">Permite novos pedidos agora.</p>
                      </div>
                      <Switch defaultChecked />
                   </div>
                   <div className="flex items-center justify-between p-4 bg-white rounded-2xl border">
                      <div className="space-y-0.5">
                        <p className="font-bold text-sm">Aceitar Pagamento Online</p>
                        <p className="text-xs text-slate-500">Habilita checkout com cartão.</p>
                      </div>
                      <Switch defaultChecked />
                   </div>
                   <div className="flex items-center justify-between p-4 bg-white rounded-2xl border">
                      <div className="space-y-0.5">
                        <p className="font-bold text-sm">Retirada no Balcão</p>
                        <p className="text-xs text-slate-500">Habilita opção de Takeaway.</p>
                      </div>
                      <Switch />
                   </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <Button className="bg-accent hover:bg-accent/90 px-10 py-6 rounded-2xl text-lg font-bold">Salvar Alterações</Button>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
             <Card className="border-none shadow-sm rounded-3xl p-8 text-center space-y-4">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                   <Bell className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold">Centro de Notificações</h2>
                <p className="text-slate-500 max-w-sm mx-auto">Configure como você deseja ser alertado sobre novos pedidos e mensagens de clientes.</p>
             </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
