import { useState, useEffect } from 'react';
import { HeartIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';
import { CURRENCY_RATES } from '../data/products';

export default function ProductCard({
  product,
  searchQuery = '',
  onQuickView,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  selectedCurrency = 'PKR',
  staggerClass = 'stagger-1'
}) {
  const productColors = Array.isArray(product.colors) && product.colors.length > 0
    ? product.colors
    : [{ name: 'Standard', hex: '#641E32' }];

  const [selectedSize, setSelectedSize] = useState(
    Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes[0] : 'M'
  );
  
  const [selectedColor, setSelectedColor] = useState(() => {
    if (product.selectedColor) return product.selectedColor;
    if (searchQuery && typeof searchQuery === 'string') {
      const q = searchQuery.trim().toLowerCase();
      const matched = productColors.find((c) => (c?.name || '').toLowerCase().includes(q));
      if (matched) return matched;
    }
    return productColors[0];
  });

  // When searchQuery or product changes, update selectedColor if matching
  useEffect(() => {
    if (searchQuery && typeof searchQuery === 'string') {
      const q = searchQuery.trim().toLowerCase();
      const matched = productColors.find((c) => (c?.name || '').toLowerCase().includes(q));
      if (matched) {
        setSelectedColor(matched);
        return;
      }
    }
    if (product.selectedColor) {
      setSelectedColor(product.selectedColor);
    }
  }, [searchQuery, product.id, product.selectedColor]);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [heartPopping, setHeartPopping] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const imagesList = Array.isArray(product.images) && product.images.filter(Boolean).length > 0
    ? product.images.filter(Boolean)
    : [product.image || '/Logo.jpeg'];
  const totalImages = imagesList.length;
  const safeImgIdx = totalImages > 0 ? currentImgIdx % totalImages : 0;

  // Automatic carousel slide when hovering over the card (Desktop pointer devices only)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia && !window.matchMedia('(hover: hover)').matches) {
      return;
    }
    if (!isHovered || totalImages <= 1) return;

    const interval = setInterval(() => {
      setCurrentImgIdx((prev) => (prev + 1) % totalImages);
    }, 1400);

    return () => clearInterval(interval);
  }, [isHovered, totalImages]);

  const handleCardMouseEnter = () => {
    if (typeof window !== 'undefined' && window.matchMedia && !window.matchMedia('(hover: hover)').matches) {
      return;
    }
    setIsHovered(true);
    if (totalImages > 1) {
      setCurrentImgIdx(1);
    }
  };

  const handleCardMouseLeave = () => {
    setIsHovered(false);
    setShowSizePicker(false);
    setCurrentImgIdx(0);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev + 1) % totalImages);
  };

  const curr = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES.PKR;
  const convertedPrice = Math.round(product.price * curr.rate);
  const convertedOriginalPrice = Math.round(product.originalPrice * curr.rate);
  const discount =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : (Number(product.discountPercent) || 0);

  const isOutOfStock = Boolean(product.isOutOfStock) || (product.stock !== undefined && Number(product.stock) <= 0);

  const handleHeartClick = (e) => {
    e.stopPropagation();
    setHeartPopping(true);
    onToggleWishlist(product.id);
    setTimeout(() => setHeartPopping(false), 500);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    onAddToCart({
      ...product,
      selectedSize,
      selectedColor,
      convertedPrice,
      quantity: 1
    });
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setShowSizePicker(false);
    }, 1200);
  };

  return (
    <article
      className={`group relative flex flex-col h-full ${staggerClass} animate-card-glide`}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
    >
      {/* ================= IMAGE & FLOATING ACTIONS ================= */}
      <div
        className="relative w-full aspect-[4/5] overflow-hidden bg-[#F7F3EB] cursor-pointer rounded-xl transition-shadow hover:shadow-lg"
        onClick={() => onQuickView({ ...product, selectedColor, selectedSize })}
      >
        {/* Base Cover Image (Always visible underneath so the frame is NEVER blank) */}
        <img
          src={imagesList[0]}
          alt={product.title}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/Logo.jpeg';
          }}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 z-0"
        />

        {/* Overlay Carousel Slides (Crossfade smoothly over the base image) */}
        {imagesList.slice(1).map((imgSrc, i) => {
          const slideIdx = i + 1;
          const isSlideActive = safeImgIdx === slideIdx;
          return (
            <img
              key={`${slideIdx}-${imgSrc}`}
              src={imgSrc}
              alt={`${product.title} - view ${slideIdx + 1}`}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = imagesList[0] || '/Logo.jpeg';
              }}
              className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-500 ease-in-out group-hover:scale-105 z-[1] ${
                isSlideActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            />
          );
        })}

        {/* Carousel Left / Right Controls & Dots (Desktop only when multiple images exist) */}
        {totalImages > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              aria-label="Previous product image"
              className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 hover:bg-[#641E32] text-[#282321] hover:text-white shadow-md backdrop-blur-sm items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              aria-label="Next product image"
              className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 hover:bg-[#641E32] text-[#282321] hover:text-white shadow-md backdrop-blur-sm items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>

            {/* Carousel Dots Indicator (Desktop only on hover) */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="hidden sm:flex absolute bottom-2.5 group-hover:bottom-12 inset-x-0 z-10 items-center justify-center gap-1.5 transition-all duration-300 pointer-events-auto opacity-0 group-hover:opacity-100"
            >
              {imagesList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImgIdx(idx);
                  }}
                  aria-label={`View image ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all shadow-sm cursor-pointer ${
                    safeImgIdx === idx
                      ? 'w-4 bg-[#641E32]'
                      : 'w-1.5 bg-white/80 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Minimal Luxury Sale/Status Tag */}
        {isOutOfStock ? (
          <span className="absolute top-2.5 left-2.5 z-10 bg-[#17131B]/95 text-rose-200 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.16em] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md shadow-md border border-rose-500/40 backdrop-blur-xs flex items-center gap-1.5 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            OUT OF STOCK
          </span>
        ) : (discount > 0 || product.tag) && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-[#641E32] text-white text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.16em] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md shadow-sm border border-[#D4AF37]/30 pointer-events-none">
            {product.tag || `-${discount}%`}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleHeartClick}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 p-1.5 sm:p-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-white hover:scale-110 ${
            heartPopping ? 'animate-heart-pop scale-125' : ''
          } ${
            isWishlisted
              ? 'text-[#641E32] opacity-100'
              : 'text-gray-400 opacity-90 sm:opacity-0 group-hover:opacity-100 hover:text-[#641E32]'
          }`}
        >
          <HeartIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 drop-shadow-sm" filled={isWishlisted} />
        </button>

        {/* ================= COMPACT DESKTOP HOVER ACTION BAR ================= */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="hidden sm:block absolute inset-x-3 bottom-3 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out"
        >
          {isOutOfStock ? (
            <div className="flex h-8 bg-[#18121E]/95 backdrop-blur-sm rounded-md shadow-lg border border-white/10 overflow-hidden">
              <button
                type="button"
                onClick={() => onQuickView({ ...product, selectedColor, selectedSize })}
                className="flex-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                Quick View
              </button>
              <div className="w-[1px] bg-white/10"></div>
              <button
                type="button"
                disabled
                className="flex-1 text-[9px] font-bold uppercase tracking-[0.15em] text-rose-300 bg-rose-950/70 cursor-not-allowed opacity-90"
              >
                Sold Out
              </button>
            </div>
          ) : showSizePicker ? (
            <div className="bg-white/95 backdrop-blur-sm p-2.5 rounded-lg shadow-lg border border-white/60">
              <p className="text-[8.5px] uppercase tracking-[0.2em] text-gray-500 mb-2 text-center font-semibold">
                Select Size
              </p>
              <div className="flex justify-center flex-wrap gap-1 mb-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`min-w-[26px] h-6 px-1 text-[9px] font-medium tracking-wider rounded border transition-colors ${
                      selectedSize === sz
                        ? 'bg-[#641E32] border-[#641E32] text-white'
                        : 'bg-transparent border-gray-300 text-gray-700 hover:border-[#641E32]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              <button
                onClick={handleQuickAdd}
                disabled={justAdded}
                className={`w-full h-7 rounded text-[9px] font-semibold uppercase tracking-widest flex items-center justify-center gap-1 transition-colors ${
                  justAdded
                    ? 'bg-[#641E32] text-white'
                    : 'bg-[#641E32] text-white hover:bg-[#4A1624]'
                }`}
              >
                {justAdded ? (
                  <>
                    <CheckIcon className="w-3 h-3" /> Added
                  </>
                ) : (
                  'Confirm & Add'
                )}
              </button>
            </div>
          ) : (
            /* 🔥 SLEEK SPLIT BUTTON (Perfect for small cards) 🔥 */
            <div className="flex h-8 bg-white/95 backdrop-blur-sm rounded-md shadow-lg border border-white/60 overflow-hidden">
              <button
                type="button"
                onClick={() => onQuickView({ ...product, selectedColor, selectedSize })}
                className="flex-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#282321] hover:bg-gray-50 transition-colors"
              >
                Quick View
              </button>
              
              {/* Divider Line */}
              <div className="w-[1px] bg-gray-200"></div>
              
              <button
                type="button"
                onClick={() => setShowSizePicker(true)}
                className="flex-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#641E32] hover:bg-[#641E32] hover:text-white transition-colors"
              >
                Add to Bag
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= DETAILS SECTION ================= */}
      <div className="pt-3.5 flex flex-col flex-1 gap-1.5">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <p className="text-[9.5px] uppercase tracking-widest text-[#B89B62] font-semibold mb-1">
              {product.categoryLabel}
            </p>
            <h3
              onClick={() => onQuickView({ ...product, selectedColor, selectedSize })}
              className="font-cinzel text-[13px] sm:text-[14px] font-bold leading-snug text-[#282321] cursor-pointer hover:text-[#641E32] transition-colors line-clamp-2"
              title={product.title}
            >
              {product.title}
            </h3>
          </div>
          
          <div className="flex flex-col items-end text-right">
            <span className="text-[13px] sm:text-[14px] font-bold text-[#641E32] tracking-wide">
              {curr.symbol}{convertedPrice.toLocaleString()}
            </span>
            {convertedOriginalPrice > convertedPrice && (
              <span className="text-[10px] text-gray-400 line-through mt-0.5">
                {curr.symbol}{convertedOriginalPrice.toLocaleString()}
              </span>
            )}
            {isOutOfStock && (
              <span className="text-[9px] font-bold text-rose-600 uppercase tracking-wider mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                Out of Stock
              </span>
            )}
          </div>
        </div>

        <div className="mt-auto pt-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            {productColors.slice(0, 4).map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(color);
                }}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={color.name}
                className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                  selectedColor?.name === color.name
                    ? 'ring-2 ring-offset-1 ring-[#641E32] scale-110 shadow-xs'
                    : 'ring-1 ring-gray-300 hover:scale-105'
                }`}
              />
            ))}
            {selectedColor?.name && selectedColor.name !== 'Standard' && (
              <span className="text-[9px] text-[#641E32] font-semibold tracking-wide ml-0.5 truncate max-w-[80px]">
                {selectedColor.name}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView({ ...product, selectedColor, selectedSize });
            }}
            className="sm:hidden text-[9px] font-bold uppercase tracking-widest text-[#641E32] hover:text-[#4A1624] transition-colors underline underline-offset-2"
          >
            Quick View
          </button>
        </div>
      </div>
    </article>
  );
}