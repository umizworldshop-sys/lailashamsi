import React from 'react';
import { HeartIcon } from './Icons';
import ProductCard from './ProductCard';

export default function WishlistPage({
  wishlist = [],
  products = [],
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  selectedCurrency = 'PKR',
  onNavigate
}) {
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));
  const recommendedProducts = products.filter((p) => !wishlist.includes(p.id)).slice(0, 4);

  return (
    <div className="bg-[#FAF5EC] text-[#282321] pt-32 sm:pt-36 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8DCCB]/60 text-[#641E32] text-[10px] sm:text-xs uppercase tracking-widest font-semibold mb-2">
            <HeartIcon className="w-3.5 h-3.5 text-[#641E32]" filled={true} />
            <span>Curated Favourites</span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#641E32] tracking-wide">
            Your Saved Wishlist
          </h1>
          <div className="w-16 h-0.5 bg-[#B89B62] mx-auto mt-2" />
        </div>

        {wishlistedProducts.length > 0 ? (
          /* Grid of Wishlisted Outfits */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistedProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                isWishlisted={true}
                onToggleWishlist={onToggleWishlist}
                selectedCurrency={selectedCurrency}
                staggerClass={`stagger-${(idx % 4) + 1}`}
              />
            ))}
          </div>
        ) : (
          /* Empty Wishlist State: No Long Text -> Direct Recommendations */
          <div className="space-y-12">
            <div className="text-center py-10 bg-white rounded-3xl border border-[#E8DCCB] max-w-md mx-auto p-6 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#FAF5EC] text-[#641E32] border border-[#E8DCCB] flex items-center justify-center mx-auto mb-3">
                <HeartIcon className="w-7 h-7" />
              </div>
              <h2 className="font-cinzel text-lg font-bold text-[#641E32]">Your Wishlist is Empty</h2>
              <button
                onClick={() => onNavigate('/')}
                className="mt-4 px-6 py-2.5 bg-[#641E32] hover:bg-[#4A1624] text-[#FAF5EC] text-xs font-semibold uppercase tracking-wider rounded-full transition-colors shadow-sm"
              >
                Discover Collections
              </button>
            </div>

            {/* Recommended Products Grid */}
            <div>
              <div className="text-center mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#B89B62] font-semibold">Curated For You</span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#641E32] mt-1">Recommended Outfits</h3>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {recommendedProducts.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                    onAddToCart={onAddToCart}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                    selectedCurrency={selectedCurrency}
                    staggerClass={`stagger-${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

