
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
  LayoutDashboard, Settings, Smartphone, Zap, Code, MessageCircle, Loader2, CheckCircle2, Link as LinkIcon, RefreshCw,
  Menu, ShoppingBag, List, Users, Calendar, Scissors, Stethoscope, Video, ClipboardList, Wallet, BarChart3, LogOut,
  Building2, Landmark, MapPin, ReceiptText, ShieldAlert, Save, Image as ImageIcon, Sparkles
} from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, where, limit, doc } from 'firebase/firestore';
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

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
  const segment = merchant?.segment || 'RETAIL';

  const [settings, setSettings] = useState({
    name: "",
    whatsapp: "",
    enableAutoNotify: true,
    facebookPixel: "",
    googleAnalytics: "",
    primaryColor: "#3b82f6",
    legal: {
      razaoSocial: "",
      cnpj: "",
      regimeTributario: "MEI"
    },
    financial: {
      pixKey: "",
      creditFee: 2.99,
      bankAccount: ""
    },
    operation: {
      chairs: 1,
      delayTolerance: 15,
      cancellationPolicy: ""
    },
    contact: {
      address: "",
      email: ""
    }
  });

  useEffect(() => {
    if (merchant) {
      setSettings({
        name: merchant.name || "",
        whatsapp: merchant.settings?.whatsapp || merchant.contact?.whatsapp || "",
        enableAutoNotify: merchant.settings?.enableAutoNotify ?? true,
        facebookPixel: merchant.settings?.facebookPixel || "",
        googleAnalytics: merchant.settings?.googleAnalytics || "",
        primaryColor: merchant.settings?.primaryColor || "#3b82f6",
        legal: {
          razaoSocial: merchant.legal?.razaoSocial || "",
          cnpj: merchant.legal?.cnpj || "",
          regimeTributario: merchant.legal?.regimeTributario || "MEI"
        },
        financial: {
          pixKey: merchant.financial?.pixKey || "",
          creditFee: merchant.financial?.creditFee || 2.99,
          bankAccount: merchant.financial?.bankAccount || ""
        },
        operation: {
          chairs: merchant.operation?.chairs || 1,
          delayTolerance: merchant.operation?.delayTolerance || 15,
          cancellationPolicy: merchant.operation?.cancellationPolicy || ""
        },
        contact: {
          address: merchant.contact?.address || "",
          email: merchant.contact?.email || ""
        }
      });
    }
  }, [merchant]);

  const handleSave = () => {
    if (!merchant) return;
    setLoading(true);
    
    const merchantRef = doc(db, 'merchants', merchant.id);
    
    updateDocumentNonBlocking(merchantRef, {
      name: settings.name,
      legal: settings.legal,
      financial: settings.financial,
      operation: settings.operation,
      contact: {
        ...settings.contact,
        whatsapp: settings.whatsapp
      },
      settings: {
        ...(merchant.settings || {}),
        whatsapp: settings.whatsapp,
        enableAutoNotify: settings.enableAutoNotify,
        facebookPixel: settings.facebookPixel,
        googleAnalytics: settings.googleAnalytics,
        primaryColor: settings.primaryColor
      }
    });

    setTimeout(() => {
      setLoading(false);
      toast({ title: "Configurações Salvas", description: "As informações da sua instância foram atualizadas." });
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

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={mobile ? "space-y-2" : "flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar"}>
      <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
        <LayoutDashboard className="h-5 w-5" /> Dashboard
      </Link>
      
      {segment === 'BEAUTY' && (
        <>
          <Link href={`/merchant/${slug}/appointments`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><Calendar className="h-5 w-5" /> Agenda Digital</Link>
          <Link href={`/merchant/${slug}/staff`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><Users className="h-5 w-5" /> Equipe de Estilo</Link>
          <Link href={`/merchant/${slug}/services`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><Scissors className="h-5 w-5" /> Procedimentos</Link>
        </>
      )}

      <Link href={`/merchant/${slug}/finance`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Wallet className="h-5 w-5" /> Financeiro</Link>
      <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><Settings className="h-5 w-5" /> Configurações</Link>
    </div>
  );

  if (loadingMerchant) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg shadow-sm">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight italic uppercase">MERCADO ÁGIL</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-hidden">
          <NavLinks />
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2" asChild><Link href="/login"><LogOut className="h-4 w-4" /> Sair</Link></Button>
        </div>
      </aside>

      <main className="flex-1 p-4 lg:p-8 max-w-6xl">
        <header className="mb-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden rounded-xl border-slate-200">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 border-none bg-white">
                <SheetHeader className="p-6 border-b text-left">
                  <SheetTitle className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">
                    MERCADO ÁGIL
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4 h-full flex flex-col">
                  <NavLinks mobile />
                  <div className="mt-auto pt-4 border-t">
                    <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2" asChild><Link href="/login"><LogOut className="h-4 w-4" /> Sair</Link></Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Gestão da Instância</h1>
              <p className="text-slate-500 font-medium text-xs lg:text-base">Conformidade, operação e branding extraordinário.</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-700 border-none px-4 py-2 font-black italic hidden sm:flex">UNIDADE: {merchant?.status?.toUpperCase()}</Badge>
        </header>

        <Tabs defaultValue="legal" className="space-y-8">
          <TabsList className="bg-white p-1 rounded-2xl shadow-sm border h-auto flex overflow-x-auto no-scrollbar">
            <TabsTrigger value="legal" className="rounded-xl py-3 px-6 font-black italic text-xs whitespace-nowrap"><Building2 className="h-4 w-4 mr-2" /> Dados Legais</TabsTrigger>
            <TabsTrigger value="branding" className="rounded-xl py-3 px-6 font-black italic text-xs whitespace-nowrap"><Palette className="h-4 w-4 mr-2" /> Branding Vitrine</TabsTrigger>
            <TabsTrigger value="whatsapp" className="rounded-xl py-3 px-6 font-black italic text-xs whitespace-nowrap"><MessageCircle className="h-4 w-4 mr-2" /> WhatsApp</TabsTrigger>
            <TabsTrigger value="integrations" className="rounded-xl py-3 px-6 font-black italic text-xs whitespace-nowrap"><Code className="h-4 w-4 mr-2" /> Marketing & SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="legal">
             <div className="grid md:grid-cols-12 gap-8">
                <Card className="md:col-span-8 border-none shadow-sm rounded-[40px] p-8 bg-white space-y-8">
                   <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b pb-4">
                         <ReceiptText className="h-5 w-5 text-primary" />
                         <h3 className="font-black italic uppercase text-lg">Informações Cadastrais</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Razão Social</Label>
                            <Input value={settings.legal.razaoSocial} onChange={e => setSettings({...settings, legal: {...settings.legal, razaoSocial: e.target.value}})} className="rounded-2xl h-12 bg-slate-50 border-none font-bold" />
                         </div>
                         <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 px-1">CNPJ</Label>
                            <Input value={settings.legal.cnpj} onChange={e => setSettings({...settings, legal: {...settings.legal, cnpj: e.target.value}})} className="rounded-2xl h-12 bg-slate-50 border-none font-bold" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Endereço Completo</Label>
                         <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input value={settings.contact.address} onChange={e => setSettings({...settings, contact: {...settings.contact, address: e.target.value}})} className="rounded-2xl h-12 bg-slate-50 border-none font-bold pl-12" />
                         </div>
                      </div>

                      <div className="flex items-center gap-3 border-b pb-4 pt-4">
                         <Zap className="h-5 w-5 text-primary" />
                         <h3 className="font-black italic uppercase text-lg">Parâmetros de Operação</h3>
                      </div>
                      <div className="grid md:grid-cols-3 gap-6">
                         <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Cadeiras/Boxes</Label>
                            <Input type="number" value={settings.operation.chairs} onChange={e => setSettings({...settings, operation: {...settings.operation, chairs: Number(e.target.value)}})} className="rounded-2xl h-12 bg-slate-50 border-none font-bold" />
                         </div>
                         <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Tolerância (min)</Label>
                            <Input type="number" value={settings.operation.delayTolerance} onChange={e => setSettings({...settings, operation: {...settings.operation, delayTolerance: Number(e.target.value)}})} className="rounded-2xl h-12 bg-slate-50 border-none font-bold" />
                         </div>
                         <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Taxa Crédito (%)</Label>
                            <Input type="number" step="0.01" value={settings.financial.creditFee} onChange={e => setSettings({...settings, financial: {...settings.financial, creditFee: Number(e.target.value)}})} className="rounded-2xl h-12 bg-slate-50 border-none font-bold" />
                         </div>
                      </div>

                      <Button onClick={handleSave} disabled={loading} className="w-full h-16 bg-slate-900 rounded-[30px] font-black italic text-lg shadow-2xl text-white gap-2">
                        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Save className="h-5 w-5" /> Salvar Alterações Corporativas</>}
                      </Button>
                   </div>
                </Card>

                <div className="md:col-span-4 space-y-6">
                   <Card className="border-none shadow-sm rounded-[40px] p-8 bg-slate-900 text-white relative overflow-hidden">
                      <div className="relative z-10 space-y-4">
                         <ShieldAlert className="h-10 w-10 text-primary" />
                         <h3 className="font-black italic uppercase text-lg leading-tight">Auditoria SaaS</h3>
                         <p className="text-xs text-slate-400 leading-relaxed font-medium">Sua instância foi auditada e aprovada pelo Master Admin em conformidade com o CNPJ informado.</p>
                         <div className="pt-4">
                            <Badge className="bg-primary/20 text-primary border-none font-black italic">TRUSTED TENANT</Badge>
                         </div>
                      </div>
                   </Card>
                </div>
             </div>
          </TabsContent>

          <TabsContent value="branding">
             <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white space-y-8">
                <div>
                   <CardTitle className="text-2xl font-black italic">Identidade Visual da Vitrine</CardTitle>
                   <p className="text-slate-400 text-sm font-medium mt-1">Personalize como os clientes enxergam sua marca online.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <div className="space-y-4">
                         <Label className="text-[10px] font-black uppercase text-slate-400">Logotipo da Unidade</Label>
                         <div className="h-32 w-32 rounded-[30px] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-primary transition-colors">
                            <ImageIcon className="h-8 w-8 mb-2" />
                            <span className="text-[8px] font-black uppercase">Alterar Logo</span>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <Label className="text-[10px] font-black uppercase text-slate-400">Cor Principal (Brand Color)</Label>
                         <div className="flex items-center gap-4">
                            <input 
                              type="color" 
                              value={settings.primaryColor}
                              onChange={e => setSettings({...settings, primaryColor: e.target.value})}
                              className="h-14 w-14 rounded-xl border-none p-0 cursor-pointer"
                            />
                            <Input value={settings.primaryColor} onChange={e => setSettings({...settings, primaryColor: e.target.value})} className="rounded-xl h-12 bg-slate-50 border-none font-mono" />
                         </div>
                      </div>

                      <Button onClick={handleSave} disabled={loading} className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-[30px] font-black italic shadow-xl">
                         ATUALIZAR MARCA
                      </Button>
                   </div>

                   <div className="bg-slate-900 rounded-[45px] p-8 text-white space-y-6">
                      <h4 className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                         <Sparkles className="h-3 w-3" /> Preview do Branding
                      </h4>
                      <div className="space-y-4">
                         <div className="h-10 w-40 rounded-lg" style={{ backgroundColor: settings.primaryColor }}></div>
                         <div className="space-y-2">
                            <div className="h-4 w-full bg-white/10 rounded-full"></div>
                            <div className="h-4 w-[80%] bg-white/10 rounded-full"></div>
                         </div>
                         <Button className="w-full rounded-2xl h-12 font-black italic" style={{ backgroundColor: settings.primaryColor }}>
                            BOTÃO CUSTOMIZADO
                         </Button>
                      </div>
                      <p className="text-[8px] text-slate-500 font-bold uppercase leading-relaxed text-center">As cores serão aplicadas no link público da sua loja.</p>
                   </div>
                </div>
             </Card>
          </TabsContent>

          <TabsContent value="whatsapp">
             <div className="grid md:grid-cols-3 gap-8">
                <Card className="md:col-span-2 border-none shadow-sm rounded-[40px] p-8 bg-white space-y-8">
                   <div>
                      <CardTitle className="text-2xl font-black italic">WhatsApp Business Connect</CardTitle>
                      <p className="text-slate-400 text-sm font-medium mt-1">Conecte seu número para automatizar confirmações e retornos.</p>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Número de Conexão (DDD + Número)</Label>
                         <div className="relative">
                            <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                            <Input placeholder="11999998888" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} className="rounded-2xl h-14 bg-slate-50 border-none font-bold pl-12" />
                         </div>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                         <div className="flex items-center gap-4 w-full">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${settings.whatsapp ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                               <RefreshCw className={cn("h-6 w-6", isConnecting && "animate-spin")} />
                            </div>
                            <div>
                               <p className="font-black text-slate-900 italic uppercase text-sm">Status da Conexão</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{settings.whatsapp ? 'INSTÂNCIA ATIVA' : 'AGUARDANDO QR CODE'}</p>
                            </div>
                         </div>
                         <Button onClick={handleConnectWhatsApp} disabled={isConnecting} variant="outline" className="rounded-xl font-black italic text-xs border-slate-200 uppercase w-full sm:w-auto shadow-sm">
                            {isConnecting ? 'Autenticando...' : 'Atualizar Link'}
                         </Button>
                      </div>

                      <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                         <div className="space-y-1">
                            <p className="font-black text-slate-900 italic text-sm uppercase">Envio de Lembretes IA</p>
                            <p className="text-[10px] text-slate-400 font-medium">Disparar lembretes 1h antes do agendamento.</p>
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
                         <h3 className="font-black italic uppercase text-lg">Seu Link de Chatbot</h3>
                         <p className="text-xs text-slate-400 leading-relaxed italic">Clientes podem agendar conversando diretamente com a nossa IA no WhatsApp.</p>
                         <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex items-center justify-between gap-2 overflow-hidden">
                            <code className="text-[10px] text-primary font-bold truncate">agil.com/wa/{slug}</code>
                            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 hover:bg-white/20 text-white"><QrCode className="h-3 w-3" /></Button>
                         </div>
                      </div>
                   </Card>
                </div>
             </div>
          </TabsContent>

          <TabsContent value="integrations">
             <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                <CardTitle className="text-2xl font-black italic mb-8">Tráfego & Rastreamento (SEO)</CardTitle>
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
                      <Button onClick={handleSave} disabled={loading} className="w-full h-16 bg-slate-900 rounded-[30px] font-black italic text-lg shadow-2xl text-white">
                        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Salvar Configurações de Growth'}
                      </Button>
                   </div>
                   <div className="p-8 bg-blue-50 rounded-[40px] border border-blue-100 space-y-4">
                      <Code className="h-10 w-10 text-primary" />
                      <h3 className="font-black italic text-slate-900 uppercase">Métricas de Growth</h3>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed italic">Conectando seus Pixels, você pode criar campanhas de remarketing para clientes que visitaram sua vitrine, aumentando sua taxa de retorno.</p>
                   </div>
                </div>
             </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
