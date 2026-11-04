import React, { useState } from 'react';
import { 
  CloseIcon, 
  TrashIcon, 
  PlusIcon, 
  MinusIcon, 
  ShoppingBagIcon, 
  ArrowRightIcon, 
  SparklesIcon,
  ShieldCheckIcon
} from './Icons';
import { CURRENCY_RATES } from '../data/products';

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  selectedCurrency = 'PKR'
}) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

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
      setPromoError('Invalid code. Try "UMIZ10" for 10% off');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-[#282321]/75 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer: full width on mobile, max-w-md on desktop */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FAF5EC] shadow-2xl flex flex-col justify-between border-l border-[#E8DCCB]">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#E8DCCB] bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBagIcon className="w-5 h-5 text-[#641E32]" />
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#641E32] uppercase">Your Shopping Bag</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FAF5EC] text-[#641E32] border border-[#E8DCCB]">
                  {items.length}
                </span>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 text-[#282321]/60 hover:text-[#641E32] rounded-full focus:outline-none"
                aria-label="Close bag"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="mt-3 sm:mt-4 p-3 bg-[#FAF5EC] rounded-2xl border border-[#E8DCCB]">
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-[#641E32] font-semibold flex items-center gap-1 text-[11px] sm:text-xs">
                    <SparklesIcon className="w-3.5 h-3.5 text-[#B89B62]" />
                    Unlocked: COMPLIMENTARY DELIVERY!
                  </span>
                ) : (
                  <span className="text-[#282321]/75 text-[11px] sm:text-xs">
                    Add <strong className="text-[#641E32]">{curr.symbol}{Math.round(amountNeededForFreeShipping)}</strong> more for <strong className="text-[#641E32]">FREE DELIVERY</strong>
                  </span>
                )}
                <span className="text-[10px] sm:text-[11px] text-[#282321]/60 font-semibold">{Math.round(shippingProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#E8DCCB] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#641E32] transition-all duration-500 rounded-full"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white text-[#B89B62] border border-[#E8DCCB] flex items-center justify-center mx-auto shadow-sm">
                  <ShoppingBagIcon className="w-8 h-8" />
                </div>
                <h4 className="font-cinzel text-base font-bold text-[#641E32] uppercase">Your Bag is Empty</h4>
                <p className="text-xs text-[#282321]/70 max-w-xs mx-auto font-normal">
                  Explore our luxury pret, unstitched lawn, and festive collections to curate your dream outfit.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-6 py-2.5 bg-[#641E32] text-[#FAF5EC] rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#4A1624] transition-colors shadow-sm"
                >
                  Shop the Collection
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemPrice = Math.round(item.price * curr.rate);

                return (
                  <div 
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor?.name}`}
                    className="flex gap-3 sm:gap-4 p-3 sm:p-3.5 bg-white rounded-2xl border border-[#E8DCCB] shadow-sm"
                  >
                    <div className="w-18 h-22 sm:w-20 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#E8DCCB]/30 border border-[#E8DCCB]">
                      <img 
                        src={item.images[0]} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-cinzel text-xs font-bold text-[#641E32] uppercase line-clamp-1">{item.title}</h4>
                          <button 
                            onClick={() => onRemoveItem(item)}
                            className="text-[#282321]/40 hover:text-red-600 transition-colors p-1"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-[#282321]/70">
                          <span className="bg-[#FAF5EC] border border-[#E8DCCB] px-1.5 py-0.5 rounded text-[#282321] font-semibold">
                            Size: {item.selectedSize}
                          </span>
                          <span className="flex items-center gap-1">
                            <span 
                              className="w-2.5 h-2.5 rounded-full border border-[#E8DCCB]" 
                              style={{ backgroundColor: item.selectedColor?.hex }}
                            />
                            <span>{item.selectedColor?.name}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-[#E8DCCB] rounded-xl overflow-hidden bg-[#FAF5EC]">
                          <button 
                            onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                            className="p-1 sm:p-1.5 text-[#282321] hover:bg-[#E8DCCB]"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <MinusIcon className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 sm:px-3 text-xs font-bold text-[#282321]">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                            className="p-1 sm:p-1.5 text-[#282321] hover:bg-[#E8DCCB]"
                            aria-label="Increase quantity"
                          >
                            <PlusIcon className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-cinzel font-bold text-xs sm:text-sm text-[#282321]">
                          {curr.symbol}{(itemPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 bg-white border-t border-[#E8DCCB] space-y-3 sm:space-y-4 shadow-xl">
              
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input 
                  type="text" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Code (e.g. UMIZ10)"
                  className="flex-1 bg-[#FAF5EC] border border-[#E8DCCB] rounded-xl px-3.5 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-[#641E32]"
                />
                <button 
                  type="submit"
                  className="px-4 sm:px-5 py-2 bg-[#641E32] text-[#FAF5EC] text-xs font-semibold rounded-xl hover:bg-[#4A1624] transition-colors uppercase tracking-wider shadow-sm"
                >
                  Apply
                </button>
              </form>

              {appliedPromo && (
                <div className="text-[11px] text-[#641E32] flex items-center justify-between bg-[#641E32]/10 px-3 py-1.5 rounded-lg border border-[#641E32]/30">
                  <span>Code <strong>UMIZ10</strong> applied (10% Seasonal Privilege)</span>
                  <button onClick={() => setAppliedPromo(null)} className="text-gray-500 hover:text-black">✕</button>
                </div>
              )}

              {promoError && (
                <p className="text-[11px] text-red-600">{promoError}</p>
              )}

              <div className="space-y-1.5 text-xs text-[#282321]/75 border-t border-[#E8DCCB] pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#282321]">{curr.symbol}{Math.round(subtotal).toLocaleString()}</span>
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

                <div className="flex justify-between text-base font-bold text-[#282321] pt-2 border-t border-[#E8DCCB]">
                  <span className="font-cinzel text-xs uppercase tracking-wider text-[#641E32]">Estimated Total</span>
                  <span className="font-cinzel text-lg text-[#641E32]">{curr.symbol}{grandTotal.toLocaleString()}</span>
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
                className="w-full py-3.5 sm:py-4 bg-[#641E32] text-[#FAF5EC] rounded-full text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#4A1624] transition-all flex items-center justify-center gap-2 shadow-lg group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[9.5px] sm:text-[10px] text-[#282321]/60 uppercase tracking-widest">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-[#B89B62]" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
