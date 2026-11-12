import React, { useState, useEffect, useMemo } from 'react';
import { CATEGORIES } from '../data/products';
import ProductCard from './ProductCard';
import { SparklesIcon } from './Icons';

export default function CategoriesPage({
  products,
  onQuickView,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  selectedCurrency = 'PKR',
  subFilter = 'all'
}) {
  const [selectedCategory, setSelectedCategory] = useState(subFilter || 'all');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    if (subFilter) {
      setSelectedCategory(subFilter);
    }
  }, [subFilter]);

  const displayCategories = CATEGORIES.filter(c => c.id !== 'all');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'female' || selectedCategory === 'women') {
        return p.category !== 'babies' && p.stitchType !== 'babies';
      }
      if (selectedCategory === 'babies' || selectedCategory === 'kids') {
        return p.category === 'babies' || p.stitchType === 'babies';
      }
      if (selectedCategory === 'unstitched') {
        return p.stitchType === 'unstitched' || p.category === 'unstitched' || p.categoryLabel?.toLowerCase().includes('unstitched');
      }
      if (selectedCategory === 'stitched' || selectedCategory === 'ready-to-wear') {
        return (p.stitchType === 'stitched' || p.category === 'stitched' || p.category === 'ready-to-wear' || p.category === 'luxury-formals') && p.category !== 'babies';
      }

      return p.category === selectedCategory || p.stitchType === selectedCategory;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      return (a.id || 0) - (b.id || 0);
    });
  }, [products, selectedCategory, sortBy]);

  return (
    <div className="bg-[#FAF5EC] text-[#282321] pt-28 sm:pt-36 pb-16 sm:pb-20">
      
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B89B62]/15 border border-[#B89B62]/40 text-[#641E32] text-[10px] uppercase tracking-widest font-semibold mb-3">
          <SparklesIcon className="w-3.5 h-3.5 text-[#B89B62]" />
          Discover Timeless Pakistani Elegance
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#641E32] tracking-wide">
          Discover Our Collections
        </h1>
        <div className="w-20 h-0.5 bg-[#B89B62] mx-auto mt-4 mb-3" />
        <p className="text-xs sm:text-sm text-[#282321]/80 font-normal max-w-xl mx-auto leading-relaxed">
          Find your perfect look with our collection of Pakistani suits, embroidered outfits, and timeless Eastern essentials.
        </p>
      </section>

      {/* Main 4 Category Cards - Perfectly Balanced */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
              className={`group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border ${
                selectedCategory === cat.id ? 'border-[#641E32] ring-2 ring-[#641E32]' : 'border-[#E8DCCB]'
              }`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#282321]/90 via-[#282321]/35 to-transparent" />
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-[#FAF5EC]">
                <span className="text-[9px] uppercase tracking-widest text-[#B89B62] font-semibold">
                  {(() => {
                    const count = (products || []).filter(p => {
                      if (cat.id === 'female') return p.category !== 'babies' && p.category !== 'kids';
                      if (cat.id === 'stitched') return p.category === 'stitched' || p.stitchType === 'stitched';
                      if (cat.id === 'unstitched') return p.category === 'unstitched' || p.stitchType === 'unstitched';
                      if (cat.id === 'babies') return p.category === 'babies' || p.category === 'kids';
                      return p.category === cat.id;
                    }).length;
                    return count > 0 ? `${count} ${count === 1 ? 'Design' : 'Designs'}` : 'Artisanal Collection';
                  })()}
                </span>
                <h3 className="font-cinzel text-lg font-bold tracking-wide mt-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#E8DCCB]/90 font-normal mt-1 line-clamp-2">
                  {cat.subtitle}
                </p>
                <span className="text-[10px] uppercase font-semibold text-[#B89B62] group-hover:text-[#FAF5EC] mt-2 flex items-center gap-1">
                  {selectedCategory === cat.id ? '✓ Filter Active' : 'Explore Collection →'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filter Tabs & Sort Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DCCB] pb-3 sm:pb-4">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {CATEGORIES.map((tab) => {
              const displayName = (tab.label || tab.name).replace('Female (Women Wear)', 'Women Wear');
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold rounded-full uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#641E32] text-[#FAF5EC] shadow-md border border-[#B89B62]/40'
                      : 'bg-white border border-[#E8DCCB] text-[#282321] hover:border-[#641E32] hover:text-[#641E32]'
                  }`}
                >
                  {displayName}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#282321]/60">{filteredProducts.length} Pieces</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#E8DCCB] text-xs rounded-xl px-3 py-2 text-[#282321] focus:outline-none focus:border-[#641E32] cursor-pointer"
            >
              <option value="featured">Featured Collection</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Favourites</option>
            </select>
          </div>
        </div>
      </section>

      {/* Garment Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E8DCCB]">
            <p className="font-cinzel text-lg text-[#641E32]">No outfits found in this category.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-3 px-6 py-2.5 bg-[#641E32] hover:bg-[#4A1624] text-[#FAF5EC] rounded-xl text-xs uppercase tracking-wider font-semibold"
            >
              Shop the Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
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
