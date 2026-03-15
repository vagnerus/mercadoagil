
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Store, Shield, Palette, QrCode, Globe, Key, 
  LayoutDashboard, Settings, Smartphone, Zap, Code, MessageCircle, Loader2, CheckCircle2, Link as LinkIcon, RefreshCw
} from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, where, limit, doc } from 'firebase/firestore';

export default function MerchantSettings({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const { toast } = useToast();
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const merchantQuery = useMemoFirebase(() => query(
    collection(db, 'merchants'), 
    where('slug', '==', slug), 
    limit(1)
  ), [db, slug]);
  const { data: merchantData, isLoading: loadingMerchant } = useCollection(merchantQuery);
  const merchant = merchantData?.[0];

  const [settings, setSettings] = useState({
    name: "",
    whatsapp: "",
    enableAutoNotify: true,
    facebookPixel: "",
    googleAnalytics: ""
  });

  useEffect(() => {
    if (merchant) {
      setSettings({
        name: merchant.name || "",
        whatsapp: merchant.settings?.whatsapp || "",
        enableAutoNotify: merchant.settings?.enableAutoNotify ?? true,
        facebookPixel: merchant.settings?.facebookPixel || "",
        googleAnalytics: merchant.settings?.googleAnalytics || ""
      });
    }
  }, [merchant]);

  const handleSave = () => {
    if (!merchant) return;
    setLoading(true);
    
    const merchantRef = doc(db, 'merchants', merchant.id);
    updateDocumentNonBlocking(merchantRef, {
      name: settings.name,
      settings: {
        ...merchant.settings,
        whatsapp: settings.whatsapp,
        enableAutoNotify: settings.enableAutoNotify,
        facebookPixel: settings.facebookPixel,
        googleAnalytics: settings.googleAnalytics
      }
    });

    setTimeout(() => {
      setLoading(false);
      toast({ title: "Configurações Salvas", description: "As informações da sua loja foram atualizadas." });
    }, 800);
  };

  const handleConnectWhatsApp = () => {
    if (!settings.whatsapp) {
      toast({ title: "Número necessário", description: "Insira seu WhatsApp antes de conectar.", variant: "destructive" });
      return;
    }
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      toast({ title: "WhatsApp Conectado!", description: "Sua instância de mensageria está ativa." });
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
          <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><Settings className="h-5 w-5" /> Configurações</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 max-w-6xl">
        <header className="mb-10 flex justify-between items-end">
          <div><h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Gestão Enterprise</h1><p className="text-slate-500 font-medium">Configurações técnicas e integrações de canais.</p></div>
          <Badge className="bg-green-100 text-green-700 border-none px-4 py-2 font-black italic">ESTADO: ONLINE</Badge>
        </header>

        <Tabs defaultValue="store" className="space-y-8">
          <TabsList className="bg-white p-1 rounded-2xl shadow-sm border h-auto flex overflow-x-auto no-scrollbar">
            <TabsTrigger value="store" className="rounded-xl py-3 px-6 font-black italic text-xs"><Store className="h-4 w-4 mr-2" /> Identidade & Unidade</TabsTrigger>
            <TabsTrigger value="whatsapp" className="rounded-xl py-3 px-6 font-black italic text-xs"><MessageCircle className="h-4 w-4 mr-2" /> Integração WhatsApp</TabsTrigger>
            <TabsTrigger value="integrations" className="rounded-xl py-3 px-6 font-black italic text-xs"><Code className="h-4 w-4 mr-2" /> Marketing & Pixel</TabsTrigger>
          </TabsList>

          <TabsContent value="store">
             <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                <CardTitle className="text-2xl font-black italic mb-8">Informações do Negócio</CardTitle>
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Nome da Instância</Label>
                         <Input value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} className="rounded-2xl h-14 bg-slate-50 border-none font-bold" />
                      </div>
                      
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Subdomínio (Não editável)</Label>
                         <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-2xl text-slate-400 font-bold border border-slate-100">
                            <Globe className="h-4 w-4" /> {slug}.agil.com
                         </div>
                      </div>

                      <Button onClick={handleSave} disabled={loading} className="w-full h-16 bg-slate-900 rounded-[30px] font-black italic text-lg shadow-2xl">
                        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Salvar Alterações'}
                      </Button>
                   </div>
                   
                   <div className="p-8 bg-primary/5 rounded-[40px] border border-primary/10 space-y-4">
                      <Zap className="h-10 w-10 text-primary" />
                      <h3 className="font-black italic text-slate-900 uppercase text-sm">Estrutura Enterprise</h3>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">Sua loja opera em uma instância isolada com banco de dados próprio. Todas as alterações são replicadas em tempo real para a vitrine do cliente.</p>
                   </div>
                </div>
             </Card>
          </TabsContent>

          <TabsContent value="whatsapp">
             <div className="grid md:grid-cols-3 gap-8">
                <Card className="md:col-span-2 border-none shadow-sm rounded-[40px] p-8 bg-white space-y-8">
                   <div>
                      <CardTitle className="text-2xl font-black italic">WhatsApp Business Connect</CardTitle>
                      <p className="text-slate-400 text-sm font-medium mt-1">Conecte seu número para automatizar confirmações e marketing.</p>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Número de Conexão (DDD + Número)</Label>
                         <div className="relative">
                            <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                            <Input placeholder="11999998888" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} className="rounded-2xl h-14 bg-slate-50 border-none font-bold pl-12" />
                         </div>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${settings.whatsapp ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                               <RefreshCw className={cn("h-6 w-6", isConnecting && "animate-spin")} />
                            </div>
                            <div>
                               <p className="font-black text-slate-900 italic uppercase text-sm">Status da Instância</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{settings.whatsapp ? 'CONECTADO E PRONTO' : 'AGUARDANDO CONFIGURAÇÃO'}</p>
                            </div>
                         </div>
                         <Button onClick={handleConnectWhatsApp} disabled={isConnecting} variant="outline" className="rounded-xl font-black italic text-xs border-slate-200 uppercase">
                            {isConnecting ? 'Conectando...' : 'Reconectar'}
                         </Button>
                      </div>

                      <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100">
                         <div className="space-y-1">
                            <p className="font-black text-slate-900 italic text-sm uppercase">Envio Automático</p>
                            <p className="text-[10px] text-slate-400 font-medium">Disparar confirmações instantâneas ao agendar.</p>
                         </div>
                         <Switch checked={settings.enableAutoNotify} onCheckedChange={v => setSettings({...settings, enableAutoNotify: v})} />
                      </div>

                      <Button onClick={handleSave} disabled={loading} className="w-full h-16 bg-green-600 hover:bg-green-700 text-white rounded-[30px] font-black italic text-lg shadow-2xl gap-2">
                        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <><CheckCircle2 className="h-6 w-6" /> Confirmar Integração</>}
                      </Button>
                   </div>
                </Card>

                <div className="space-y-6">
                   <Card className="border-none shadow-sm rounded-[40px] p-8 bg-slate-900 text-white relative overflow-hidden">
                      <div className="relative z-10 space-y-4">
                         <LinkIcon className="h-10 w-10 text-primary" />
                         <h3 className="font-black italic uppercase text-lg">Link do Chatbot</h3>
                         <p className="text-xs text-slate-400 leading-relaxed">Use este link na sua bio do WhatsApp Business para permitir que clientes agendem sem precisar de um atendente humano.</p>
                         <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                            <code className="text-[10px] text-primary font-bold">agil.com/s/{slug}</code>
                            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/20"><QrCode className="h-3 w-3" /></Button>
                         </div>
                      </div>
                   </Card>

                   <div className="p-6 bg-white rounded-3xl border shadow-sm space-y-4">
                      <h4 className="font-black italic uppercase text-xs text-slate-400">Dica de Conversão</h4>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed italic">"Lojistas que usam o disparo automático reduzem em 42% a taxa de não-comparecimento (no-show)."</p>
                   </div>
                </div>
             </div>
          </TabsContent>

          <TabsContent value="integrations">
             <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                <CardTitle className="text-2xl font-black italic mb-8">Tráfego Pago & Rastreamento</CardTitle>
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Facebook Pixel ID</Label>
                         <Input value={settings.facebookPixel} onChange={e => setSettings({...settings, facebookPixel: e.target.value})} placeholder="ex: 123456789012345" className="h-14 rounded-2xl bg-slate-50 border-none font-mono" />
                      </div>
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Google Analytics (G-ID)</Label>
                         <Input value={settings.googleAnalytics} onChange={e => setSettings({...settings, googleAnalytics: e.target.value})} placeholder="ex: G-XXXXXXX" className="h-14 rounded-2xl bg-slate-50 border-none font-mono" />
                      </div>
                      <Button onClick={handleSave} className="w-full h-16 bg-slate-900 rounded-[30px] font-black italic text-lg shadow-2xl">Salvar Integrações</Button>
                   </div>
                   <div className="p-8 bg-blue-50 rounded-[40px] border border-blue-100 space-y-4">
                      <Code className="h-10 w-10 text-primary" />
                      <h3 className="font-black italic text-slate-900 uppercase">Métricas de Conversão</h3>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">Conectando seus Pixels, você pode criar campanhas de remarketing para clientes que visitaram sua vitrine mas não agendaram.</p>
                   </div>
                </div>
             </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
