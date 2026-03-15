
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Store, ShieldCheck, ArrowRight, Loader2, UserCircle, LayoutGrid } from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser, initiateGoogleSignIn, initiateEmailSignIn } from '@/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  // Redirecionamento automático quando o usuário logar
  useEffect(() => {
    if (user && !isUserLoading) {
      if (user.email?.includes('admin')) {
        router.push('/admin/dashboard');
        toast({ title: "Bem-vindo", description: "Acesso administrativo liberado." });
      } else {
        // No protótipo redirecionamos para uma loja fixa, 
        // mas em produção buscaríamos o merchantId do perfil do usuário
        router.push('/merchant/burger-ze/dashboard');
        toast({ title: "Bem-vindo", description: "Painel da sua loja carregado." });
      }
    }
  }, [user, isUserLoading, router, toast]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    initiateEmailSignIn(auth, email, password);
    // O loading será desativado indiretamente pelo useEffect que observa o 'user'
    // ou se houver erro (através do FirebaseErrorListener)
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    initiateGoogleSignIn(auth);
  };

  const handleQuickDemoLogin = (type: 'admin' | 'merchant') => {
    setLoading(true);
    const targetEmail = type === 'admin' ? 'admin@mercadoagil.com' : 'lojista@mercadoagil.com';
    initiateEmailSignIn(auth, targetEmail, 'password123');
  };

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
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Acesso ao Painel</h1>
          <p className="text-slate-500 font-medium italic opacity-70">Gerencie sua loja ou a plataforma global.</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="p-10 pb-4">
            <CardTitle className="text-xl font-black italic">Entrar</CardTitle>
            <CardDescription className="font-medium">Escolha seu método de acesso preferido.</CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-4 space-y-8">
            
            <Button 
              onClick={handleGoogleLogin} 
              disabled={loading || isUserLoading}
              variant="outline" 
              className="w-full h-14 rounded-2xl border-2 border-slate-100 font-bold gap-3 hover:bg-slate-50 transition-all shadow-sm"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.14-4.53z" fill="#EA4335"/>
              </svg>
              Continuar com Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-400 bg-white px-2">Ou use e-mail</div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">E-mail</Label>
                <Input 
                  type="email" 
                  placeholder="seu@email.com" 
                  className="h-14 rounded-2xl bg-slate-50 border-none font-bold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Senha</Label>
                  <Button variant="link" className="text-[10px] font-black uppercase tracking-widest text-primary p-0 h-auto">Esqueci a senha</Button>
                </div>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="h-14 rounded-2xl bg-slate-50 border-none font-bold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading || isUserLoading} className="w-full h-16 bg-primary hover:bg-primary/90 rounded-[28px] text-lg font-black italic shadow-xl shadow-primary/20 gap-3">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Entrar no Painel <ArrowRight className="h-5 w-5" /></>}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-400 bg-white px-2">Acesso Rápido (Demo)</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <Button 
                variant="outline" 
                className="h-14 rounded-2xl border-2 border-slate-100 font-black italic text-[10px] gap-2 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all uppercase tracking-widest"
                onClick={() => handleQuickDemoLogin('admin')}
                disabled={loading}
               >
                 <ShieldCheck className="h-4 w-4" /> MASTER ADM
               </Button>
               <Button 
                variant="outline" 
                className="h-14 rounded-2xl border-2 border-slate-100 font-black italic text-[10px] gap-2 hover:bg-accent hover:text-white hover:border-accent transition-all uppercase tracking-widest"
                onClick={() => handleQuickDemoLogin('merchant')}
                disabled={loading}
               >
                 <UserCircle className="h-4 w-4" /> LOJISTA
               </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm font-bold text-slate-400">
          Não tem uma loja? <Link href="/" className="text-primary hover:underline">Comece agora gratuitamente.</Link>
        </p>
      </div>
    </div>
  );
}
