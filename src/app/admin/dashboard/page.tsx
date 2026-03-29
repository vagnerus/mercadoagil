
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, Store, LayoutDashboard, Database, Server, LogOut, 
  ShieldCheck, Activity, Globe, LayoutGrid, Building2, 
  TrendingUp, AlertTriangle, Search, Wallet, Landmark, 
  ArrowUpRight, Map, Heart, Zap, PieChart as PieChartIcon, 
  ChevronRight, Bell, ShieldAlert, Cpu, Network, Globe2, Loader2,
  Menu
} from "lucide-react";
import Link from 'next/link';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Input } from "@/components/ui/input";
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AiAssistantChat } from "@/components/merchant/ai-assistant-chat";

const planData = [
  { name: 'Free', value: 45, color: '#94a3b8' },
  { name: 'Pro', value: 35, color: '#3b82f6' },
  { name: 'Pro II', value: 20, color: '#8b5cf6' },
];

const expansionData = [
  { month: 'Jan', active: 10, forecast: 15 },
  { month: 'Fev', active: 25, forecast: 30 },
  { month: 'Mar', active: 45, forecast: 55 },
  { month: 'Abr', active: 85, forecast: 100 },
];

export default function AdminDashboard() {
  const db = useFirestore();
  
  const merchantsQuery = useMemoFirebase(() => query(collection(db, 'merchants'), orderBy('createdAt', 'desc'), limit(10)), [db]);
  const { data: merchants, isLoading: loadingMerchants } = useCollection(merchantsQuery);

  const stats = [
    { title: "Redes (Franquias)", value: "0", icon: Building2, color: "text-blue-600", bg: "bg-blue-100", trend: "Start" },
    { title: "MRR Global", value: `R$ ${(merchants?.length || 0) * 150}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-100", trend: "+8.4%" },
    { title: "Lojistas Ativos", value: merchants?.length?.toString() || "0", icon: Store, color: "text-purple-600", bg: "bg-purple-100", trend: `+${merchants?.length}` },
    { title: "Royalties Acumulados", value: "R$ 0,00", icon: Landmark, color: "text-orange-600", bg: "bg-orange-100", trend: "0%" },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={mobile ? "space-y-2" : "flex-1 px-4 space-y-2"}>
      <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-semibold">
        <LayoutDashboard className="h-5 w-5" /> Global Dashboard
      </Link>
      <Link href="/admin/tenants" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
        <LayoutGrid className="h-5 w-5" /> Multi-Tenancy
      </Link>
      <Link href="/admin/infra" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
        <Server className="h-5 w-5" /> Infraestrutura Cloud
      </Link>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">Master Admin</span>
          </Link>
        </div>
        <NavLinks />
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2 hover:text-red-500" asChild>
            <Link href="/"><LogOut className="h-4 w-4" /> Sair do Console</Link>
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
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
                    Master Admin
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4 h-full flex flex-col">
                  <NavLinks mobile />
                  <div className="mt-auto pt-4 border-t">
                    <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2 hover:text-red-500" asChild>
                      <Link href="/"><LogOut className="h-4 w-4" /> Sair</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter italic">Command Center Global</h1>
              <p className="text-slate-500 font-medium text-xs lg:text-base">Monitoramento em tempo real do ecossistema Ágil.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Badge className="bg-slate-900 text-white font-black uppercase text-[10px] py-1.5 px-4 rounded-full">v3.2.0-ULTRA-ENTERPRISE</Badge>
             <Button size="icon" variant="outline" className="rounded-full relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
             </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:bg-primary transition-colors duration-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bg} p-3 rounded-2xl group-hover:bg-white/20 transition-colors`}>
                    <stat.icon className={`h-6 w-6 ${stat.color} group-hover:text-white`} />
                  </div>
                  <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full group-hover:bg-white/20 group-hover:text-white">{stat.trend}</span>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white/60">{stat.title}</p>
                  <p className="text-2xl font-black text-slate-900 mt-1 italic tracking-tight group-hover:text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card className="lg:col-span-2 border-none shadow-sm p-6 lg:p-8 rounded-[40px] bg-white relative overflow-hidden">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                   <CardTitle className="text-2xl font-black italic">Expansão & Forecast IA</CardTitle>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Base de Lojistas vs Projeção de Crescimento</p>
                </div>
                <div className="flex gap-2">
                   <Badge className="bg-blue-500 text-white border-none font-black italic">ATUAL</Badge>
                   <Badge className="bg-blue-100 text-blue-500 border-none font-black italic">IA PROJECTION</Badge>
                </div>
             </div>
             <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={expansionData}>
                      <defs>
                        <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontWeight: 700, fontSize: 10}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontWeight: 700, fontSize: 10}} />
                      <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                      <Area type="monotone" dataKey="forecast" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                      <Area type="monotone" dataKey="active" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorActive)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </Card>
          
          <div className="space-y-6">
            <Card className="border-none shadow-sm p-8 rounded-[40px] bg-slate-900 text-white relative overflow-hidden">
               <CardTitle className="text-xl font-black italic mb-6">SaaS Plan Mix</CardTitle>
               <div className="h-[200px] mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                          data={planData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {planData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="space-y-3">
                  {planData.map(plan => (
                    <div key={plan.name} className="flex justify-between items-center text-xs">
                       <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: plan.color }}></div>
                          <span className="font-bold text-slate-400">{plan.name}</span>
                       </div>
                       <span className="font-black text-white">{plan.value}%</span>
                    </div>
                  ))}
               </div>
            </Card>

            <Card className="border-none shadow-sm p-8 rounded-[40px] bg-white">
               <CardTitle className="text-xl font-black italic mb-6">Governança & Tasks</CardTitle>
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-dashed">
                     <div className="flex items-center gap-3">
                        <div className="bg-orange-100 p-2 rounded-xl text-orange-600"><Globe2 className="h-4 w-4" /></div>
                        <span className="font-bold text-[10px] uppercase">Domínios Pendentes</span>
                     </div>
                     <span className="font-black text-sm text-slate-900">0</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-dashed">
                     <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-xl text-purple-600"><ShieldAlert className="h-4 w-4" /></div>
                        <span className="font-bold text-[10px] uppercase">Verificação KYC</span>
                     </div>
                     <span className="font-black text-sm text-slate-900">0</span>
                  </div>
               </div>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
           <Card className="lg:col-span-2 border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
              <CardHeader className="p-6 lg:p-8 border-b flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <CardTitle className="text-2xl font-black italic">Últimos Lojistas Ativados</CardTitle>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input className="pl-10 h-10 rounded-xl border-none bg-slate-100 font-medium" placeholder="Buscar lojista..." />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loadingMerchants ? (
                  <div className="p-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
                ) : (
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Lojista</TableHead>
                        <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Segmento</TableHead>
                        <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Plano</TableHead>
                        <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {merchants?.map((merchant: any) => (
                        <TableRow key={merchant.id}>
                          <TableCell className="px-8 py-6">
                             <div className="flex flex-col">
                                <span className="font-black text-slate-900 text-lg italic uppercase leading-tight">{merchant.name}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">{merchant.slug}.agil.com</span>
                             </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="rounded-lg font-black italic bg-blue-100 text-blue-700 border-none">{merchant.segment}</Badge>
                          </TableCell>
                          <TableCell className="font-black text-slate-600 italic">{merchant.planName || 'Pro'}</TableCell>
                          <TableCell className="text-right px-8 font-bold text-slate-400 tabular-nums">
                            {new Date(merchant.createdAt).toLocaleDateString('pt-BR')}
                          </TableCell>
                        </TableRow>
                      ))}
                      {merchants?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="h-40 text-center text-slate-400 font-bold italic">Nenhum lojista ativado no momento.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm p-8 rounded-[40px] bg-slate-900 text-white relative overflow-hidden">
              <CardTitle className="text-xl font-black italic mb-8">Infra Health Monitor</CardTitle>
              <div className="space-y-8">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                       <span>Database Cluster SA</span>
                       <span className="text-green-500">Normal</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-green-500 w-[12%]"></div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                       <span>API Throughput</span>
                       <span className="text-blue-500">Stable</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 w-[5%]"></div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                       <span>CDN Global Edge</span>
                       <span className="text-green-500">Active</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-green-500 w-[5%]"></div>
                    </div>
                 </div>
              </div>
              <div className="mt-10 p-6 bg-white/5 rounded-[30px] border border-white/10 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                       <Zap className="h-5 w-5" />
                    </div>
                    <div>
                       <p className="font-black italic text-sm">IA Scaler</p>
                       <p className="text-[9px] text-slate-500 uppercase font-bold">Auto-scaling ativo</p>
                    </div>
                 </div>
                 <Badge className="bg-green-500/20 text-green-500 border-none font-black italic">OPTIMIZED</Badge>
              </div>
              <Network className="absolute -bottom-10 -right-10 h-40 w-40 opacity-5" />
           </Card>
        </div>
      </main>

      <AiAssistantChat isAdmin={true} />
    </div>
  );
}
