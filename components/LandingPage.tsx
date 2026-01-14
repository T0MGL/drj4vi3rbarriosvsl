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
    answer: "Entendemos que esto es una inversión en ti. Aceptamos diversas formas de pago y trabajamos con entidades financieras aliadas para ofrecer planes de cuotas. Todos los detalles se discuten con transparencia durante tu consulta."
  },
  {
    question: "¿Cómo es la primera consulta?",
    answer: "Es el momento más importante. El Dr. Barrios evaluará tu anatomía, escuchará tus deseos y te explicará con honestidad qué resultados podemos lograr. Incluye un análisis fotográfico y un plan quirúrgico a medida."
  }
];

const SAFETY_STEPS = [
  {
    icon: Stethoscope,
    title: "1. Valoración Médica",
    desc: "Evaluación anatómica presencial. Escuchamos tus deseos y definimos si eres candidata/o desde un criterio médico y ético."
  },
  {
    icon: ShieldCheck,
    title: "2. Protocolo Pre-Quirúrgico",
    desc: "Tu seguridad es innegociable. Realizamos análisis completos, riesgo cardiológico y planificación detallada de tu cirugía."
  },
  {
    icon: Activity,
    title: "3. Tu Procedimiento",
    desc: "Tecnología de punta en quirófanos certificados. Anestesia monitoreada por especialistas para tu total tranquilidad."
  },
  {
    icon: HeartHandshake,
    title: "4. Post-Operatorio Integral",
    desc: "No te dejamos sola. Incluye drenajes linfáticos, curaciones y seguimiento continuo hasta tu alta definitiva."
  }
];

export const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const heroCtaRef = useRef<HTMLDivElement>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen]);

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

  const goldGradientButtonClass = "bg-gradient-to-r from-[#9f7d2f] via-[#dcb966] to-[#9f7d2f] bg-[length:200%_auto] animate-shimmer";

  return (
    <div className="min-h-screen bg-brand-dark text-stone-200 overflow-x-hidden font-sans selection:bg-brand-gold selection:text-black">
      
      {/* GLOBAL BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 marble-texture opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-dark/95 to-brand-dark"></div>
      </div>

      {/* === HEADER === */}
      <nav className={`fixed top-0 w-full z-40 bg-brand-dark/90 backdrop-blur-xl border-b border-white/5 transition-all duration-500 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <Logo size="sm" />
          <button
            onClick={openModal}
            className="group flex items-center gap-2 bg-white/5 hover:bg-brand-gold hover:text-black border border-white/10 text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_20px_rgba(197,160,89,0.3)]"
          >
            <Calendar size={14} className="text-brand-gold group-hover:text-black transition-colors duration-300" />
            <span className="hidden sm:inline">Agendar Cita</span>
          </button>
        </div>
      </nav>

      {/* === HERO SECTION (VSL INTEGRATED) === */}
      <section className="relative z-10 pt-32 pb-24 px-4 min-h-screen flex flex-col justify-center items-center text-center">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
          
          {/* MAIN HEADLINE */}
          <div className="mb-10 space-y-4">
            <span className="hero-subtitle text-brand-gold text-[10px] md:text-xs uppercase tracking-[0.4em] font-medium block animate-pulse-slow">
              Medicina Estética de Alto Nivel
            </span>
            <h1 className="hero-title font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1]">
              Diseñemos tu <br/>
              <span className="italic bg-clip-text text-transparent bg-gradient-to-r from-white via-stone-200 to-stone-500">Transformación</span>
            </h1>
          </div>

          {/* VSL CONTAINER - SMOOTH CARD */}
          <div
             className="hero-video relative w-full max-w-4xl aspect-video bg-stone-950 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group cursor-pointer transition-all duration-700 hover:shadow-[0_20px_80px_rgba(197,160,89,0.15)] hover:border-brand-gold/30 hover:scale-[1.01]"
             onClick={openModal}
          >
             {/* Thumbnail Image */}
             <div className="absolute inset-0 bg-[url('/assets/DSC_1879.webp')] bg-cover bg-center group-hover:scale-105 transition-transform duration-[1.5s]"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>

             {/* Play Interface */}
             <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <div className="relative group-hover:-translate-y-2 transition-transform duration-500">
                   <div className="absolute inset-0 bg-brand-gold/20 rounded-full animate-ping opacity-20"></div>
                   <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border border-white/20 backdrop-blur-md bg-white/5 flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.5)] group-hover:bg-brand-gold group-hover:border-brand-gold transition-colors duration-500">
                      <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1 group-hover:text-black transition-colors duration-500" fill="currentColor" />
                   </div>
                </div>
                
                <div className="mt-8 flex flex-col items-center gap-2">
                    <span className="text-white font-medium text-lg md:text-xl tracking-wide group-hover:text-brand-gold transition-colors duration-300">Descubre el proceso</span>
                    <span className="text-stone-400 text-sm font-light">Mira el video de 60 segundos</span>
                </div>
             </div>
          </div>

          {/* PRIMARY CTA - DIRECT TO MODAL */}
          <div ref={heroCtaRef} className="hero-cta mt-12 w-full flex flex-col items-center gap-6">
             <button 
                onClick={openModal}
                className={`group relative overflow-hidden rounded-full px-12 py-5 transition-all duration-300 hover:shadow-[0_0_40px_rgba(159,125,47,0.5)] hover:scale-105 ${goldGradientButtonClass}`}
             >
                <div className="relative z-10 flex items-center gap-3 font-bold text-black uppercase tracking-widest text-sm">
                   Iniciar mi Transformación
                   <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
             </button>
             
             <div className="flex items-center gap-2 text-stone-500 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span>Agenda abierta para nuevos pacientes</span>
             </div>
          </div>

        </div>
      </section>

      {/* === STATS SECTION - MINIMALIST === */}
      <section className="relative z-10 py-16 border-y border-white/5 bg-stone-900/20 backdrop-blur-sm">
         <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-32 text-center">
            <div className="stat-number space-y-2">
               <span className="text-4xl md:text-6xl font-serif text-white block">+1000</span>
               <span className="text-brand-gold text-xs uppercase tracking-[0.2em]">Pacientes Felices</span>
            </div>
            <div className="stat-number delay-100 space-y-2">
               <span className="text-4xl md:text-6xl font-serif text-white block">15</span>
               <span className="text-brand-gold text-xs uppercase tracking-[0.2em]">Años de Experiencia</span>
            </div>
            <div className="stat-number delay-200 space-y-2">
               <span className="text-4xl md:text-6xl font-serif text-white block">100%</span>
               <span className="text-brand-gold text-xs uppercase tracking-[0.2em]">Atención Premium</span>
            </div>
         </div>
      </section>

      {/* === SAFETY / PROCESS SECTION === */}
      <section className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 reveal-on-scroll">
            <span className="text-brand-gold text-xs tracking-[0.4em] uppercase mb-4 block font-bold">Protocolo Dr. Barrios</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white mb-6">
              Tu seguridad en cada etapa
            </h2>
            <p className="text-stone-400 font-light max-w-2xl mx-auto leading-relaxed">
              La cirugía plástica es un viaje médico, no solo estético. Hemos diseñado un protocolo estricto para acompañarte antes, durante y después de tu transformación.
            </p>
        </div>

        {/* Process Grid */}
        <div className="grid md:grid-cols-2 gap-6 relative">
          {/* Subtle connecting line for desktop visualization */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-gold/20 to-transparent hidden md:block reveal-on-scroll"></div>

          {SAFETY_STEPS.map((step, index) => (
             <div
               key={index}
               style={{ transitionDelay: `${index * 150}ms` }}
               className={`process-card card-lift relative p-8 rounded-2xl border border-white/5 bg-stone-900/40 backdrop-blur-sm hover:bg-stone-900/80 hover:border-brand-gold/30 transition-all duration-500 group ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}
             >
                {/* Connector Dot for Desktop */}
                <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-stone-950 border border-brand-gold z-10 ${index % 2 === 0 ? '-right-[42px]' : '-left-[42px]'}`}>
                   <div className="w-full h-full bg-brand-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <div className="flex flex-col gap-4">
                   <div className="w-12 h-12 rounded-full bg-stone-900 border border-white/10 flex items-center justify-center text-brand-gold group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                      <step.icon size={24} />
                   </div>
                   <div>
                      <h3 className="font-serif text-xl text-white mb-3 group-hover:text-brand-gold transition-colors">{step.title}</h3>
                      <p className="text-stone-400 font-light text-sm leading-relaxed">
                        {step.desc}
                      </p>
                   </div>
                </div>
             </div>
          ))}
        </div>
      </section>

      {/* === BIO SECTION - EDITORIAL LAYOUT === */}
      <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
           
           {/* Text Content */}
           <div className="w-full md:w-1/2 order-2 md:order-1 reveal-from-left">
              <span className="text-brand-gold text-xs tracking-[0.4em] uppercase mb-6 block font-bold">El Especialista</span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
                Arte y Ciencia <br/> en Equilibrio.
              </h2>
              
              <div className="space-y-6 text-stone-400 font-light leading-relaxed text-base md:text-lg text-justify md:text-left">
                <p>
                  El <strong className="text-white">Dr. Javier Barrios</strong> no solo es cirujano; es un artista apasionado por la simetría y la belleza natural. Su filosofía se basa en potenciar tu mejor versión sin perder tu esencia.
                </p>
                <p>
                  Con una formación internacional y miembro de la prestigiosa <strong className="text-brand-gold">Sociedad Paraguaya de Cirugía Plástica</strong>, combina tecnología de vanguardia con un trato humano inigualable.
                </p>
              </div>

              {/* Smooth Cards for Credentials */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="group p-6 bg-stone-900/30 backdrop-blur-md rounded-2xl border border-white/5 hover:border-brand-gold/30 hover:bg-stone-900/60 card-lift transition-all duration-500">
                    <Award className="text-brand-gold mb-4 group-hover:scale-110 transition-transform duration-500" size={24} />
                    <h4 className="text-white text-sm font-bold uppercase mb-2">Certificado</h4>
                    <p className="text-stone-500 text-xs leading-relaxed">Miembro Titular de la Sociedad Paraguaya de Cirugía Plástica.</p>
                 </div>
                 <div className="group p-6 bg-stone-900/30 backdrop-blur-md rounded-2xl border border-white/5 hover:border-brand-gold/30 hover:bg-stone-900/60 card-lift transition-all duration-500">
                    <Star className="text-brand-gold mb-4 group-hover:scale-110 transition-transform duration-500" size={24} />
                    <h4 className="text-white text-sm font-bold uppercase mb-2">Excelencia</h4>
                    <p className="text-stone-500 text-xs leading-relaxed">Enfoque en resultados naturales y recuperación rápida.</p>
                 </div>
              </div>
           </div>

           {/* Image Layout - Floating */}
           <div className="w-full md:w-1/2 order-1 md:order-2 relative reveal-from-right delay-200">
              <div className="absolute -top-10 -right-10 w-2/3 h-2/3 bg-brand-gold/5 rounded-full blur-[80px]"></div>
              <div className="relative rounded-3xl overflow-hidden aspect-[3/4] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/5 group hover:border-brand-gold/20 transition-colors duration-700">
                 <img 
                   src="/assets/DSC_1349.webp" 
                   alt="Dr. Javier Barrios" 
                   className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent"></div>
                 
                 {/* Signature overlay effect */}
                 <div className="absolute bottom-6 left-6">
                     <Logo size="lg" className="opacity-60" />
                 </div>
              </div>
           </div>

        </div>
      </section>

      {/* === FAQ SECTION === */}
      <section className="relative z-10 py-24 px-6 bg-stone-900/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 reveal-blur">
            <span className="text-brand-gold text-xs tracking-[0.4em] uppercase mb-4 block font-bold">Dudas Frecuentes</span>
            <h2 className="font-serif text-3xl md:text-5xl text-white">
              Todo lo que necesitas saber
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                style={{ transitionDelay: `${index * 100}ms` }}
                className={`faq-item group border rounded-2xl transition-all duration-500 overflow-hidden ${openFaqIndex === index ? 'border-brand-gold/30 bg-stone-900/60' : 'border-white/5 bg-transparent hover:bg-stone-900/30'}`}
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={`font-serif text-lg md:text-xl transition-colors ${openFaqIndex === index ? 'text-brand-gold' : 'text-stone-200 group-hover:text-white'}`}>
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-full border transition-all duration-500 ${openFaqIndex === index ? 'border-brand-gold text-brand-gold rotate-180' : 'border-white/10 text-stone-500 group-hover:text-white'}`}>
                     {openFaqIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>
                
                <div 
                  className={`transition-[max-height] duration-500 ease-in-out ${openFaqIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-6 pt-0 text-stone-400 font-light leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12 reveal-on-scroll delay-300">
            <p className="text-stone-500 text-sm mb-4">¿Tienes otra pregunta?</p>
            <button 
              onClick={openModal}
              className="text-white border-b border-brand-gold pb-1 text-xs uppercase tracking-widest hover:text-brand-gold transition-colors"
            >
              Contactar al equipo
            </button>
          </div>
        </div>
      </section>

      {/* === LOCATION & FOOTER SECTION === */}
      {/* Added extra bottom padding on mobile (pb-32) so the sticky CTA doesn't cover the footer text */}
      <section className="relative z-10 pt-24 pb-32 md:pb-12 px-6 bg-stone-950 border-t border-white/5">
        
        {/* Main Footer Grid */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 mb-20">
            
            {/* Info Column */}
            <div className="space-y-12 reveal-from-left">
                <div>
                   <h2 className="font-serif text-4xl text-white mb-6">Visítanos</h2>
                   <p className="text-stone-400 font-light max-w-sm">
                      Un espacio diseñado para tu confort y privacidad en el corazón de Asunción.
                   </p>
                </div>

                <div className="space-y-8">
                    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors duration-300 cursor-pointer group">
                       <div className="bg-stone-900 p-3 rounded-full text-brand-gold border border-white/5 group-hover:border-brand-gold group-hover:bg-brand-gold group-hover:text-black transition-all">
                           <MapPin size={20} />
                       </div>
                       <div>
                          <h4 className="text-white text-sm font-bold uppercase mb-1">Ubicación</h4>
                          <p className="text-stone-400 text-sm leading-relaxed">
                             Padre de la Cruz Ortigoza 2349,<br/> Asunción
                          </p>
                          <a href="https://www.google.com/maps/place/Padre+de+la+Cruz+Ortigoza+2349,+Asunci%C3%B3n+001531/@-25.2687133,-57.5789495,17z/data=!3m1!4b1!4m6!3m5!1s0x945da63e043fa309:0x7049c4ea90862a9b!8m2!3d-25.2687133!4d-57.5763746!16s%2Fg%2F11k5t559p_?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D" target="_blank" rel="noreferrer" className="text-brand-gold text-xs mt-2 inline-block hover:underline">Abrir Mapa</a>
                       </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors duration-300">
                       <div className="bg-stone-900 p-3 rounded-full text-brand-gold border border-white/5">
                           <Clock size={20} />
                       </div>
                       <div>
                          <h4 className="text-white text-sm font-bold uppercase mb-1">Horarios</h4>
                          <p className="text-stone-400 text-sm leading-relaxed">
                             Lun - Vie: 09:00 - 18:00<br/> Sáb: Con cita previa
                          </p>
                       </div>
                    </div>
                </div>
            </div>

            {/* Map/Image Card */}
            <div className="reveal-from-right delay-200 relative h-full min-h-[300px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group hover:border-brand-gold/30 transition-colors duration-500">
                 <div className="absolute inset-0 bg-stone-900">
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
                 <a href="https://www.google.com/maps/place/Padre+de+la+Cruz+Ortigoza+2349,+Asunci%C3%B3n+001531/@-25.2687133,-57.5789495,17z/data=!3m1!4b1!4m6!3m5!1s0x945da63e043fa309:0x7049c4ea90862a9b!8m2!3d-25.2687133!4d-57.5763746!16s%2Fg%2F11k5t559p_?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D" target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 z-10">
                     <span className="bg-white text-black px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">Ver en Google Maps</span>
                 </a>
            </div>

        </div>

        {/* Separator */}
        <div className="h-px w-full bg-white/5 my-12" />

        {/* Professional Footer - Centered Layout */}
        <div className="reveal-scale max-w-7xl mx-auto flex flex-col items-center gap-8">

            {/* Logo Centered */}
            <Logo size="xl" centered className="opacity-80" />

            {/* Socials */}
            <div className="flex gap-5 opacity-50 hover:opacity-100 transition-opacity duration-300">
                <a href="https://www.instagram.com/dr.javierbarrios/" target="_blank" rel="noreferrer" className="text-stone-500 hover:text-brand-gold transition-colors"><Instagram size={18}/></a>
                <a href="https://www.facebook.com/share/1DUG8wnZFZ/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="text-stone-500 hover:text-brand-gold transition-colors"><Facebook size={18}/></a>
                <a href="https://wa.me/595981003460" target="_blank" rel="noreferrer" className="text-stone-500 hover:text-brand-gold transition-colors"><MessageCircle size={18}/></a>
                <a href="https://www.tiktok.com/@dr.javierbarrios?_r=1&_t=ZM-932itBHEKzY" target="_blank" rel="noreferrer" className="text-stone-500 hover:text-brand-gold transition-colors"><TiktokIcon size={18}/></a>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
                <button
                  onClick={() => setIsPrivacyOpen(true)}
                  className="text-[10px] text-stone-600 hover:text-stone-400 transition-colors tracking-wide"
                >
                  Políticas de Privacidad
                </button>
                <span className="text-stone-800">|</span>
                <button
                  onClick={() => setIsTermsOpen(true)}
                  className="text-[10px] text-stone-600 hover:text-stone-400 transition-colors tracking-wide"
                >
                  Términos de Uso
                </button>
            </div>

            {/* Copyright & Credit */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-4 border-t border-white/5 w-full">
                <span className="text-[10px] text-stone-700 tracking-widest">
                   © {new Date().getFullYear()} Dr. Javier Barrios. Todos los derechos reservados.
                </span>
                <a
                  href="https://thebrightidea.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-stone-800 hover:text-stone-500 transition-colors uppercase tracking-widest"
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
          <div className="modal-content relative w-full max-w-2xl bg-stone-950 border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header Decoration */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-50"></div>
              
              <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar relative">
                  <ConsultationForm onClose={closeModal} />
                  
                  {/* Minimalist Developer Credit Inside Modal */}
                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
                     <a 
                      href="https://thebrightidea.ai" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1 text-[9px] text-stone-700 hover:text-stone-500 transition-colors tracking-widest opacity-50 hover:opacity-100"
                    >
                      <span>Desarrollado por</span>
                      <span className="font-bold group-hover:text-brand-gold transition-colors">Bright Idea</span>
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
            className={`w-full shadow-[0_0_20px_rgba(159,125,47,0.3)] text-black py-4 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 backdrop-blur-md ${goldGradientButtonClass}`}
         >
            Iniciar Transformación <ArrowRight size={16}/>
         </button>
      </div>

    </div>
  );
};