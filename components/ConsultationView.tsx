import React from 'react';
import { 
  Instagram, 
  Facebook, 
  MessageCircle,
  Play,
  ArrowLeft,
  Quote,
  Check
} from 'lucide-react';
import { ConsultationForm } from './ConsultationForm';
import { Logo } from './Logo';

interface ConsultationViewProps {
  onBack: () => void;
}

export const ConsultationView: React.FC<ConsultationViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-brand-dark text-stone-200 relative selection:bg-brand-gold selection:text-white lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row font-sans">
      
      {/* Global Background Texture */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 marble-texture opacity-10"></div>
        <div className="absolute inset-0 vignette"></div>
      </div>

      {/* Back Button (Floating) */}
      <button 
        onClick={onBack}
        className="fixed top-6 left-6 z-50 p-3 bg-black/40 backdrop-blur-md rounded-full text-stone-400 hover:text-white border border-white/10 hover:border-brand-gold transition-all duration-300 group"
        aria-label="Volver"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* === LEFT COLUMN: BRANDING & VSL (Sticky Desktop) === */}
      <div className="w-full lg:w-[45%] relative lg:h-full flex flex-col bg-stone-900/40 border-b lg:border-b-0 lg:border-r border-white/5 backdrop-blur-sm z-10">
        
        {/* Content Container - Centered */}
        <div className="flex-1 flex flex-col justify-center px-6 py-20 lg:px-12 lg:py-0 overflow-y-auto custom-scrollbar">
            
            <div className="max-w-md mx-auto w-full animate-fade-in-up">
              {/* Profile Header */}
              <div className="text-center lg:text-left mb-10">
                <Logo size="xl" className="mb-8 mx-auto lg:mx-0" />
                <h1 className="font-serif text-4xl lg:text-5xl text-white mb-4 leading-none">
                  Tu Transformación <br/>
                  <span className="italic text-stone-500">Comienza Aquí</span>
                </h1>
                <p className="text-stone-400 font-light text-sm max-w-sm lg:mx-0 mx-auto leading-relaxed">
                    Estás a un paso de realizar tu sueño. Completa el formulario para recibir una evaluación personalizada del Dr. Javier Barrios.
                </p>
              </div>

              {/* Steps Preview */}
              <div className="hidden lg:block space-y-6 mb-12 pl-4 border-l border-white/10">
                 <div className="flex gap-4 items-start opacity-50">
                    <span className="text-brand-gold font-serif text-xl">01</span>
                    <div>
                        <h4 className="text-white text-sm uppercase tracking-wider">Pre-Agendamiento</h4>
                        <p className="text-stone-500 text-xs">Completa tus datos básicos y preferencias.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start">
                    <span className="text-brand-gold font-serif text-xl">02</span>
                    <div>
                        <h4 className="text-white text-sm uppercase tracking-wider">Evaluación</h4>
                        <p className="text-stone-500 text-xs">Nuestro equipo analizará tu caso.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start opacity-50">
                    <span className="text-brand-gold font-serif text-xl">03</span>
                    <div>
                        <h4 className="text-white text-sm uppercase tracking-wider">Contacto</h4>
                        <p className="text-stone-500 text-xs">Te contactaremos para coordinar tu cita.</p>
                    </div>
                 </div>
              </div>

              {/* Socials Minimal */}
              <div className="flex justify-center lg:justify-start gap-6 pt-6 border-t border-white/5">
                <a href="https://wa.me/595981003460" className="text-stone-500 hover:text-brand-gold transition-colors p-2 hover:bg-white/5 rounded-full"><MessageCircle size={20}/></a>
                <a href="https://www.instagram.com/dr.javierbarrios/" className="text-stone-500 hover:text-brand-gold transition-colors p-2 hover:bg-white/5 rounded-full"><Instagram size={20}/></a>
                <a href="https://www.facebook.com/share/1DUG8wnZFZ/?mibextid=wwXIfr" className="text-stone-500 hover:text-brand-gold transition-colors p-2 hover:bg-white/5 rounded-full"><Facebook size={20}/></a>
              </div>
            </div>
        </div>
      </div>

      {/* === RIGHT COLUMN: FORM (Scrollable) === */}
      <div className="w-full lg:w-[55%] lg:h-full relative overflow-y-auto bg-black/40 backdrop-blur-sm z-10 scroll-smooth">
          <div className="min-h-full px-4 py-16 lg:px-24 lg:py-24 flex items-center">
             <div className="w-full max-w-lg mx-auto animate-fade-in-up [animation-delay:200ms]">
                <ConsultationForm />
             </div>
          </div>
      </div>

    </div>
  );
};