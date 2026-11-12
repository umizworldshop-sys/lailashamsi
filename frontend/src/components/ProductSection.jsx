import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { SparklesIcon, ArrowRightIcon } from './Icons';

export default function ProductSection({
  products,
  activeCategory,
  onSelectCategory,
  onQuickView,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  selectedCurrency = 'PKR',
  searchQuery,
  onClearSearch,
  title = "New Arrivals",
  badge = "Discover Timeless Pakistani Elegance",
  onExploreAll,
  maxProducts = 5
}) {
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      let matchesCategory = false;
      if (activeCategory === 'all') {
        matchesCategory = true;
      } else if (activeCategory === 'female' || activeCategory === 'women') {
        matchesCategory = p.category !== 'babies' && p.stitchType !== 'babies';
      } else if (activeCategory === 'babies' || activeCategory === 'kids') {
        matchesCategory = p.category === 'babies' || p.stitchType === 'babies';
      } else if (activeCategory === 'unstitched') {
        matchesCategory = p.stitchType === 'unstitched' || p.category === 'unstitched' || p.categoryLabel?.toLowerCase().includes('unstitched');
      } else if (activeCategory === 'stitched' || activeCategory === 'ready-to-wear') {
        matchesCategory = (p.stitchType === 'stitched' || p.category === 'stitched' || p.category === 'ready-to-wear' || p.category === 'luxury-formals') && p.category !== 'babies';
      } else {
        matchesCategory = p.category === activeCategory || p.stitchType === activeCategory;
      }

      const q = searchQuery ? searchQuery.trim().toLowerCase() : '';
      const matchesSearch = !q ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.fabric && p.fabric.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.categoryLabel && p.categoryLabel.toLowerCase().includes(q)) ||
        (Array.isArray(p.colors) && p.colors.some(c => (c?.name || '').toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.id - b.id;
    });
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <section id="collection" className="py-14 sm:py-20 bg-[#FAF5EC] border-b border-[#E8DCCB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-8 sm:mb-10 pb-5 sm:pb-6 border-b border-[#E8DCCB]">
          <div className="inline-flex items-center gap-2 text-[#B89B62] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] mb-1.5 sm:mb-2">
            <SparklesIcon className="w-3.5 h-3.5 text-[#B89B62]" />
            <span>{badge}</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#641E32] tracking-wide">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[#282321]/80 mt-1.5 max-w-2xl leading-relaxed">
            Find your perfect look with our collection of Pakistani suits, embroidered outfits, and timeless Eastern essentials.
          </p>
        </div>

        {/* Search Feedback */}
        {searchQuery && (
          <div className="mb-6 p-3 bg-white border border-[#E8DCCB] rounded-xl flex items-center justify-between text-xs shadow-sm">
            <span className="text-[#282321]">
              Active query: <strong className="text-[#641E32]">"{searchQuery}"</strong> ({filteredProducts.length} items found)
            </span>
            <button
              onClick={onClearSearch}
              className="text-[#641E32] font-bold hover:underline"
            >
              Reset Search
            </button>
          </div>
        )}

        {/* Product Grid - Exactly 5 cards on desktop row */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-3 sm:gap-x-5 gap-y-6 sm:gap-y-10 max-w-7xl mx-auto">
              {filteredProducts.slice(0, maxProducts).map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  searchQuery={searchQuery}
                  onQuickView={onQuickView}
                  onAddToCart={onAddToCart}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  selectedCurrency={selectedCurrency}
                  staggerClass={`stagger-${(index % 5) + 1}`}
                />
              ))}
            </div>

            {/* Explore All New Arrivals Button */}
            {onExploreAll && (
              <div className="mt-10 sm:mt-14 text-center">
                <button
                  type="button"
                  onClick={onExploreAll}
                  className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#641E32] hover:bg-[#4a1624] text-[#FAF5EC] text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] font-semibold rounded-full shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group"
                >
                  <span>Explore All New Arrivals</span>
                  <ArrowRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8DCCB] max-w-md mx-auto p-6">
            <p className="font-cinzel text-base font-semibold text-[#641E32] mb-1">No Outfits Found</p>
            <p className="text-xs text-[#282321]/70 mb-4">Try selecting another collection or clearing your search filters.</p>
            <button
              onClick={() => {
                onSelectCategory('all');
                if (onClearSearch) onClearSearch();
              }}
              className="px-5 py-2 bg-[#641E32] text-[#FAF5EC] rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-[#4a1624] transition-colors"
            >
              Show All Collections
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
