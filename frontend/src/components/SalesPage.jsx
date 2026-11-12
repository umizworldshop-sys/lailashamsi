import { useState, useMemo } from 'react';
import { CATEGORIES } from '../data/products';
import ProductCard from './ProductCard';
import { SparklesIcon } from './Icons';

// Helper to calculate exact discount percentage
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

export default function SalesPage({
  products,
  onQuickView,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  selectedCurrency = 'PKR',
  saleDiscountPercent = 30,
  saleDiscountType = 'FLAT'
}) {
  const [selectedSubCat, setSelectedSubCat] = useState('all');

  const saleProducts = useMemo(() => {
    return (products || [])
      .filter((p) => {
        const discPct = getDiscountPercent(p);
        // STRICT: Must have a genuine discount (> 0%) or originalPrice > price
        const hasRealDiscount = discPct > 0 || (p.isOnSale === true && p.originalPrice && Number(p.originalPrice) > Number(p.price));
        if (!hasRealDiscount) return false;

        // If it's a pure non-sale item (discount 0%), do not display on Sales page
        if (p.isOnSale === false && discPct <= 0) return false;

        if (selectedSubCat === 'all') return true;
        if (selectedSubCat === 'female' || selectedSubCat === 'women') {
          return p.category !== 'babies' && p.stitchType !== 'babies' && p.category !== 'kids';
        }
        if (selectedSubCat === 'babies' || selectedSubCat === 'kids') {
          return p.category === 'babies' || p.stitchType === 'babies' || p.category === 'kids';
        }
        if (selectedSubCat === 'unstitched') {
          return p.stitchType === 'unstitched' || p.category === 'unstitched' || p.categoryLabel?.toLowerCase().includes('unstitched');
        }
        if (selectedSubCat === 'stitched' || selectedSubCat === 'ready-to-wear') {
          return (p.stitchType === 'stitched' || p.category === 'stitched' || p.category === 'ready-to-wear' || p.category === 'luxury-formals') && p.category !== 'babies' && p.category !== 'kids';
        }
        return p.category === selectedSubCat || p.stitchType === selectedSubCat;
      })
      .sort((a, b) => {
        // High discount on top, then lower, then lowest (e.g. 50% -> 40% -> 30% -> 20% -> 10%)
        const discA = getDiscountPercent(a);
        const discB = getDiscountPercent(b);
        if (discB !== discA) {
          return discB - discA;
        }

        // Secondary sort: highest cash savings in PKR
        const saveA = (Number(a.originalPrice) || Number(a.price)) - Number(a.price);
        const saveB = (Number(b.originalPrice) || Number(b.price)) - Number(b.price);
        return saveB - saveA;
      });
  }, [products, selectedSubCat]);

  return (
    <div className="min-h-screen bg-[#FAF5EC] text-[#282321] pt-28 sm:pt-36 lg:pt-40 pb-16 selection:bg-[#B89B62] selection:text-white font-sans">
      
      {/* ================= HIGH-IMPACT SALE BANNER (MOBILE OPTIMIZED) ================= */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 mb-6 sm:mb-10 mt-1 sm:mt-3">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-[#641E32] via-[#7d2640] to-[#501325] text-[#FAF5EC] p-5 sm:p-8 lg:p-12 border border-[#B89B62]/40 shadow-xl">
          
          {/* Background Decorative Glow */}
          <div className="absolute -right-10 -bottom-10 w-72 h-72 sm:w-96 sm:h-96 bg-[#B89B62]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            
            {/* Left Content */}
            <div className="space-y-2 sm:space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 border border-[#B89B62]/60 text-[#B89B62] text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold shadow-sm">
                <SparklesIcon className="w-3 h-3" />
                Limited Time Offer
              </div>

              <h1 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-[#FAF5EC] leading-tight">
                Grand Seasonal <span className="text-[#B89B62]">Sale</span>
              </h1>

              <p className="text-[11px] sm:text-xs text-[#E8DCCB] font-light leading-relaxed line-clamp-2 sm:line-clamp-none">
                Discover unstitched masterpieces, luxury stitched pret, and festive attire at exclusive promotional prices.
              </p>

              <div className="pt-1 flex items-center gap-2">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-md border border-white/15 text-[#FAF5EC] font-semibold">
                  Stitched &middot; Unstitched &middot; Pret
                </span>
              </div>
            </div>

            {/* Right Badge (FLAT OFF Style) */}
            <div className="flex md:flex-col items-baseline md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-white/15 pt-3 md:pt-0 md:pl-8 shrink-0">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#B89B62] font-semibold block mb-0.5">
                Special Discount
              </span>
              <div className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-wider">
                {saleDiscountType || 'FLAT'} <span className="text-[#B89B62]">{saleDiscountPercent || 30}%</span> OFF
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#E8DCCB]/80 uppercase tracking-widest mt-0.5 hidden sm:block">
                {saleDiscountType === 'UP TO' ? 'On Selected Sale Outfits' : "On Entire Umi'z World Collection"}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CATEGORY FILTER PILLS (NO SCROLL, WRAPS CLEANLY) ================= */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#E8DCCB] pb-3 sm:pb-4">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {CATEGORIES.map((tab) => {
              const displayName = tab.label || tab.name;
              const isActive = selectedSubCat === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedSubCat(tab.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold rounded-full uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#641E32] text-[#FAF5EC] shadow-md border border-[#B89B62]/40'
                      : 'bg-white border border-[#E8DCCB] text-[#282321]/80 hover:border-[#641E32] hover:text-[#641E32]'
                  }`}
                >
                  {displayName}
                </button>
              );
            })}
          </div>

          <span className="text-[11px] sm:text-xs text-[#282321]/60 font-medium shrink-0">
            {saleProducts.length} Outfits Available
          </span>
        </div>
      </section>

      {/* ================= PRODUCT GRID (2-COLUMN RESPONSIVE ON MOBILE) ================= */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {saleProducts.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-[#E8DCCB]">
            <p className="text-sm font-cinzel text-[#641E32] font-semibold">No pieces found in this category.</p>
            <p className="text-xs text-[#282321]/60 mt-1">Please explore other collections or check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {saleProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                selectedCurrency={selectedCurrency}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}