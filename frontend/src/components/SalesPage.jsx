import { useState, useMemo } from 'react';
import { CATEGORIES } from '../data/products';
import ProductCard from './ProductCard';
import { SparklesIcon } from './Icons';

export default function SalesPage({
  products,
  onQuickView,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  selectedCurrency = 'PKR',
  saleDiscountPercent = 30
}) {
  const [selectedSubCat, setSelectedSubCat] = useState('all');

  const saleProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Must be on sale or have a discounted originalPrice
        const isSaleItem = p.isOnSale === true || (p.originalPrice && Number(p.originalPrice) > Number(p.price)) || p.tag?.toLowerCase().includes('sale') || p.tag?.toLowerCase().includes('off');
        if (!isSaleItem) return false;

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
        // Higher discount items appear first
        const discA = a.originalPrice && a.originalPrice > a.price ? (a.originalPrice - a.price) : 0;
        const discB = b.originalPrice && b.originalPrice > b.price ? (b.originalPrice - b.price) : 0;
        return discB - discA;
      });
  }, [products, selectedSubCat]);

  return (
    <div className="min-h-screen bg-[#FAF5EC] text-[#282321] pt-36 sm:pt-40 lg:pt-44 pb-20 selection:bg-[#B89B62] selection:text-white font-sans">
      
      {/* ================= HIGH-IMPACT SALE BANNER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 mt-2 sm:mt-4">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#641E32] via-[#7d2640] to-[#501325] text-[#FAF5EC] p-8 sm:p-14 lg:p-16 border border-[#B89B62]/40 shadow-2xl">
          
          {/* Background Decorative Glow */}
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-[#B89B62]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            {/* Left Content */}
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-[#B89B62]/60 text-[#B89B62] text-[10px] uppercase tracking-[0.25em] font-bold shadow-sm">
                <SparklesIcon className="w-3.5 h-3.5" />
                Limited Time Offer
              </div>

              <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-bold tracking-wide text-[#FAF5EC] leading-tight">
                Grand Seasonal <span className="text-[#B89B62]">Sale</span>
              </h1>

              <p className="text-xs sm:text-sm text-[#E8DCCB] font-light leading-relaxed">
                Discover unstitched masterpieces, luxury stitched pret, and adorable traditional wear for little ones at exclusive festive prices.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-md border border-white/20 text-[#FAF5EC] font-semibold">
                  Stitched &middot; Unstitched &middot; Baby Wear
                </span>
              </div>
            </div>

            {/* Right Badge (FLAT OFF Style) */}
            <div className="flex lg:flex-col items-center justify-center lg:items-end text-left lg:text-right border-t lg:border-t-0 lg:border-l border-white/15 pt-6 lg:pt-0 lg:pl-10">
              <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#B89B62] font-semibold block mb-1">
                Special Discount
              </span>
              <div className="font-cinzel text-4xl sm:text-6xl font-extrabold text-white tracking-wider">
                FLAT <span className="text-[#B89B62]">{saleDiscountPercent || 30}%</span> OFF
              </div>
              <span className="text-[11px] text-[#E8DCCB]/80 uppercase tracking-widest mt-1">
                On Entire Umi&apos;z World Collection
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CATEGORY FILTER PILLS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {CATEGORIES.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSubCat(tab.id)}
                className={`px-4 py-2 text-[10px] sm:text-xs font-semibold rounded-full uppercase tracking-widest transition-all whitespace-nowrap ${
                  selectedSubCat === tab.id
                    ? 'bg-[#641E32] text-[#FAF5EC] shadow-md border border-[#B89B62]/40'
                    : 'bg-white border border-[#E8DCCB] text-[#282321]/80 hover:border-[#641E32] hover:text-[#641E32]'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <span className="text-xs text-[#282321]/60 font-light hidden sm:inline shrink-0 pl-4">
            {saleProducts.length} Pieces Available
          </span>
        </div>
      </section>

      {/* ================= PRODUCT GRID ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {saleProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8DCCB]">
            <p className="text-sm font-cinzel text-[#641E32] font-semibold">No pieces found in this category.</p>
            <p className="text-xs text-[#282321]/60 mt-1">Please explore other collections or check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {saleProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onQuickView={() => onQuickView(product)}
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