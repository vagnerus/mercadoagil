"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Store, ShieldCheck, ArrowRight, Loader2, UserCircle, AlertCircle } from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser, initiateGoogleSignIn, initiateEmailSignIn, handleRedirectResult } from '@/firebase';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  // Verifica se há um resultado de redirecionamento pendente ao montar a página
  useEffect(() => {
    handleRedirectResult(auth)
      .then((result) => {
        if (result) {
          toast({ title: "Sucesso!", description: "Autenticação Google concluída." });
        }
        setRedirecting(false);
      })
      .catch((err) => {
        console.error("Erro no Redirect:", err);
        setRedirecting(false);
        if (err.code !== 'auth/popup-closed-by-user') {
          toast({
            title: "Erro na Autenticação",
            description: "Não foi possível completar o login com Google.",
            variant: "destructive"
          });
        }
      });
  }, [auth, toast]);

  // Redirecionamento automático baseado no perfil do usuário logado
  useEffect(() => {
    if (user && !isUserLoading && !redirecting) {
      const emailLower = user.email?.toLowerCase() || '';
      // Lógica de roteamento: se for admin do domínio ou tiver "admin" no email
      if (emailLower.includes('admin') || emailLower === 'admin@mercadoagil.com') {
        router.push('/admin/dashboard');
      } else {
        router.push('/merchant/burger-ze/dashboard');
      }
    }
  }, [user, isUserLoading, redirecting, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    initiateEmailSignIn(auth, email, password).catch((err: any) => {
      setLoading(false);
      toast({
        title: "Erro no Login",
        description: "Credenciais inválidas ou erro de conexão.",
        variant: "destructive"
      });
    });
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    initiateGoogleSignIn(auth).catch((err: any) => {
      setLoading(false);
      toast({
        title: "Erro ao iniciar Google",
        description: err.message,
        variant: "destructive"
      });
    });
  };

  const handleQuickDemoLogin = (type: 'admin' | 'merchant') => {
    setLoading(true);
    const targetEmail = type === 'admin' ? 'admin@mercadoagil.com' : 'lojista@mercadoagil.com';
    initiateEmailSignIn(auth, targetEmail, 'password123').catch(() => {
      setLoading(false);
      toast({ 
        title: "Demo offline", 
        description: "Use o login com Google para testar o sistema real.",
        variant: "destructive"
      });
    });
  };

  if (isUserLoading || redirecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-black italic text-slate-400 uppercase tracking-widest animate-pulse">
          {redirecting ? "Processando Login..." : "Sincronizando Plataforma..."}
        </p>
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Portal de Acesso</h1>
          <p className="text-slate-500 font-medium italic opacity-70">Gerenciamento Enterprise v2.9</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="p-10 pb-4">
            <CardTitle className="text-xl font-black italic">Entrar</CardTitle>
            <CardDescription className="font-medium">Acesse sua conta corporativa.</CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-4 space-y-8">
            
            <Button 
              onClick={handleGoogleLogin} 
              disabled={loading}
              variant="outline" 
              className="w-full h-14 rounded-2xl border-2 border-slate-100 font-bold gap-3 hover:bg-slate-50 transition-all shadow-sm"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.14-4.53z" fill="#EA4335"/>
                  </svg>
                  Continuar com Google
                </>
              )}
            </Button>

            <Alert className="bg-slate-50 border-slate-200 rounded-2xl">
              <AlertCircle className="h-4 w-4 text-slate-400" />
              <AlertDescription className="text-[10px] font-bold text-slate-500 uppercase">
                O login abrirá em uma nova aba se o redirecionamento falhar.
              </AlertDescription>
            </Alert>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-400 bg-white px-2">Ou use e-mail</div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">E-mail Corporativo</Label>
                <Input 
                  type="email" 
                  placeholder="ex: admin@mercadoagil.com" 
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
                  placeholder="••••••••" 
                  className="h-14 rounded-2xl bg-slate-50 border-none font-bold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-16 bg-primary hover:bg-primary/90 rounded-[28px] text-lg font-black italic shadow-xl shadow-primary/20 gap-3">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Entrar no Painel <ArrowRight className="h-5 w-5" /></>}
              </Button>
            </form>

            <div className="grid grid-cols-2 gap-4 mt-4">
               <Button 
                variant="outline" 
                className="h-14 rounded-2xl border-2 border-slate-100 font-black italic text-[10px] gap-2 transition-all uppercase tracking-widest"
                onClick={() => handleQuickDemoLogin('admin')}
                disabled={loading}
               >
                 <ShieldCheck className="h-4 w-4" /> MASTER ADM
               </Button>
               <Button 
                variant="outline" 
                className="h-14 rounded-2xl border-2 border-slate-100 font-black italic text-[10px] gap-2 transition-all uppercase tracking-widest"
                onClick={() => handleQuickDemoLogin('merchant')}
                disabled={loading}
               >
                 <UserCircle className="h-4 w-4" /> LOJISTA
               </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm font-bold text-slate-400 italic">
          Mercado Ágil Tecnologias - Versão SaaS Enterprise
        </p>
      </div>
    </div>
  );
}
