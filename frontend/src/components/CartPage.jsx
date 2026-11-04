import React, { useState } from 'react';
import { 
  ShoppingBagIcon, 
  TrashIcon, 
  PlusIcon, 
  MinusIcon, 
  ArrowRightIcon, 
  SparklesIcon, 
  ShieldCheckIcon 
} from './Icons';
import ProductCard from './ProductCard';
import { CURRENCY_RATES } from '../data/products';

export default function CartPage({
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onQuickView,
  onAddToCart,
  wishlist = [],
  onToggleWishlist,
  products = [],
  selectedCurrency = 'PKR',
  onNavigate
}) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  const curr = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES.PKR;

  // Calculate Subtotal
  const subtotal = items.reduce((acc, item) => {
    return acc + (item.price * curr.rate * item.quantity);
  }, 0);

  // Free shipping threshold = Rs. 15,000 / $150
  const freeShippingThreshold = 150 * curr.rate;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // Apply discount
  const discountAmount = appliedPromo ? Math.round(subtotal * 0.10) : 0;
  const shippingFee = (subtotal >= freeShippingThreshold || items.length === 0) ? 0 : (curr.symbol === 'Rs. ' ? 250 : Math.round(15 * curr.rate));
  const grandTotal = Math.max(0, Math.round(subtotal - discountAmount + shippingFee));

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'UMIZ10' || code === 'LAILA10') {
      setAppliedPromo({ code: 'UMIZ10', discount: 10 });
      setPromoError('');
    } else {
      setPromoError('Invalid code. Use "UMIZ10" for 10% privilege');
    }
  };

  const recommendedProducts = products.filter(p => !items.some(i => i.id === p.id)).slice(0, 4);

  return (
    <div className="bg-[#FAF5EC] text-[#282321] pt-32 sm:pt-36 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8DCCB]/60 text-[#641E32] text-[10px] sm:text-xs uppercase tracking-widest font-semibold mb-2">
            <ShoppingBagIcon className="w-3.5 h-3.5 text-[#641E32]" />
            <span>Review Your Selection</span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#641E32] tracking-wide">
            Your Shopping Bag
          </h1>
          <div className="w-16 h-0.5 bg-[#B89B62] mx-auto mt-2" />
        </div>

        {items.length > 0 ? (
          /* When Bag Has Items: 2-Column Responsive View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* Left: Cart Items List (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Free Delivery Bar */}
              <div className="p-4 bg-white rounded-2xl border border-[#E8DCCB] shadow-sm">
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  {amountNeededForFreeShipping === 0 ? (
                    <span className="text-[#641E32] font-semibold flex items-center gap-1.5">
                      <SparklesIcon className="w-4 h-4 text-[#B89B62]" />
                      Unlocked: Complimentary Delivery Across Pakistan!
                    </span>
                  ) : (
                    <span className="text-[#282321]/75">
                      Add <strong className="text-[#641E32]">{curr.symbol}{Math.round(amountNeededForFreeShipping)}</strong> more for <strong className="text-[#641E32]">Free Delivery</strong>
                    </span>
                  )}
                  <span className="text-xs font-semibold text-[#282321]/60">{Math.round(shippingProgress)}%</span>
                </div>
                <div className="w-full h-2 bg-[#FAF5EC] border border-[#E8DCCB] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#641E32] transition-all duration-500 rounded-full"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {items.map((item) => {
                  const itemPrice = Math.round(item.price * curr.rate);

                  return (
                    <div 
                      key={`${item.id}-${item.selectedSize}-${item.selectedColor?.name}`}
                      className="p-4 bg-white rounded-2xl border border-[#E8DCCB] shadow-sm flex gap-4 items-center"
                    >
                      <img 
                        src={item.images[0]} 
                        alt={item.title} 
                        className="w-20 h-26 sm:w-24 sm:h-28 object-cover rounded-xl border border-[#E8DCCB] bg-[#FAF5EC]"
                      />

                      <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#641E32] line-clamp-1">{item.title}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#282321]/70">
                              <span className="bg-[#FAF5EC] border border-[#E8DCCB] px-2 py-0.5 rounded font-semibold text-[#282321]">
                                Size: {item.selectedSize}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <span 
                                  className="w-2.5 h-2.5 rounded-full border border-[#E8DCCB]" 
                                  style={{ backgroundColor: item.selectedColor?.hex }}
                                />
                                <span>{item.selectedColor?.name}</span>
                              </span>
                            </div>
                          </div>

                          <button 
                            onClick={() => onRemoveItem(item)}
                            className="text-[#282321]/40 hover:text-red-600 transition-colors p-1"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E8DCCB]/60">
                          {/* Quantity Stepper */}
                          <div className="flex items-center border border-[#E8DCCB] rounded-xl bg-[#FAF5EC]">
                            <button 
                              onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                              className="px-2.5 py-1 text-[#282321] hover:bg-[#E8DCCB] transition-colors rounded-l-xl"
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <MinusIcon className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-bold text-[#282321]">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                              className="px-2.5 py-1 text-[#282321] hover:bg-[#E8DCCB] transition-colors rounded-r-xl"
                              aria-label="Increase quantity"
                            >
                              <PlusIcon className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-cinzel font-bold text-sm sm:text-base text-[#282321]">
                            {curr.symbol}{(itemPrice * item.quantity).toLocaleString()}
                          </span>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right: Order Summary Box (5 cols) */}
            <div className="lg:col-span-5">
              <div className="p-6 bg-white rounded-3xl border border-[#E8DCCB] shadow-md space-y-5 sticky top-36">
                <h3 className="font-cinzel text-lg font-bold text-[#641E32] pb-3 border-b border-[#E8DCCB]">
                  Order Summary
                </h3>

                {/* Voucher Code Form */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input 
                    type="text" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Voucher (e.g. UMIZ10)"
                    className="flex-1 bg-[#FAF5EC] border border-[#E8DCCB] rounded-xl px-3.5 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-[#641E32]"
                  />
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-[#641E32] text-[#FAF5EC] text-xs font-semibold rounded-xl hover:bg-[#4A1624] transition-colors uppercase tracking-wider shadow-sm"
                  >
                    Apply
                  </button>
                </form>

                {appliedPromo && (
                  <div className="text-xs text-[#641E32] flex items-center justify-between bg-[#641E32]/10 px-3 py-2 rounded-xl border border-[#641E32]/30">
                    <span>Code <strong>UMIZ10</strong> applied (10% Discount)</span>
                    <button onClick={() => setAppliedPromo(null)} className="text-gray-500 hover:text-black">✕</button>
                  </div>
                )}

                {promoError && (
                  <p className="text-xs text-red-600">{promoError}</p>
                )}

                {/* Cost Lines */}
                <div className="space-y-2 text-xs text-[#282321]/80 border-t border-[#E8DCCB] pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#282321]">{curr.symbol}{Math.round(subtotal).toLocaleString()}</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between text-[#641E32] font-semibold">
                      <span>Privilege Discount (10%)</span>
                      <span>-{curr.symbol}{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery (Pakistan & Global)</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-[#641E32] font-semibold uppercase">Free</span>
                      ) : (
                        `${curr.symbol}${shippingFee.toLocaleString()}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-[#282321] pt-3 border-t border-[#E8DCCB]">
                    <span className="font-cinzel text-sm uppercase tracking-wider text-[#641E32]">Total Payable</span>
                    <span className="font-cinzel text-xl text-[#641E32]">{curr.symbol}{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => {
                    onProceedToCheckout({
                      items,
                      subtotal,
                      discountAmount,
                      shippingFee,
                      grandTotal,
                      appliedPromo
                    });
                  }}
                  className="w-full py-4 bg-[#641E32] hover:bg-[#4A1624] text-[#FAF5EC] rounded-full text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 shadow-lg group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-[#282321]/60 uppercase tracking-widest pt-1">
                  <ShieldCheckIcon className="w-3.5 h-3.5 text-[#B89B62]" />
                  <span>Cash on Delivery Available Across Pakistan</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Empty Bag State: No Long Text -> Direct Recommendations */
          <div className="space-y-12">
            <div className="text-center py-10 bg-white rounded-3xl border border-[#E8DCCB] max-w-md mx-auto p-6 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#FAF5EC] text-[#B89B62] border border-[#E8DCCB] flex items-center justify-center mx-auto mb-3">
                <ShoppingBagIcon className="w-7 h-7" />
              </div>
              <h2 className="font-cinzel text-lg font-bold text-[#641E32]">Your Bag is Currently Empty</h2>
              <button
                onClick={() => onNavigate('/')}
                className="mt-4 px-6 py-2.5 bg-[#641E32] hover:bg-[#4A1624] text-[#FAF5EC] text-xs font-semibold uppercase tracking-wider rounded-full transition-colors shadow-sm"
              >
                Shop New Arrivals
              </button>
            </div>

            {/* Recommended Products Grid */}
            <div>
              <div className="text-center mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#B89B62] font-semibold">Handpicked For You</span>
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

