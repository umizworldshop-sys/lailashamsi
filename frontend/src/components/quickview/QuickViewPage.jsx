import { useState, useEffect } from 'react';
import {
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  RefreshCwIcon,
  CheckIcon,
  ShoppingBagIcon,
  HeartIcon,
  PlusIcon,
  MinusIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '../Icons';
import ProductCard from '../ProductCard';
import { CURRENCY_RATES } from '../../data/products';

export default function QuickViewPage({
  product,
  products = [],
  onBack,
  onNavigate,
  onSelectProduct,
  onAddToCart,
  onProceedToCheckout,
  isWishlisted,
  wishlist = [],
  onToggleWishlist,
  selectedCurrency = 'PKR'
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.selectedSize || product?.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(
    product?.selectedColor || product?.colors?.[0] || { name: 'Standard', hex: '#641E32' }
  );
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Touch swipe support for mobile gallery
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  // Reset state whenever the selected product changes
  useEffect(() => {
    if (!product) return;
    const timer = setTimeout(() => {
      setActiveImage(0);
      setSelectedSize(product.selectedSize || product.sizes?.[0] || 'M');
      setSelectedColor(product.selectedColor || product.colors?.[0] || { name: 'Standard', hex: '#641E32' });
      setQuantity(1);
      setShowSizeGuide(false);
    }, 0);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    return () => clearTimeout(timer);
  }, [product]);

  if (!product) {
    if (products.length === 0) {
      return (
        <section className="pt-24 sm:pt-36 pb-24 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh] select-none">
          <div className="relative flex items-center justify-center mb-4">
            <div className="w-14 h-14 rounded-full border-2 border-[#E8DCCB] border-t-[#641E32] border-r-[#B89B62] animate-spin" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#641E32] absolute" />
          </div>
          <span className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] text-[#641E32] uppercase">
            Loading Atelier Garment...
          </span>
          <span className="text-[10px] tracking-[0.25em] text-[#B89B62] uppercase font-semibold mt-1">
            UMI&apos;Z WORLD
          </span>
        </section>
      );
    }

    return (
      <section className="pt-24 sm:pt-36 pb-24 px-4 sm:px-8 max-w-5xl mx-auto text-center">
        <div className="bg-white rounded-3xl border border-[#E8DCCB] p-8 sm:p-16 shadow-sm space-y-4">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#B89B62] font-semibold">
            UMI&apos;Z WORLD ATELIER
          </p>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#641E32]">
            Piece Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#282321]/70 max-w-md mx-auto">
            The garment you are looking for may have been moved or is no longer in our active catalog.
          </p>
          <button
            type="button"
            onClick={() => (onNavigate ? onNavigate('/') : onBack && onBack())}
            className="mt-4 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#641E32] hover:bg-[#4A1624] text-[#FAF5EC] text-xs uppercase tracking-[0.2em] font-semibold transition-all cursor-pointer shadow-md"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span>Back to Storefront</span>
          </button>
        </div>
      </section>
    );
  }

  const imagesList =
    Array.isArray(product.images) && product.images.filter(Boolean).length > 0
      ? product.images.filter(Boolean)
      : [product.image || '/Logo.jpeg'];
  const totalImages = imagesList.length;
  const safeActiveIdx = totalImages > 0 ? activeImage % totalImages : 0;

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance && totalImages > 1) {
      // Swiped Left -> Next Image
      setActiveImage((prev) => (prev + 1) % totalImages);
    } else if (distance < -minSwipeDistance && totalImages > 1) {
      // Swiped Right -> Previous Image
      setActiveImage((prev) => (prev - 1 + totalImages) % totalImages);
    }
  };

  const curr = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES.PKR;
  const convertedPrice = Math.round((Number(product.price) || 0) * curr.rate);
  const convertedOriginalPrice = Math.round((Number(product.originalPrice) || 0) * curr.rate);
  const discountPercent =
    convertedOriginalPrice > convertedPrice && convertedPrice > 0
      ? Math.round(((convertedOriginalPrice - convertedPrice) / convertedOriginalPrice) * 100)
      : 0;

  const handleAddToCartClick = () => {
    onAddToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity,
      convertedPrice
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  // Related products from same category (or other products)
  const relatedProducts = products
    .filter((p) => String(p.id) !== String(product.id) && p.category === product.category)
    .slice(0, 4);

  const fallbackRelated =
    relatedProducts.length > 0
      ? relatedProducts
      : products.filter((p) => String(p.id) !== String(product.id)).slice(0, 4);

  return (
    <section className="pt-28 sm:pt-32 lg:pt-36 pb-32 sm:pb-24 bg-[#FAF5EC] min-h-screen">
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6">
        
        {/* ================= TOP NAVIGATION / BREADCRUMB BAR ================= */}
        <div className="flex items-center justify-between pb-3 mb-3 sm:mb-4 border-b border-[#E8DCCB]">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => (onBack ? onBack() : onNavigate && onNavigate('/'))}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#641E32] text-[#282321] hover:text-[#FAF5EC] border border-[#E8DCCB] text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all shadow-sm cursor-pointer"
          >
            <ChevronLeftIcon className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          {/* Desktop Breadcrumbs (Hidden on small mobile to avoid cluttered wrapping) */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#282321]/70">
            <button
              type="button"
              onClick={() => (onNavigate ? onNavigate('/') : onBack && onBack())}
              className="hover:text-[#641E32] font-semibold transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => {
                if (!onNavigate) return;
                if (product.category === 'stitched') onNavigate('/stitched');
                else if (product.category === 'unstitched') onNavigate('/unstitched');
                else if (product.category === 'babies') onNavigate('/baby-clothes');
                else onNavigate('/categories', product.category);
              }}
              className="hover:text-[#641E32] font-semibold capitalize transition-colors cursor-pointer"
            >
              {product.categoryLabel || product.category || 'Collection'}
            </button>
            <span>/</span>
            <span className="text-[#641E32] font-bold truncate max-w-xs">
              {product.title}
            </span>
          </div>

          {/* Top Right Wishlist Toggle */}
          <button
            type="button"
            onClick={() => onToggleWishlist(product.id)}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              isWishlisted
                ? 'bg-[#641E32] text-[#FAF5EC] border-[#641E32] shadow-sm'
                : 'bg-white text-[#282321] border-[#E8DCCB] hover:border-[#641E32]'
            }`}
            title={isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist"
          >
            <HeartIcon className="w-4 h-4" filled={isWishlisted} />
          </button>
        </div>

        {/* ================= MAIN PRODUCT QUICKVIEW SHOWCASE ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 lg:p-7 border border-[#E8DCCB] shadow-sm">
          
          {/* ================= LEFT: TOUCH-SWIPEABLE GALLERY ================= */}
          <div className="md:col-span-5 space-y-2.5 sm:space-y-3">
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative aspect-[3/4] max-h-[400px] sm:max-h-[460px] mx-auto rounded-xl sm:rounded-2xl overflow-hidden bg-[#F7F3EB] border border-[#E8DCCB] shadow-sm group select-none"
            >
              {/* Base Cover Image */}
              <img
                src={imagesList[0]}
                alt={product.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/Logo.jpeg';
                }}
                className="absolute inset-0 w-full h-full object-cover object-top z-0"
              />

              {/* Overlay Carousel Slides */}
              {imagesList.slice(1).map((imgSrc, i) => {
                const slideIdx = i + 1;
                return (
                  <img
                    key={`${slideIdx}-${imgSrc}`}
                    src={imgSrc}
                    alt={`${product.title} - view ${slideIdx + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = imagesList[0] || '/Logo.jpeg';
                    }}
                    className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-300 z-[1] ${
                      safeActiveIdx === slideIdx ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  />
                );
              })}

              {/* Single Top Left Badge (Prevents duplicate badge glitch) */}
              {(product.tag || discountPercent > 0) && (
                <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                  <span className="text-[9px] font-bold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full shadow-md bg-[#641E32] text-[#FAF5EC] border border-[#B89B62]/40">
                    {product.tag || `-${discountPercent}% OFF`}
                  </span>
                </div>
              )}

              {/* Photo Indicator Pill */}
              {totalImages > 1 && (
                <div className="absolute bottom-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono tracking-wider font-semibold pointer-events-none">
                  {safeActiveIdx + 1} / {totalImages}
                </div>
              )}

              {/* Desktop-only Hover Prev / Next Buttons (Hidden on mobile to keep tap/swipe clean) */}
              {totalImages > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveImage((safeActiveIdx - 1 + totalImages) % totalImages)}
                    aria-label="Previous photo"
                    className="hidden sm:flex absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-[#641E32] text-[#282321] hover:text-white shadow-md items-center justify-center transition-all cursor-pointer opacity-80 hover:opacity-100"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImage((safeActiveIdx + 1) % totalImages)}
                    aria-label="Next photo"
                    className="hidden sm:flex absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-[#641E32] text-[#282321] hover:text-white shadow-md items-center justify-center transition-all cursor-pointer opacity-80 hover:opacity-100"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip (Touch scrollable) */}
            {totalImages > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center px-0.5">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-13 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                      safeActiveIdx === idx
                        ? 'border-[#641E32] scale-105 shadow-md ring-2 ring-[#641E32]/30'
                        : 'border-[#E8DCCB] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= RIGHT: SPECIFICATIONS & ACTIONS ================= */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-3.5 sm:space-y-4">
              
              {/* Category Kicker & Reviews */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-bold text-[#B89B62]">
                  {product.categoryLabel || 'Luxury Eastern Wear'}
                </span>
                <div className="flex items-center gap-1.5 bg-[#FAF5EC] px-2.5 py-0.5 rounded-full border border-[#E8DCCB]">
                  <StarIcon className="w-3 h-3 fill-[#B89B62] text-[#B89B62]" />
                  <span className="text-xs font-bold text-[#282321]">{product.rating || '5.0'}</span>
                  <span className="text-[10px] text-[#282321]/60">
                    ({product.reviewsCount || 18})
                  </span>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="font-cinzel text-lg sm:text-2xl font-bold text-[#641E32] uppercase leading-snug">
                {product.title}
              </h1>

              {/* Pricing Row */}
              <div className="flex flex-wrap items-baseline gap-2.5 pt-0.5">
                <span className="font-cinzel text-xl sm:text-2xl font-bold text-[#282321]">
                  {curr.symbol}
                  {convertedPrice.toLocaleString()}
                </span>
                {convertedOriginalPrice > convertedPrice && (
                  <span className="text-xs sm:text-sm text-[#282321]/45 line-through">
                    {curr.symbol}
                    {convertedOriginalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-[10px] text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                  ✓ In Stock
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-xs text-[#282321]/80 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Garment Specifications Box */}
              <div className="p-3 bg-[#FAF5EC] rounded-xl border border-[#E8DCCB] text-xs space-y-1.5 shadow-sm">
                <div className="flex justify-between border-b border-[#E8DCCB]/60 pb-1">
                  <strong className="text-[#641E32]">Fabric Details:</strong>
                  <span className="text-[#282321]/85 font-medium">
                    {product.fabric || 'Pure Luxury Embroidered Fabric'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#E8DCCB]/60 pb-1">
                  <strong className="text-[#641E32]">Package Includes:</strong>
                  <span className="text-[#282321]/85 font-medium">
                    {product.pieces || '3 Piece Complete Suit'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong className="text-[#641E32]">Care Instructions:</strong>
                  <span className="text-[#282321]/85">Dry Clean Recommended</span>
                </div>
              </div>

              {/* Colour Selection */}
              {Array.isArray(product.colors) && product.colors.length > 0 && (
                <div>
                  <label className="text-[11px] font-bold text-[#282321] uppercase tracking-wider block mb-1.5">
                    Colour:{' '}
                    <span className="font-semibold text-[#641E32] capitalize">
                      {selectedColor?.name}
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        style={{ backgroundColor: color.hex }}
                        className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                          selectedColor?.name === color.name
                            ? 'border-[#641E32] scale-110 shadow-md ring-2 ring-[#641E32]/40'
                            : 'border-white hover:scale-105 shadow-sm'
                        }`}
                        title={color.name}
                        aria-label={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection & Size Chart */}
              {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-[#282321] uppercase tracking-wider">
                      Select Size: <span className="text-[#641E32]">{selectedSize}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowSizeGuide(!showSizeGuide)}
                      className="text-[11px] text-[#641E32] underline hover:text-[#4A1624] font-semibold cursor-pointer"
                    >
                      {showSizeGuide ? 'Hide Size Chart' : 'View Size Chart'}
                    </button>
                  </div>

                  {showSizeGuide && (
                    <div className="p-2.5 sm:p-3 mb-2.5 bg-[#FAF5EC] rounded-xl border border-[#B89B62]/50 text-xs animate-reveal-up overflow-x-auto shadow-sm">
                      <table className="w-full text-center">
                        <thead>
                          <tr className="border-b border-[#E8DCCB] text-[#282321]/70">
                            <th className="py-1">Size</th>
                            <th className="py-1">Bust</th>
                            <th className="py-1">Waist</th>
                            <th className="py-1">Hip</th>
                            <th className="py-1">Length</th>
                          </tr>
                        </thead>
                        <tbody className="text-[#282321]">
                          <tr><td className="font-bold py-0.5">XS</td><td>34&quot;</td><td>27&quot;</td><td>37&quot;</td><td>46&quot;</td></tr>
                          <tr><td className="font-bold py-0.5">S</td><td>36&quot;</td><td>29&quot;</td><td>39&quot;</td><td>46&quot;</td></tr>
                          <tr><td className="font-bold py-0.5">M</td><td>39&quot;</td><td>32&quot;</td><td>42&quot;</td><td>47&quot;</td></tr>
                          <tr><td className="font-bold py-0.5">L</td><td>42&quot;</td><td>35&quot;</td><td>45&quot;</td><td>47&quot;</td></tr>
                          <tr><td className="font-bold py-0.5">XL</td><td>45&quot;</td><td>38&quot;</td><td>48&quot;</td><td>48&quot;</td></tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-[44px] h-9 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-[#641E32] text-[#FAF5EC] shadow-sm scale-105'
                            : 'bg-[#FAF5EC] border border-[#E8DCCB] text-[#282321] hover:border-[#641E32]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Add to Bag (Desktop & in-page view) */}
              <div className="flex items-center gap-2.5 pt-1">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-[#E8DCCB] rounded-xl bg-[#FAF5EC] p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-[#282321] hover:text-[#641E32] cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2.5 text-xs font-bold text-[#282321]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-[#282321] hover:text-[#641E32] cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  type="button"
                  onClick={handleAddToCartClick}
                  className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl bg-[#641E32] hover:bg-[#4A1624] text-[#FAF5EC] text-xs uppercase tracking-[0.16em] font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  {addedSuccess ? (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBagIcon className="w-4 h-4" />
                      <span>
                        Add to Bag • {curr.symbol}
                        {(convertedPrice * quantity).toLocaleString()}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Instant Buy It Now Button */}
              {onProceedToCheckout && (
                <button
                  type="button"
                  onClick={() => {
                    const newItem = {
                      ...product,
                      selectedSize,
                      selectedColor,
                      quantity,
                      convertedPrice
                    };
                    onAddToCart(newItem);
                    onProceedToCheckout({ items: [newItem] });
                  }}
                  className="w-full py-3 px-5 rounded-xl bg-[#282321] hover:bg-[#641E32] text-[#FAF5EC] text-xs uppercase tracking-[0.18em] font-bold transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer active:scale-95"
                >
                  <span>Buy It Now • Express Checkout</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>

            {/* Guarantees Footer */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E8DCCB] text-center text-[10px] sm:text-[11px] text-[#282321]/75">
              <div className="flex flex-col items-center gap-0.5">
                <TruckIcon className="w-3.5 h-3.5 text-[#B89B62]" />
                <span>Nationwide COD</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-[#B89B62]" />
                <span>100% Pure Fabrics</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <RefreshCwIcon className="w-3.5 h-3.5 text-[#B89B62]" />
                <span>14-Day Exchanges</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RELATED / YOU MAY ALSO LIKE ================= */}
        {fallbackRelated.length > 0 && (
          <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-[#E8DCCB]">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-[#B89B62] font-semibold mb-0.5">
                  CURATED FOR YOU
                </p>
                <h2 className="font-cinzel text-base sm:text-xl font-bold text-[#282321] uppercase">
                  You May Also Like
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
              {fallbackRelated.map((relProduct, idx) => (
                <ProductCard
                  key={relProduct.id || idx}
                  product={relProduct}
                  onQuickView={(p) => onSelectProduct && onSelectProduct(p)}
                  onAddToCart={onAddToCart}
                  isWishlisted={wishlist.includes(relProduct.id)}
                  onToggleWishlist={onToggleWishlist}
                  selectedCurrency={selectedCurrency}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= STICKY MOBILE ACTION BAR ================= */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF5EC]/95 backdrop-blur-md border-t border-[#E8DCCB] px-4 py-2.5 shadow-[0_-4px_25px_rgba(40,35,33,0.12)] flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-[#B89B62] font-bold">
            {selectedSize} {selectedColor?.name ? `• ${selectedColor.name}` : ''}
          </span>
          <span className="font-cinzel text-base font-bold text-[#641E32] leading-tight">
            {curr.symbol}{(convertedPrice * quantity).toLocaleString()}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCartClick}
          className="flex-1 py-2.5 px-4 rounded-xl bg-[#641E32] hover:bg-[#4A1624] text-[#FAF5EC] text-xs uppercase tracking-[0.16em] font-bold shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
        >
          {addedSuccess ? (
            <>
              <CheckIcon className="w-4 h-4" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <ShoppingBagIcon className="w-4 h-4" />
              <span>Add to Bag</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
