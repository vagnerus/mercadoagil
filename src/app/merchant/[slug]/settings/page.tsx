
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
  Building2, Landmark, MapPin, ReceiptText, ShieldAlert, Save, Image as ImageIcon, Sparkles, Clock, AlertCircle
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
    },
    notifications: {
      reminders: true,
      newsletters: false,
      whatsappAlerts: true
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
        },
        notifications: {
          reminders: merchant.settings?.notifications?.reminders ?? true,
          newsletters: merchant.settings?.notifications?.newsletters ?? false,
          whatsappAlerts: merchant.settings?.notifications?.whatsappAlerts ?? true
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
        primaryColor: settings.primaryColor,
        notifications: settings.notifications
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
                </div>
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Gestão da Instância</h1>
              <p className="text-slate-500 font-medium text-xs lg:text-base">Conformidade, automação e branding.</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-700 border-none px-4 py-2 font-black italic">UNIDADE: {merchant?.status?.toUpperCase()}</Badge>
        </header>

        <Tabs defaultValue="legal" className="space-y-8">
          <TabsList className="bg-white p-1 rounded-2xl shadow-sm border h-auto flex overflow-x-auto no-scrollbar">
            <TabsTrigger value="legal" className="rounded-xl py-3 px-6 font-black italic text-xs whitespace-nowrap"><Building2 className="h-4 w-4 mr-2" /> Dados Legais</TabsTrigger>
            <TabsTrigger value="operation" className="rounded-xl py-3 px-6 font-black italic text-xs whitespace-nowrap"><Clock className="h-4 w-4 mr-2" /> Regras de Operação</TabsTrigger>
            <TabsTrigger value="branding" className="rounded-xl py-3 px-6 font-black italic text-xs whitespace-nowrap"><Palette className="h-4 w-4 mr-2" /> Branding</TabsTrigger>
            <TabsTrigger value="automation" className="rounded-xl py-3 px-6 font-black italic text-xs whitespace-nowrap"><Zap className="h-4 w-4 mr-2" /> Automacão & Whats</TabsTrigger>
          </TabsList>

          <TabsContent value="legal">
             <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white space-y-8">
                <div className="flex items-center gap-3 border-b pb-4">
                   <ReceiptText className="h-5 w-5 text-primary" />
                   <h3 className="font-black italic uppercase text-lg">Conformidade Fiscal</h3>
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
                   <Input value={settings.contact.address} onChange={e => setSettings({...settings, contact: {...settings.contact, address: e.target.value}})} className="rounded-2xl h-12 bg-slate-50 border-none font-bold" />
                </div>
                <Button onClick={handleSave} className="w-full h-16 bg-slate-900 text-white rounded-[30px] font-black italic"><Save className="mr-2 h-5 w-5" /> Salvar Dados Fiscais</Button>
             </Card>
          </TabsContent>

          <TabsContent value="operation">
             <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white space-y-8">
                <div className="flex items-center gap-3 border-b pb-4">
                   <Zap className="h-5 w-5 text-primary" />
                   <h3 className="font-black italic uppercase text-lg">Configurações de Fluxo</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Capacidade (Cadeiras)</Label>
                      <Input type="number" value={settings.operation.chairs} onChange={e => setSettings({...settings, operation: {...settings.operation, chairs: Number(e.target.value)}})} className="rounded-2xl h-12 bg-slate-50 border-none font-bold" />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Tolerância Atraso (min)</Label>
                      <Input type="number" value={settings.operation.delayTolerance} onChange={e => setSettings({...settings, operation: {...settings.operation, delayTolerance: Number(e.target.value)}})} className="rounded-2xl h-12 bg-slate-50 border-none font-bold" />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Taxa de Maquininha (%)</Label>
                      <Input type="number" step="0.01" value={settings.financial.creditFee} onChange={e => setSettings({...settings, financial: {...settings.financial, creditFee: Number(e.target.value)}})} className="rounded-2xl h-12 bg-slate-50 border-none font-bold" />
                   </div>
                </div>
                <Button onClick={handleSave} className="w-full h-16 bg-slate-900 text-white rounded-[30px] font-black italic">Sincronizar Operação</Button>
             </Card>
          </TabsContent>

          <TabsContent value="branding">
             <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white space-y-8">
                <div>
                   <CardTitle className="text-2xl font-black italic">Identidade Visual</CardTitle>
                   <p className="text-slate-400 text-sm font-medium mt-1">Sua marca, suas cores.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <div className="space-y-4">
                         <Label className="text-[10px] font-black uppercase text-slate-400">Cor Principal (Brand Color)</Label>
                         <div className="flex items-center gap-4">
                            <input type="color" value={settings.primaryColor} onChange={e => setSettings({...settings, primaryColor: e.target.value})} className="h-14 w-14 rounded-xl cursor-pointer" />
                            <Input value={settings.primaryColor} className="rounded-xl h-12 bg-slate-50 border-none font-mono" />
                         </div>
                      </div>
                      <Button onClick={handleSave} className="w-full h-16 bg-primary text-white rounded-[30px] font-black italic shadow-xl" style={{ backgroundColor: settings.primaryColor }}>Aplicar Branding</Button>
                   </div>
                   <div className="bg-slate-900 rounded-[45px] p-8 text-white space-y-4 border border-white/5">
                      <h4 className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2"><Sparkles className="h-3 w-3" /> Preview</h4>
                      <Button className="w-full rounded-2xl h-12 font-black italic" style={{ backgroundColor: settings.primaryColor }}>RESERVAR AGORA</Button>
                      <p className="text-[8px] text-slate-500 font-bold uppercase text-center">Este botão aparecerá na sua vitrine pública.</p>
                   </div>
                </div>
             </Card>
          </TabsContent>

          <TabsContent value="automation">
             <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white space-y-8">
                <div className="flex items-center justify-between border-b pb-4">
                   <h3 className="font-black italic uppercase text-lg">Mensageria & Lembretes IA</h3>
                   <Badge className="bg-green-100 text-green-700 font-black italic">SERVER STABLE</Badge>
                </div>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Número WhatsApp Business</Label>
                      <Input placeholder="11999998888" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} className="rounded-2xl h-14 bg-slate-50 border-none font-bold text-green-600" />
                   </div>
                   <div className="grid gap-4">
                      <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                         <div className="space-y-1">
                            <p className="font-black text-slate-900 italic uppercase text-sm">Lembretes Automáticos</p>
                            <p className="text-[10px] text-slate-400 font-medium italic">Disparar 1h antes do agendamento via WhatsApp.</p>
                         </div>
                         <Switch checked={settings.notifications.reminders} onCheckedChange={v => setSettings({...settings, notifications: {...settings.notifications, reminders: v}})} />
                      </div>
                      <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                         <div className="space-y-1">
                            <p className="font-black text-slate-900 italic uppercase text-sm">Mensagem de Retorno (Pós-Venda)</p>
                            <p className="text-[10px] text-slate-400 font-medium italic">Disparar 15 dias após o último serviço.</p>
                         </div>
                         <Switch checked={settings.notifications.whatsappAlerts} onCheckedChange={v => setSettings({...settings, notifications: {...settings.notifications, whatsappAlerts: v}})} />
                      </div>
                   </div>
                   <Button onClick={handleSave} className="w-full h-16 bg-green-600 hover:bg-green-700 text-white rounded-[30px] font-black italic shadow-xl"><MessageCircle className="mr-2 h-5 w-5" /> Ativar Fluxo de Mensageria</Button>
                </div>
             </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
