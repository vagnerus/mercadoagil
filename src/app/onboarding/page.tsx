
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Store, Loader2, Sparkles, Scissors, ShoppingBag, 
  Utensils, Zap, Dog, GraduationCap, Stethoscope, 
  ShieldCheck, CheckCircle2, Building2, MapPin, Settings2, Wallet,
  Dumbbell, PartyPopper, Gavel, Car
} from "lucide-react";
import { useUser, useFirestore, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";
import { MerchantSegment, SYSTEM_PLANS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const SEGMENTS: { value: MerchantSegment; label: string; icon: any }[] = [
  { value: 'BEAUTY', label: 'Barbearia / Estética', icon: Scissors },
  { value: 'RESTAURANT', label: 'Restaurante / Food', icon: Utensils },
  { value: 'RETAIL', label: 'Loja / Varejo', icon: ShoppingBag },
  { value: 'HEALTH', label: 'Saúde / Clínicas', icon: Stethoscope },
  { value: 'AUTO', label: 'Automotivo / Oficina', icon: Car },
  { value: 'PET', label: 'Pets / Veterinária', icon: Dog },
  { value: 'EDUCATION', label: 'Educação / Aulas', icon: GraduationCap },
  { value: 'FITNESS', label: 'Academias & Studios', icon: Dumbbell },
  { value: 'EVENTS', label: 'Eventos & Produtoras', icon: PartyPopper },
  { value: 'PROFESSIONAL', label: 'Consultoria & Jurídico', icon: Gavel },
];

export default function OnboardingPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    segment: "BEAUTY" as MerchantSegment,
    planId: "p_1prof",
    razaoSocial: "",
    cnpj: "",
    regimeTributario: "MEI",
    address: "",
    whatsapp: "",
    emailContatos: "",
    chairs: 1,
    delayTolerance: 15,
    pixKey: "",
    creditFee: 2.99
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  const handleNextStep = () => setStep(prev => prev + 1);
  const handlePrevStep = () => setStep(prev => prev - 1);

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const merchantId = `m_${Math.random().toString(36).substring(7)}`;
      const merchantSlug = formData.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const selectedPlan = SYSTEM_PLANS.find(p => p.id === formData.planId);
      
      const merchantData = {
        id: merchantId,
        name: formData.name,
        slug: merchantSlug,
        segment: formData.segment,
        email: user.email,
        status: 'pending_approval',
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp(),
        planId: formData.planId,
        planName: selectedPlan?.name || 'Pro',
        mrr: selectedPlan?.price || 0,
        platformUserId: user.uid,
        legal: {
          razaoSocial: formData.razaoSocial || formData.name,
          cnpj: formData.cnpj,
          regimeTributario: formData.regimeTributario
        },
        contact: {
          address: formData.address,
          whatsapp: formData.whatsapp,
          email: formData.emailContatos || user.email
        },
        operation: {
          workingHours: "09:00 - 19:00",
          chairs: Number(formData.chairs),
          delayTolerance: Number(formData.delayTolerance),
          cancellationPolicy: "2 horas de antecedência"
        },
        financial: {
          pixKey: formData.pixKey,
          creditFee: Number(formData.creditFee),
          debitFee: 1.99
        },
        settings: {
          enableWallet: true,
          enableCashback: true,
          cashbackPercentage: 5,
          appointmentInterval: 30,
          primaryColor: "#3b82f6"
        },
        logoUrl: `https://picsum.photos/seed/${formData.segment}/200/200`,
        bannerUrl: `https://picsum.photos/seed/${merchantSlug}/1200/400`
      };

      await setDocumentNonBlocking(doc(db, 'merchants', merchantId), merchantData, { merge: true });

      await setDocumentNonBlocking(doc(db, 'platformUsers', user.uid), {
        id: user.uid,
        email: user.email,
        firstName: formData.name.split(' ')[0],
        lastName: "",
        role: 'MERCHANT_ADMIN',
        merchantId: merchantId,
        merchantSlug: merchantSlug,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      addDocumentNonBlocking(collection(db, 'supportTickets'), {
        merchantId: merchantId,
        merchantName: formData.name,
        userEmail: user.email,
        subject: "[AUDITORIA] Nova Instância Criada",
        reason: `Nova loja ${formData.name} (CNPJ: ${formData.cnpj}) aguardando aprovação master.`,
        urgency: "high",
        status: "open",
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp()
      });

      toast({ title: "Configuração Concluída!", description: "Sua conta foi enviada para auditoria do Master Admin." });
      router.replace(`/merchant/${merchantSlug}/dashboard`);
    } catch (err) {
      setLoading(false);
      toast({ title: "Erro", description: "Não foi possível processar seu cadastro.", variant: "destructive" });
    }
  };

  if (isUserLoading) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 py-20 font-body">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-primary rounded-2xl text-white shadow-xl mb-4 animate-pulse">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">Configuração Enterprise</h1>
          <p className="text-slate-500 font-medium italic">Passo {step} de 5 • Dados de Compliance</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[45px] overflow-hidden bg-white dark:bg-slate-900">
          <CardContent className="p-10">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-3 mb-6">
                   <Store className="h-6 w-6 text-primary" />
                   <h3 className="text-xl font-black italic uppercase dark:text-white">Identidade do Negócio</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Nome da Unidade</Label>
                    <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Segmento</Label>
                    <Select value={formData.segment} onValueChange={v => setFormData({...formData, segment: v as MerchantSegment})}>
                      <SelectTrigger className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-xl">
                        {SEGMENTS.map(s => (
                          <SelectItem key={s.value} value={s.value} className="font-bold py-3">
                            <div className="flex items-center gap-2"><s.icon className="h-4 w-4" /> {s.label}</div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">Subdomínio (.agil.com)</Label>
                  <Input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-primary" />
                </div>
                <Button onClick={handleNextStep} className="w-full h-16 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[30px] font-black italic shadow-xl">CONTINUAR</Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-3 mb-6">
                   <Building2 className="h-6 w-6 text-primary" />
                   <h3 className="text-xl font-black italic uppercase dark:text-white">Dados Legais & CNPJ</h3>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">CNPJ (Obrigatório)</Label>
                  <Input required placeholder="00.000.000/0000-00" value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">Razão Social</Label>
                  <Input placeholder="Empresa LTDA" value={formData.razaoSocial} onChange={e => setFormData({...formData, razaoSocial: e.target.value})} className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" />
                </div>
                <div className="flex gap-4">
                  <Button variant="ghost" onClick={handlePrevStep} className="h-16 flex-1 rounded-[30px] font-black">VOLTAR</Button>
                  <Button onClick={handleNextStep} className="h-16 flex-[2] bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[30px] font-black italic">PRÓXIMO</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-3 mb-6">
                   <MapPin className="h-6 w-6 text-primary" />
                   <h3 className="text-xl font-black italic uppercase dark:text-white">Localização & Contato</h3>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">Endereço Completo</Label>
                  <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">WhatsApp Oficial</Label>
                    <Input value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">E-mail Administrativo</Label>
                    <Input value={formData.emailContatos} onChange={e => setFormData({...formData, emailContatos: e.target.value})} className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="ghost" onClick={handlePrevStep} className="h-16 flex-1 rounded-[30px] font-black">VOLTAR</Button>
                  <Button onClick={handleNextStep} className="h-16 flex-[2] bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[30px] font-black italic">PRÓXIMO</Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-3 mb-6">
                   <Settings2 className="h-6 w-6 text-primary" />
                   <h3 className="text-xl font-black italic uppercase dark:text-white">Operação & Finanças</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Qtd. Cadeiras/Unidades</Label>
                    <Input type="number" value={formData.chairs} onChange={e => setFormData({...formData, chairs: Number(e.target.value)})} className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Taxa Máquina Crédito (%)</Label>
                    <Input type="number" step="0.01" value={formData.creditFee} onChange={e => setFormData({...formData, creditFee: Number(e.target.value)})} className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">Chave PIX Oficial</Label>
                  <Input placeholder="CNPJ ou E-mail" value={formData.pixKey} onChange={e => setFormData({...formData, pixKey: e.target.value})} className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-green-600" />
                </div>
                <div className="flex gap-4">
                  <Button variant="ghost" onClick={handlePrevStep} className="h-16 flex-1 rounded-[30px] font-black">VOLTAR</Button>
                  <Button onClick={handleNextStep} className="h-16 flex-[2] bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[30px] font-black italic">ESCOLHER PLANO</Button>
                </div>
              </div>
            )}

            {step === 5 && (
              <form onSubmit={handleCreateBusiness} className="space-y-8 animate-in fade-in">
                <div className="flex items-center gap-3 mb-6">
                   <Wallet className="h-6 w-6 text-primary" />
                   <h3 className="text-xl font-black italic uppercase dark:text-white">Licenciamento Mensal</h3>
                </div>
                <div className="grid gap-4">
                   {SYSTEM_PLANS.map(plan => (
                     <div 
                      key={plan.id}
                      onClick={() => setFormData({...formData, planId: plan.id})}
                      className={cn(
                        "p-6 rounded-[30px] border-4 cursor-pointer transition-all flex items-center justify-between group",
                        formData.planId === plan.id ? "border-primary bg-primary/5 shadow-lg" : "border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:border-slate-200"
                      )}
                     >
                        <div className="flex items-center gap-4">
                           <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", formData.planId === plan.id ? "bg-primary text-white" : "bg-white dark:bg-slate-700 text-slate-400")}>
                              {plan.price === 0 ? <ShieldCheck className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
                           </div>
                           <div>
                              <p className="font-black italic uppercase text-sm dark:text-white">{plan.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">Até {plan.maxStaff} Usuários</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="font-black italic text-xl text-primary">R$ {plan.price.toFixed(2)}</p>
                           <p className="text-[8px] font-black uppercase text-slate-400">Por Mês</p>
                        </div>
                     </div>
                   ))}
                </div>
                <div className="flex gap-4">
                   <Button variant="ghost" onClick={handlePrevStep} className="h-20 flex-1 rounded-[30px] font-black uppercase">VOLTAR</Button>
                   <Button type="submit" disabled={loading} className="h-20 flex-[2] bg-primary hover:bg-primary/90 text-white rounded-[35px] text-xl font-black italic shadow-2xl gap-3">
                      {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : <>FINALIZAR E ATIVAR <CheckCircle2 className="h-6 w-6" /></>}
                   </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
