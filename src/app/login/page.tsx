
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Store, ShieldCheck, ArrowRight, Loader2, Star, AlertCircle } from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser, initiateEmailSignIn, initiateEmailSignUp, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();

  const userProfileQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'platformUsers'), where('email', '==', user.email), limit(1));
  }, [db, user]);

  const { data: userProfiles, isLoading: loadingProfile } = useCollection(userProfileQuery);

  useEffect(() => {
    if (user && userProfiles && userProfiles.length > 0) {
      const profile = userProfiles[0];
      if (profile.role === 'SUPER_ADMIN' || user.email === 'vagneroliveira.us@gmail.com') {
        router.replace('/admin/dashboard');
      } else if (profile.role === 'MERCHANT_ADMIN' || profile.role === 'MERCHANT_STAFF') {
        const slug = profile.merchantSlug || 'demo';
        router.replace(`/merchant/${slug}/dashboard`);
      }
    } else if (user && userProfiles && userProfiles.length === 0 && !loadingProfile) {
      if (user.email === 'vagneroliveira.us@gmail.com') {
        router.replace('/admin/dashboard');
      }
    }
  }, [user, userProfiles, loadingProfile, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegistering) {
        await initiateEmailSignUp(auth, email, password);
        toast({ title: "Conta Criada!", description: "Agora você pode acessar o painel." });
      } else {
        await initiateEmailSignIn(auth, email, password);
      }
    } catch (err: any) {
      setLoading(false);
      toast({
        title: "Erro na Autenticação",
        description: "Verifique suas credenciais.",
        variant: "destructive"
      });
    }
  };

  const handleVagnerLogin = async () => {
    setLoading(true);
    try {
      await initiateEmailSignIn(auth, 'vagneroliveira.us@gmail.com', 'Vag@15215845');
    } catch (err) {
      setLoading(false);
      toast({ title: "Erro Master", description: "Falha ao acessar Painel Master.", variant: "destructive" });
    }
  };

  if (isUserLoading || (user && loadingProfile)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-black italic text-slate-400 uppercase tracking-widest animate-pulse">Sincronizando Mercado Ágil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-body">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="bg-primary p-2 rounded-xl text-white">
              <Store className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">MERCADO ÁGIL</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">{isRegistering ? 'Criar Nova Conta' : 'Portal de Acesso'}</h1>
          <p className="text-slate-500 font-medium italic opacity-70">Plataforma Enterprise v3.2</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="p-10 pb-4 text-center">
            <CardTitle className="text-xl font-black italic">{isRegistering ? 'Cadastre seu Negócio' : 'Acesse seu Painel'}</CardTitle>
            <CardDescription className="font-medium text-slate-400">Gerencie sua operação em tempo real.</CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-4 space-y-8">
            
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">E-mail Corporativo</Label>
                <Input 
                  type="email" 
                  className="h-14 rounded-2xl bg-slate-50 border-none font-bold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Senha</Label>
                <Input 
                  type="password" 
                  className="h-14 rounded-2xl bg-slate-50 border-none font-bold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-16 bg-primary hover:bg-primary/90 rounded-[28px] text-lg font-black italic shadow-xl gap-3">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>{isRegistering ? 'Criar Conta' : 'Entrar no Painel'} <ArrowRight className="h-5 w-5" /></>}
              </Button>
            </form>

            <div className="text-center">
              <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-[10px] font-black uppercase text-slate-400 hover:text-primary transition-colors"
              >
                {isRegistering ? 'Já tenho conta? Entrar agora' : 'Não tem conta? Criar agora'}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-200"><span className="bg-white px-2 italic">Acesso Restrito</span></div>
            </div>

            <Button 
              variant="outline" 
              className="w-full h-14 rounded-2xl border-2 border-primary/10 bg-primary/5 font-black italic text-xs gap-3 text-primary hover:bg-primary/10"
              onClick={handleVagnerLogin}
            >
              <Star className="h-4 w-4 fill-primary" /> VAGNER SUPER ADMIN
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
