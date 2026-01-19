import React, { useState, useRef, useEffect } from 'react';
import { LeadData, PROCEDURES, BUDGET_RANGES, SOURCES } from '../types';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, X, AlertCircle, ChevronDown, Loader2, Check } from 'lucide-react';
import { submitLead } from '../services/sheetApi';
import { trackFormConversion, trackFormStart, trackFormStep } from '../services/analytics';

interface ConsultationFormProps {
  onClose?: () => void;
}

interface FormErrors {
  email?: string;
  whatsapp?: string;
}

const COUNTRIES = [
  { code: '+595', flag: '🇵🇾', name: 'Paraguay' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: '+55', flag: '🇧🇷', name: 'Brasil' },
  { code: '+598', flag: '🇺🇾', name: 'Uruguay' },
  { code: '+591', flag: '🇧🇴', name: 'Bolivia' },
  { code: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+34', flag: '🇪🇸', name: 'España' },
  { code: '+52', flag: '🇲🇽', name: 'México' },
];

export const ConsultationForm: React.FC<ConsultationFormProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<LeadData>({
    fullName: '',
    email: '',
    whatsapp: '',
    location: '',
    procedures: [],
    otherProcedure: '',
    budget: '',
    source: '',
    motivation: ''
  });

  const [countryCode, setCountryCode] = useState('+595');
  const [localPhone, setLocalPhone] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{email?: boolean, whatsapp?: boolean}>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [currentStep]);

  // Validation Logic
  const validateField = (name: string, value: string): string | undefined => {
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) return undefined;
      if (!emailRegex.test(value)) return 'Formato de correo inválido';
    }
    if (name === 'whatsapp') {
      const cleanNumber = value.replace(/[\s\-\+]/g, '');
      if (cleanNumber.length < 9) return 'El número es muy corto';
    }
    return undefined;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'email') {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const updatePhoneState = (newCode: string, newNumber: string) => {
    const fullNumber = `${newCode} ${newNumber}`;
    setFormData(prev => ({ ...prev, whatsapp: fullNumber }));

    if (touched.whatsapp) {
      const error = validateField('whatsapp', fullNumber);
      setErrors(prev => ({ ...prev, whatsapp: error }));
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    setCountryCode(newCode);
    updatePhoneState(newCode, localPhone);
  };

  const handleLocalPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9\s-]/g, '');
    setLocalPhone(val);
    updatePhoneState(countryCode, val);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setTouched(prev => ({ ...prev, [name]: true }));
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
    if (name === 'whatsapp') {
      setTouched(prev => ({ ...prev, whatsapp: true }));
      const error = validateField('whatsapp', formData.whatsapp);
      setErrors(prev => ({ ...prev, whatsapp: error }));
    }
  };

  // Handler para selección múltiple de procedimientos
  const handleProcedureToggle = (procedure: string) => {
    setFormData(prev => {
      const currentProcedures = prev.procedures || [];
      const isSelected = currentProcedures.includes(procedure);

      if (isSelected) {
        return {
          ...prev,
          procedures: currentProcedures.filter(p => p !== procedure),
          otherProcedure: procedure === 'Otro procedimiento' ? '' : prev.otherProcedure
        };
      } else {
        return {
          ...prev,
          procedures: [...currentProcedures, procedure]
        };
      }
    });
  };

  const handleBudgetSelection = (value: string) => {
    setFormData(prev => ({ ...prev, budget: value }));
    setTimeout(nextStep, 300);
  };

  // ORDEN DE PASOS:
  // 0: Intro
  // 1: Datos del cliente (nombre, whatsapp)
  // 2: Datos adicionales (email, ubicación, fuente)
  // 3: Procedimientos (selección múltiple)
  // 4: Presupuesto
  // 5: Motivación (paso final)
  const stepNames = ['intro', 'contact', 'details', 'procedures', 'budget', 'motivation'];
  const TOTAL_STEPS = 5;

  const nextStep = () => {
    // Validación del paso 1 (datos de contacto principales)
    if (currentStep === 1) {
      if (!formData.whatsapp || errors.whatsapp || localPhone.length < 4) {
        setTouched(prev => ({ ...prev, whatsapp: true }));
        setErrors(prev => ({ ...prev, whatsapp: validateField('whatsapp', formData.whatsapp) || 'Campo requerido' }));
        return;
      }
      if (!formData.fullName.trim()) {
        return;
      }
    }

    // Validación del paso 2 (datos adicionales)
    if (currentStep === 2) {
      if (formData.email && errors.email) {
        setTouched(prev => ({ ...prev, email: true }));
        return;
      }
    }

    // Validación del paso 3 (procedimientos)
    if (currentStep === 3) {
      if (formData.procedures.length === 0) {
        return;
      }
      if (formData.procedures.includes('Otro procedimiento') && !formData.otherProcedure.trim()) {
        return;
      }
    }

    if (currentStep < TOTAL_STEPS) {
      const nextStepNum = currentStep + 1;
      setCurrentStep(nextStepNum);

      if (currentStep === 0) {
        trackFormStart();
      }
      trackFormStep(nextStepNum, stepNames[nextStepNum]);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const success = await submitLead(formData);

    if (success) {
      const proceduresString = formData.procedures.includes('Otro procedimiento')
        ? formData.procedures.map(p => p === 'Otro procedimiento' ? (formData.otherProcedure || 'Otro') : p).join(', ')
        : formData.procedures.join(', ');

      trackFormConversion({
        procedure: proceduresString || 'No especificado',
        budget: formData.budget,
        source: formData.source,
        location: formData.location,
      });

      setSubmitted(true);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      alert("Hubo un problema al enviar sus datos. Por favor, verifique su conexión e intente nuevamente.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentStep === TOTAL_STEPS) {
        handleSubmit();
      } else {
        nextStep();
      }
    }
  };

  const getInputBorderClass = (fieldName: 'email' | 'whatsapp') => {
    const value = formData[fieldName];
    const error = errors[fieldName];
    const isTouched = touched[fieldName];

    if (isTouched && error) return 'border-red-500/50 text-red-200';
    if (value && !error && isTouched) return 'border-green-500/50 text-white';
    return 'border-brand-neutral text-white group-focus-within:border-brand-accent';
  };

  // --- RENDER STEPS ---
  const renderStep = () => {
    switch (currentStep) {
      // PASO 0: Intro
      case 0:
        return (
          <div className="animate-fade-in-up text-center md:text-left">
            <span className="text-brand-accent text-xs uppercase tracking-[0.2em] font-sans font-medium mb-4 block">Evaluación Personalizada</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-6 leading-tight tracking-tight">
              Cuéntanos tu historia.
            </h2>
            <p className="text-brand-neutral text-base font-sans font-normal mb-8 leading-relaxed">
              Para ofrecerte la mejor solución, el Dr. Barrios necesita conocer algunos detalles clave. Tus respuestas son 100% confidenciales.
            </p>
            <button
              onClick={nextStep}
              className="w-full md:w-auto group flex items-center justify-center gap-4 bg-brand-accent text-black px-8 py-3 rounded-xl font-sans font-medium uppercase tracking-widest text-xs hover:bg-white transition-all duration-300"
            >
              Iniciar Cuestionario
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="mt-6 flex items-center justify-center md:justify-start gap-2 text-brand-neutral text-[10px] uppercase tracking-wider font-sans">
              <Sparkles size={12} className="text-brand-accent" />
              <span>Tiempo estimado: 2 minutos</span>
            </div>
          </div>
        );

      // PASO 1: Datos del cliente (nombre, whatsapp)
      case 1:
        return (
          <div className="animate-slide-in-right w-full">
             <h3 className="font-display font-bold text-2xl text-white mb-6 tracking-tight">
              <span className="text-brand-accent text-sm block mb-2 font-sans font-medium tracking-widest uppercase">Paso 01</span>
              Tus datos de contacto
            </h3>
            <div className="space-y-8">
              <div className="group">
                <label className="block text-brand-accent text-[10px] uppercase tracking-widest mb-2 font-sans">Nombre Completo</label>
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ej: María González"
                  className="w-full bg-transparent border-b border-brand-neutral-40 text-xl md:text-2xl text-white py-2 focus:border-brand-accent outline-none transition-colors placeholder:text-brand-neutral-50 font-display"
                />
              </div>
              <div className="group relative">
                <label className="block text-brand-accent text-[10px] uppercase tracking-widest mb-2 flex justify-between font-sans">
                  Whatsapp
                  {errors.whatsapp && touched.whatsapp && <span className="text-red-400 normal-case tracking-normal font-sans">{errors.whatsapp}</span>}
                </label>
                <div className={`flex items-end gap-3 border-b pb-2 transition-colors ${getInputBorderClass('whatsapp')}`}>
                  <div className="relative shrink-0">
                    <select
                      value={countryCode}
                      onChange={handleCountryChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    >
                      {COUNTRIES.map(c => (
                        <option key={c.code} value={c.code} className="bg-brand-dark text-white">
                          {c.flag} {c.name} ({c.code})
                        </option>
                      ))}
                      <option value="" className="bg-brand-dark text-white">Otro</option>
                    </select>
                    <div className="flex items-center gap-2 text-brand-accent font-sans text-lg cursor-pointer">
                      <span>{COUNTRIES.find(c => c.code === countryCode)?.flag || '🌐'}</span>
                      <span>{countryCode || '+'}</span>
                      <ChevronDown size={14} className="opacity-50" />
                    </div>
                  </div>
                  <div className="w-[1px] h-6 bg-brand-neutral-40/50"></div>
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      name="whatsapp"
                      value={localPhone}
                      onChange={handleLocalPhoneChange}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      placeholder="0981..."
                      className="w-full bg-transparent text-xl md:text-2xl outline-none placeholder:text-brand-neutral-50 font-display"
                    />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                      {touched.whatsapp && errors.whatsapp && <AlertCircle className="text-red-500 animate-pulse" size={20} />}
                      {touched.whatsapp && !errors.whatsapp && localPhone.length > 4 && <CheckCircle2 className="text-green-500 animate-fade-in" size={20} />}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={nextStep}
                disabled={(!!errors.whatsapp && !!touched.whatsapp) || !formData.fullName.trim()}
                className={`mt-4 px-8 py-3 rounded-lg text-xs uppercase tracking-widest transition-all duration-300 w-full md:w-auto font-sans font-medium
                   ${((errors.whatsapp && touched.whatsapp) || !formData.fullName.trim())
                      ? 'bg-border-brand-primary-50 text-brand-neutral cursor-not-allowed'
                      : 'bg-border-brand-primary-50 hover:bg-brand-neutral-40 text-white'
                   }`}
              >
                Siguiente Paso
              </button>
            </div>
          </div>
        );

      // PASO 2: Datos adicionales (email, ubicación, fuente)
      case 2:
        return (
          <div className="animate-slide-in-right w-full">
            <h3 className="font-display font-bold text-2xl text-white mb-6 tracking-tight">
              <span className="text-brand-accent text-sm block mb-2 font-sans font-medium tracking-widest uppercase">Paso 02</span>
              Información adicional
            </h3>
            <div className="space-y-6">
               <div className="group">
                <label className="block text-brand-accent text-[10px] uppercase tracking-widest mb-2 font-sans">Ciudad / País</label>
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ej: Asunción, Paraguay"
                  className="w-full bg-transparent border-b border-brand-neutral-40 text-lg text-white py-2 focus:border-brand-accent outline-none transition-colors placeholder:text-brand-neutral-50 font-sans"
                />
              </div>
              <div className="group">
                <label className="block text-brand-accent text-[10px] uppercase tracking-widest mb-2 flex justify-between font-sans">
                   Correo Electrónico <span className="text-brand-neutral-60">(opcional)</span>
                   {errors.email && touched.email && <span className="text-red-400 normal-case tracking-normal font-sans">{errors.email}</span>}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder="ejemplo@correo.com"
                    className={`w-full bg-transparent border-b text-lg py-2 outline-none transition-colors placeholder:text-brand-neutral-50 pr-8 font-sans ${getInputBorderClass('email')}`}
                  />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                     {touched.email && errors.email && <AlertCircle className="text-red-500 animate-pulse" size={18} />}
                     {formData.email && !errors.email && <CheckCircle2 className="text-green-500 animate-fade-in" size={18} />}
                  </div>
                </div>
              </div>
              <div className="group">
                <label className="block text-brand-accent text-[10px] uppercase tracking-widest mb-2 font-sans">¿Cómo nos conociste?</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-brand-neutral-40 text-lg text-white py-2 focus:border-brand-accent outline-none transition-colors cursor-pointer appearance-none rounded-none font-sans"
                >
                  <option value="" disabled className="text-brand-neutral-40 bg-brand-dark">Seleccionar...</option>
                  {SOURCES.map(s => <option key={s} value={s} className="bg-brand-dark">{s}</option>)}
                </select>
              </div>
              <button
                onClick={nextStep}
                className="mt-4 bg-border-brand-primary-50 hover:bg-brand-neutral-40 text-white px-8 py-3 rounded-lg text-xs uppercase tracking-widest transition-colors w-full md:w-auto font-sans font-medium"
              >
                Siguiente
              </button>
            </div>
          </div>
        );

      // PASO 3: Procedimientos (selección múltiple)
      case 3:
        return (
          <div className="animate-slide-in-right w-full">
            <h3 className="font-display font-bold text-2xl text-white mb-2 tracking-tight">
              <span className="text-brand-accent text-sm block mb-2 font-sans font-medium tracking-widest uppercase">Paso 03</span>
              ¿Qué procedimientos te interesan?
            </h3>
            <p className="text-brand-neutral text-sm mb-6 font-sans font-normal">Puedes seleccionar uno o más procedimientos.</p>
            <div className="grid grid-cols-1 gap-2 max-h-[45vh] overflow-y-auto custom-scrollbar pr-2">
              {PROCEDURES.map((p) => {
                const isSelected = formData.procedures.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => handleProcedureToggle(p)}
                    className={`text-left p-4 rounded-lg border transition-all duration-300 flex justify-between items-center group
                      ${isSelected
                        ? 'bg-brand-accent text-black border-brand-accent shadow-lg shadow-brand-accent/20'
                        : 'bg-brand-dark/40 border-border-brand-primary-50 text-brand-light hover:border-brand-accent/30 hover:bg-brand-dark'
                      }`}
                  >
                    <span className="font-sans font-normal tracking-wide text-sm md:text-base">{p}</span>
                    {isSelected && <Check size={18} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>

            {formData.procedures.includes('Otro procedimiento') && (
               <div className="mt-4 animate-fade-in">
                 <input
                    type="text"
                    name="otherProcedure"
                    value={formData.otherProcedure}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Especifique el procedimiento..."
                    className="w-full bg-transparent border-b border-brand-neutral-50 text-white text-lg py-2 focus:border-brand-accent outline-none placeholder:text-brand-neutral-60 transition-colors font-sans"
                 />
               </div>
            )}

            <button
              onClick={nextStep}
              disabled={formData.procedures.length === 0 || (formData.procedures.includes('Otro procedimiento') && !formData.otherProcedure.trim())}
              className={`mt-6 px-8 py-3 rounded-lg text-xs uppercase tracking-widest transition-all duration-300 w-full md:w-auto font-sans font-medium flex items-center justify-center gap-2
                ${formData.procedures.length === 0 || (formData.procedures.includes('Otro procedimiento') && !formData.otherProcedure.trim())
                  ? 'bg-border-brand-primary-50 text-brand-neutral cursor-not-allowed'
                  : 'bg-brand-accent text-black hover:bg-white'
                }`}
            >
              Continuar
              {formData.procedures.length > 0 && (
                <span className="bg-black/20 px-2 py-0.5 rounded text-[10px]">
                  {formData.procedures.length} seleccionado{formData.procedures.length > 1 ? 's' : ''}
                </span>
              )}
            </button>
          </div>
        );

      // PASO 4: Presupuesto
      case 4:
         return (
          <div className="animate-slide-in-right w-full">
            <h3 className="font-display font-bold text-2xl text-white mb-2 tracking-tight">
              <span className="text-brand-accent text-sm block mb-2 font-sans font-medium tracking-widest uppercase">Paso 04</span>
              Inversión estimada
            </h3>
            <p className="text-brand-neutral text-sm mb-6 font-sans font-normal">Para ofrecerte opciones realistas, selecciona tu rango de presupuesto.</p>
            <div className="space-y-2">
              {BUDGET_RANGES.map((range, idx) => (
                <button
                  key={idx}
                  onClick={() => handleBudgetSelection(range)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-300 flex justify-between items-center
                    ${formData.budget === range
                      ? 'bg-border-brand-primary-50 border-brand-accent text-white'
                      : 'bg-transparent border-border-brand-primary-50 text-brand-neutral hover:border-brand-neutral-50 hover:bg-brand-dark/30'
                    }`}
                >
                  <span className="font-sans font-normal text-sm">{range}</span>
                  {formData.budget === range && <div className="w-2 h-2 rounded-full bg-brand-accent"></div>}
                </button>
              ))}
            </div>
          </div>
         );

      // PASO 5: Motivación (paso final)
      case 5:
        return (
           <div className="animate-slide-in-right w-full">
             <h3 className="font-display font-bold text-2xl text-white mb-4 tracking-tight">
              <span className="text-brand-accent text-sm block mb-2 font-sans font-medium tracking-widest uppercase">Paso Final</span>
              Tu Motivación
            </h3>
            <p className="text-brand-neutral mb-6 text-sm font-sans font-normal">¿Qué te motiva a considerar este procedimiento? (Opcional)</p>
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              name="motivation"
              value={formData.motivation}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={3}
              placeholder="Escribe aquí..."
              className="w-full bg-brand-dark/50 border border-brand-neutral-40 rounded-lg p-4 text-white focus:border-brand-accent outline-none resize-none placeholder:text-brand-neutral-60 text-sm font-sans"
            />
            <div className="mt-8">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-brand-accent hover:bg-brand-secondary text-brand-dark font-sans font-medium py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.01] shadow-lg shadow-brand-accent/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
              >
                {isSubmitting ? (
                   <>
                     <Loader2 className="animate-spin" size={18} />
                     Enviando...
                   </>
                ) : (
                   <>
                     Finalizar Solicitud
                     <ArrowRight size={18} />
                   </>
                )}
              </button>
              <p className="text-center text-[10px] text-brand-neutral mt-4 font-sans">
                Al enviar aceptas ser contactado por nuestro equipo médico.
              </p>
            </div>
           </div>
        );
      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in py-10">
        <div className="w-16 h-16 rounded-full bg-brand-accent/10 flex items-center justify-center mb-6 border border-brand-accent/20">
          <CheckCircle2 className="w-8 h-8 text-brand-accent" />
        </div>
        <h3 className="font-display font-bold text-3xl text-white mb-4 tracking-tight">¡Solicitud Enviada!</h3>
        <p className="text-brand-neutral mb-8 font-sans font-normal text-base leading-relaxed max-w-sm mx-auto">
          Hemos recibido tus datos correctamente. El equipo del Dr. Javier Barrios te contactará muy pronto para coordinar los siguientes pasos.
        </p>
        <button
          onClick={onClose}
          className="text-white border-b border-brand-accent pb-1 text-xs uppercase tracking-widest hover:text-brand-accent transition-colors font-sans"
        >
          Cerrar ventana
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col relative">

      {/* Close Button for Modal */}
      {onClose && !submitted && (
        <button
            onClick={onClose}
            className="absolute -top-2 -right-2 md:top-0 md:right-0 p-2 text-brand-neutral hover:text-white transition-colors z-50"
        >
            <X size={24} />
        </button>
      )}

      {/* Progress Bar */}
      {currentStep > 0 && !submitted && (
        <div className="mb-8">
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-brand-neutral mb-2 font-sans">
            <span>Progreso</span>
            <span>{Math.round((currentStep / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="w-full h-1 bg-border-brand-primary-50 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-accent transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        {renderStep()}
      </div>

      {/* Back Button */}
      {currentStep > 0 && !submitted && (
        <div className="mt-8 pt-4 border-t border-white/5 flex justify-start">
           <button
             onClick={prevStep}
             className="flex items-center gap-2 text-brand-neutral hover:text-white transition-colors text-xs uppercase tracking-wider font-sans"
           >
             <ArrowLeft size={14} />
             Atrás
           </button>
        </div>
      )}
    </div>
  );
};
