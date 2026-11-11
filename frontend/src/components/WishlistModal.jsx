import React, { useEffect } from 'react';
import { CloseIcon, HeartIcon, TrashIcon } from './Icons';
import { CURRENCY_RATES } from '../data/products';

export default function WishlistModal({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onAddToCart,
  onRemoveFromWishlist,
  selectedCurrency = 'PKR'
}) {
  // Prevent background body scroll when wishlist modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    const originalOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscroll;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const curr = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES.PKR;
  const wishlistedProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden overscroll-contain">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-[#282321]/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FAF5EC] shadow-2xl flex flex-col justify-between border-l border-[#E8DCCB] overscroll-contain">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#E8DCCB] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartIcon className="w-5 h-5 text-[#641E32]" filled={true} />
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#641E32] uppercase">Saved Wishlist</h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FAF5EC] text-[#641E32] border border-[#E8DCCB]">
                {wishlistedProducts.length}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-[#282321]/60 hover:text-[#641E32] rounded-full focus:outline-none"
              aria-label="Close wishlist"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
            {wishlistedProducts.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white text-[#B89B62] border border-[#E8DCCB] flex items-center justify-center mx-auto shadow-sm">
                  <HeartIcon className="w-8 h-8" />
                </div>
                <h4 className="font-cinzel text-base font-bold text-[#641E32]">Your Wishlist is Empty</h4>
                <p className="text-xs text-[#282321]/70 max-w-xs mx-auto font-normal">
                  Click the heart icon on any Pakistani Eastern Wear outfit to curate your personal festive wishlist.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-6 py-2.5 bg-[#641E32] text-[#FAF5EC] rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#4A1624] transition-colors shadow-sm"
                >
                  Discover Collections
                </button>
              </div>
            ) : (
              wishlistedProducts.map((product) => {
                const convertedPrice = Math.round(product.price * curr.rate);

                return (
                  <div 
                    key={product.id}
                    className="flex gap-3 sm:gap-4 p-3 sm:p-3.5 bg-white rounded-2xl border border-[#E8DCCB] shadow-sm items-center"
                  >
                    <div className="w-18 h-22 sm:w-20 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#E8DCCB]/30 border border-[#E8DCCB]">
                      <img 
                        src={product.images[0]} 
                        alt={product.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between h-22 sm:h-24 min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-cinzel text-xs font-bold text-[#641E32] line-clamp-1">{product.title}</h4>
                          <button 
                            onClick={() => onRemoveFromWishlist(product.id)}
                            className="text-[#282321]/40 hover:text-red-600 transition-colors p-1"
                            title="Remove from wishlist"
                            aria-label="Remove from wishlist"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-[#282321] font-bold mt-1">
                          {curr.symbol}{convertedPrice.toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          onAddToCart({
                            ...product,
                            selectedSize: product.sizes[0],
                            selectedColor: product.colors[0],
                            quantity: 1,
                            convertedPrice
                          });
                        }}
                        className="w-full py-1.5 sm:py-2 bg-[#641E32] text-[#FAF5EC] hover:bg-[#4A1624] text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-colors text-center shadow-sm"
                      >
                        Add to Bag
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 bg-white border-t border-[#E8DCCB] text-center">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#FAF5EC] border border-[#E8DCCB] text-[#641E32] hover:bg-[#641E32] hover:text-[#FAF5EC] text-xs uppercase tracking-widest font-semibold rounded-full transition-colors"
            >
              Continue Shopping
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
