import React from 'react';

export default function BrandLogo({ className = "h-10 w-10 sm:h-12 sm:w-12", showText = true, isScrolled = false }) {
  return (
    <div className="flex items-center gap-3 cursor-pointer group">
      {/* Official Luxury Logo Badge */}
      <img 
        src="/logo.png" 
        alt="Umi'z World" 
        onError={(e) => {
          if (e.target.src.indexOf('Logo.jpeg') === -1) {
            e.target.src = '/Logo.jpeg';
          }
        }}
        className={`${className} rounded-xl object-contain border border-[#D4AF37]/50 shadow-md group-hover:scale-105 group-hover:border-[#D4AF37] transition-all`}
      />

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col text-left">
          <span className={`font-cinzel tracking-[0.2em] text-base sm:text-xl font-bold uppercase transition-colors leading-tight ${
            isScrolled ? 'text-[#1A1A1A] group-hover:text-[#B76E79]' : 'text-white group-hover:text-[#E6B8BF]'
          }`}>
            UMI&apos;Z WORLD
          </span>
          <span className="text-[7.5px] uppercase tracking-[0.3em] text-[#B76E79] font-semibold">
            Umiz World Collection
          </span>
        </div>
      )}
    </div>
  );
}
