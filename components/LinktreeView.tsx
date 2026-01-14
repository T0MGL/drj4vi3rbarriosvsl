import React from 'react';
import {
  Instagram,
  Facebook,
  MessageCircle,
  MapPin,
  CalendarCheck,
  ArrowRight
} from 'lucide-react';
import { Logo } from './Logo';

// Helper Icon for TikTok
const TiktokIcon = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

// Standard "Blue" Verified Badge (Twitter/Instagram Style)
const VerifiedBadge = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.416-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.58.875 2.95 2.148 3.6-.154.436-.238.906-.238 1.4 0 2.21 1.71 4 3.818 4 .47 0 .92-.086 1.336-.25.62 1.333 1.926 2.25 3.437 2.25s2.816-.917 3.437-2.25c.416.165.866.25 1.336.25 2.11 0 3.818-1.79 3.818-4 0-.494-.083-.964-.237-1.4 1.272-.65 2.147-2.02 2.147-3.6z" fill="#1D9BF0"/>
    <path d="M10 17l-5-5 1.41-1.42L10 14.17l7.59-7.59L19 8l-9 9z" fill="#fff"/>
  </svg>
);

interface LinktreeProps {
  onEnterSite: () => void;
}

export const LinktreeView: React.FC<LinktreeProps> = ({ onEnterSite }) => {
  
  const socialLinks = [
    { 
      label: "Whatsapp", 
      icon: MessageCircle, 
      href: "https://wa.me/595981003460" 
    },
    { 
      label: "Instagram", 
      icon: Instagram, 
      href: "https://www.instagram.com/dr.javierbarrios/" 
    },
    { 
      label: "Facebook", 
      icon: Facebook, 
      href: "https://www.facebook.com/share/1DUG8wnZFZ/?mibextid=wwXIfr" 
    },
    { 
      label: "TikTok", 
      icon: TiktokIcon, 
      href: "https://www.tiktok.com/@dr.javierbarrios?_r=1&_t=ZM-932itBHEKzY" 
    },
    { 
      label: "Ubicación", 
      icon: MapPin, 
      href: "https://www.google.com/maps/place/Padre+de+la+Cruz+Ortigoza+2349,+Asunci%C3%B3n+001531/@-25.2687133,-57.5789495,17z/data=!3m1!4b1!4m6!3m5!1s0x945da63e043fa309:0x7049c4ea90862a9b!8m2!3d-25.2687133!4d-57.5763746!16s%2Fg%2F11k5t559p_?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D" 
    }
  ];

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-brand-gold selection:text-black">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute inset-0 marble-texture opacity-30 mix-blend-overlay"></div>
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-gold/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-sm relative z-10 flex flex-col items-center gap-10 animate-fade-in-up">
        
        {/* 1. HEADER / PROFILE */}
        <div className="text-center flex flex-col items-center group">
           {/* Foto del doctor - arriba */}
           <div className="relative mb-5">
              <div className="w-36 h-36 md:w-40 md:h-40 rounded-full p-[2px] bg-gradient-to-tr from-brand-gold via-brand-goldLight to-brand-goldDark shadow-[0_0_30px_rgba(197,160,89,0.3)] hover:shadow-[0_0_50px_rgba(197,160,89,0.5)] transition-all duration-700 relative z-10">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-brand-dark bg-stone-900 relative">
                    <img
                        src="/assets/linktree.webp"
                        alt="Dr. Javier Barrios"
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-10 h-10 z-20 drop-shadow-lg">
                      <VerifiedBadge className="w-full h-full" />
                  </div>
              </div>
           </div>

           {/* Logo debajo - centrado */}
           <Logo size="xl" centered />
        </div>

        {/* 2. MAIN CTA (PRE-AGENDAMIENTO) */}
        <div className="w-full">
            <button 
                onClick={onEnterSite} 
                className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-[#9f7d2f] via-[#dcb966] to-[#9f7d2f] bg-[length:200%_auto] animate-shimmer py-5 px-6 shadow-[0_0_30px_rgba(197,160,89,0.2)] hover:shadow-[0_0_50px_rgba(197,160,89,0.4)] transition-all duration-300 transform hover:-translate-y-1"
            >
                <div className="relative z-10 flex items-center justify-center gap-3 text-black font-bold uppercase tracking-[0.2em] text-sm">
                    <CalendarCheck size={18} strokeWidth={2.5} />
                    <span>Pre-Agendamiento</span>
                    <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                </div>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-xl"></div>
            </button>
            <p className="text-center text-[10px] text-stone-500 mt-3 tracking-wider uppercase opacity-70">
                Consulta & Procedimientos
            </p>
        </div>

        {/* Separator line */}
        <div className="w-16 h-px bg-white/10"></div>

        {/* 3. SOCIALS (MINIMAL ROW) */}
        <div className="flex items-center justify-center gap-4">
            {socialLinks.map((link, idx) => (
                <a 
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-3 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-brand-gold/50 transition-all duration-300 text-stone-400 hover:text-brand-gold hover:-translate-y-1"
                    aria-label={link.label}
                >
                    <link.icon size={20} strokeWidth={1.5} />
                    
                    {/* Tooltip */}
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[9px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none uppercase tracking-widest whitespace-nowrap border border-white/10">
                        {link.label}
                    </span>
                </a>
            ))}
        </div>

      </div>

      {/* 4. FOOTER - Developer & CRM Link */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2">
         <a 
            href="https://thebrightidea.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 opacity-30 hover:opacity-80 transition-all duration-500 group py-1"
         >
            <span className="text-[9px] text-stone-500 font-sans tracking-widest uppercase">Desarrollado por</span>
            <span className="text-[9px] text-stone-400 font-sans font-medium tracking-widest uppercase group-hover:text-brand-gold transition-colors">Bright Idea</span>
         </a>
         
      </div>

    </div>
  );
};