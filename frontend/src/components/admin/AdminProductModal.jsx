import { useState, useEffect } from 'react';
import {
  CloseIcon,
  CheckIcon,
  TrashIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  UploadIcon,
  ImageIcon,
  LinkIcon,
  TagIcon,
  FlameIcon,
  StarIcon,
  AlertCircleIcon
} from '../Icons';

const DEFAULT_CATEGORIES = [
  { id: 'female', label: 'Female (Women Wear)', desc: 'Luxury pret, formals & festive suits' },
  { id: 'babies', label: 'Kids Collection', desc: 'Festive & charming wear for girls' },
  { id: 'unstitched', label: 'Unstitched Suits', desc: 'Embroidered fabrics, chiffons & lawns' },
  { id: 'stitched', label: 'Stitched (Ready to Wear)', desc: 'Tailored 3-piece & 2-piece outfits' }
];

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'Free Size'];
const TAG_PRESETS = ['New Arrival', 'Bestseller', 'Trending', 'Seasonal Sale'];
const PIECE_PRESETS = ['3 Piece', '2 Piece', '1 Piece', 'Unstitched Fabric'];

// Rich color names dictionary for instant auto-hex conversion when typing
const LUXURY_COLOR_MAP = {
  // Whites, Ivories & Neutrals
  'white': '#FFFFFF',
  'pure white': '#FFFFFF',
  'pearl white': '#F8F6F0',
  'off white': '#FAF9F6',
  'offwhite': '#FAF9F6',
  'ivory': '#FFFFF0',
  'ivory gold': '#D4AF37',
  'cream': '#FFFDD0',
  'milky white': '#FDFBF7',
  'snow white': '#FFFAFA',
  'chalk': '#F5F5F5',
  'beige': '#F5F5DC',
  'tan': '#D2B48C',
  'champagne': '#F7E7CE',
  'khaki': '#F0E68C',

  // Blacks & Grays
  'black': '#000000',
  'jet black': '#111111',
  'siyah': '#0A0A0A',
  'charcoal': '#36454F',
  'slate': '#708090',
  'gray': '#808080',
  'grey': '#808080',
  'dark gray': '#A9A9A9',
  'dark grey': '#A9A9A9',
  'light gray': '#D3D3D3',
  'light grey': '#D3D3D3',
  'silver': '#C0C0C0',

  // Reds & Maroons
  'red': '#FF0000',
  'surkh': '#B31B1B',
  'laal': '#D62246',
  'ruby': '#E0115F',
  'royal ruby': '#9B111E',
  'maroon': '#800000',
  'burgundy': '#641E32',
  'wine': '#722F37',
  'crimson': '#DC143C',
  'scarlet': '#FF2400',
  'rust': '#9B3D2B',
  'brick': '#CB4154',

  // Pinks & Roses
  'pink': '#FFC0CB',
  'gulabi': '#FF69B4',
  'rose': '#FF007F',
  'dusty rose': '#B76E79',
  'velvet rose': '#A3485E',
  'baby pink': '#F4C2C2',
  'pastel pink': '#FFD1DC',
  'hot pink': '#FF69B4',
  'magenta': '#FF00FF',
  'blush': '#DE5D83',
  'peach': '#FFE5B4',
  'coral': '#FF7F50',
  'salmon': '#FA8072',

  // Blues & Teals
  'blue': '#0000FF',
  'royal blue': '#4169E1',
  'navy': '#000080',
  'royal navy': '#1B263B',
  'navy blue': '#1B263B',
  'midnight blue': '#191970',
  'sky blue': '#87CEEB',
  'baby blue': '#89CFF0',
  'ice blue': '#AFDBF5',
  'powder blue': '#B0E0E6',
  'cyan': '#00FFFF',
  'teal': '#008080',
  'turquoise': '#40E0D0',
  'aqua': '#00FFFF',
  'sapphire': '#0F52BA',
  'denim': '#1560BD',

  // Greens
  'green': '#008000',
  'emerald': '#0F4D3A',
  'emerald green': '#0F4D3A',
  'dark green': '#006400',
  'forest green': '#228B22',
  'olive': '#808000',
  'olive green': '#556B2F',
  'mint': '#98FF98',
  'sage': '#9CABA0',
  'sage mint': '#9CABA0',
  'sea green': '#2E8B57',
  'lime': '#00FF00',
  'pistachio': '#93C572',
  'bottle green': '#006A4E',
  'mehendi': '#4A5D23',

  // Yellows & Golds
  'yellow': '#FFFF00',
  'gold': '#D4AF37',
  'golden': '#FFD700',
  'metallic gold': '#D4AF37',
  'mustard': '#C28B38',
  'mustard yellow': '#E1AD01',
  'lemon': '#FFF700',
  'amber': '#FFBF00',
  'honey': '#EB9605',

  // Purples & Violets
  'purple': '#800080',
  'violet': '#8F00FF',
  'lilac': '#8B728E',
  'plum': '#8E4585',
  'lavender': '#E6E6FA',
  'mauve': '#E0B0FF',
  'indigo': '#4B0082',

  // Browns & Oranges
  'orange': '#FFA500',
  'brown': '#8B4513',
  'chocolate': '#7B3F00',
  'coffee': '#6F4E37',
  'copper': '#B87333',
  'bronze': '#CD7F32'
};

function resolveColorNameToHex(input) {
  if (!input || typeof input !== 'string') return null;
  const raw = input.trim().toLowerCase();
  if (!raw) return null;

  // 1. Direct hex pattern (#fff or #ffffff)
  if (/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw)) {
    const cleanHex = raw.startsWith('#') ? raw : `#${raw}`;
    if (cleanHex.length === 4) {
      return `#${cleanHex[1]}${cleanHex[1]}${cleanHex[2]}${cleanHex[2]}${cleanHex[3]}${cleanHex[3]}`.toUpperCase();
    }
    return cleanHex.toUpperCase();
  }

  // 2. Direct dictionary match
  if (LUXURY_COLOR_MAP[raw]) {
    return LUXURY_COLOR_MAP[raw];
  }

  // 3. Substring / compound word matching
  for (const [key, hex] of Object.entries(LUXURY_COLOR_MAP)) {
    if (raw === key || raw.startsWith(`${key} `) || raw.endsWith(` ${key}`) || raw.includes(` ${key} `)) {
      return hex;
    }
  }

  // 4. Native browser Canvas CSS color parser for standard CSS color names
  if (typeof document !== 'undefined') {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#010203';
      ctx.fillStyle = raw;
      if (ctx.fillStyle !== '#010203' || raw === '#010203') {
        const comp = ctx.fillStyle;
        if (comp && comp.startsWith('#')) {
          return comp.toUpperCase();
        }
      }
    } catch {
      // ignore
    }
  }

  return null;
}

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
  const [stepError, setStepError] = useState('');
  const [previewIdx, setPreviewIdx] = useState(0);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#641E32');

  // Original Price and Discount Percentage state
  const [baseOriginalPrice, setBaseOriginalPrice] = useState(() => {
    if (productForm.originalPrice && Number(productForm.originalPrice) > 0) {
      return productForm.originalPrice;
    }
    return productForm.price || '';
  });

  const [discountPercentInput, setDiscountPercentInput] = useState(() => {
    const orig = Number(productForm.originalPrice) || 0;
    const current = Number(productForm.price) || 0;
    if (orig > current && current > 0) {
      return Math.round(((orig - current) / orig) * 100);
    }
    return 0;
  });

  // Sync pricing state when modal opens or editing product changes
  useEffect(() => {
    if (isOpen) {
      const orig = Number(productForm.originalPrice) || 0;
      const current = Number(productForm.price) || 0;
      if (orig > current && current > 0) {
        setBaseOriginalPrice(orig);
        setDiscountPercentInput(Math.round(((orig - current) / orig) * 100));
      } else {
        setBaseOriginalPrice(current || orig || '');
        setDiscountPercentInput(0);
      }
    }
  }, [isOpen, editingProductId]);

  const handlePriceDiscountChange = (newBasePrice, newDiscountPct) => {
    setBaseOriginalPrice(newBasePrice);
    setDiscountPercentInput(newDiscountPct);
    if (stepError) setStepError('');

    const origNum = Number(newBasePrice) || 0;
    const discNum = Math.min(99, Math.max(0, Number(newDiscountPct) || 0));

    if (origNum > 0) {
      if (discNum > 0) {
        const calculatedSale = Math.round(origNum * (1 - discNum / 100));
        setProductForm(prev => ({
          ...prev,
          price: calculatedSale,
          originalPrice: origNum,
          discountPercent: discNum,
          isOnSale: true,
          isNewArrival: false,
          tag: `${discNum}% OFF`
        }));
      } else {
        setProductForm(prev => ({
          ...prev,
          price: origNum,
          originalPrice: '',
          discountPercent: 0,
          isOnSale: false,
          isNewArrival: true,
          tag: (prev.tag && prev.tag.includes('% OFF')) ? 'New Arrival' : prev.tag
        }));
      }
    } else {
      setProductForm(prev => ({
        ...prev,
        price: '',
        originalPrice: '',
        discountPercent: 0,
        isOnSale: false
      }));
    }
  };

  // Reset step whenever modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStep(1);
        setStepError('');
        setPreviewIdx(0);
        setNewColorName('');
        setNewColorHex('#641E32');
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
  const origPrice = Number(productForm.originalPrice) || Number(baseOriginalPrice) || 0;
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

  // Color handlers
  const handleColorNameInputChange = (val) => {
    setNewColorName(val);
    setStepError('');
    const matchedHex = resolveColorNameToHex(val);
    if (matchedHex) {
      setNewColorHex(matchedHex);
    }
  };

  const handleHexInputChange = (val) => {
    let clean = val;
    if (!clean.startsWith('#') && clean.trim() !== '') {
      clean = `#${clean}`;
    }
    setNewColorHex(clean.toUpperCase());
    setStepError('');
  };

  const handleAddColor = () => {
    const trimmedName = newColorName.trim();
    if (!trimmedName) {
      setStepError('Please enter a color name (e.g. White, Black, Ruby, Emerald).');
      return;
    }
    const currentColors = Array.isArray(productForm.colors) ? productForm.colors : [];
    const nameLower = trimmedName.toLowerCase();
    if (currentColors.some(c => (c.name || '').toLowerCase() === nameLower)) {
      setStepError(`Color "${trimmedName}" is already added.`);
      return;
    }

    const finalHex = /^#[0-9A-F]{6}$/i.test(newColorHex)
      ? newColorHex
      : (resolveColorNameToHex(trimmedName) || '#641E32');

    setProductForm({
      ...productForm,
      colors: [...currentColors, { name: trimmedName, hex: finalHex }]
    });
    setNewColorName('');
    setStepError('');
  };

  const handleRemoveColor = (idxToRemove) => {
    const currentColors = Array.isArray(productForm.colors) ? productForm.colors : [];
    setProductForm({
      ...productForm,
      colors: currentColors.filter((_, i) => i !== idxToRemove)
    });
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
    const effPrice = Number(productForm.price) || Number(baseOriginalPrice);
    if (!effPrice || effPrice <= 0) {
      setStepError('Please enter a valid Original Price (in PKR).');
      return;
    }
    setStep(3);
  };

  const validImages = Array.isArray(productForm.images)
    ? productForm.images.map(img => (img || '').trim()).filter(Boolean)
    : [];
  const safePreviewIdx = validImages.length > 0 ? Math.min(previewIdx, validImages.length - 1) : 0;
  const currentPreviewImage = validImages[safePreviewIdx] || '';

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
      className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 overflow-hidden overscroll-contain"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-[#141018] text-white rounded-2xl sm:rounded-3xl border border-[#D4AF37]/40 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden overscroll-contain flex flex-col max-h-[96vh] sm:max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#261E2D] bg-[#18131E] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B76E79]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
              <SparklesIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
                {editingProductId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-[10px] text-gray-400 truncate">
                Step-by-step product catalog manager
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Close (Esc)"
          >
            <CloseIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Multi-Step Wizard Progress Bar */}
        <div className="px-3 sm:px-6 py-2.5 sm:py-3 bg-[#110D15] border-b border-[#241C2B] shrink-0">
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
                {step > 1 ? <CheckIcon className="w-3.5 h-3.5 stroke-[3]" /> : '1'}
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
                {step > 2 ? <CheckIcon className="w-3.5 h-3.5 stroke-[3]" /> : '2'}
              </span>
              <span className="hidden sm:inline">Pricing, Sizes & Colors</span>
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
          <div className="mx-3.5 sm:mx-6 mt-2.5 px-3 py-2 bg-rose-950/70 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2 shrink-0 animate-reveal-up">
            <AlertCircleIcon className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{stepError || productFormError}</span>
          </div>
        )}

        {/* Step-by-Step Form Body */}
        <form onSubmit={onSave} className="p-3.5 sm:p-6 flex-1 flex flex-col justify-between overflow-y-auto overscroll-contain admin-scrollbar">
          
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
                      <SparklesIcon className="w-4 h-4 text-[#D4AF37] shrink-0" />
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
                      <TagIcon className="w-4 h-4 text-emerald-400 shrink-0" />
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
                      <FlameIcon className="w-4 h-4 text-purple-400 shrink-0" />
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
              {/* Pricing & Automatic Discount Section */}
              <div className="space-y-3 p-4 bg-[#18131E] rounded-2xl border border-[#2F2638]">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-white block">
                      Product Pricing & Automatic Discount
                    </label>
                    <p className="text-[10px] text-gray-400">
                      Enter the original price and discount percentage — sale price and discount badge are calculated automatically.
                    </p>
                  </div>
                  {Number(discountPercentInput) > 0 && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/30">
                      {discountPercentInput}% OFF
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Original Price */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-200 block">
                      Original Price (PKR) <span className="text-[#D4AF37]">*</span>
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
                        value={baseOriginalPrice}
                        onChange={(e) => handlePriceDiscountChange(e.target.value, discountPercentInput)}
                        placeholder="e.g. 2000"
                        className="w-full bg-[#120F16] border border-[#2F2638] rounded-xl pl-12 pr-4 py-2.5 text-xs sm:text-sm font-mono text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Discount / Off % */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-gray-200 block">
                        Discount / Off (%)
                      </label>
                      <span className="text-[10px] text-gray-400">
                        {Number(discountPercentInput) > 0 ? `${discountPercentInput}% off original price` : 'No discount (0%)'}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={discountPercentInput}
                        onChange={(e) => handlePriceDiscountChange(baseOriginalPrice, e.target.value)}
                        placeholder="0"
                        className="w-full bg-[#120F16] border border-[#2F2638] rounded-xl pl-4 pr-14 py-2.5 text-xs sm:text-sm font-mono text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-gray-400">
                        % OFF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick 1-Click Discount Preset Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mr-1">
                    Quick Off:
                  </span>
                  {[0, 10, 15, 20, 25, 30, 40, 50].map((pct) => {
                    const isSelected = Number(discountPercentInput) === pct;
                    return (
                      <button
                        type="button"
                        key={pct}
                        onClick={() => handlePriceDiscountChange(baseOriginalPrice, pct)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#D4AF37] text-black shadow-sm'
                            : 'bg-[#120F16] hover:bg-[#201927] text-gray-300 hover:text-white border border-[#2F2638]'
                        }`}
                      >
                        {pct === 0 ? 'No Off (0%)' : `${pct}% OFF`}
                      </button>
                    );
                  })}
                </div>

                {/* Live Calculated Price Summary Box */}
                {Number(baseOriginalPrice) > 0 && (
                  <div className="mt-2 p-3 bg-[#120F16] border border-[#2A2132] rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Customer Pays:</span>
                      <span className="font-mono text-sm sm:text-base font-bold text-emerald-400">
                        Rs. {(productForm.price ? Number(productForm.price) : Number(baseOriginalPrice)).toLocaleString()}
                      </span>
                      {Number(discountPercentInput) > 0 && (
                        <span className="font-mono text-xs text-gray-500 line-through">
                          Rs. {Number(baseOriginalPrice).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {Number(discountPercentInput) > 0 ? (
                      <div className="flex items-center gap-2 text-[11px] text-emerald-300 font-medium">
                        <span>Save Rs. {(Number(baseOriginalPrice) - Number(productForm.price)).toLocaleString()}</span>
                        <span className="px-2 py-0.5 rounded-md bg-[#641E32] text-white font-bold text-[10px] tracking-wider uppercase">
                          Tag: {productForm.tag || `${discountPercentInput}% OFF`}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-gray-400">Regular full price (No discount)</span>
                    )}
                  </div>
                )}
              </div>

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

              {/* Color Selection & Management */}
              <div className="space-y-2.5 pt-3 border-t border-[#261E2D]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-200 block">
                    Product Colors ({Array.isArray(productForm.colors) ? productForm.colors.length : 0} added)
                  </label>
                  <span className="text-[10px] text-gray-400">
                    Type color name (e.g. White, Black, Ruby) or pick a custom shade
                  </span>
                </div>

                {/* Custom Color Input Form with Auto-Hex Detection */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-[#17121C] p-2.5 rounded-xl border border-[#2B2332]">
                  <div className="flex items-center gap-2 bg-[#120F16] px-2.5 py-1.5 rounded-lg border border-[#2F2638] shrink-0 focus-within:border-[#D4AF37] transition-colors">
                    <input
                      type="color"
                      value={/^#[0-9A-F]{6}$/i.test(newColorHex) ? newColorHex : '#641E32'}
                      onChange={(e) => {
                        setNewColorHex(e.target.value.toUpperCase());
                        setStepError('');
                      }}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
                      title="Choose color shade from palette"
                    />
                    <input
                      type="text"
                      value={newColorHex}
                      onChange={(e) => handleHexInputChange(e.target.value)}
                      placeholder="#FFFFFF"
                      maxLength={7}
                      className="w-16 bg-transparent font-mono text-[11px] text-gray-200 uppercase focus:outline-none focus:text-[#D4AF37]"
                      title="Hex color code (e.g. #FFFFFF)"
                    />
                  </div>

                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => handleColorNameInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddColor();
                      }
                    }}
                    placeholder="Enter color name (e.g. White, Black, Ruby, Emerald)..."
                    className="flex-1 min-w-[140px] bg-[#120F16] border border-[#2F2638] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3.5 py-1.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-black font-bold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    <span>Add Color</span>
                  </button>
                </div>

                {/* Active Added Colors Chips */}
                {Array.isArray(productForm.colors) && productForm.colors.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {productForm.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#1C1623] border border-[#3A2F45] text-xs text-white"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0 shadow-sm"
                          style={{ backgroundColor: color.hex || '#641E32' }}
                        />
                        <span className="font-medium text-[11px]">{color.name}</span>
                        <span className="text-[9px] font-mono text-gray-400 uppercase">({color.hex})</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(idx)}
                          className="p-0.5 text-gray-400 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                          title={`Remove ${color.name}`}
                        >
                          <CloseIcon className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-500 italic pt-0.5">
                    No colors added yet. Enter a color name above and click "+ Add Color".
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 3: PHOTO & DETAILS ================= */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Image Upload Controls (Device Upload Only) */}
                <div className="md:col-span-2 space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-200 block">
                      Upload Multiple Product Photos ({validImages.length} added)
                    </label>
                    <div className="p-4 border-2 border-dashed border-[#3A2F45] hover:border-[#D4AF37] rounded-2xl bg-[#1A1521] text-center transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={onImageFileUpload}
                        disabled={uploadingImage}
                        id="admin-step-file-upload"
                        className="hidden"
                      />
                      <label htmlFor="admin-step-file-upload" className="cursor-pointer block space-y-1.5">
                        <UploadIcon className="w-8 h-8 text-[#D4AF37] mx-auto block" />
                        <p className="text-xs font-semibold text-white">
                          {validImages.length > 0
                            ? '+ Click to upload more photos to carousel'
                            : 'Click to select product photos from device'}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Select JPG, PNG, WebP files (Maximum limit: <span className="text-[#D4AF37] font-semibold">1 MB</span> per photo)
                        </p>
                      </label>
                      {uploadingImage && (
                        <div className="mt-2 text-xs text-[#D4AF37] flex items-center justify-center gap-1.5 animate-pulse font-semibold">
                          <span>⏳ Uploading photos to Cloudinary...</span>
                        </div>
                      )}
                    </div>
                  </div>

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
                              className="px-2 py-1 bg-[#D4AF37] hover:bg-[#c49f2e] text-black rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <StarIcon className="w-3 h-3 shrink-0" />
                              <span>Set as Cover</span>
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
                      <div className="text-center p-3 text-gray-500 space-y-1.5">
                        <ImageIcon className="w-7 h-7 mx-auto text-gray-500 block" />
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
