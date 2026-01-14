import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SocialButtonProps {
  href?: string;
  onClick?: () => void;
  icon: LucideIcon | React.FC<{ className?: string, size?: number }>;
  label: string;
  variant?: 'light' | 'dark' | 'gold';
  className?: string;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ 
  href, 
  onClick,
  icon: Icon, 
  label, 
  variant = 'light',
  className = ''
}) => {
  const baseClasses = `
    flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl 
    transition-all duration-300 transform hover:-translate-y-1 shadow-sm 
    font-medium tracking-wide text-sm uppercase cursor-pointer
  `;

  const variants = {
    light: 'bg-white/80 text-brand-dark hover:bg-white border border-stone-200 hover:border-brand-gold/50 backdrop-blur-sm',
    dark: 'bg-stone-900/60 text-stone-200 hover:bg-stone-800 hover:text-white border border-stone-800 hover:border-brand-gold/30 backdrop-blur-sm',
    gold: 'bg-gradient-to-r from-brand-gold to-brand-goldDark text-white hover:brightness-110 border border-transparent shadow-lg shadow-brand-gold/20'
  };

  const Component = href ? 'a' : 'button';
  const props = href 
    ? { href, target: "_blank", rel: "noopener noreferrer" } 
    : { onClick, type: "button" as "button" };

  return (
    <Component
      {...props}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      <Icon size={20} className={variant === 'gold' ? 'text-white' : (variant === 'dark' ? 'text-brand-gold' : 'text-brand-dark')} />
      <span>{label}</span>
    </Component>
  );
};