import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Play,
  ArrowRight,
  Instagram,
  Facebook,
  MessageCircle,
  Clock,
  Award,
  Star,
  Calendar,
  Plus,
  Minus,
  ShieldCheck,
  Stethoscope,
  Activity,
  HeartHandshake,
  Lock
} from 'lucide-react';
import { Logo } from './Logo';
import { ConsultationForm } from './ConsultationForm';
import { PrivacyPolicyModal, TermsModal } from './LegalModals';

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

const FAQS = [
  {
    question: "¿Dónde se realizan las cirugías?",
    answer: "La seguridad es nuestra prioridad innegociable. Todas las intervenciones quirúrgicas se realizan exclusivamente en sanatorios de alta complejidad en Asunción, equipados con tecnología de punta y unidades de terapia intensiva."
  },
  {
    question: "¿Cuál es el tiempo de recuperación?",
    answer: "Varía según el procedimiento. Para una lipoescultura o aumento mamario, la mayoría de los pacientes retoman actividades leves en 3 a 5 días. Procedimientos más complejos como la abdominoplastia pueden requerir 10 a 14 días. Te acompañamos en cada día de tu evolución."
  },
  {
    question: "¿Ofrecen planes de financiación?",
    answer: "Entendemos que esto es una inversión en ti. Aceptamos diversas formas de pago y trabajamos con entidades financieras aliadas para ofrecerte facilidades. Todos los detalles se discuten con transparencia durante tu consulta."
  },
  {
    question: "¿Cómo es la primera consulta?",
    answer: "Es el momento más importante. El Dr. Barrios evaluará tu anatomía, escuchará tus deseos y te explicará con honestidad qué resultados podemos lograr, en base a esto haremos un plan quirúrgico a medida."
  }
];

const SAFETY_STEPS = [
  {
    icon: Stethoscope,
    title: "1. Consulta Médica",
    desc: "Evaluación inicial presencial o online. Escuchamos tus deseos y definimos si eres candidata/o desde un criterio médico y ético."
  },
  {
    icon: ShieldCheck,
    title: "2. Protocolo Pre-Quirúrgico",
    desc: "Tu seguridad es innegociable. Solicitamos análisis completos, evaluaciones clínicas y planificación detallada de tu cirugía."
  },
  {
    icon: Activity,
    title: "3. Tu Procedimiento",
    desc: "Trabajamos en hospitales con certificaciones internacionales, para ofrecerte lo mejor en seguridad y tecnología."
  },
  {
    icon: HeartHandshake,
    title: "4. Post-Operatorio Integral",
    desc: "No te dejamos sola/o. Incluye drenajes linfáticos, curaciones y seguimiento continuo hasta tu alta definitiva."
  }
];

export const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showUnmuteHint, setShowUnmuteHint] = useState(true);
  const heroCtaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setShowUnmuteHint(false);
    }
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen]);

  // Hide unmute hint when video is unmuted
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVolumeChange = () => {
      if (!video.muted) {
        setShowUnmuteHint(false);
      }
    };

    video.addEventListener('volumechange', handleVolumeChange);
    return () => video.removeEventListener('volumechange', handleVolumeChange);
  }, []);

  // Hide header on scroll down, show on scroll up
  useEffect(() => {
    let lastScroll = 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY < 100) {
            setHeaderVisible(true);
          } else if (currentScrollY > lastScroll && currentScrollY > 200) {
            setHeaderVisible(false);
          } else if (currentScrollY < lastScroll) {
            setHeaderVisible(true);
          }

          lastScroll = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // SCROLL ANIMATION OBSERVER - Ultra smooth reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const selectors = [
        '.reveal-on-scroll',
        '.reveal-from-left',
        '.reveal-from-right',
        '.reveal-scale',
        '.reveal-blur',
        '.reveal-image',
        '.process-card',
        '.stat-number'
      ];

      document.querySelectorAll(selectors.join(', ')).forEach((el) => {
        observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Observe the Hero CTA to toggle the sticky footer button
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyCta(!entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "0px"
      }
    );

    if (heroCtaRef.current) {
      observer.observe(heroCtaRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Premium CTA classes - warm cream color for high contrast
  const ctaPremiumClass = "cta-premium rounded-full font-sans font-medium uppercase tracking-widest";
  const ctaOutlineClass = "cta-outline rounded-full font-sans font-medium uppercase tracking-widest";

  return (
    <div className="min-h-screen bg-brand-darker text-brand-light overflow-x-hidden font-sans selection:bg-brand-accent selection:text-white">
      
      {/* GLOBAL BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 marble-texture opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-darker via-brand-dark/95 to-brand-primary/30"></div>
      </div>

      {/* === HEADER === */}
      <nav className={`fixed top-0 w-full z-40 bg-brand-primary/90 backdrop-blur-xl border-b border-brand-accent/10 transition-all duration-500 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center gap-3">
          <Logo size="sm" />

          {/* Social Icons + Agendar Button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <a href="https://wa.me/595981003460" target="_blank" rel="noreferrer" className="p-2 sm:p-2.5 rounded-full bg-white/5 border border-white/10 text-brand-neutral hover:text-brand-cream hover:border-brand-cream/40 hover:bg-brand-cream/10 transition-all duration-300"><MessageCircle size={14} className="sm:w-4 sm:h-4"/></a>
            <a href="https://www.instagram.com/dr.javierbarrios/" target="_blank" rel="noreferrer" className="p-2 sm:p-2.5 rounded-full bg-white/5 border border-white/10 text-brand-neutral hover:text-brand-cream hover:border-brand-cream/40 hover:bg-brand-cream/10 transition-all duration-300"><Instagram size={14} className="sm:w-4 sm:h-4"/></a>
            <a href="https://www.facebook.com/share/1DUG8wnZFZ/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="p-2 sm:p-2.5 rounded-full bg-white/5 border border-white/10 text-brand-neutral hover:text-brand-cream hover:border-brand-cream/40 hover:bg-brand-cream/10 transition-all duration-300"><Facebook size={14} className="sm:w-4 sm:h-4"/></a>
            <a href="https://www.tiktok.com/@dr.javierbarrios?_r=1&_t=ZM-932itBHEKzY" target="_blank" rel="noreferrer" className="p-2 sm:p-2.5 rounded-full bg-white/5 border border-white/10 text-brand-neutral hover:text-brand-cream hover:border-brand-cream/40 hover:bg-brand-cream/10 transition-all duration-300"><TiktokIcon size={14} className="sm:w-4 sm:h-4"/></a>

            {/* Agendar Button - hidden on mobile */}
            <button
              onClick={openModal}
              className="hidden sm:flex items-center gap-2 ml-2 cta-premium px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
            >
              <Calendar size={14} />
              <span>Agendar Cita</span>
            </button>
          </div>
        </div>
      </nav>

      {/* === HERO SECTION (VSL INTEGRATED) === */}
      <section className="relative z-10 pt-32 pb-24 px-4 min-h-screen flex flex-col justify-center items-center text-center">

        {/* Glow Effects - Warm tones */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-cream/5 rounded-full blur-[120px] pointer-events-none morph-blob"></div>
        <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-brand-accent/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
          
          {/* MAIN HEADLINE */}
          <div className="mb-10">
            <h1 className="hero-title font-display font-bold text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight">
              Diseñemos tu <br/>
              <span className="warm-gradient-text">Transformación</span>
            </h1>
          </div>

          {/* VSL CONTAINER - HTML5 VIDEO */}
          <div className="hero-video video-premium relative w-full max-w-4xl aspect-video bg-brand-darker rounded-3xl overflow-hidden shadow-2xl border border-brand-cream/10">
             <video
               ref={videoRef}
               className="absolute inset-0 w-full h-full object-cover"
               controls
               autoPlay
               muted
               loop
               playsInline
               preload="auto"
               controlsList="nodownload"
             >
               <source src="/DRJAVIERBARRIOS.mp4" type="video/mp4" />
               Tu navegador no soporta la reproducción de video.
             </video>

             {/* Sound Indicator - Clickable hint to unmute */}
             {showUnmuteHint && (
               <button
                 onClick={handleUnmute}
                 className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 animate-pulse transition-all duration-500 hover:bg-brand-accent/20 hover:border-brand-accent/50 cursor-pointer group z-20"
               >
                 <div className="w-1.5 h-1.5 rounded-full bg-brand-accent group-hover:scale-125 transition-transform"></div>
                 <span className="text-white text-[10px] uppercase tracking-wider font-medium group-hover:text-brand-accent transition-colors">Toca para activar audio</span>
               </button>
             )}
          </div>

          {/* Texto debajo del video */}
          <p className="mt-6 text-brand-accent text-sm md:text-base font-light italic">
            Estoy aquí para responder tus preguntas y acompañarte en este proceso.
          </p>

          {/* PRIMARY CTA - DIRECT TO MODAL */}
          <div ref={heroCtaRef} className="hero-cta mt-12 w-full flex flex-col items-center gap-6">
             <button
                onClick={openModal}
                className={`group px-12 py-5 text-sm ${ctaPremiumClass}`}
             >
                <span className="relative z-10 flex items-center gap-3">
                   Iniciar mi Transformación
                   <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
             </button>

             <div className="flex items-center gap-3 text-brand-neutral/80 text-xs">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                </div>
                <span className="tracking-wide">Agenda abierta para nuevos pacientes</span>
             </div>
          </div>

        </div>
      </section>

      {/* === STATS SECTION - ENHANCED === */}
      <section className="relative z-10 py-20">
         {/* Premium divider top */}
         <div className="section-divider mb-16"></div>

         <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-16 md:gap-40 text-center">
            <div className="stat-number space-y-3 group">
               <span className="text-5xl md:text-7xl font-display font-bold text-brand-cream block glow-text transition-all duration-500 group-hover:scale-105">+1000</span>
               <span className="text-brand-warm text-xs uppercase tracking-[0.3em] font-sans font-medium">Pacientes Felices</span>
            </div>
            <div className="stat-number delay-100 space-y-3 group">
               <span className="text-5xl md:text-7xl font-display font-bold text-brand-cream block glow-text transition-all duration-500 group-hover:scale-105">100%</span>
               <span className="text-brand-warm text-xs uppercase tracking-[0.3em] font-sans font-medium">Atención Personalizada</span>
            </div>
         </div>

         {/* Premium divider bottom */}
         <div className="section-divider mt-16"></div>
      </section>

      {/* === SAFETY / PROCESS SECTION === */}
      <section className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 reveal-on-scroll">
            <span className="text-brand-cream/80 text-xs tracking-[0.4em] uppercase mb-4 block font-sans font-medium">Protocolo Dr. Barrios</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-6 tracking-tight">
              Tu seguridad en <span className="warm-gradient-text">cada etapa</span>
            </h2>
            <p className="text-brand-neutral font-sans font-normal max-w-2xl mx-auto leading-relaxed">
              La cirugía plástica es un viaje médico, no solo estético. Hemos diseñado un protocolo estricto para acompañarte antes, durante y después de tu transformación.
            </p>
        </div>

        {/* Process Grid */}
        <div className="grid md:grid-cols-2 gap-6 relative">
          {/* Subtle connecting line for desktop visualization */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-cream/20 to-transparent hidden md:block reveal-on-scroll"></div>

          {SAFETY_STEPS.map((step, index) => (
             <div
               key={index}
               style={{ transitionDelay: `${index * 150}ms` }}
               className={`process-card card-lift relative p-8 rounded-2xl border border-white/5 bg-brand-dark/40 backdrop-blur-sm hover:bg-brand-dark/80 hover:border-brand-cream/20 transition-all duration-500 group ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}
             >
                {/* Connector Dot for Desktop */}
                <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-brand-darker border border-brand-cream/50 z-10 ${index % 2 === 0 ? '-right-[42px]' : '-left-[42px]'}`}>
                   <div className="w-full h-full bg-brand-cream rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <div className="flex flex-col gap-4">
                   <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-dark to-brand-darker border border-brand-cream/10 flex items-center justify-center text-brand-cream group-hover:scale-110 group-hover:border-brand-cream/30 transition-all duration-500 shadow-lg">
                      <step.icon size={26} strokeWidth={1.5} />
                   </div>
                   <div>
                      <h3 className="font-display font-bold text-xl text-white mb-3 group-hover:text-brand-cream transition-colors duration-300">{step.title}</h3>
                      <p className="text-brand-neutral font-sans font-normal text-sm leading-relaxed">
                        {step.desc}
                      </p>
                   </div>
                </div>
             </div>
          ))}
        </div>
      </section>

      {/* === BIO SECTION - EDITORIAL LAYOUT === */}
      <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
        {/* Premium divider */}
        <div className="section-divider mb-24"></div>

        <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">

           {/* Text Content */}
           <div className="w-full md:w-1/2 order-2 md:order-1 reveal-from-left">
              <span className="text-brand-cream/70 text-xs tracking-[0.4em] uppercase mb-6 block font-sans font-medium">El Especialista</span>
              <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight tracking-tight">
                Arte y Ciencia <br/> en <span className="warm-gradient-text">Equilibrio.</span>
              </h2>

              <div className="space-y-6 text-brand-neutral font-sans font-normal leading-relaxed text-base md:text-lg text-justify md:text-left">
                <p>
                  El <strong className="text-white font-medium">Dr. Javier Barrios</strong> no solo es cirujano; es un artista apasionado por la simetría y la belleza natural. Su filosofía se basa en potenciar tu mejor versión sin perder tu esencia.
                </p>
                <p>
                  Con una formación internacional y miembro de la prestigiosa <strong className="text-brand-cream font-medium">Sociedad Paraguaya de Cirugía Plástica</strong>, combina tecnología de vanguardia con un trato humano inigualable.
                </p>
              </div>

              {/* Smooth Cards for Credentials */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="group p-6 bg-gradient-to-br from-brand-dark/50 to-brand-darker/50 backdrop-blur-md rounded-2xl border border-brand-cream/5 hover:border-brand-cream/20 card-lift transition-all duration-500">
                    <div className="w-10 h-10 rounded-xl bg-brand-cream/10 flex items-center justify-center mb-4 group-hover:bg-brand-cream/20 transition-colors duration-300">
                      <Award className="text-brand-cream" size={20} />
                    </div>
                    <h4 className="text-brand-cream text-sm font-sans font-medium uppercase mb-2 tracking-wide">Certificado</h4>
                    <p className="text-brand-neutral text-xs font-sans font-normal leading-relaxed">Miembro Titular de la Sociedad Paraguaya de Cirugía Plástica.</p>
                 </div>
                 <div className="group p-6 bg-gradient-to-br from-brand-dark/50 to-brand-darker/50 backdrop-blur-md rounded-2xl border border-brand-cream/5 hover:border-brand-cream/20 card-lift transition-all duration-500">
                    <div className="w-10 h-10 rounded-xl bg-brand-cream/10 flex items-center justify-center mb-4 group-hover:bg-brand-cream/20 transition-colors duration-300">
                      <Star className="text-brand-cream" size={20} />
                    </div>
                    <h4 className="text-brand-cream text-sm font-sans font-medium uppercase mb-2 tracking-wide">Excelencia</h4>
                    <p className="text-brand-neutral text-xs font-sans font-normal leading-relaxed">Enfoque en resultados naturales y recuperación rápida.</p>
                 </div>
              </div>
           </div>

           {/* Image Layout - Floating */}
           <div className="w-full md:w-1/2 order-1 md:order-2 relative reveal-from-right delay-200">
              <div className="absolute -top-10 -right-10 w-2/3 h-2/3 bg-brand-cream/5 rounded-full blur-[100px]"></div>
              <div className="relative rounded-3xl overflow-hidden aspect-[3/4] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-brand-cream/10 group hover:border-brand-cream/25 transition-all duration-700">
                 <img
                   src="/drjavierbarrios.webp"
                   alt="Dr. Javier Barrios"
                   className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 via-brand-primary/20 to-transparent"></div>

                 {/* Signature overlay effect */}
                 <div className="absolute bottom-6 left-6">
                     <Logo size="lg" className="opacity-60" />
                 </div>

                 {/* Premium corner accent */}
                 <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-cream/10 to-transparent"></div>
              </div>
           </div>

        </div>
      </section>

      {/* === FAQ SECTION === */}
      <section className="relative z-10 py-24 px-6">
        {/* Premium divider */}
        <div className="section-divider mb-20"></div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 reveal-blur">
            <span className="text-brand-cream/70 text-xs tracking-[0.4em] uppercase mb-4 block font-sans font-medium">Dudas Frecuentes</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tight">
              Todo lo que necesitas <span className="warm-gradient-text">saber</span>
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                style={{ transitionDelay: `${index * 100}ms` }}
                className={`faq-item group border rounded-2xl transition-all duration-500 overflow-hidden ${openFaqIndex === index ? 'border-brand-cream/30 bg-brand-dark/60 shadow-lg shadow-brand-cream/5' : 'border-white/5 bg-transparent hover:bg-brand-dark/30 hover:border-brand-cream/10'}`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={`font-display font-bold text-lg md:text-xl transition-colors duration-300 ${openFaqIndex === index ? 'text-brand-cream' : 'text-brand-light group-hover:text-white'}`}>
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-full border transition-all duration-500 ${openFaqIndex === index ? 'border-brand-cream text-brand-cream bg-brand-cream/10 rotate-180' : 'border-white/10 text-brand-neutral group-hover:text-white group-hover:border-brand-cream/30'}`}>
                     {openFaqIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>

                <div
                  className={`transition-[max-height,opacity] duration-500 ease-in-out ${openFaqIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-6 pt-0 text-brand-neutral font-sans font-normal leading-relaxed border-t border-brand-cream/10">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 reveal-on-scroll delay-300">
            <p className="text-brand-neutral text-sm font-sans font-normal mb-6">¿Tienes otra pregunta?</p>
            <button
              onClick={openModal}
              className={`px-8 py-3 text-xs font-sans ${ctaOutlineClass}`}
            >
              Contactar al equipo
            </button>
          </div>
        </div>
      </section>

      {/* === LOCATION & FOOTER SECTION === */}
      {/* Added extra bottom padding on mobile (pb-32) so the sticky CTA doesn't cover the footer text */}
      <section className="relative z-10 pt-24 pb-32 md:pb-12 px-6 bg-brand-darker">
        {/* Premium divider */}
        <div className="section-divider mb-20"></div>

        {/* Main Footer Grid */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 mb-20">

            {/* Info Column */}
            <div className="space-y-12 reveal-from-left">
                <div>
                   <h2 className="font-display font-bold text-4xl text-white mb-6 tracking-tight">Visítanos</h2>
                   <p className="text-brand-neutral font-sans font-normal max-w-sm">
                      Un espacio diseñado para tu confort y privacidad en el corazón de Asunción.
                   </p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-dark/30 border border-brand-cream/5 hover:border-brand-cream/20 hover:bg-brand-dark/50 transition-all duration-300 cursor-pointer group">
                       <div className="bg-brand-cream/10 p-3 rounded-xl text-brand-cream border border-brand-cream/10 group-hover:bg-brand-cream/20 transition-all">
                           <MapPin size={20} />
                       </div>
                       <div>
                          <h4 className="text-brand-cream text-sm font-sans font-medium uppercase mb-1 tracking-wide">Ubicación</h4>
                          <p className="text-brand-neutral text-sm font-sans font-normal leading-relaxed">
                             Padre de la Cruz Ortigoza 2349,<br/> Asunción
                          </p>
                          <a href="https://www.google.com/maps/place/Padre+de+la+Cruz+Ortigoza+2349,+Asunci%C3%B3n+001531/@-25.2687133,-57.5789495,17z/data=!3m1!4b1!4m6!3m5!1s0x945da63e043fa309:0x7049c4ea90862a9b!8m2!3d-25.2687133!4d-57.5763746!16s%2Fg%2F11k5t559p_?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D" target="_blank" rel="noreferrer" className="text-brand-cream/70 text-xs font-sans mt-2 inline-block hover:text-brand-cream transition-colors">Abrir Mapa →</a>
                       </div>
                    </div>

                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-dark/30 border border-brand-cream/5 hover:border-brand-cream/20 hover:bg-brand-dark/50 transition-all duration-300 group">
                       <div className="bg-brand-cream/10 p-3 rounded-xl text-brand-cream border border-brand-cream/10 group-hover:bg-brand-cream/20 transition-all">
                           <Clock size={20} />
                       </div>
                       <div>
                          <h4 className="text-brand-cream text-sm font-sans font-medium uppercase mb-1 tracking-wide">Horarios</h4>
                          <p className="text-brand-neutral text-sm font-sans font-normal leading-relaxed">
                             Lun - Vie: 09:00 - 18:00<br/> Sáb: Con cita previa
                          </p>
                       </div>
                    </div>
                </div>
            </div>

            {/* Map/Image Card */}
            <div className="reveal-from-right delay-200 relative h-full min-h-[300px] rounded-3xl overflow-hidden border border-brand-cream/10 shadow-2xl group hover:border-brand-cream/25 transition-all duration-500">
                 <div className="absolute inset-0 bg-brand-dark">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.287042857484!2d-57.5789495!3d-25.2687133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x945da63e043fa309%3A0x7049c4ea90862a9b!2sPadre%20de%20la%20Cruz%20Ortigoza%202349%2C%20Asunci%C3%B3n!5e0!3m2!1ses-419!2spy"
                      width="100%" 
                      height="100%" 
                      style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      className="opacity-70 transition-opacity duration-500 group-hover:opacity-50"
                    ></iframe>
                 </div>
                 <a href="https://www.google.com/maps/place/Padre+de+la+Cruz+Ortigoza+2349,+Asunci%C3%B3n+001531/@-25.2687133,-57.5789495,17z/data=!3m1!4b1!4m6!3m5!1s0x945da63e043fa309:0x7049c4ea90862a9b!8m2!3d-25.2687133!4d-57.5763746!16s%2Fg%2F11k5t559p_?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D" target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 z-10">
                     <span className="cta-premium px-6 py-3 rounded-full font-sans font-medium text-xs uppercase tracking-widest shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">Ver en Google Maps</span>
                 </a>
            </div>

        </div>

        {/* Separator */}
        <div className="section-divider my-12" />

        {/* Professional Footer - Centered Layout */}
        <div className="reveal-scale max-w-7xl mx-auto flex flex-col items-center gap-8">

            {/* Logo Centered */}
            <Logo size="xl" centered className="opacity-80" />

            {/* Socials */}
            <div className="flex gap-4">
                <a href="https://www.instagram.com/dr.javierbarrios/" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-brand-cream/5 border border-brand-cream/10 text-brand-neutral hover:text-brand-cream hover:border-brand-cream/30 hover:bg-brand-cream/10 transition-all duration-300"><Instagram size={18}/></a>
                <a href="https://www.facebook.com/share/1DUG8wnZFZ/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-brand-cream/5 border border-brand-cream/10 text-brand-neutral hover:text-brand-cream hover:border-brand-cream/30 hover:bg-brand-cream/10 transition-all duration-300"><Facebook size={18}/></a>
                <a href="https://wa.me/595981003460" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-brand-cream/5 border border-brand-cream/10 text-brand-neutral hover:text-brand-cream hover:border-brand-cream/30 hover:bg-brand-cream/10 transition-all duration-300"><MessageCircle size={18}/></a>
                <a href="https://www.tiktok.com/@dr.javierbarrios?_r=1&_t=ZM-932itBHEKzY" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-brand-cream/5 border border-brand-cream/10 text-brand-neutral hover:text-brand-cream hover:border-brand-cream/30 hover:bg-brand-cream/10 transition-all duration-300"><TiktokIcon size={18}/></a>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
                <button
                  onClick={() => setIsPrivacyOpen(true)}
                  className="text-[10px] text-brand-neutral hover:text-brand-neutral transition-colors tracking-wide"
                >
                  Políticas de Privacidad
                </button>
                <span className="text-border-brand-primary-50">|</span>
                <button
                  onClick={() => setIsTermsOpen(true)}
                  className="text-[10px] text-brand-neutral hover:text-brand-neutral transition-colors tracking-wide"
                >
                  Términos de Uso
                </button>
            </div>

            {/* Copyright & Credit */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-4 border-t border-white/5 w-full">
                <span className="text-[10px] text-brand-neutral-40 tracking-widest font-sans">
                   © {new Date().getFullYear()} Dr. Javier Barrios. Todos los derechos reservados.
                </span>
                <a
                  href="https://thebrightidea.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-border-brand-primary-50 hover:text-brand-neutral transition-colors uppercase tracking-widest font-sans"
                >
                  Desarrollado por Bright Idea
                </a>
            </div>
        </div>
      </section>

      {/* === TYPEFORM MODAL OVERLAY === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
             className="modal-backdrop absolute inset-0 bg-black/80 backdrop-blur-md"
             onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="modal-content relative w-full max-w-2xl bg-brand-darker border border-brand-cream/10 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header Decoration */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-cream/50 to-transparent"></div>
              
              <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar relative">
                  <ConsultationForm onClose={closeModal} />
                  
                  {/* Minimalist Developer Credit Inside Modal */}
                  <div className="mt-8 pt-6 border-t border-brand-cream/5 flex justify-center">
                     <a
                      href="https://thebrightidea.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1 text-[9px] text-brand-neutral-40 hover:text-brand-neutral transition-colors tracking-widest opacity-50 hover:opacity-100"
                    >
                      <span>Desarrollado por</span>
                      <span className="font-bold group-hover:text-brand-cream transition-colors">Bright Idea</span>
                    </a>
                  </div>
              </div>
          </div>
        </div>
      )}
      
      {/* === LEGAL MODALS === */}
      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />

      {/* === MOBILE FLOAT CTA === */}
      <div
        className={`md:hidden fixed bottom-6 left-6 right-6 z-40 transition-all duration-500 ease-in-out transform ${showStickyCta && !isModalOpen && !isPrivacyOpen && !isTermsOpen ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'}`}
      >
         <button
            onClick={openModal}
            className={`w-full py-4 text-xs flex items-center justify-center gap-2 ${ctaPremiumClass}`}
         >
            Iniciar Transformación <ArrowRight size={16}/>
         </button>
      </div>

    </div>
  );
};