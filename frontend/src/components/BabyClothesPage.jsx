import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { SparklesIcon } from './Icons';

const SUB_CATEGORIES = [
  { id: 'all', name: 'All Baby & Kids Clothes' },
  { id: 'girls', name: 'Girls Angrakhas & Lehengas' },
  { id: 'boys', name: 'Boys Kurta Sets' },
  { id: 'eid', name: 'Eid Festive Edits' }
];

export default function BabyClothesPage({
  products = [],
  onQuickView,
  onAddToCart,
  wishlist = [],
  onToggleWishlist,
  selectedCurrency = 'PKR'
}) {
  const [selectedSubCat, setSelectedSubCat] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Filter baby & kids clothes
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const isBaby = p.category === 'babies' || p.category === 'kids' || p.category === 'baby-clothes' || p.stitchType === 'babies';
        if (!isBaby) return false;

        if (selectedSubCat === 'all') return true;
        const textToSearch = `${p.title} ${p.fabric || ''} ${p.description || ''} ${p.tag || ''}`.toLowerCase();
        
        if (selectedSubCat === 'boys') {
          return textToSearch.includes('boy') || textToSearch.includes('kurta');
        }
        if (selectedSubCat === 'girls') {
          return textToSearch.includes('angrakha') || textToSearch.includes('peshwas') || textToSearch.includes('ghagra') || textToSearch.includes('princess');
        }
        if (selectedSubCat === 'eid') {
          return textToSearch.includes('eid') || textToSearch.includes('festive');
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
        return (b.id || 0) - (a.id || 0);
      });
  }, [products, selectedSubCat, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAF5EC] text-[#282321] pt-36 sm:pt-40 lg:pt-44 pb-24 selection:bg-[#641E32] selection:text-[#FAF5EC] font-sans">
      
      {/* ================= EDITORIAL BABY CLOTHES HERO BANNER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 mt-2 sm:mt-4">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#641E32] via-[#7d2640] to-[#501325] text-[#FAF5EC] p-8 sm:p-14 lg:p-16 border border-[#B89B62]/40 shadow-2xl">
          
          {/* Background Decorative Glow */}
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-[#B89B62]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            {/* Left Content */}
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-[#B89B62]/60 text-[#B89B62] text-[10px] uppercase tracking-[0.25em] font-bold shadow-sm">
                <SparklesIcon className="w-3.5 h-3.5" />
                ✦ Little Shamsi Atelier
              </div>
              
              <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-bold tracking-wide text-[#FAF5EC] leading-tight">
                Baby & Kids <span className="text-[#B89B62]">Eastern Wear</span>
              </h1>
              
              <p className="text-xs sm:text-sm text-[#E8DCCB] font-light leading-relaxed max-w-2xl">
                Precious festive ensembles crafted specially for your little ones—featuring gentle hypoallergenic cotton silk linings, lightweight gotta kinari, and comfortable traditional silhouettes.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-md border border-white/20 text-[#FAF5EC] font-semibold">
                  Ages 0 to 6 Years &middot; Gentle Soft Seams
                </span>
              </div>
            </div>

            {/* Right Counter Badge */}
            <div className="flex lg:flex-col items-center justify-center lg:items-end text-left lg:text-right border-t lg:border-t-0 lg:border-l border-white/15 pt-6 lg:pt-0 lg:pl-10">
              <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#B89B62] font-semibold block mb-1">
                Kids Edit
              </span>
              <div className="font-cinzel text-4xl sm:text-6xl font-extrabold text-white tracking-wider">
                LITTLE <span className="text-[#B89B62]">SHAMSI</span>
              </div>
              <span className="text-[11px] text-[#E8DCCB]/80 uppercase tracking-widest mt-1">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Outfit Available' : 'Outfits Available'}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FILTER & SORT CONTROL BAR ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="bg-white rounded-2xl p-3 sm:px-5 sm:py-3.5 border border-[#E8DCCB] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Subcategory Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {SUB_CATEGORIES.map((tab) => {
              const isActive = selectedSubCat === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedSubCat(tab.id)}
                  className={`px-4 py-2 text-[10px] sm:text-xs font-semibold rounded-full uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#641E32] text-[#FAF5EC] shadow-md border border-[#B89B62]/40'
                      : 'bg-[#FAF5EC]/60 border border-[#E8DCCB] text-[#282321]/80 hover:border-[#641E32] hover:text-[#641E32] hover:bg-white'
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 border-[#E8DCCB] pt-3 md:pt-0">
            <span className="text-[10px] uppercase tracking-widest text-[#282321]/60 font-bold whitespace-nowrap">
              Sort By
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-[#FAF5EC] hover:bg-white border border-[#E8DCCB] text-xs rounded-xl pl-4 pr-8 py-2 text-[#282321] focus:outline-none focus:border-[#641E32] font-medium shadow-xs transition-all cursor-pointer"
              >
                <option value="featured">Featured Collection</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Favourites</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#641E32]">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= PRODUCT GRID & EMPTY STATE ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                selectedCurrency={selectedCurrency}
                staggerClass={`stagger-${(index % 6) + 1}`}
              />
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden text-center py-20 px-6 bg-white rounded-3xl border border-[#E8DCCB] max-w-xl mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#FAF5EC] border border-[#B89B62]/30 flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="w-6 h-6 text-[#B89B62]" />
            </div>
            <h3 className="font-cinzel text-xl font-bold text-[#641E32]">
              No Baby Clothes Found
            </h3>
            <p className="text-xs text-[#282321]/70 mt-1 mb-6 max-w-xs mx-auto">
              Please choose another filter to view our baby outfits.
            </p>
            <button
              onClick={() => setSelectedSubCat('all')}
              className="px-6 py-2.5 bg-[#641E32] text-[#FAF5EC] rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[#4a1624] transition-all"
            >
              View All Baby Clothes
            </button>
          </div>
        )}
      </section>

    </div>
  );
}

