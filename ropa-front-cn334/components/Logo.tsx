import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="relative w-20 h-20">
        <Image 
          src="/kcsp.png" 
          alt="KCSP Logo" 
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="flex flex-col">
        <span className="text-5xl font-bold tracking-tight text-[#111827]">KCSP</span>
        <span className="text-2xl font-normal text-[#374151]">RoPA</span>
      </div>
    </div>
  );
};

export default Logo;
