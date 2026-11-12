import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from './Icons';

const DEFAULT_HERO_SLIDES = [
  {
    id: 1,
    tag: 'Velvet Formals 2026',
    title: 'Grace in Every Thread',
    subtitle: 'Handcrafted Velvet & Zari Peshwas with Intricate Dabka Work',
    image: 'https://res.cloudinary.com/jpea5mb0/image/upload/v1793790101/lailashamsi_products/kfbb3t86uhm5nkg5zn9q.jpg',
    fallbackImage: 'https://res.cloudinary.com/jpea5mb0/image/upload/v1793790101/lailashamsi_products/kfbb3t86uhm5nkg5zn9q.jpg',
    ctaText: 'Shop Velvet Collection',
    targetRoute: '/categories'
  },
  {
    id: 2,
    tag: 'Festive Pret & Couture',
    title: 'Festive Pret & Couture',
    subtitle: 'Pure Chiffon, Fine Lawn & Hand-Embroidered Luxury Silks',
    image: 'https://res.cloudinary.com/jpea5mb0/image/upload/v1793790095/lailashamsi_products/dp34oped5by7svtpzj7y.jpg',
    fallbackImage: 'https://res.cloudinary.com/jpea5mb0/image/upload/v1793790095/lailashamsi_products/dp34oped5by7svtpzj7y.jpg',
    ctaText: 'Shop New Arrivals',
    targetRoute: '/new-arrivals'
  },
  {
    id: 3,
    tag: 'Royal Heritage Formals',
    title: 'Timeless Eastern Elegance',
    subtitle: 'Flared Kalidar Silhouettes & Gilded Gotta Kinari Craft',
    image: 'https://res.cloudinary.com/jpea5mb0/image/upload/v1793790109/lailashamsi_hero/pyxu5ecrkjo7v2lzzchu.jpg',
    fallbackImage: 'https://res.cloudinary.com/jpea5mb0/image/upload/v1793790109/lailashamsi_hero/pyxu5ecrkjo7v2lzzchu.jpg',
    ctaText: 'Explore Collection',
    targetRoute: '/categories'
  }
];

export default function Hero({ onExploreClick, onLookbookClick, customSlides = [] }) {
  const slidesList = Array.isArray(customSlides) && customSlides.filter(s => s && s.image).length > 0
    ? customSlides.filter(s => s && s.image)
    : DEFAULT_HERO_SLIDES;
  const totalSlides = slidesList.length;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const safeSlideIdx = totalSlides > 0 ? currentSlide % totalSlides : 0;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay - precisely 3 seconds interval
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused, totalSlides]);

  // Mobile Swipe Gesture Handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const active = slidesList[safeSlideIdx] || slidesList[0];
  
  // Extended array so sliding multiple images continuously is smooth
  const displaySlides = [...slidesList, ...slidesList, ...slidesList]; 

  return (
    <section 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden select-none bg-[#110e10] text-[#FAF5EC] pt-[125px] sm:pt-[135px] lg:pt-[140px] xl:pt-[148px] pb-12 sm:pb-16 lg:pb-20"
    >
      {/* Inline styles for responsive carousel math */}
      <style>{`
        .hero-slider-track {
          --slide-w: 82vw;
          --slide-g: 16px;
        }
        @media (min-width: 640px) {
          .hero-slider-track { --slide-w: 360px; --slide-g: 20px; }
        }
        @media (min-width: 1024px) {
          .hero-slider-track { --slide-w: 380px; --slide-g: 24px; }
        }
        @media (min-width: 1280px) {
          .hero-slider-track { --slide-w: 420px; --slide-g: 28px; }
        }
        @media (min-width: 1536px) {
          .hero-slider-track { --slide-w: 460px; --slide-g: 32px; }
        }
      `}</style>

      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#641E32]/15 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Full-Width Layout Container */}
      <div className="flex flex-col lg:flex-row items-center w-full max-w-[2000px] mx-auto">
        
        {/* ======================================================== */}
        {/* LEFT PART (TEXT & CTAs) - 42% Width                     */}
        {/* ======================================================== */}
        <div className="w-full lg:w-[42%] flex-shrink-0 px-5 sm:px-10 lg:pl-14 xl:pl-20 z-10 mb-8 lg:mb-0">
          
          <div key={`text-${safeSlideIdx}`} className="animate-fade-in-up">
            <span 
              style={{ fontFamily: 'var(--font-heading)' }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#D4AF37]/35 bg-black/40 text-[#D4AF37] text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase rounded-full mb-5 backdrop-blur-sm shadow-sm"
            >
              <SparklesIcon className="w-3 h-3 text-[#D4AF37]" />
              {active.tag || 'Luxury Collection'}
            </span>

            <h1 
              style={{ fontFamily: 'var(--font-heading)' }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-wide leading-[1.15] drop-shadow-md mb-4"
            >
              {active.title || 'Grace in Every Thread'}
            </h1>

            <p 
              style={{ fontFamily: 'var(--font-body)' }}
              className="text-sm sm:text-base lg:text-lg text-[#FAF5EC]/75 font-normal leading-relaxed max-w-md mb-7"
            >
              {active.subtitle || 'Handcrafted Pakistani Eastern Wear with Intricate Artisan Details'}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onExploreClick}
                style={{ fontFamily: 'var(--font-heading)' }}
                className="group flex items-center gap-3 px-6 sm:px-7 py-3 sm:py-3.5 bg-[#641E32] hover:bg-[#852541] active:scale-95 text-white text-xs sm:text-sm uppercase tracking-[0.18em] font-semibold transition-all duration-300 shadow-[0_4px_20px_rgba(100,30,50,0.4)] cursor-pointer"
              >
                <span>{active.ctaText || 'Shop Collection'}</span>
                <ArrowRightIcon className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onLookbookClick}
                style={{ fontFamily: 'var(--font-heading)' }}
                className="px-6 sm:px-7 py-3 sm:py-3.5 bg-transparent hover:bg-white/10 active:scale-95 text-white border border-white/30 hover:border-white text-xs sm:text-sm uppercase tracking-[0.18em] font-semibold transition-all duration-300 cursor-pointer"
              >
                New Arrivals
              </button>
            </div>
          </div>

          {/* Navigation Controls & Indicators */}
          <div className="flex items-center gap-4 mt-8 lg:mt-14">
            <div className="flex items-center gap-3">
              <button
                onClick={prevSlide}
                className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-full bg-black/30 hover:bg-white hover:text-black text-white transition-all duration-300 cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>

              <span 
                style={{ fontFamily: 'var(--font-heading)' }}
                className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#FAF5EC]/80 px-1"
              >
                <span className="text-[#D4AF37]">{String(safeSlideIdx + 1).padStart(2, '0')}</span>
                <span className="text-white/40 mx-1.5">/</span>
                <span>{String(totalSlides).padStart(2, '0')}</span>
              </span>

              <button
                onClick={nextSlide}
                className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-full bg-black/30 hover:bg-white hover:text-black text-white transition-all duration-300 cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
            
            {/* Custom Bar Indicator */}
            <div className="hidden sm:flex items-center ml-2 gap-2">
              {slidesList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-[3px] rounded-full transition-all duration-500 cursor-pointer ${
                    safeSlideIdx === idx ? 'w-8 bg-[#D4AF37]' : 'w-3 bg-white/25 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT PART (SLIDER / 3 IMAGES CAROUSEL) - 58% Width     */}
        {/* ======================================================== */}
        <div 
          className="w-full lg:w-[58%] relative overflow-hidden pl-4 sm:pl-8 lg:pl-4 pr-5 sm:pr-8 lg:pr-12 xl:pr-16"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="hero-slider-track flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ 
              gap: 'var(--slide-g)',
              transform: `translateX(calc(-${safeSlideIdx} * (var(--slide-w) + var(--slide-g))))` 
            }}
          >
            {displaySlides.map((slide, idx) => {
              const isActive = idx === safeSlideIdx;
              
              return (
                <div
                  key={`${slide.id}-${idx}`}
                  style={{ width: 'var(--slide-w)' }}
                  className={`flex-shrink-0 relative rounded-2xl overflow-hidden transition-all duration-700 ease-out cursor-grab active:cursor-grabbing
                    ${isActive 
                      ? 'opacity-100 scale-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 border border-white/15 ring-1 ring-white/10' 
                      : 'opacity-50 scale-[0.95] blur-[1px] hover:opacity-80 hover:blur-none z-0 border border-transparent'
                    }
                  `}
                >
                  {/* Clean height to stay clear of navbar and bottom */}
                  <div className="w-full h-[450px] sm:h-[500px] lg:h-[540px] xl:h-[580px] relative bg-[#1F181D]">
                    
                    {/* Floating Luxury Tag on Active Card */}
                    {isActive && (
                      <span 
                        style={{ fontFamily: 'var(--font-heading)' }}
                        className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase rounded-full shadow-lg"
                      >
                        ✦ {slide.tag || 'HIGH FASHION PRET'}
                      </span>
                    )}

                    {/* Direct Prev / Next arrows over active slide for effortless desktop navigation */}
                    {isActive && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all opacity-75 hover:opacity-100 cursor-pointer"
                          aria-label="Previous slide"
                        >
                          <ChevronLeftIcon className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all opacity-75 hover:opacity-100 cursor-pointer"
                          aria-label="Next slide"
                        >
                          <ChevronRightIcon className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    <img
                      src={slide.image}
                      alt={slide.title || "Umi'z World Collection"}
                      loading={idx < 3 ? 'eager' : 'lazy'}
                      fetchPriority={idx === safeSlideIdx ? 'high' : 'auto'}
                      decoding="async"
                      onError={(e) => {
                        e.target.onerror = null;
                        if (slide.fallbackImage && e.target.src !== slide.fallbackImage) {
                          e.target.src = slide.fallbackImage;
                        } else {
                          e.target.src = '/Logo.jpeg';
                        }
                      }}
                      className="w-full h-full object-cover object-top transition-transform duration-1000 ease-out hover:scale-105"
                    />
                    
                    {/* Subtle bottom vignette gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#110e10]/80 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
