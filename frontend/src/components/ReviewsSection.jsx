import React, { useState, useEffect, useRef } from 'react';
import { StarIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

const REVIEWS = [
  {
    id: 1,
    name: 'Ayla Tariq',
    city: 'Lahore',
    outfit: 'Gul-e-Noor Chiffon Suit',
    rating: 5,
    comment: 'The organza dupatta and delicate embroidery are stunning. Received so many compliments at my family event!'
  },
  {
    id: 2,
    name: 'Zara Hameed',
    city: 'Karachi',
    outfit: 'Zahra Velvet Kalidar',
    rating: 5,
    comment: 'Fabric weight and tilla stitching are top quality. The parcel arrived in Karachi in 2 days in beautiful packaging.'
  },
  {
    id: 3,
    name: 'Mahnoor Khan',
    city: 'Islamabad',
    outfit: 'Mah-e-Nau Lawn Pret',
    rating: 5,
    comment: 'Breathable pure lawn, accurate sizing, and very neat finishing. Exactly as shown on the website!'
  },
  {
    id: 4,
    name: 'Fatima Noor',
    city: 'Rawalpindi',
    outfit: 'Siyah Embroidered 3-Piece',
    rating: 5,
    comment: 'Fabric is 100% pure and embroidery is incredibly neat. Cash on Delivery was super fast!'
  },
  {
    id: 5,
    name: 'Hira Shah',
    city: 'Faisalabad',
    outfit: 'Noor-e-Haya Luxury Suit',
    rating: 5,
    comment: 'The stitching quality and color vibrancy are even better than the pictures. Totally worth every rupee!'
  },
  {
    id: 6,
    name: 'Zainab Bilal',
    city: 'Multan',
    outfit: 'Handcrafted Festive Pret',
    rating: 5,
    comment: 'Customer support on WhatsApp helped me choose the exact right size. Very polite and professional service.'
  },
  {
    id: 7,
    name: 'Dua Siddiqui',
    city: 'Peshawar',
    outfit: 'Silk Organza Kalidar',
    rating: 5,
    comment: 'Received my parcel in premium luxury packaging. Perfect fitting and high-end fabric feel.'
  },
  {
    id: 8,
    name: 'Anum Jawad',
    city: 'Sialkot',
    outfit: 'Chiffon Party Wear',
    rating: 5,
    comment: 'Stitching and dupatta laces are so delicate and luxurious. Umi\'z World has become my favorite brand!'
  }
];

export default function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  // Touch swipe support
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Responsive visible count
  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCount(1);
      } else if (width < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const maxIndex = Math.max(0, REVIEWS.length - visibleCount);

  // Keep index within bounds if resized
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Auto-play timer (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, maxIndex]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section 
      className="py-14 sm:py-16 bg-[#FAF5EC] text-[#282321] border-b border-[#E8DCCB] relative overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clean Centered Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#641E32]">
            What Our Customers Say
          </h2>
          <div className="w-14 h-0.5 bg-[#B89B62] mx-auto mt-2.5" />
        </div>

        {/* Carousel Viewport Container */}
        <div className="relative">
          {/* Desktop Left Float Arrow */}
          <button
            onClick={handlePrev}
            aria-label="Previous review"
            className="hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-[#E8DCCB] bg-white text-[#641E32] hover:bg-[#641E32] hover:text-[#FAF5EC] hover:border-[#641E32] shadow-md transition-all duration-300 items-center justify-center cursor-pointer active:scale-95"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          {/* Carousel Viewport */}
          <div 
            className="overflow-hidden w-full py-2 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out -mx-2.5 sm:-mx-3"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`
              }}
            >
              {REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2.5 sm:px-3"
                >
                  <div className="h-full bg-white rounded-2xl p-6 sm:p-7 border border-[#E8DCCB] shadow-sm hover:shadow-lg hover:border-[#B89B62] transition-all duration-300 flex flex-col justify-between group">
                    <div>
                      {/* 5 Stars + Outfit Pill */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-0.5">
                          {[...Array(rev.rating)].map((_, i) => (
                            <StarIcon key={i} className="w-4 h-4 fill-[#B89B62] text-[#B89B62]" />
                          ))}
                        </div>
                        <span className="text-[10px] text-[#641E32] bg-[#FAF5EC] border border-[#E8DCCB] px-2.5 py-0.5 rounded-full font-medium truncate max-w-[140px]">
                          {rev.outfit}
                        </span>
                      </div>

                      {/* Authentic Customer Quote */}
                      <p className="text-xs sm:text-[13px] text-[#282321]/80 leading-relaxed italic mb-5">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>

                    {/* Author & City */}
                    <div className="pt-4 border-t border-[#E8DCCB] flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-cinzel font-bold text-[#641E32] group-hover:text-[#B89B62] transition-colors">
                          {rev.name}
                        </h4>
                        <p className="text-[10px] text-[#282321]/55 flex items-center gap-1 mt-0.5">
                          <CheckIcon className="w-2.5 h-2.5 text-[#641E32]" />
                          <span>Verified Buyer, {rev.city}</span>
                        </p>
                      </div>
                      <span className="text-[10.5px] text-[#B89B62] font-semibold bg-[#FAF5EC] border border-[#E8DCCB]/60 px-2 py-0.5 rounded-md">
                        ★ 5.0
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Right Float Arrow */}
          <button
            onClick={handleNext}
            aria-label="Next review"
            className="hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-[#E8DCCB] bg-white text-[#641E32] hover:bg-[#641E32] hover:text-[#FAF5EC] hover:border-[#641E32] shadow-md transition-all duration-300 items-center justify-center cursor-pointer active:scale-95"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel Pagination Controls (Centered below) */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={handlePrev}
            aria-label="Previous review"
            className="md:hidden w-9 h-9 rounded-full border border-[#E8DCCB] bg-white text-[#641E32] hover:bg-[#641E32] hover:text-[#FAF5EC] hover:border-[#641E32] shadow-sm transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95 shrink-0"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx 
                    ? 'w-7 bg-[#641E32]' 
                    : 'w-2 bg-[#E8DCCB] hover:bg-[#B89B62]'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            aria-label="Next review"
            className="md:hidden w-9 h-9 rounded-full border border-[#E8DCCB] bg-white text-[#641E32] hover:bg-[#641E32] hover:text-[#FAF5EC] hover:border-[#641E32] shadow-sm transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95 shrink-0"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
