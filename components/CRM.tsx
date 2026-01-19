import React, { useState, useEffect } from 'react';
import { Lead } from '../types';
import { getLeads, toggleLeadContacted, toggleLeadConversion, toggleLeadLost, authenticateCRM } from '../services/sheetApi';
import {
  Lock,
  Search,
  RefreshCw,
  MessageCircle,
  Download,
  LogOut,
  User,
  ArrowLeft,
  X,
  Check,
  Ban,
  DollarSign,
  Loader2
} from 'lucide-react';
import { Logo } from './Logo';

export const CRM: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Restaurar sesión
  useEffect(() => {
    const token = localStorage.getItem('crm_token');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoginLoading(true);

    const token = await authenticateCRM(passwordInput);

    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
      localStorage.setItem('crm_token', token);
    } else {
      setError('Contraseña incorrecta');
    }

    setLoginLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthToken(null);
    localStorage.removeItem('crm_token');
  };

  const fetchLeads = async () => {
    if (!authToken) return;

    setLoading(true);
    try {
      const data = await getLeads(authToken);
      setLeads(data);
    } catch (err) {
      console.error("Error fetching leads", err);
      setError('Error al conectar con la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && authToken) {
      fetchLeads();
    }
  }, [isAuthenticated, authToken]);

  // --- ACTIONS ---
  const handleToggleContacted = async (lead: Lead) => {
    if (!authToken) return;
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, contacted: !l.contacted } : l));
    await toggleLeadContacted(lead.id, !!lead.contacted, authToken);
  };

  const handleToggleConverted = async (lead: Lead) => {
    if (!authToken) return;
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, converted: !l.converted } : l));
    await toggleLeadConversion(lead.id, !!lead.converted, authToken);
  };

  const handleToggleLost = async (lead: Lead) => {
    if (!authToken) return;
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, lost: !l.lost } : l));
    await toggleLeadLost(lead.id, !!lead.lost, authToken);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesTerm = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm) ||
      lead.procedure?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTerm;
  });

  const downloadCSV = () => {
    const headers = ["ID", "Fecha", "Nombre", "Whatsapp", "Email", "Ubicacion", "Procedimiento", "Presupuesto", "Fuente", "Contactado", "Convertido"];
    const csvContent = [
        headers.join(","),
        ...leads.map(lead => [
            `"${lead.id}"`,
            `"${lead.date}"`,
            `"${lead.name}"`,
            `"${lead.phone}"`,
            `"${lead.email}"`,
            `"${lead.location}"`,
            `"${lead.procedure}"`,
            `"${lead.budget}"`,
            `"${lead.source}"`,
            `"${lead.contacted ? 'SI' : 'NO'}"`,
            `"${lead.converted ? 'SI' : 'NO'}"`
        ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `pacientes_dr_barrios_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 marble-texture opacity-20"></div>
        <a href="/" className="absolute top-6 left-6 text-brand-neutral hover:text-brand-accent transition-colors flex items-center gap-2 text-sm z-20">
          <ArrowLeft size={16} /> Volver al sitio
        </a>
        <div className="w-full max-w-md bg-brand-dark/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center relative z-10">
           <Logo size="xl" centered className="mx-auto mb-8" />
           <h2 className="text-2xl font-display font-bold text-white mb-2 tracking-tight">Acceso Privado</h2>
           <p className="text-brand-neutral text-sm mb-8 tracking-wide font-sans">Gestión de Pacientes Dr. Barrios</p>
           <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative group">
                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-neutral group-focus-within:text-brand-accent transition-colors" size={18} />
                 <input
                   type="password"
                   value={passwordInput}
                   onChange={(e) => setPasswordInput(e.target.value)}
                   placeholder="Ingresa tu contraseña"
                   className="w-full bg-brand-darker border border-border-brand-primary-50 rounded-xl py-4 pl-10 text-white focus:border-brand-accent outline-none transition-all placeholder:text-brand-neutral-40 text-sm font-sans"
                   disabled={loginLoading}
                 />
              </div>
              {error && <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-xs flex items-center justify-center gap-2 font-sans"><Lock size={12}/> {error}</div>}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-gradient-to-r from-brand-accent to-brand-primary hover:brightness-110 text-white font-sans font-medium py-4 rounded-xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-brand-accent/10 mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loginLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Acceder al Sistema'
                )}
              </button>
           </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-darker text-brand-light font-sans selection:bg-brand-accent selection:text-black">
      <nav className="border-b border-white/5 bg-brand-dark/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
           <div className="flex items-center">
              <Logo size="lg" />
           </div>
           <div className="flex items-center gap-3">
              <button onClick={fetchLeads} className="p-2.5 hover:bg-white/5 rounded-full text-stone-400 hover:text-brand-accent transition-all active:scale-95 border border-transparent hover:border-white/5" title="Actualizar Lista">
                 <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
              <div className="h-6 w-px bg-white/10 mx-1"></div>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-stone-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-wide border border-transparent hover:border-white/5">
                 <LogOut size={14} /> <span className="hidden md:inline">Cerrar Sesión</span>
              </button>
           </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
         <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                 <h1 className="text-2xl font-display font-bold text-white mb-1 tracking-tight">Pacientes Recientes</h1>
                 <p className="text-brand-neutral text-sm font-sans">Gestiona las solicitudes de pre-agendamiento.</p>
              </div>
              <button onClick={downloadCSV} className="px-6 py-3 bg-brand-dark hover:bg-border-brand-primary-50 border border-white/10 hover:border-brand-accent/30 rounded-xl text-xs font-sans font-medium text-brand-accent transition-all flex items-center justify-center gap-2 uppercase tracking-wider shadow-sm w-full lg:w-auto">
                  <Download size={16} /> Exportar Excel
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-4 bg-brand-dark/30 p-4 rounded-2xl border border-white/5">
                <div className="relative flex-1 group">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-neutral group-focus-within:text-brand-accent transition-colors" size={16} />
                   <input type="text" placeholder="Buscar por nombre, whatsapp o procedimiento..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-brand-dark border border-white/10 rounded-xl py-2.5 pl-10 text-white focus:border-brand-accent outline-none text-sm transition-all shadow-sm h-full font-sans" />
                </div>
                {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="px-4 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center"><X size={16} /></button>
                 )}
            </div>
         </div>

         <div className="bg-brand-dark/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto custom-scrollbar">
               <table className="w-full text-left text-sm whitespace-nowrap font-sans">
                  <thead className="bg-brand-darker text-brand-neutral uppercase tracking-wider text-[10px] font-medium border-b border-white/5">
                     <tr>
                        <th className="p-5">Fecha</th>
                        <th className="p-5">Paciente</th>
                        <th className="p-5">Procedimiento</th>
                        <th className="p-5">Estados</th>
                        <th className="p-5 text-center">Acciones</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {loading ? (
                        <tr><td colSpan={5} className="p-12 text-center text-brand-neutral animate-pulse">Sincronizando...</td></tr>
                     ) : filteredLeads.length === 0 ? (
                        <tr><td colSpan={5} className="p-12 text-center text-brand-neutral">Sin resultados.</td></tr>
                     ) : (
                        filteredLeads.map((lead, idx) => {
                           let dateStr = lead.date;
                           try {
                               if (lead.date.includes('T')) {
                                  const d = new Date(lead.date);
                                  dateStr = d.toLocaleDateString('es-PY', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' });
                               }
                           } catch(e){}

                           const isLost = lead.lost;
                           const isConverted = lead.converted;

                           return (
                              <tr key={idx} className={`hover:bg-white/5 transition-colors group ${isLost ? 'opacity-50 grayscale' : ''} ${isConverted ? 'bg-green-900/5' : ''}`}>
                                 <td className="p-5 text-stone-400 text-xs font-mono">{dateStr}</td>
                                 <td className="p-5">
                                    <div className="flex items-center gap-3">
                                       <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isConverted ? 'bg-green-500 text-black' : 'bg-brand-accent/10 text-brand-accent'}`}>
                                          {isConverted ? <DollarSign size={14} /> : <User size={14} />}
                                       </div>
                                       <div>
                                          <div className={`font-display font-bold text-sm ${isConverted ? 'text-green-400' : 'text-white'}`}>{lead.name}</div>
                                          <div className="text-[10px] text-brand-neutral uppercase tracking-wide font-sans">{lead.location}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="p-5">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-sans font-medium text-stone-300">{lead.procedure}</span>
                                        <span className="text-[10px] text-brand-neutral font-sans">{lead.budget}</span>
                                    </div>
                                 </td>
                                 <td className="p-5">
                                    <div className="flex gap-2">
                                       <button
                                          onClick={() => handleToggleContacted(lead)}
                                          title="Marcar como Contactado"
                                          className={`p-1.5 rounded-md border transition-all ${lead.contacted ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-border-brand-primary-50 border-white/10 text-brand-neutral hover:text-white'}`}
                                       >
                                          <MessageCircle size={14} />
                                       </button>
                                       <button
                                          onClick={() => handleToggleConverted(lead)}
                                          title="Marcar como Venta Cerrada"
                                          className={`p-1.5 rounded-md border transition-all ${lead.converted ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-border-brand-primary-50 border-white/10 text-brand-neutral hover:text-white'}`}
                                       >
                                          <Check size={14} />
                                       </button>
                                       <button
                                          onClick={() => handleToggleLost(lead)}
                                          title="Marcar como Perdido"
                                          className={`p-1.5 rounded-md border transition-all ${lead.lost ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-border-brand-primary-50 border-white/10 text-brand-neutral hover:text-white'}`}
                                       >
                                          <Ban size={14} />
                                       </button>
                                    </div>
                                 </td>
                                 <td className="p-5">
                                    <div className="flex justify-center gap-2">
                                       <a href={`https://wa.me/${(lead.phone || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/20 hover:border-green-500 rounded-lg transition-all text-xs font-sans font-medium uppercase tracking-wide">
                                          <MessageCircle size={14} /> <span>Whatsapp</span>
                                       </a>
                                    </div>
                                 </td>
                              </tr>
                           )
                        })
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </main>
    </div>
  );
};
