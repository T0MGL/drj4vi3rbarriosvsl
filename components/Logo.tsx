import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'gold' | 'brand' | 'accent';
  centered?: boolean;
  useOfficialLogo?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'light',
  centered = false,
  useOfficialLogo = false
}) => {
  // Height-based sizes for logo
  const logoSizes = {
    sm: 'h-8 md:h-10',
    md: 'h-10 md:h-12',
    lg: 'h-12 md:h-14',
    xl: 'h-14 md:h-16 lg:h-20'
  };

  // For text-based version
  const imageSizes = {
    sm: 'h-[14px] md:h-4',
    md: 'h-4 md:h-5',
    lg: 'h-5 md:h-6',
    xl: 'h-6 md:h-7 lg:h-8'
  };

  const textSizes = {
    sm: 'text-[7px] md:text-[8px] tracking-[0.2em]',
    md: 'text-[8px] md:text-[9px] tracking-[0.22em]',
    lg: 'text-[9px] md:text-[10px] tracking-[0.25em]',
    xl: 'text-[10px] md:text-[11px] lg:text-xs tracking-[0.25em]'
  };

  const gaps = {
    sm: 'gap-[2px]',
    md: 'gap-[3px]',
    lg: 'gap-1',
    xl: 'gap-1'
  };

  const alignment = centered ? 'items-center' : 'items-start';

  // Brand colors based on variant
  const textColor = variant === 'gold' || variant === 'accent'
    ? 'text-brand-accent'
    : variant === 'brand'
    ? 'text-brand-primary'
    : 'text-brand-light';

  // Use official logo from brand guidelines
  if (useOfficialLogo) {
    return (
      <img
        src="/logos/logo-principal.png"
        alt="Dr. Javier Barrios - Cirugía Plástica"
        className={`${logoSizes[size]} w-auto object-contain ${className}`}
      />
    );
  }

  // Fallback to text-based version
  return (
    <div className={`flex flex-col ${gaps[size]} ${alignment} ${className}`}>
      <img
        src="/logo-name-web.png"
        alt="Javier Barrios"
        className={`${imageSizes[size]} w-auto object-contain brightness-0 invert`}
      />
      <span className={`${textSizes[size]} ${textColor} font-sans font-normal uppercase`}>
        Cirugía Plástica
      </span>
    </div>
  );
};
