import React, { useEffect } from 'react';
import { CheckCircle2, ArrowLeft, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { trackFormConversion } from '../services/analytics';

interface LocationState {
  conversionData?: {
    procedure: string;
    budget: string;
    source: string;
    location: string;
  };
}

export const ThankYouPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  // CRÍTICO: Disparar conversión de Meta Pixel AL CARGAR /gracias
  useEffect(() => {
    // Disparar el evento de conversión SOLO si hay datos
    if (state?.conversionData) {
      trackFormConversion(state.conversionData);

      // Log para debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('🎯 CONVERSIÓN DISPARADA EN /gracias:', state.conversionData);
      }
    } else {
      // Si alguien accede directamente a /gracias sin completar el formulario
      console.warn('⚠️ Acceso directo a /gracias sin datos de conversión');
    }
  }, []); // Solo ejecutar una vez al montar

  return (
    <div className="min-h-screen bg-brand-dark text-brand-light relative selection:bg-brand-accent selection:text-white flex flex-col font-sans">

      {/* Global Background Texture */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 marble-texture opacity-10"></div>
        <div className="absolute inset-0 vignette"></div>
      </div>

      {/* Back Button */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-50 p-3 bg-black/40 backdrop-blur-md rounded-full text-stone-400 hover:text-white border border-white/10 hover:border-brand-accent transition-all duration-300 group"
        aria-label="Volver al inicio"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
      </Link>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-20 relative z-10">
        <div className="max-w-2xl w-full text-center animate-fade-in-up">

          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-brand-accent/10 flex items-center justify-center mb-8 border-2 border-brand-accent/20 animate-pulse">
            <CheckCircle2 className="w-10 h-10 text-brand-accent" strokeWidth={2.5} />
          </div>

          {/* Logo */}
          <Logo size="xl" className="mb-8 mx-auto" />

          {/* Main Message */}
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-6 tracking-tight leading-tight">
            ¡Tu Solicitud fue Enviada con Éxito!
          </h1>

          <div className="max-w-xl mx-auto space-y-6 mb-12">
            <p className="text-brand-neutral text-lg font-sans font-normal leading-relaxed">
              Gracias por confiar en el <span className="text-white font-medium">Dr. Javier Barrios</span>.
              Hemos recibido tu información correctamente.
            </p>

            <div className="bg-brand-dark/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-brand-accent text-sm uppercase tracking-widest mb-4 font-medium">
                Próximos Pasos
              </h2>
              <ul className="space-y-3 text-left">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                  <span className="text-brand-light text-sm">Nuestro equipo revisará tu solicitud</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                  <span className="text-brand-light text-sm">Te contactaremos por WhatsApp en las próximas 24-48 horas</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                  <span className="text-brand-light text-sm">Coordinaremos tu evaluación personalizada</span>
                </li>
              </ul>
            </div>

            <p className="text-brand-neutral-60 text-sm italic">
              Revisa tu WhatsApp regularmente para no perderte nuestra respuesta.
            </p>
          </div>

          {/* CTA Section */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://wa.me/595981003460"
                className="group flex items-center gap-3 bg-brand-accent hover:bg-white text-black px-8 py-4 rounded-xl font-sans font-medium uppercase tracking-widest text-xs transition-all duration-300 shadow-lg shadow-brand-accent/20"
              >
                <MessageCircle size={18} />
                Escríbenos ahora
              </a>
              <Link
                to="/"
                className="flex items-center gap-3 bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-brand-accent px-8 py-4 rounded-xl font-sans font-medium uppercase tracking-widest text-xs transition-all duration-300"
              >
                <ArrowLeft size={18} />
                Volver al inicio
              </Link>
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-white/5">
              <p className="text-brand-neutral text-xs uppercase tracking-wider mb-4">
                Síguenos en redes sociales
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://www.instagram.com/dr.javierbarrios/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-neutral hover:text-brand-accent transition-colors p-3 hover:bg-white/5 rounded-full"
                >
                  <Instagram size={22}/>
                </a>
                <a
                  href="https://www.facebook.com/share/1DUG8wnZFZ/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-neutral hover:text-brand-accent transition-colors p-3 hover:bg-white/5 rounded-full"
                >
                  <Facebook size={22}/>
                </a>
                <a
                  href="https://wa.me/595981003460"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-neutral hover:text-brand-accent transition-colors p-3 hover:bg-white/5 rounded-full"
                >
                  <MessageCircle size={22}/>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 py-6 border-t border-white/5">
        <p className="text-center text-brand-neutral-60 text-xs">
          © {new Date().getFullYear()} Dr. Javier Barrios. Cirugía Plástica & Estética.
        </p>
      </div>

    </div>
  );
};
