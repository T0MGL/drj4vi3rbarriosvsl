import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const BaseModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-brand-darker border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-brand-dark/50">
          <h3 className="font-display font-bold text-xl text-brand-accent tracking-tight">{title}</h3>
          <button onClick={onClose} className="text-brand-neutral hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar text-stone-400 font-sans font-normal text-sm leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = (props) => (
  <BaseModal {...props} title="Políticas de Privacidad">
    <p><strong className="font-sans font-medium">Última actualización: {new Date().getFullYear()}</strong></p>

    <h4 className="text-white font-display font-bold mt-4">1. Responsable del Tratamiento</h4>
    <p>
      El responsable del tratamiento de sus datos personales es el <strong className="font-medium">Dr. Javier Barrios</strong>, con RUC <strong className="font-medium">4189490-1</strong>.
      Puede contactarnos para cualquier duda relacionada con su privacidad en: <a href="mailto:consultoriodrjavierbarrios@gmail.com" className="text-brand-accent hover:underline">consultoriodrjavierbarrios@gmail.com</a>.
    </p>

    <h4 className="text-white font-display font-bold mt-4">2. Información que Recopilamos</h4>
    <p>
      A través de nuestro formulario de contacto y pre-agendamiento, recopilamos la siguiente información personal:
      Nombre completo, número de teléfono (WhatsApp), correo electrónico, ubicación geográfica y preferencias sobre procedimientos estéticos.
    </p>

    <h4 className="text-white font-display font-bold mt-4">3. Finalidad del Uso de Datos</h4>
    <p>Sus datos serán utilizados exclusivamente para:</p>
    <ul className="list-disc pl-5 space-y-1">
      <li>Gestionar su solicitud de cita o evaluación médica.</li>
      <li>Contactarle vía WhatsApp o correo electrónico para coordinar horarios.</li>
      <li>Enviar información relevante sobre el procedimiento de su interés.</li>
    </ul>

    <h4 className="text-white font-display font-bold mt-4">4. Confidencialidad y Seguridad</h4>
    <p>
      La relación médico-paciente se basa en la confianza. Nos comprometemos a proteger su información con medidas de seguridad técnicas y organizativas para evitar su pérdida, uso indebido o acceso no autorizado. Sus datos no serán vendidos ni compartidos con terceros con fines comerciales.
    </p>

    <h4 className="text-white font-display font-bold mt-4">5. Sus Derechos</h4>
    <p>
      Usted tiene derecho a acceder, rectificar o solicitar la eliminación de sus datos de nuestros registros en cualquier momento, enviando una solicitud a nuestro correo electrónico de contacto.
    </p>
  </BaseModal>
);

export const TermsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = (props) => (
  <BaseModal {...props} title="Términos y Condiciones de Uso">
    <p><strong className="font-sans font-medium">Última actualización: {new Date().getFullYear()}</strong></p>

    <h4 className="text-white font-display font-bold mt-4">1. Naturaleza del Servicio</h4>
    <p>
      Este sitio web tiene un carácter informativo y facilita el contacto inicial con el <strong className="font-medium">Dr. Javier Barrios</strong> (RUC 4189490-1).
      El contenido aquí expuesto no sustituye en ningún caso a una consulta médica profesional presencial.
    </p>

    <h4 className="text-white font-display font-bold mt-4">2. Exención de Responsabilidad Médica</h4>
    <p>
      La información proporcionada en este sitio web sobre procedimientos quirúrgicos y estéticos es general. Los resultados de cada procedimiento pueden variar según la anatomía y condiciones particulares de cada paciente. Ninguna interacción a través de este sitio web constituye un diagnóstico médico definitivo.
    </p>

    <h4 className="text-white font-display font-bold mt-4">3. Propiedad Intelectual</h4>
    <p>
      Todos los contenidos de este sitio web, incluyendo textos, logotipos, imágenes y material gráfico, son propiedad exclusiva del Dr. Javier Barrios o de sus licenciantes, y están protegidos por las leyes de propiedad intelectual vigentes. Queda prohibida su reproducción total o parcial sin autorización expresa.
    </p>

    <h4 className="text-white font-display font-bold mt-4">4. Enlaces a Terceros</h4>
    <p>
      Este sitio puede contener enlaces a plataformas de terceros (como Instagram, Facebook, WhatsApp). No nos hacemos responsables de las políticas de privacidad o el contenido de dichos sitios externos.
    </p>

    <h4 className="text-white font-display font-bold mt-4">5. Legislación Aplicable</h4>
    <p>
      Estos términos se rigen por las leyes de la República del Paraguay. Para cualquier controversia, las partes se someten a los juzgados y tribunales de la ciudad de Asunción.
    </p>
  </BaseModal>
);