import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'gold';
  centered?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'light',
  centered = false
}) => {
  // Height-based sizes for the name image
  const imageSizes = {
    sm: 'h-[14px] md:h-4',
    md: 'h-4 md:h-5',
    lg: 'h-5 md:h-6',
    xl: 'h-6 md:h-7 lg:h-8'
  };

  // Text sizes for CIRUGÍA PLÁSTICA subtitle - more proportional to name
  const textSizes = {
    sm: 'text-[7px] md:text-[8px] tracking-[0.2em]',
    md: 'text-[8px] md:text-[9px] tracking-[0.22em]',
    lg: 'text-[9px] md:text-[10px] tracking-[0.25em]',
    xl: 'text-[10px] md:text-[11px] lg:text-xs tracking-[0.25em]'
  };

  // Gap between name and subtitle
  const gaps = {
    sm: 'gap-[2px]',
    md: 'gap-[3px]',
    lg: 'gap-1',
    xl: 'gap-1'
  };

  const alignment = centered ? 'items-center' : 'items-start';

  return (
    <div className={`flex flex-col ${gaps[size]} ${alignment} ${className}`}>
      <img
        src="/logo-name-web.png"
        alt="Javier Barrios"
        className={`${imageSizes[size]} w-auto object-contain brightness-0 invert`}
      />
      <span className={`${textSizes[size]} text-brand-gold font-sans font-normal uppercase`}>
        Cirugía Plástica
      </span>
    </div>
  );
};
