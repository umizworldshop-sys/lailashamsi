import { useState } from 'react';
import ProductCard from './ProductCard';
import { ArrowRightIcon, CheckIcon } from './Icons';

function getSaleProducts(products) {
  const discounted = products
    .filter(
      (p) =>
        p.isOnSale === true ||
        (p.originalPrice && p.originalPrice > p.price) ||
        (p.tag &&
          (p.tag.toLowerCase().includes('sale') ||
            p.tag.toLowerCase().includes('favourite') ||
            p.tag.toLowerCase().includes('special')))
    )
    .sort((a, b) => {
      const discA = a.originalPrice && a.originalPrice > a.price ? a.originalPrice - a.price : 0;
      const discB = b.originalPrice && b.originalPrice > b.price ? b.originalPrice - b.price : 0;
      return discB - discA;
    });

  if (discounted.length >= 4) {
    return discounted.slice(0, 4);
  }

  const fallbackList = products.map((p, idx) => {
    if (p.originalPrice && p.originalPrice > p.price) return p;
    return {
      ...p,
      originalPrice: p.originalPrice || Math.round(p.price * 1.25),
      tag: idx % 2 === 0 ? '-25% Off' : 'Seasonal Sale'
    };
  });

  return fallbackList.slice(0, 4);
}

export default function HomeSalesSection({
  products = [],
  onQuickView,
  onAddToCart,
  wishlist = [],
  onToggleWishlist,
  selectedCurrency = 'PKR',
  onExploreAll,
  saleDiscountPercent = 30
}) {
  const [copiedCode, setCopiedCode] = useState(false);
  const saleProducts = getSaleProducts(products);

  const handleCopyCode = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText('UMIZ10');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  return (
    <section className="py-14 sm:py-20 bg-[#FAF5EC] border-b border-[#E8DCCB] relative overflow-hidden">
      
      {/* Subtle atmospheric glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#641E32]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#B89B62]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 pb-5 sm:pb-6 border-b border-[#E8DCCB] gap-4">
          <div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#641E32] tracking-wide">
              Seasonal Sale & Special Offers
            </h2>
            <p className="text-xs sm:text-sm text-[#282321]/80 font-normal mt-1.5 sm:mt-2 max-w-xl leading-relaxed">
              Enjoy flat {saleDiscountPercent || 30}% off on handcrafted Pakistani Eastern Wear, embroidered lawn suits, luxury pret, and festive attire.
            </p>
          </div>
        </div>

        {/* 4-Item Product Cards Grid: 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {saleProducts.map((product, index) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              selectedCurrency={selectedCurrency}
              staggerClass={`stagger-${index + 1}`}
            />
          ))}
        </div>

        {/* Explore All Sales Button -> Connects directly to /sales */}
        <div className="mt-10 sm:mt-14 text-center">
          <button
            type="button"
            onClick={onExploreAll}
            className="inline-flex items-center gap-2 sm:gap-3 px-7 sm:px-9 py-3.5 sm:py-4 bg-[#641E32] hover:bg-[#4a1624] text-[#FAF5EC] text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group"
          >
            <span>Explore All Sale Outfits</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
}
