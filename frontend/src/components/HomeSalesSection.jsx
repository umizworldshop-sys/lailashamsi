import { useState } from 'react';
import ProductCard from './ProductCard';
import { ArrowRightIcon, CheckIcon } from './Icons';

function getDiscountPercent(p) {
  if (!p) return 0;
  const price = Number(p.price) || 0;
  const orig = Number(p.originalPrice) || 0;
  if (orig > price && price > 0) {
    return Math.round(((orig - price) / orig) * 100);
  }
  if (p.discountPercent && Number(p.discountPercent) > 0) {
    return Number(p.discountPercent);
  }
  return 0;
}

function getSaleProducts(products) {
  return (products || [])
    .filter((p) => {
      const disc = getDiscountPercent(p);
      return disc > 0 || (p.isOnSale === true && p.originalPrice && Number(p.originalPrice) > Number(p.price));
    })
    .sort((a, b) => {
      const discA = getDiscountPercent(a);
      const discB = getDiscountPercent(b);
      if (discB !== discA) return discB - discA;
      const saveA = (Number(a.originalPrice) || Number(a.price)) - Number(a.price);
      const saveB = (Number(b.originalPrice) || Number(b.price)) - Number(b.price);
      return saveB - saveA;
    })
    .slice(0, 4);
}

export default function HomeSalesSection({
  products = [],
  onQuickView,
  onAddToCart,
  wishlist = [],
  onToggleWishlist,
  selectedCurrency = 'PKR',
  onExploreAll,
  saleDiscountPercent = 30,
  saleDiscountType = 'FLAT'
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
              Enjoy {saleDiscountType ? saleDiscountType.toLowerCase() : 'flat'} {saleDiscountPercent || 30}% off on handcrafted Pakistani Eastern Wear, embroidered lawn suits, luxury pret, and festive attire.
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
