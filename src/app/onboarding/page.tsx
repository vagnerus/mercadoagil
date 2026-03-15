
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store, Loader2, Sparkles, Scissors, ShoppingBag, Briefcase, Utensils, Zap, Dog, GraduationCap, HeartHandshake, Stethoscope, Wrench } from "lucide-react";
import { useUser, useFirestore, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";
import { MerchantSegment } from "@/lib/mock-data";

const SEGMENTS: { value: MerchantSegment; label: string; icon: any }[] = [
  { value: 'BEAUTY', label: 'Barbearia / Estética', icon: Scissors },
  { value: 'RESTAURANT', label: 'Restaurante / Food', icon: Utensils },
  { value: 'RETAIL', label: 'Loja / Varejo', icon: ShoppingBag },
  { value: 'HEALTH', label: 'Saúde / Clínicas', icon: Stethoscope },
  { value: 'MAINTENANCE', label: 'Manutenção / T.I.', icon: Wrench },
  { value: 'AUTO', label: 'Automotivo / Oficina', icon: Zap },
  { value: 'PET', label: 'Pets / Veterinária', icon: Dog },
  { value: 'EDUCATION', label: 'Educação / Aulas', icon: GraduationCap },
  { value: 'SERVICE', label: 'Consultoria / Outros', icon: HeartHandshake },
];

export default function OnboardingPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    segment: "BEAUTY" as MerchantSegment,
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const merchantId = `m_${Math.random().toString(36).substring(7)}`;
      const merchantSlug = formData.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      // 1. Criar a Loja (Merchant)
      const merchantData = {
        id: merchantId,
        name: formData.name,
        slug: merchantSlug,
        segment: formData.segment,
        email: user.email,
        status: 'active',
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp(),
        planName: 'Pro',
        mrr: 0,
        platformUserId: user.uid,
        logoUrl: `https://picsum.photos/seed/${formData.segment}/200/200`,
        bannerUrl: `https://picsum.photos/seed/${merchantSlug}/1200/400`,
        settings: {
          enableWallet: true,
          enableCashback: true,
          cashbackPercentage: 5,
          appointmentInterval: formData.segment === 'BEAUTY' || formData.segment === 'HEALTH' ? 30 : 0
        }
      };

      await setDocumentNonBlocking(doc(db, 'merchants', merchantId), merchantData, { merge: true });

      // 2. Criar/Atualizar o Perfil do Usuário
      const profileId = user.uid;
      const profileData = {
        id: profileId,
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || formData.name.split(' ')[0],
        lastName: user.displayName?.split(' ').slice(1).join(' ') || "",
        role: 'MERCHANT_ADMIN',
        merchantId: merchantId,
        merchantSlug: merchantSlug,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDocumentNonBlocking(doc(db, 'platformUsers', profileId), profileData, { merge: true });

      toast({ title: "Negócio Ativado!", description: "Bem-vindo ao seu novo painel." });
      router.replace(`/merchant/${merchantSlug}/dashboard`);
    } catch (err) {
      setLoading(false);
      toast({ title: "Erro na Configuração", description: "Não foi possível criar sua loja agora.", variant: "destructive" });
    }
  };

  if (isUserLoading) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-body">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-primary rounded-2xl text-white shadow-xl shadow-primary/20 mb-4 animate-bounce">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase">Configure seu Negócio</h1>
          <p className="text-slate-500 font-medium italic">Personalize sua instância do Mercado Ágil.</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[45px] overflow-hidden bg-white">
          <CardContent className="p-10 space-y-8">
            <form onSubmit={handleCreateBusiness} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Nome da sua Loja/Salão</Label>
                <Input 
                  required 
                  placeholder="Ex: Barbearia Elite" 
                  className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-lg"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Segmento Principal</Label>
                <Select value={formData.segment} onValueChange={v => setFormData({...formData, segment: v as MerchantSegment})}>
                  <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    {SEGMENTS.map(s => (
                      <SelectItem key={s.value} value={s.value} className="font-bold py-3">
                        <div className="flex items-center gap-3"><s.icon className="h-5 w-5 text-primary" /> {s.label}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Subdomínio Desejado</Label>
                <div className="relative">
                  <Input 
                    required 
                    placeholder="minha-loja" 
                    className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-lg pr-32"
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-black italic text-xs uppercase">.agil.com</div>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-20 bg-slate-900 hover:bg-slate-800 rounded-[35px] text-xl font-black italic shadow-2xl gap-3">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <>ATIVAR MEU PAINEL <Sparkles className="h-6 w-6 text-primary" /></>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
