
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, ShoppingBag, List, Settings, Package, Bell, Store, Shield, Globe, Wallet, Palette, QrCode, Share2, Check, Download, Monitor, Zap, ExternalLink, Key } from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

export default function MerchantSettings({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const { toast } = useToast();
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [isQrGenerated, setIsQrGenerated] = useState(false);
  const [isKioskMode, setIsKioskMode] = useState(false);

  const handleSaveBranding = () => {
    toast({
      title: "Identidade Visual Atualizada",
      description: "As novas cores foram propagadas para todos os seus canais de venda."
    });
  };

  const handleGenerateQr = () => {
    setIsQrGenerated(true);
    toast({
      title: "QR Codes Gerados",
      description: "Criamos links únicos para 10 mesas da sua loja."
    });
  };

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
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Configurações Enterprise</h1>
            <p className="text-slate-500 font-medium">Personalize cada detalhe da sua infraestrutura digital.</p>
          </div>
          <Badge className="bg-green-100 text-green-700 border-none px-4 py-2 font-black italic">ESTADO: ONLINE</Badge>
        </header>

        <Tabs defaultValue="store" className="space-y-8">
          <TabsList className="bg-white p-1 rounded-2xl shadow-sm border h-auto w-full md:w-auto grid grid-cols-2 md:flex overflow-x-auto no-scrollbar">
            <TabsTrigger value="store" className="rounded-xl py-3 px-6 data-[state=active]:bg-primary data-[state=active]:text-white font-black italic text-xs">
              <Store className="h-4 w-4 mr-2" /> Minha Loja
            </TabsTrigger>
            <TabsTrigger value="branding" className="rounded-xl py-3 px-6 data-[state=active]:bg-primary data-[state=active]:text-white font-black italic text-xs">
              <Palette className="h-4 w-4 mr-2" /> Branding Pro
            </TabsTrigger>
            <TabsTrigger value="tables" className="rounded-xl py-3 px-6 data-[state=active]:bg-primary data-[state=active]:text-white font-black italic text-xs">
              <QrCode className="h-4 w-4 mr-2" /> Autoatendimento
            </TabsTrigger>
            <TabsTrigger value="infra" className="rounded-xl py-3 px-6 data-[state=active]:bg-primary data-[state=active]:text-white font-black italic text-xs">
              <Shield className="h-4 w-4 mr-2" /> Domínios & Segurança
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
                    </div>
                  </Card>

                  <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                    <CardTitle className="text-xl font-black italic mb-8">Omnichannel Integrations</CardTitle>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       {[
                         { name: 'WhatsApp', icon: 'bg-green-500' },
                         { name: 'Instagram', icon: 'bg-pink-500' },
                         { name: 'Google Shop', icon: 'bg-blue-500' }
                       ].map(integration => (
                         <div key={integration.name} className="p-6 bg-slate-50 rounded-3xl border flex flex-col items-center gap-3">
                            <div className={`h-10 w-10 rounded-xl ${integration.icon} flex items-center justify-center text-white font-black italic`}>
                               {integration.name[0]}
                            </div>
                            <span className="font-bold text-xs">{integration.name}</span>
                            <Switch defaultChecked />
                         </div>
                       ))}
                    </div>
                  </Card>
               </div>

               <div className="space-y-8">
                  <Card className="border-none shadow-sm rounded-[40px] p-8 bg-slate-900 text-white relative overflow-hidden">
                     <div className="relative z-10 space-y-6">
                        <h3 className="text-2xl font-black italic tracking-tighter">Status Global</h3>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-400">CDN Edge</span>
                              <Badge className="bg-green-500 text-white border-none italic font-black">Active</Badge>
                           </div>
                           <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-400">SSL Certificate</span>
                              <span className="text-white">Auto-Renewing</span>
                           </div>
                        </div>
                        <Button className="w-full h-14 bg-white text-slate-900 font-black italic rounded-2xl hover:bg-slate-50 transition-all">Flush DNS Cache</Button>
                     </div>
                  </Card>
               </div>
            </div>
          </TabsContent>

          <TabsContent value="branding">
             <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                <CardTitle className="text-2xl font-black italic mb-8">Dynamic Theme Engine</CardTitle>
                <div className="grid md:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <div className="space-y-4">
                         <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Cor Primária (HEX)</Label>
                         <div className="flex gap-4">
                            <input 
                              type="color" 
                              value={primaryColor} 
                              onChange={(e) => setPrimaryColor(e.target.value)}
                              className="h-14 w-20 rounded-2xl border-none cursor-pointer"
                            />
                            <Input 
                              value={primaryColor} 
                              onChange={(e) => setPrimaryColor(e.target.value)}
                              className="flex-1 h-14 rounded-2xl bg-slate-50 border-none font-black text-lg"
                            />
                         </div>
                      </div>
                      <div className="space-y-4">
                         <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Tipografia</Label>
                         <Select defaultValue="inter">
                            <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold">
                               <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-xl">
                               <SelectItem value="inter" className="font-bold">Inter (Padrão SaaS)</SelectItem>
                               <SelectItem value="poppins" className="font-bold">Poppins (Arredondado)</SelectItem>
                               <SelectItem value="serif" className="font-bold">Playfair (Luxo)</SelectItem>
                            </SelectContent>
                         </Select>
                      </div>
                      <Button onClick={handleSaveBranding} className="w-full h-16 bg-slate-900 rounded-[30px] font-black italic text-lg shadow-2xl">Salvar Identidade</Button>
                   </div>
                   <div className="bg-slate-50 rounded-[40px] p-8 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-6">
                      <div className="w-full max-w-[240px] bg-white rounded-[35px] shadow-xl p-6 space-y-4">
                         <div className="h-12 w-12 rounded-2xl mx-auto" style={{ backgroundColor: primaryColor }}></div>
                         <div className="h-3 w-3/4 bg-slate-100 rounded-full mx-auto"></div>
                         <div className="h-10 w-full rounded-xl" style={{ backgroundColor: primaryColor }}></div>
                      </div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Preview da Vitrine</p>
                   </div>
                </div>
             </Card>
          </TabsContent>

          <TabsContent value="tables">
             <div className="grid gap-8 md:grid-cols-2">
                <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                   <CardTitle className="text-2xl font-black italic mb-8">Pedido em Mesa & Retirada</CardTitle>
                   <div className="space-y-6">
                      <p className="text-slate-500 font-medium leading-relaxed text-sm">
                         Gere códigos QR inteligentes que permitem ao cliente pedir e pagar direto da mesa sem chamar o garçom.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Quantidade de Mesas</Label>
                            <Input type="number" defaultValue="10" className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                         </div>
                         <div className="flex items-end">
                            <Button onClick={handleGenerateQr} className="w-full h-12 bg-primary rounded-xl font-black italic text-xs">Gerar Agora</Button>
                         </div>
                      </div>
                      {isQrGenerated && (
                        <div className="grid grid-cols-3 gap-4 pt-4 animate-in fade-in zoom-in duration-500">
                           {[1,2,3,4,5,6].map(i => (
                             <div key={i} className="bg-slate-50 p-4 rounded-2xl border flex flex-col items-center gap-2 group cursor-pointer hover:bg-white hover:shadow-lg transition-all">
                                <QrCode className="h-8 w-8 text-slate-400" />
                                <span className="text-[10px] font-black italic">MESA {i}</span>
                                <Download className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100" />
                             </div>
                           ))}
                        </div>
                      )}
                   </div>
                </Card>

                <Card className="border-none shadow-sm rounded-[40px] p-8 bg-slate-900 text-white relative overflow-hidden">
                   <CardTitle className="text-2xl font-black italic mb-8 flex items-center gap-3">
                      <Monitor className="h-6 w-6 text-primary" /> Self-Service Kiosk
                   </CardTitle>
                   <div className="space-y-6 relative z-10">
                      <p className="text-slate-400 font-medium text-sm leading-relaxed">
                         Ative o modo totem para tablets em sua loja física. A interface muda para botões gigantes e fluxo de pagamento assistido.
                      </p>
                      <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
                         <div>
                            <p className="font-black italic">Habilitar Modo Quiosque</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Segurança por biometria requerida</p>
                         </div>
                         <Switch checked={isKioskMode} onCheckedChange={setIsKioskMode} />
                      </div>
                      <Button disabled={!isKioskMode} className="w-full h-14 bg-white text-slate-900 font-black italic rounded-2xl hover:bg-slate-50 transition-all gap-2">
                         <ExternalLink className="h-4 w-4" /> Abrir Terminal de Autoatendimento
                      </Button>
                   </div>
                   <Zap className="absolute -bottom-10 -right-10 h-40 w-40 opacity-5" />
                </Card>
             </div>
          </TabsContent>

          <TabsContent value="infra">
             <div className="grid gap-8 md:grid-cols-2">
                <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                   <CardTitle className="text-2xl font-black italic mb-8 flex items-center gap-3">
                      <Globe className="h-6 w-6 text-primary" /> Domínios Customizados
                   </CardTitle>
                   <div className="space-y-6">
                      <p className="text-slate-500 font-medium text-sm">
                         Conecte seu próprio domínio (ex: www.sualoja.com.br) para fortalecer seu branding.
                      </p>
                      <div className="space-y-4">
                         <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Seu Domínio</Label>
                            <div className="flex gap-2">
                               <Input placeholder="ex: compras.burguerze.com.br" className="h-12 rounded-xl bg-slate-50 border-none font-bold flex-1" />
                               <Button className="h-12 bg-slate-900 rounded-xl font-black italic text-xs">Validar DNS</Button>
                            </div>
                         </div>
                         <div className="p-4 bg-blue-50 rounded-2xl space-y-2 border border-blue-100">
                            <p className="text-[10px] font-black uppercase text-blue-600">Configuração Requerida</p>
                            <div className="flex justify-between text-[10px] font-mono font-bold">
                               <span>Tipo: CNAME</span>
                               <span>Valor: nodes.mercadoagil.com</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </Card>

                <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                   <CardTitle className="text-2xl font-black italic mb-8 flex items-center gap-3">
                      <Key className="h-6 w-6 text-primary" /> API & Segurança
                   </CardTitle>
                   <div className="space-y-6">
                      <p className="text-slate-500 font-medium text-sm">
                         Integre seu sistema ERP ou use Webhooks para automações externas.
                      </p>
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Merchant API Key</Label>
                         <div className="relative">
                            <Input value="mk_live_51P2...9Xz2" readOnly className="h-12 rounded-xl bg-slate-50 border-none font-mono text-xs pr-12" />
                            <Button size="icon" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg">
                               <Check className="h-4 w-4 text-green-500" />
                            </Button>
                         </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border">
                         <span className="text-xs font-bold text-slate-600 uppercase">Hardware Fingerprinting</span>
                         <Switch defaultChecked />
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
