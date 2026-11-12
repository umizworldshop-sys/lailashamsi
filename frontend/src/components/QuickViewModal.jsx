import { useState, useEffect } from 'react';
import { 
  CloseIcon, 
  StarIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  RefreshCwIcon, 
  CheckIcon, 
  ShoppingBagIcon, 
  HeartIcon,
  PlusIcon,
  MinusIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from './Icons';
import { CURRENCY_RATES } from '../data/products';

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onProceedToCheckout,
  isWishlisted,
  onToggleWishlist,
  selectedCurrency = 'PKR'
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.selectedSize || product?.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product?.selectedColor || product?.colors?.[0] || { name: 'Standard', hex: '#641E32' });
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Sync state whenever product prop updates
  useEffect(() => {
    if (product) {
      setSelectedSize(product.selectedSize || product.sizes?.[0] || 'M');
      setSelectedColor(product.selectedColor || product.colors?.[0] || { name: 'Standard', hex: '#641E32' });
      setActiveImage(0);
      setQuantity(1);
    }
  }, [product]);

  // Prevent background body scroll when quick view is open
  useEffect(() => {
    if (!product) return;
    const originalOverflow = document.body.style.overflow;
    const originalOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscroll;
    };
  }, [product]);

  if (!product) return null;

  const imagesList = Array.isArray(product.images) && product.images.filter(Boolean).length > 0
    ? product.images.filter(Boolean)
    : [product.image || '/Logo.jpeg'];
  const totalImages = imagesList.length;
  const safeActiveIdx = totalImages > 0 ? activeImage % totalImages : 0;

  const curr = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES.PKR;
  const convertedPrice = Math.round(product.price * curr.rate);
  const convertedOriginalPrice = Math.round(product.originalPrice * curr.rate);
  const isOutOfStock = Boolean(product.isOutOfStock) || (product.stock !== undefined && Number(product.stock) <= 0);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    onAddToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity,
      convertedPrice
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain px-4 py-6 flex items-center justify-center font-sans">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-[#282321]/60 backdrop-blur-sm transition-opacity"
      />

      {/* Compact Main Container */}
      <div className="relative w-full max-w-xl bg-[#FAF5EC] rounded-2xl shadow-xl overflow-hidden overscroll-contain border border-[#E8DCCB] z-10 my-auto animate-reveal-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 z-30 p-1.5 rounded-full bg-white/90 hover:bg-white text-[#282321] hover:text-[#641E32] shadow-sm transition-all border border-[#E8DCCB]"
          aria-label="Close modal"
        >
          <CloseIcon className="w-3.5 h-3.5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 sm:p-5 items-start">
          
          {/* Left: Gallery (5 Cols) */}
          <div className="sm:col-span-5 space-y-2">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#E8DCCB]/20 border border-[#E8DCCB]">
              <img 
                src={imagesList[0]} 
                alt={product.title} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/Logo.jpeg';
                }}
                className="absolute inset-0 w-full h-full object-cover object-top z-0"
              />
              {imagesList.slice(1).map((imgSrc, i) => {
                const slideIdx = i + 1;
                return (
                  <img
                    key={`${slideIdx}-${imgSrc}`}
                    src={imgSrc}
                    alt={`${product.title} view ${slideIdx + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = imagesList[0] || '/Logo.jpeg';
                    }}
                    className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-300 z-[1] ${
                      safeActiveIdx === slideIdx ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  />
                );
              })}

              {totalImages > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveImage((safeActiveIdx - 1 + totalImages) % totalImages)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white/80 hover:bg-[#641E32] text-[#282321] hover:text-white shadow-xs flex items-center justify-center transition-all"
                  >
                    <ChevronLeftIcon className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImage((safeActiveIdx + 1) % totalImages)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white/80 hover:bg-[#641E32] text-[#282321] hover:text-white shadow-xs flex items-center justify-center transition-all"
                  >
                    <ChevronRightIcon className="w-3 h-3" />
                  </button>
                </>
              )}

              {isOutOfStock ? (
                <span className="absolute top-2 left-2 text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 rounded shadow-md bg-[#17131B]/95 text-rose-200 border border-rose-500/50 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  OUT OF STOCK
                </span>
              ) : (product.tag || (product.originalPrice > product.price)) && (
                <span className="absolute top-2 left-2 text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 rounded shadow-2xs bg-[#641E32] text-[#FAF5EC] border border-[#B89B62]/40">
                  {product.tag || `-${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%`}
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {totalImages > 1 && (
              <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-10 h-12 rounded-md overflow-hidden flex-shrink-0 border transition-all ${
                      safeActiveIdx === idx ? 'border-[#641E32] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Actions (7 Cols) */}
          <div className="sm:col-span-7 flex flex-col space-y-2.5">
            
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#B89B62]">
                {product.categoryLabel}
              </span>
              <div className="flex items-center gap-1">
                <StarIcon className="w-3 h-3 fill-[#B89B62] text-[#B89B62]" />
                <span className="text-[10px] font-bold text-[#282321]">{product.rating}</span>
                <span className="text-[9px] text-[#282321]/60">({product.reviewsCount})</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#641E32] leading-tight">
              {product.title}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="font-cinzel text-base font-bold text-[#282321]">
                {curr.symbol}{convertedPrice.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-[10px] text-[#282321]/50 line-through">
                  {curr.symbol}{convertedOriginalPrice.toLocaleString()}
                </span>
              )}
              {isOutOfStock ? (
                <span className="text-[8.5px] text-rose-700 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded font-bold ml-auto flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                  Out of Stock
                </span>
              ) : (
                <span className="text-[8.5px] text-[#164B3C] bg-[#164B3C]/10 px-2 py-0.5 rounded font-semibold ml-auto">
                  In Stock
                </span>
              )}
            </div>

            {/* Compact Specs Box */}
            <div className="p-1.5 bg-white rounded-md border border-[#E8DCCB] text-[10px] space-y-0.5">
              <p><strong className="text-[#641E32]">Fabric:</strong> <span className="text-[#282321]/80">{product.fabric}</span></p>
              <p><strong className="text-[#641E32]">Includes:</strong> <span className="text-[#282321]/80">{product.pieces}</span></p>
            </div>

            {/* Colour Selection */}
            {Array.isArray(product.colors) && product.colors.length > 0 && (
              <div>
                <label className="text-[9.5px] font-bold text-[#282321] uppercase tracking-wider block mb-1">
                  Colour: <span className="font-normal text-[#641E32] capitalize">{selectedColor?.name || 'Standard'}</span>
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color.hex }}
                      className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                        selectedColor?.name === color.name 
                          ? 'border-[#641E32] scale-110 ring-1 ring-[#641E32]/40 shadow-xs' 
                          : 'border-white hover:scale-105'
                      }`}
                      title={color.name}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[9.5px] font-bold text-[#282321] uppercase tracking-wider">
                  Size: <span className="font-normal text-[#641E32]">{selectedSize}</span>
                </label>
                <button 
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-[9px] text-[#641E32] underline hover:text-[#4A1624] font-medium"
                >
                  {showSizeGuide ? 'Hide Chart' : 'Size Guide'}
                </button>
              </div>

              {/* Size Guide Table */}
              {showSizeGuide && (
                <div className="p-1.5 mb-1.5 bg-white rounded-md border border-[#B89B62]/40 text-[9px] overflow-x-auto">
                  <table className="w-full text-center">
                    <thead>
                      <tr className="border-b border-[#E8DCCB] text-[#282321]/70">
                        <th className="py-0.5">Size</th>
                        <th className="py-0.5">Bust</th>
                        <th className="py-0.5">Waist</th>
                        <th className="py-0.5">Hip</th>
                        <th className="py-0.5">Length</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#282321]">
                      <tr><td className="font-bold">XS</td><td>34"</td><td>27"</td><td>37"</td><td>46"</td></tr>
                      <tr><td className="font-bold">S</td><td>36"</td><td>29"</td><td>39"</td><td>46"</td></tr>
                      <tr><td className="font-bold">M</td><td>39"</td><td>32"</td><td>42"</td><td>47"</td></tr>
                      <tr><td className="font-bold">L</td><td>42"</td><td>35"</td><td>45"</td><td>47"</td></tr>
                      <tr><td className="font-bold">XL</td><td>45"</td><td>38"</td><td>48"</td><td>48"</td></tr>
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex flex-wrap gap-1">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-7 h-6 rounded text-[10px] font-semibold transition-all ${
                      selectedSize === sz 
                        ? 'bg-[#641E32] text-[#FAF5EC]' 
                        : 'bg-white border border-[#E8DCCB] text-[#282321] hover:border-[#641E32]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="flex items-center gap-1.5 pt-1">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-[#E8DCCB] rounded-md bg-white p-0.5 shadow-2xs">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 text-[#282321] hover:text-[#641E32]"
                >
                  <MinusIcon className="w-2.5 h-2.5" />
                </button>
                <span className="px-1.5 text-[11px] font-bold text-[#282321]">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 text-[#282321] hover:text-[#641E32]"
                >
                  <PlusIcon className="w-2.5 h-2.5" />
                </button>
              </div>

              {/* Add to Bag Button */}
              {isOutOfStock ? (
                <button
                  type="button"
                  disabled
                  className="flex-1 py-1.5 px-3 rounded-md text-[9px] uppercase tracking-[0.12em] font-bold shadow-2xs flex items-center justify-center gap-1.5 bg-gray-200 text-gray-500 cursor-not-allowed"
                >
                  Out of Stock
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-1.5 px-3 rounded-md text-[9px] uppercase tracking-[0.12em] font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 bg-[#641E32] text-[#FAF5EC] hover:bg-[#4A1624] cursor-pointer"
                >
                  {addedSuccess ? (
                    <>
                      <CheckIcon className="w-3 h-3" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBagIcon className="w-3 h-3" />
                      <span>Add • {curr.symbol}{(convertedPrice * quantity).toLocaleString()}</span>
                    </>
                  )}
                </button>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`p-1.5 rounded-md border transition-all ${
                  isWishlisted 
                    ? 'bg-[#641E32] text-[#FAF5EC] border-[#641E32]' 
                    : 'bg-white text-[#282321] border-[#E8DCCB] hover:border-[#641E32]'
                }`}
              >
                <HeartIcon className="w-3.5 h-3.5" filled={isWishlisted} />
              </button>
            </div>

            {/* Instant Checkout Button */}
            {onProceedToCheckout && !isOutOfStock && (
              <button
                type="button"
                onClick={() => {
                  const newItem = {
                    ...product,
                    selectedSize,
                    selectedColor,
                    quantity,
                    convertedPrice
                  };
                  onAddToCart(newItem);
                  onClose();
                  onProceedToCheckout({ items: [newItem] });
                }}
                className="w-full py-1.5 px-3 rounded-md bg-[#164B3C] hover:bg-[#113a2e] text-[#FAF5EC] text-[9px] uppercase tracking-[0.15em] font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {/* Mini Guarantees */}
            <div className="grid grid-cols-3 gap-1 pt-2 border-t border-[#E8DCCB] text-center text-[8.5px] text-[#282321]/70">
              <div className="flex flex-col items-center gap-0.5">
                <TruckIcon className="w-3 h-3 text-[#B89B62]" />
                <span>COD Pakistan</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <ShieldCheckIcon className="w-3 h-3 text-[#B89B62]" />
                <span>Pure Fabrics</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <RefreshCwIcon className="w-3 h-3 text-[#B89B62]" />
                <span>Easy Exchange</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}