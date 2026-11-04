import { useState, useEffect } from 'react';
import { CloseIcon, CheckIcon, TrashIcon, SparklesIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '../Icons';

const DEFAULT_CATEGORIES = [
  { id: 'female', label: 'Female (Women Wear)', desc: 'Luxury pret, formals & festive suits' },
  { id: 'babies', label: 'Kids Collection', desc: 'Festive & charming wear for girls' },
  { id: 'unstitched', label: 'Unstitched Suits', desc: 'Embroidered fabrics, chiffons & lawns' },
  { id: 'stitched', label: 'Stitched (Ready to Wear)', desc: 'Tailored 3-piece & 2-piece outfits' }
];

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'Free Size'];
const TAG_PRESETS = ['New Arrival', 'Bestseller', 'Trending', 'Seasonal Sale'];
const PIECE_PRESETS = ['3 Piece', '2 Piece', '1 Piece', 'Unstitched Fabric'];

export default function AdminProductModal({
  isOpen,
  onClose,
  editingProductId,
  productForm,
  setProductForm,
  productFormError,
  productSaving,
  uploadingImage,
  onSave,
  onImageFileUpload,
  categories = []
}) {
  const [step, setStep] = useState(1); // Step 1 | Step 2 | Step 3
  const [imageTab, setImageTab] = useState('upload'); // 'upload' | 'url'
  const [stepError, setStepError] = useState('');
  const [previewIdx, setPreviewIdx] = useState(0);
  const [urlInput, setUrlInput] = useState('');

  // Reset step whenever modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStep(1);
        setStepError('');
        setPreviewIdx(0);
        setUrlInput('');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Use storefront categories
  const availableCategories = categories.filter(c => c.id !== 'all').length > 0
    ? categories.filter(c => c.id !== 'all')
    : DEFAULT_CATEGORIES;

  // Price calculations
  const salePrice = Number(productForm.price) || 0;
  const origPrice = Number(productForm.originalPrice) || 0;
  const hasDiscount = origPrice > salePrice && salePrice > 0;
  const discountPercent = hasDiscount ? Math.round(((origPrice - salePrice) / origPrice) * 100) : 0;
  const savingsAmount = hasDiscount ? origPrice - salePrice : 0;

  // Size toggle
  const handleToggleSize = (size) => {
    const currentSizes = Array.isArray(productForm.sizes) ? productForm.sizes : [];
    if (currentSizes.includes(size)) {
      setProductForm({ ...productForm, sizes: currentSizes.filter(s => s !== size) });
    } else {
      setProductForm({ ...productForm, sizes: [...currentSizes, size] });
    }
  };

  // Step 1 Validation
  const handleNextFromStep1 = () => {
    setStepError('');
    if (!productForm.title || !productForm.title.trim()) {
      setStepError('Please enter a Product Title before proceeding.');
      return;
    }
    if (!productForm.category) {
      setStepError('Please select a Category.');
      return;
    }
    setStep(2);
  };

  // Step 2 Validation
  const handleNextFromStep2 = () => {
    setStepError('');
    if (!productForm.price || Number(productForm.price) <= 0) {
      setStepError('Please enter a valid Sale Price (in PKR).');
      return;
    }
    setStep(3);
  };

  const validImages = Array.isArray(productForm.images)
    ? productForm.images.map(img => (img || '').trim()).filter(Boolean)
    : [];
  const safePreviewIdx = validImages.length > 0 ? Math.min(previewIdx, validImages.length - 1) : 0;
  const currentPreviewImage = validImages[safePreviewIdx] || '';

  const handleAddUrlImage = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    const nextImgs = [...validImages, trimmed];
    setProductForm({ ...productForm, images: nextImgs });
    setPreviewIdx(nextImgs.length - 1);
    setUrlInput('');
  };

  const handleRemoveImageAt = (idxToRemove) => {
    const nextImgs = validImages.filter((_, i) => i !== idxToRemove);
    setProductForm({ ...productForm, images: nextImgs });
    setPreviewIdx(prev => Math.max(0, Math.min(prev, nextImgs.length - 1)));
  };

  const handleMakeCoverImage = (idxToPromote) => {
    if (idxToPromote <= 0 || idxToPromote >= validImages.length) return;
    const chosen = validImages[idxToPromote];
    const rest = validImages.filter((_, i) => i !== idxToPromote);
    setProductForm({ ...productForm, images: [chosen, ...rest] });
    setPreviewIdx(0);
  };

  return (
    <div 
      className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-[#141018] text-white rounded-3xl border border-[#D4AF37]/40 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#261E2D] bg-[#18131E] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B76E79]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <SparklesIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                {editingProductId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-[10px] text-gray-400">
                Step-by-step product catalog manager
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Wizard Progress Bar */}
        <div className="px-6 py-3 bg-[#110D15] border-b border-[#241C2B] shrink-0">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            {/* Step 1 */}
            <button
              type="button"
              onClick={() => { setStep(1); setStepError(''); }}
              className={`flex items-center gap-2 text-xs font-semibold cursor-pointer transition-colors ${
                step === 1 ? 'text-[#D4AF37]' : step > 1 ? 'text-gray-300 hover:text-white' : 'text-gray-500'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === 1 ? 'bg-[#D4AF37] text-black' : step > 1 ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-400'
              }`}>
                {step > 1 ? '✓' : '1'}
              </span>
              <span className="hidden sm:inline">Category & Details</span>
            </button>

            <div className={`flex-1 h-0.5 mx-3 transition-colors ${step > 1 ? 'bg-emerald-600/60' : 'bg-[#2A2132]'}`} />

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => {
                if (step > 2) { setStep(2); setStepError(''); }
                else if (productForm.title && productForm.category) { setStep(2); setStepError(''); }
              }}
              className={`flex items-center gap-2 text-xs font-semibold cursor-pointer transition-colors ${
                step === 2 ? 'text-[#D4AF37]' : step > 2 ? 'text-gray-300 hover:text-white' : 'text-gray-500'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === 2 ? 'bg-[#D4AF37] text-black' : step > 2 ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-400'
              }`}>
                {step > 2 ? '✓' : '2'}
              </span>
              <span className="hidden sm:inline">Pricing & Sizing</span>
            </button>

            <div className={`flex-1 h-0.5 mx-3 transition-colors ${step > 2 ? 'bg-emerald-600/60' : 'bg-[#2A2132]'}`} />

            {/* Step 3 */}
            <button
              type="button"
              onClick={() => {
                if (productForm.title && productForm.category && productForm.price) {
                  setStep(3);
                  setStepError('');
                }
              }}
              className={`flex items-center gap-2 text-xs font-semibold cursor-pointer transition-colors ${
                step === 3 ? 'text-[#D4AF37]' : 'text-gray-500'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === 3 ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-gray-400'
              }`}>
                3
              </span>
              <span className="hidden sm:inline">Photo & Details</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {(stepError || productFormError) && (
          <div className="mx-6 mt-3 px-3.5 py-2 bg-rose-950/70 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2 shrink-0 animate-reveal-up">
            <span>⚠️</span>
            <span>{stepError || productFormError}</span>
          </div>
        )}

        {/* Step-by-Step Form Body (No vertical scrolling needed) */}
        <form onSubmit={onSave} className="p-5 sm:p-6 flex-1 flex flex-col justify-between overflow-y-auto admin-scrollbar">
          
          {/* ================= STEP 1: CATEGORY & DETAILS ================= */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              {/* Product Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-200 block">
                  Product Title <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={productForm.title}
                  onChange={(e) => {
                    setProductForm({ ...productForm, title: e.target.value });
                    if (stepError) setStepError('');
                  }}
                  placeholder="e.g. Gul-e-Noor Embroidered Chiffon Suit"
                  className="w-full bg-[#1A1521] border border-[#2F2638] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
              </div>

              {/* Category Cards (1-Click Selection) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-200 block">
                  Main Category <span className="text-[#D4AF37]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {availableCategories.map((cat) => {
                    const isSelected = productForm.category === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setProductForm({
                            ...productForm,
                            category: cat.id,
                            categoryLabel: cat.label
                          });
                          if (stepError) setStepError('');
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-md shadow-[#D4AF37]/10'
                            : 'bg-[#18131E] border-[#2A2232] hover:border-[#3E3249] hover:bg-[#1E1825]'
                        }`}
                      >
                        <div>
                          <p className={`text-xs font-bold ${isSelected ? 'text-[#D4AF37]' : 'text-white'}`}>
                            {cat.label}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {cat.desc || 'Storefront collection'}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                          isSelected ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-gray-600'
                        }`}>
                          {isSelected && <CheckIcon className="w-3.5 h-3.5 text-black stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Collection Placement Toggles (New Arrival, On Sale, Trending) */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-gray-200 block">
                  Display Placements <span className="text-[10px] text-gray-400 font-normal">(Choose where this product appears)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* New Arrival Toggle */}
                  <div
                    onClick={() => setProductForm({ ...productForm, isNewArrival: !productForm.isNewArrival })}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      productForm.isNewArrival
                        ? 'bg-amber-950/40 border-amber-600 text-amber-300'
                        : 'bg-[#18131E] border-[#2A2232] text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">✨</span>
                      <div>
                        <p className="text-xs font-bold">New Arrival</p>
                        <p className="text-[9px] opacity-75">Show on New Arrivals & Home</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      productForm.isNewArrival ? 'border-amber-500 bg-amber-500' : 'border-gray-600'
                    }`}>
                      {productForm.isNewArrival && <CheckIcon className="w-3 h-3 text-black stroke-[3]" />}
                    </div>
                  </div>

                  {/* On Sale Toggle */}
                  <div
                    onClick={() => setProductForm({ ...productForm, isOnSale: !productForm.isOnSale })}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      productForm.isOnSale
                        ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300'
                        : 'bg-[#18131E] border-[#2A2232] text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🏷️</span>
                      <div>
                        <p className="text-xs font-bold">On Sale</p>
                        <p className="text-[9px] opacity-75">Show in Grand Sale & Deals</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      productForm.isOnSale ? 'border-emerald-500 bg-emerald-500' : 'border-gray-600'
                    }`}>
                      {productForm.isOnSale && <CheckIcon className="w-3 h-3 text-black stroke-[3]" />}
                    </div>
                  </div>

                  {/* Trending / Bestseller Toggle */}
                  <div
                    onClick={() => setProductForm({ ...productForm, isTrending: !productForm.isTrending })}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      productForm.isTrending
                        ? 'bg-purple-950/40 border-purple-600 text-purple-300'
                        : 'bg-[#18131E] border-[#2A2232] text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🔥</span>
                      <div>
                        <p className="text-xs font-bold">Trending</p>
                        <p className="text-[9px] opacity-75">Show on Trending Top Picks</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      productForm.isTrending ? 'border-purple-500 bg-purple-500' : 'border-gray-600'
                    }`}>
                      {productForm.isTrending && <CheckIcon className="w-3 h-3 text-black stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tag / Badge Field with Presets */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-200 block">
                    Tag / Badge Text
                  </label>
                  <div className="flex items-center gap-1.5">
                    {TAG_PRESETS.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setProductForm({ ...productForm, tag: productForm.tag === t ? '' : t })}
                        className={`px-2 py-0.5 rounded-md text-[9px] font-semibold transition-colors cursor-pointer ${
                          productForm.tag === t
                            ? 'bg-[#D4AF37] text-black'
                            : 'bg-[#1F1926] text-gray-400 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  value={productForm.tag}
                  onChange={(e) => setProductForm({ ...productForm, tag: e.target.value })}
                  placeholder="e.g. New Arrival, Bestseller, 20% Off"
                  className="w-full bg-[#1A1521] border border-[#2F2638] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* ================= STEP 2: PRICING & SIZING ================= */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              {/* Pricing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-200 block">
                    Sale Price (PKR) <span className="text-[#D4AF37]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#D4AF37]">
                      Rs.
                    </span>
                    <input
                      type="number"
                      autoFocus
                      required
                      min="1"
                      value={productForm.price}
                      onChange={(e) => {
                        setProductForm({ ...productForm, price: e.target.value });
                        if (stepError) setStepError('');
                      }}
                      placeholder="12500"
                      className="w-full bg-[#1A1521] border border-[#2F2638] rounded-xl pl-12 pr-4 py-2.5 text-xs sm:text-sm font-mono text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-200 block">
                    Original / Strikethrough Price (PKR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-gray-400">
                      Rs.
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                      placeholder="15500"
                      className="w-full bg-[#1A1521] border border-[#2F2638] rounded-xl pl-12 pr-4 py-2.5 text-xs sm:text-sm font-mono text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Discount Calculator Notice */}
              {hasDiscount && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center justify-between text-xs text-emerald-300">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px]">
                      {discountPercent}% OFF
                    </span>
                    <span>Customer will save <strong>Rs. {savingsAmount.toLocaleString()}</strong></span>
                  </div>
                  <span className="font-mono text-xs text-emerald-400 font-bold">
                    Rs. {salePrice.toLocaleString()} (was Rs. {origPrice.toLocaleString()})
                  </span>
                </div>
              )}

              {/* Fabric & Pieces */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-200 block">
                    Fabric Details
                  </label>
                  <input
                    type="text"
                    value={productForm.fabric}
                    onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                    placeholder="e.g. Pure Embroidered Chiffon & Silk"
                    className="w-full bg-[#1A1521] border border-[#2F2638] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-200 block">
                      Pieces Included
                    </label>
                    <div className="flex items-center gap-1">
                      {PIECE_PRESETS.map((p) => (
                        <button
                          type="button"
                          key={p}
                          onClick={() => setProductForm({ ...productForm, pieces: p })}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-semibold cursor-pointer ${
                            productForm.pieces === p ? 'bg-[#B76E79] text-white' : 'bg-[#1F1926] text-gray-400'
                          }`}
                        >
                          {p.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={productForm.pieces}
                    onChange={(e) => setProductForm({ ...productForm, pieces: e.target.value })}
                    placeholder="e.g. 3 Piece (Shirt, Trouser, Dupatta)"
                    className="w-full bg-[#1A1521] border border-[#2F2638] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-gray-200 block">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {SIZE_OPTIONS.map((sz) => {
                    const isActive = Array.isArray(productForm.sizes) && productForm.sizes.includes(sz);
                    return (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => handleToggleSize(sz)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-[#D4AF37] text-black shadow-sm'
                            : 'bg-[#1A1521] text-gray-400 hover:text-white border border-[#2F2638]'
                        }`}
                      >
                        {isActive && <CheckIcon className="w-3 h-3 stroke-[3]" />}
                        <span>{sz}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: PHOTO & DETAILS ================= */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Image Upload / URL Controls */}
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center p-1 bg-[#1A1521] border border-[#2B2332] rounded-xl w-fit">
                    <button
                      type="button"
                      onClick={() => setImageTab('upload')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        imageTab === 'upload' ? 'bg-[#D4AF37] text-black shadow-sm' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      📁 Upload from Device (Cloudinary)
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('url')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        imageTab === 'url' ? 'bg-[#D4AF37] text-black shadow-sm' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      🔗 Image URL Link
                    </button>
                  </div>

                  {imageTab === 'url' ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-200 block">
                        Add Photo URLs ({validImages.length} added)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddUrlImage();
                            }
                          }}
                          placeholder="https://res.cloudinary.com/..."
                          className="flex-1 bg-[#1A1521] border border-[#2F2638] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleAddUrlImage}
                          className="px-3.5 py-2 bg-[#D4AF37] hover:bg-[#c49f2e] text-black rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                          <span>Add Photo</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400">
                        Paste any image URL and click "Add Photo" to build your product carousel.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-200 block">
                        Upload Multiple Product Photos ({validImages.length} added)
                      </label>
                      <div className="p-3.5 border-2 border-dashed border-[#3A2F45] hover:border-[#D4AF37] rounded-2xl bg-[#1A1521] text-center transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={onImageFileUpload}
                          disabled={uploadingImage}
                          id="admin-step-file-upload"
                          className="hidden"
                        />
                        <label htmlFor="admin-step-file-upload" className="cursor-pointer block space-y-1">
                          <span className="text-2xl block">📁</span>
                          <p className="text-xs font-semibold text-white">
                            {validImages.length > 0
                              ? '+ Click to add more photos to carousel'
                              : 'Click to select 1 or multiple photos from device'}
                          </p>
                          <p className="text-[10px] text-gray-400">Select multiple JPG, PNG, WebP files at once (Uploads to Cloudinary)</p>
                        </label>
                        {uploadingImage && (
                          <div className="mt-2 text-xs text-[#D4AF37] flex items-center justify-center gap-1.5 animate-pulse font-semibold">
                            <span>⏳ Uploading photos to Cloudinary...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Uploaded Carousel Thumbnail Strip */}
                  {validImages.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-gray-300">
                          Carousel Gallery ({validImages.length} {validImages.length === 1 ? 'photo' : 'photos'})
                        </span>
                        <span className="text-[10px] text-gray-400">
                          Click a thumbnail to preview or set as Main Cover
                        </span>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 admin-scrollbar">
                        {validImages.map((imgUrl, idx) => {
                          const isSelected = safePreviewIdx === idx;
                          return (
                            <div
                              key={`${idx}-${imgUrl.slice(0, 24)}`}
                              onClick={() => setPreviewIdx(idx)}
                              className={`relative w-14 h-16 rounded-xl overflow-hidden shrink-0 border-2 cursor-pointer transition-all group ${
                                isSelected
                                  ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30 scale-105'
                                  : 'border-[#2E2536] opacity-75 hover:opacity-100'
                              }`}
                            >
                              <img
                                src={imgUrl}
                                alt={`Slide ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {idx === 0 && (
                                <span className="absolute bottom-0 inset-x-0 bg-[#D4AF37] text-black text-[8px] font-extrabold uppercase text-center py-0.2">
                                  Main
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImageAt(idx);
                                }}
                                title="Remove photo"
                                className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/80 hover:bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              >
                                <CloseIcon className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="space-y-1 pt-0.5">
                    <label className="text-xs font-semibold text-gray-200 block">
                      Product Description
                    </label>
                    <textarea
                      rows="2"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Add fabric details, embroidery style, occasion wear notes..."
                      className="w-full bg-[#1A1521] border border-[#2F2638] rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Right: Interactive Carousel Preview */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-200 block">
                      Carousel Preview
                    </label>
                    {validImages.length > 0 && (
                      <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                        {safePreviewIdx + 1} / {validImages.length}
                      </span>
                    )}
                  </div>
                  <div className="aspect-[3/4] max-h-60 bg-[#17131D] rounded-2xl border border-[#2B2333] overflow-hidden relative group flex items-center justify-center shadow-inner">
                    {currentPreviewImage ? (
                      <>
                        <img 
                          src={currentPreviewImage} 
                          alt={`Preview ${safePreviewIdx + 1}`} 
                          className="w-full h-full object-cover transition-all duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/Logo.jpeg';
                          }}
                        />

                        {/* Left / Right Carousel Arrows inside Preview */}
                        {validImages.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => setPreviewIdx((safePreviewIdx - 1 + validImages.length) % validImages.length)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/70 hover:bg-[#D4AF37] text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer z-10"
                              title="Previous image"
                            >
                              <ChevronLeftIcon className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewIdx((safePreviewIdx + 1) % validImages.length)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/70 hover:bg-[#D4AF37] text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer z-10"
                              title="Next image"
                            >
                              <ChevronRightIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {/* Bottom actions overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/85 via-black/50 to-transparent flex items-center justify-between gap-1">
                          {safePreviewIdx > 0 ? (
                            <button
                              type="button"
                              onClick={() => handleMakeCoverImage(safePreviewIdx)}
                              className="px-2 py-1 bg-[#D4AF37] hover:bg-[#c49f2e] text-black rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              ★ Set as Cover
                            </button>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-md text-[9px] font-bold">
                              Cover Photo
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImageAt(safePreviewIdx)}
                            className="px-2 py-1 bg-rose-900/80 hover:bg-rose-700 text-white rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <TrashIcon className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-3 text-gray-500 space-y-1">
                        <span className="text-xl block">🖼️</span>
                        <p className="text-[11px] font-medium">No photos added yet</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= BOTTOM STEP CONTROLS ================= */}
          <div className="pt-4 border-t border-[#261E2D] flex items-center justify-between gap-3 shrink-0">
            {step === 1 ? (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-white/5"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { setStep(step - 1); setStepError(''); }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-white/5"
              >
                ← Back
              </button>
            )}

            <div className="flex items-center gap-2">
              {step < 3 ? (
                <button
                  type="button"
                  onClick={step === 1 ? handleNextFromStep1 : handleNextFromStep2}
                  className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-black rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <span>Continue to {step === 1 ? 'Pricing' : 'Photos'}</span>
                  <span>→</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={productSaving || uploadingImage}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#B76E79] to-[#8E4453] hover:from-[#c27c87] hover:to-[#9f4f5f] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {productSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Product...</span>
                    </>
                  ) : (
                    <span>{editingProductId ? 'Update Product' : '+ Add Product to Store'}</span>
                  )}
                </button>
              )}
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
