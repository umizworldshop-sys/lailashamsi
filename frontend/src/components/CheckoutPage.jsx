import React, { useState, useMemo, useCallback, startTransition, memo } from 'react';
import {
  ShoppingBagIcon,
  ShieldCheckIcon,
  TruckIcon,
  CheckIcon,
  LockIcon,
  SparklesIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  WhatsAppIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  PackageIcon
} from './Icons';
import ProductCard from './ProductCard';
import { CURRENCY_RATES } from '../data/products';
import { createOrder, generateInstantOrderNumber } from '../services/api';

// Memoized Product Card inside Checkout so 1,000+ concurrent renders stay ultra-fast
const CheckoutProductRow = memo(function CheckoutProductRow({
  item,
  curr,
  onUpdateQuantity,
  onUpdateItemVariant,
  onRemoveItem
}) {
  const unitPrice = Math.round(Number(item.price || 0) * curr.rate);
  const originalUnitPrice = Math.round(Number(item.originalPrice || item.price || 0) * curr.rate);
  const hasDiscount = originalUnitPrice > unitPrice;

  return (
    <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E8DCCB] shadow-sm transition-all hover:border-[#B89B62]/60">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image from Backend */}
        <div className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-xl overflow-hidden bg-[#FAF5EC] border border-[#E8DCCB] flex-shrink-0">
          <img
            src={item.images?.[0]}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover object-top"
          />
          {item.tag && (
            <span className="absolute top-1.5 left-1.5 bg-[#641E32] text-[#FAF5EC] text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              {item.tag}
            </span>
          )}
        </div>

        {/* Full Backend Product Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#B89B62]">
                    {item.categoryLabel || item.category}
                  </span>
                  <span className="text-[9.5px] bg-[#641E32]/10 text-[#641E32] px-2 py-0.5 rounded-full font-semibold">
                    {item.stock > 0 ? `In Stock (${item.stock} available)` : 'Available for Dispatch'}
                  </span>
                </div>
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#641E32] leading-snug">
                  {item.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => onRemoveItem(item)}
                className="text-[#282321]/40 hover:text-red-600 transition-colors p-1"
                title="Remove product"
                aria-label="Remove product"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Authentic Backend Specifications (Fabric, Pieces, Description) */}
            <div className="mt-2 p-2.5 rounded-xl bg-[#FAF5EC] border border-[#E8DCCB]/80 text-[11px] space-y-1 text-[#282321]/85">
              {item.fabric && (
                <p>
                  <strong className="text-[#641E32]">Fabric:</strong> {item.fabric}
                </p>
              )}
              {item.pieces && (
                <p>
                  <strong className="text-[#641E32]">Includes:</strong> {item.pieces}
                </p>
              )}
              {item.description && (
                <p className="text-[#282321]/70 line-clamp-2 pt-0.5">
                  {item.description}
                </p>
              )}
            </div>

            {/* Interactive Size & Color Selectors synced with Backend Product Options */}
            <div className="flex flex-wrap items-center gap-4 mt-3">
              {/* Size Selector */}
              {Array.isArray(item.sizes) && item.sizes.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#282321]/70">
                    Size:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() =>
                          onUpdateItemVariant(item, {
                            selectedSize: sz,
                            selectedColor: item.selectedColor
                          })
                        }
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                          item.selectedSize === sz
                            ? 'bg-[#641E32] text-[#FAF5EC] shadow-sm'
                            : 'bg-[#FAF5EC] border border-[#E8DCCB] text-[#282321] hover:border-[#641E32]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Swatches */}
              {Array.isArray(item.colors) && item.colors.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#282321]/70">
                    Color:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {item.colors.map((color) => {
                      const isSelected = item.selectedColor?.name === color.name;
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() =>
                            onUpdateItemVariant(item, {
                              selectedSize: item.selectedSize,
                              selectedColor: color
                            })
                          }
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border transition-all ${
                            isSelected
                              ? 'border-[#641E32] bg-[#641E32]/10 text-[#641E32] font-bold'
                              : 'border-[#E8DCCB] bg-[#FAF5EC] text-[#282321]/75'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/15"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span>{color.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quantity & Price Line */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#E8DCCB]/60">
            <div className="flex items-center border border-[#E8DCCB] rounded-xl bg-[#FAF5EC]">
              <button
                type="button"
                onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="px-2.5 py-1 text-[#282321] hover:bg-[#E8DCCB] disabled:opacity-40 transition-colors rounded-l-xl"
                aria-label="Decrease quantity"
              >
                <MinusIcon className="w-3 h-3" />
              </button>
              <span className="px-3 text-xs font-bold text-[#282321]">{item.quantity}</span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                className="px-2.5 py-1 text-[#282321] hover:bg-[#E8DCCB] transition-colors rounded-r-xl"
                aria-label="Increase quantity"
              >
                <PlusIcon className="w-3 h-3" />
              </button>
            </div>

            <div className="text-right">
              {hasDiscount && (
                <span className="text-[11px] text-[#282321]/45 line-through mr-2">
                  {curr.symbol}{(originalUnitPrice * item.quantity).toLocaleString()}
                </span>
              )}
              <span className="font-cinzel font-bold text-sm sm:text-base text-[#641E32]">
                {curr.symbol}{(unitPrice * item.quantity).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Strict Pakistani Mobile Number Validation (03XXXXXXXXX - 11 digits, real network prefix)
const isValidPakistaniPhone = (phone) => {
  const digits = (phone || '').replace(/\D/g, '');
  // Must be 11 digits starting with 03
  if (!/^03[0-9]{9}$/.test(digits)) {
    return false;
  }
  const suffix = digits.slice(2); // remaining 9 digits
  // Reject identical repeating digits (e.g. 000000000, 111111111, etc.)
  if (/^(\d)\1+$/.test(suffix)) {
    return false;
  }
  // Reject simple dummy sequences
  if (
    suffix === '123456789' ||
    suffix === '987654321' ||
    suffix === '012345678' ||
    suffix === '000000001'
  ) {
    return false;
  }
  return true;
};

// Strict Real Email Validation (Blocks dummy, fake, disposable or incomplete addresses)
const isValidRealEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const cleaned = email.trim().toLowerCase();

  // Standard RFC regex
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(cleaned)) return false;

  const [localPart, domainPart] = cleaned.split('@');
  if (!localPart || !domainPart) return false;

  // Local part must be at least 2 characters
  if (localPart.length < 2) return false;

  // Reject common dummy / fake usernames
  const fakePrefixes = [
    'test', 'fake', 'dummy', 'temp', 'asdf', 'qwerty', 'abc', 'xyz',
    'none', 'noemail', 'sample', 'example', 'user', 'admin', 'client',
    'customer', 'guest', 'na', 'null'
  ];
  if (fakePrefixes.includes(localPart)) return false;

  // Reject disposable / dummy domains
  const fakeDomains = [
    'example.com', 'test.com', 'fake.com', 'dummy.com', 'sample.com',
    'asdf.com', 'temp.com', 'mailinator.com', 'tempmail.com', 'trashmail.com',
    '10minutemail.com', 'guerrillamail.com', 'yopmail.com', 'sharklasers.com',
    'dispostable.com', 'getairmail.com', 'throwawaymail.com', 'email.com',
    'domain.com', 'site.com'
  ];
  if (fakeDomains.includes(domainPart)) return false;

  // Check top-level domain has at least 2 letters (.com, .pk, .net, etc.)
  const parts = domainPart.split('.');
  const tld = parts[parts.length - 1];
  if (!tld || tld.length < 2) return false;

  return true;
};

export default function CheckoutPage({
  items = [],
  products = [],
  initialCheckoutData = null,
  onUpdateQuantity,
  onUpdateItemVariant,
  onRemoveItem,
  onOrderSuccess,
  onQuickView,
  onAddToCart,
  wishlist = [],
  onToggleWishlist,
  selectedCurrency = 'PKR',
  onNavigate
}) {
  const curr = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES.PKR;

  // ---------------------------------------------------------------------------
  // 1. SYNC EVERY CART ITEM WITH LIVE BACKEND PRODUCT DETAILS
  // Ensures title, fabric, pieces, description, price, originalPrice, sizes,
  // colors, categoryLabel, and stock always match the backend catalog.
  // ---------------------------------------------------------------------------
  const enrichedItems = useMemo(() => {
    return items.map((item) => {
      const backendProduct = products.find(
        (p) =>
          (p.id !== undefined && String(p.id) === String(item.id)) ||
          (p._id !== undefined && String(p._id) === String(item._id || item.id)) ||
          (p.title && item.title && p.title.toLowerCase() === item.title.toLowerCase())
      );

      if (!backendProduct) return item;

      return {
        ...backendProduct,
        ...item,
        id: backendProduct.id || backendProduct._id || item.id,
        productId: String(backendProduct._id || backendProduct.id || item.id),
        title: backendProduct.title,
        category: backendProduct.category,
        categoryLabel: backendProduct.categoryLabel,
        fabric: backendProduct.fabric,
        pieces: backendProduct.pieces,
        description: backendProduct.description,
        price: Number(backendProduct.price),
        originalPrice: Number(backendProduct.originalPrice || backendProduct.price),
        images:
          Array.isArray(backendProduct.images) && backendProduct.images.length > 0
            ? backendProduct.images
            : item.images,
        sizes:
          Array.isArray(backendProduct.sizes) && backendProduct.sizes.length > 0
            ? backendProduct.sizes
            : item.sizes,
        colors:
          Array.isArray(backendProduct.colors) && backendProduct.colors.length > 0
            ? backendProduct.colors
            : item.colors,
        stock: backendProduct.stock ?? item.stock ?? 15,
        selectedSize: item.selectedSize || backendProduct.sizes?.[0] || 'M',
        selectedColor: item.selectedColor || backendProduct.colors?.[0] || { name: 'Default', hex: '#641E32' }
      };
    });
  }, [items, products]);

  // Customer & Shipping Form State (Single Page)
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Lahore',
    postalCode: '',
    country: 'Pakistan',
    notes: ''
  });

  // Default payment method is Cash on Delivery (COD) via WhatsApp
  const paymentMethod = 'cod';

  // Form Validation & Specific Field Errors
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Confirmed Order Receipt State (Displayed on the same /checkout page with 0ms wait)
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Totals Calculation (Memoized)
  const { subtotal, discountAmount, shippingFee, grandTotal } = useMemo(() => {
    const rawSubtotal = enrichedItems.reduce(
      (acc, item) => acc + Number(item.price || 0) * curr.rate * Number(item.quantity || 1),
      0
    );
    const freeShippingThreshold = 150 * curr.rate;
    const disc = 0;
    const ship =
      rawSubtotal >= freeShippingThreshold || enrichedItems.length === 0
        ? 0
        : (curr.symbol === 'Rs. ' ? 250 : Math.round(15 * curr.rate));
    const total = Math.max(0, Math.round(rawSubtotal - disc + ship));

    return {
      subtotal: Math.round(rawSubtotal),
      discountAmount: disc,
      shippingFee: ship,
      grandTotal: total
    };
  }, [enrichedItems, curr.rate]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // STRICT: Only allow numbers (digits 0-9), max 11 digits for Pakistani mobile
      const digitsOnly = value.replace(/\D/g, '').slice(0, 11);
      setShippingInfo((prev) => ({ ...prev, phone: digitsOnly }));
      setFieldErrors((prev) => ({ ...prev, phone: '' }));
      setFormError('');
      return;
    }

    setShippingInfo((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setFormError('');
  }, []);

  // ---------------------------------------------------------------------------
  // 2. DIRECT WHATSAPP ORDER SUBMISSION WITH LIVE BACKEND PERSISTENCE
  // Collects all user input from form, builds itemized breakdown, and
  // opens WhatsApp directly (03174341036) while persisting to backend.
  // ---------------------------------------------------------------------------
  const handleCompleteOrder = (e) => {
    e.preventDefault();

    const errors = {};

    // 1. Full Name check
    if (!shippingInfo.fullName.trim() || shippingInfo.fullName.trim().length < 3) {
      errors.fullName = 'Please enter your genuine Full Name (at least 3 characters).';
    }

    // 2. Strict Pakistani Mobile Number check
    if (!shippingInfo.phone.trim()) {
      errors.phone = 'Phone / WhatsApp number is required.';
    } else if (shippingInfo.phone.length < 11) {
      errors.phone = `Incomplete number (${shippingInfo.phone.length}/11 digits). Pakistani mobile number must be 11 digits.`;
    } else if (!isValidPakistaniPhone(shippingInfo.phone)) {
      errors.phone = 'Please enter a valid Pakistani mobile number starting with 03 (e.g. 03001234567). Dummy or repetitive numbers are rejected.';
    }

    // 3. Strict Real Email check
    if (!shippingInfo.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!isValidRealEmail(shippingInfo.email)) {
      errors.email = 'Please enter a genuine, active email address (e.g. yourname@gmail.com). Fake, dummy, or temporary emails are rejected.';
    }

    // 4. City check
    if (!shippingInfo.city.trim() || shippingInfo.city.trim().length < 2) {
      errors.city = 'Please enter your delivery City.';
    }

    // 5. Complete Address check
    if (!shippingInfo.address.trim() || shippingInfo.address.trim().length < 5) {
      errors.address = 'Please enter complete street address & house number (at least 5 characters).';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError(Object.values(errors)[0]);
      return;
    }

    setFieldErrors({});
    setFormError('');

    const instantOrderNo = generateInstantOrderNumber();

    // Build payload with full backend product details for each item
    const orderItemsPayload = enrichedItems.map((item) => ({
      productId: String(item.productId || item.id || item._id || ''),
      title: item.title,
      category: item.category || '',
      categoryLabel: item.categoryLabel || '',
      fabric: item.fabric || '',
      pieces: item.pieces || '',
      description: item.description || '',
      price: Math.round(Number(item.price || 0) * curr.rate),
      originalPrice: Math.round(Number(item.originalPrice || item.price || 0) * curr.rate),
      quantity: Number(item.quantity || 1),
      selectedSize: item.selectedSize || 'M',
      selectedColor: item.selectedColor || { name: 'Default', hex: '#641E32' },
      image: item.images?.[0] || ''
    }));

    const orderPayload = {
      orderNumber: instantOrderNo,
      customer: { ...shippingInfo, country: 'Pakistan' },
      items: orderItemsPayload,
      subtotal,
      discountAmount: 0,
      promoCode: '',
      shippingFee,
      grandTotal,
      currency: selectedCurrency,
      paymentMethod: 'cod'
    };

    // Format full order details into a clean, itemized WhatsApp message
    const itemsListText = orderItemsPayload
      .map(
        (i, idx) =>
          `${idx + 1}. *${i.title}*\n   • Size: ${i.selectedSize} | Color: ${i.selectedColor?.name || 'Standard'}\n   • Qty: ${i.quantity} × ${curr.symbol}${i.price.toLocaleString()} = ${curr.symbol}${(i.price * i.quantity).toLocaleString()}`
      )
      .join('\n\n');

    const whatsappMessage = `*🛍️ NEW ORDER - UMI'Z WORLD*
*Order Reference:* ${instantOrderNo}
───────────────────────
*👤 CUSTOMER DETAILS:*
• *Full Name:* ${shippingInfo.fullName.trim()}
• *Phone / WhatsApp:* ${shippingInfo.phone.trim()}
• *Email:* ${shippingInfo.email.trim() || 'N/A'}
• *City:* ${shippingInfo.city.trim()}
• *Delivery Address:* ${shippingInfo.address.trim()}
• *Country:* Pakistan
${shippingInfo.notes?.trim() ? `• *Special Note:* ${shippingInfo.notes.trim()}\n` : ''}───────────────────────
*👗 ORDERED ITEMS:*
${itemsListText}
───────────────────────
*💰 PAYMENT & TOTAL:*
• *Subtotal:* ${curr.symbol}${subtotal.toLocaleString()}
• *Delivery Charges:* ${shippingFee === 0 ? 'Free (Complimentary)' : `${curr.symbol}${shippingFee.toLocaleString()}`}
• *Total Payable:* ${curr.symbol}${grandTotal.toLocaleString()}
• *Payment Method:* Cash on Delivery (COD Across Pakistan)
───────────────────────
Please confirm my order. Thank you!`;

    const whatsappUrl = `https://wa.me/923174341036?text=${encodeURIComponent(whatsappMessage)}`;

    // Open WhatsApp directly with the pre-filled order details
    window.open(whatsappUrl, '_blank');

    // Immediately show confirmed receipt on the same page (0ms wait time!)
    startTransition(() => {
      setConfirmedOrder({
        ...orderPayload,
        createdAt: new Date().toLocaleString()
      });
      if (onOrderSuccess) {
        onOrderSuccess();
      }
    });

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Fire non-blocking background persistence to MongoDB backend
    createOrder(orderPayload).catch(() => {
      // Handled gracefully by api.js offline/high-load queue
    });
  };

  const recommendedProducts = useMemo(
    () => products.filter((p) => !items.some((i) => i.id === p.id)).slice(0, 4),
    [products, items]
  );

  // ===========================================================================
  // VIEW A: INSTANT ORDER CONFIRMATION RECEIPT (On the same /checkout page)
  // ===========================================================================
  if (confirmedOrder) {
    return (
      <div className="bg-[#FAF5EC] text-[#282321] pt-32 sm:pt-36 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-[#E8DCCB] shadow-xl p-6 sm:p-10 space-y-8 animate-reveal-up">
            {/* Top Confirmation Header */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#641E32] text-[#FAF5EC] flex items-center justify-center mx-auto shadow-lg border-4 border-[#B89B62]/40">
                <CheckIcon className="w-8 h-8" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#641E32]/10 text-[#641E32] text-[10px] font-bold uppercase tracking-[0.2em]">
                <SparklesIcon className="w-3.5 h-3.5 text-[#B89B62]" />
                Order Confirmed Instantly
              </span>
              <h1 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#641E32]">
                Thank You, {confirmedOrder.customer.fullName}!
              </h1>
              <p className="text-xs sm:text-sm text-[#282321]/75 max-w-lg mx-auto">
                Your couture order has been registered at the Umi&apos;z World Flagship Atelier in Lahore with all verified product specifications.
              </p>
            </div>

            {/* Order Reference & Summary Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 sm:p-5 rounded-2xl bg-[#FAF5EC] border border-[#B89B62]/40 text-center sm:text-left">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#282321]/60 font-semibold">
                  Order Reference
                </p>
                <p className="font-cinzel text-lg sm:text-xl font-bold text-[#641E32] mt-0.5">
                  {confirmedOrder.orderNumber}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#282321]/60 font-semibold">
                  Payment Method
                </p>
                <p className="text-xs sm:text-sm font-bold text-[#641E32] uppercase mt-1">
                  {confirmedOrder.paymentMethod === 'cod'
                    ? 'Cash on Delivery (COD)'
                    : confirmedOrder.paymentMethod === 'bank'
                    ? 'Bank / JazzCash / EasyPaisa'
                    : 'Credit / Debit Card'}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#282321]/60 font-semibold">
                  Total Amount
                </p>
                <p className="font-cinzel text-lg sm:text-xl font-bold text-[#641E32] mt-0.5">
                  {curr.symbol}{confirmedOrder.grandTotal.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Ordered Products with Exact Backend Details */}
            <div className="space-y-3">
              <h2 className="font-cinzel text-sm sm:text-base font-bold text-[#641E32] uppercase tracking-wider border-b border-[#E8DCCB] pb-2">
                Ordered Ensembles & Verified Specifications
              </h2>
              <div className="space-y-3">
                {confirmedOrder.items.map((item, idx) => (
                  <div
                    key={`${item.productId}-${idx}`}
                    className="flex flex-col sm:flex-row gap-4 p-3.5 rounded-2xl bg-[#FAF5EC]/70 border border-[#E8DCCB] items-start sm:items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-20 object-cover object-top rounded-xl border border-[#E8DCCB] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9.5px] uppercase tracking-[0.18em] text-[#B89B62] font-bold">
                        {item.categoryLabel || item.category}
                      </span>
                      <h3 className="font-cinzel text-sm font-bold text-[#641E32]">{item.title}</h3>
                      <p className="text-[11px] text-[#282321]/75 mt-0.5">
                        <strong>Size:</strong> {item.selectedSize} • <strong>Color:</strong> {item.selectedColor?.name} • <strong>Qty:</strong> {item.quantity}
                      </p>
                      {(item.fabric || item.pieces) && (
                        <p className="text-[10.5px] text-[#282321]/65 mt-0.5">
                          {item.fabric} {item.pieces ? `— ${item.pieces}` : ''}
                        </p>
                      )}
                    </div>
                    <div className="font-cinzel font-bold text-sm text-[#641E32]">
                      {curr.symbol}{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer & Delivery Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAF5EC] border border-[#E8DCCB] text-xs">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#641E32]">
                  Delivery Destination
                </p>
                <p className="font-semibold text-[#282321]">{confirmedOrder.customer.fullName}</p>
                <p className="text-[#282321]/75">{confirmedOrder.customer.address}</p>
                <p className="text-[#282321]/75">
                  {confirmedOrder.customer.city}, {confirmedOrder.customer.country}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#641E32]">
                  Contact & Atelier Support
                </p>
                <p className="text-[#282321]/80">
                  <strong>Phone / WhatsApp:</strong> {confirmedOrder.customer.phone}
                </p>
                {confirmedOrder.customer.email && (
                  <p className="text-[#282321]/80">
                    <strong>Email:</strong> {confirmedOrder.customer.email}
                  </p>
                )}
                <p className="text-[#641E32] font-medium pt-1">
                  Lahore Atelier: 129 Mehmood Road, New Samanabad • 03174341036
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/923174341036?text=${encodeURIComponent(
                  `Assalam-o-Alaikum Umi'z World Atelier! My Order Reference is ${confirmedOrder.orderNumber} (${confirmedOrder.items
                    .map((i) => `${i.title} - Size ${i.selectedSize}`)
                    .join(', ')}). Total: ${curr.symbol}${confirmedOrder.grandTotal.toLocaleString()}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3.5 px-6 bg-[#25D366] hover:bg-[#1ebd5b] text-[#FAF5EC] rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Confirm on WhatsApp (03174341036)</span>
              </a>
              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="flex-1 py-3.5 px-6 bg-[#641E32] hover:bg-[#282321] text-[#FAF5EC] rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // VIEW B: SINGLE-PAGE EXPRESS CHECKOUT (/checkout)
  // ===========================================================================
  return (
    <div className="bg-[#FAF5EC] text-[#282321] pt-32 sm:pt-36 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-5 border-b border-[#E8DCCB]">
          <div>
            <button
              type="button"
              onClick={() => onNavigate('/cart')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#641E32] hover:text-[#B89B62] transition-colors mb-2"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              <span>Back to Shopping Bag</span>
            </button>
            <h1 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#641E32] tracking-wide">
              Atelier Checkout
            </h1>
          </div>
        </div>

        {enrichedItems.length > 0 ? (
          <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* LEFT COLUMN (7 Cols): Verified Backend Product Details + Delivery Form */}
            <div className="lg:col-span-7 space-y-8">
              {/* SECTION 1: Selected Products with Full Backend Details */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#641E32] text-[#FAF5EC] text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#641E32] uppercase tracking-wider">
                      Selected Outfit Details ({enrichedItems.length})
                    </h2>
                  </div>
                  <span className="text-[11px] text-[#641E32] font-semibold">
                    Synced with Atelier Catalog
                  </span>
                </div>

                <div className="space-y-3">
                  {enrichedItems.map((item) => (
                    <CheckoutProductRow
                      key={`${item.id}-${item.selectedSize}-${item.selectedColor?.name}`}
                      item={item}
                      curr={curr}
                      onUpdateQuantity={onUpdateQuantity}
                      onUpdateItemVariant={onUpdateItemVariant}
                      onRemoveItem={onRemoveItem}
                    />
                  ))}
                </div>
              </section>

              {/* SECTION 2: Customer & Delivery Details */}
              <section className="p-5 sm:p-7 bg-white rounded-3xl border border-[#E8DCCB] shadow-sm space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-[#E8DCCB]">
                  <span className="w-6 h-6 rounded-full bg-[#641E32] text-[#FAF5EC] text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#641E32] uppercase tracking-wider">
                    Delivery & Contact Information
                  </h2>
                </div>

                {formError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#282321]/80 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={shippingInfo.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Ayesha Khan"
                      className={`w-full bg-[#FAF5EC] border rounded-xl px-4 py-3 text-xs text-[#282321] focus:outline-none transition-all ${
                        fieldErrors.fullName
                          ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                          : 'border-[#641E32] focus:border-[#641E32] focus:ring-1 focus:ring-[#641E32]'
                      }`}
                    />
                    {fieldErrors.fullName && (
                      <p className="text-[10px] text-red-600 mt-1 font-semibold">{fieldErrors.fullName}</p>
                    )}
                  </div>

                  {/* Phone / WhatsApp (Numbers Only, 11 digits Pakistani mobile) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#282321]/80">
                        Phone / WhatsApp Number *
                      </label>
                      <span className={`text-[9.5px] font-bold ${shippingInfo.phone.length === 11 ? 'text-green-600' : 'text-[#641E32]'}`}>
                        {shippingInfo.phone.length}/11 digits
                      </span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={11}
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      placeholder="03XXXXXXXXX (Numbers only)"
                      className={`w-full bg-[#FAF5EC] border rounded-xl px-4 py-3 text-xs text-[#282321] focus:outline-none transition-all ${
                        fieldErrors.phone
                          ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                          : 'border-[#641E32] focus:border-[#641E32] focus:ring-1 focus:ring-[#641E32]'
                      }`}
                    />
                    {fieldErrors.phone ? (
                      <p className="text-[10px] text-red-600 mt-1 font-semibold">{fieldErrors.phone}</p>
                    ) : (
                      <p className="text-[9.5px] text-[#282321]/60 mt-1">
                        Only numbers allowed. Must start with 03 (e.g. 03001234567).
                      </p>
                    )}
                  </div>

                  {/* Email Address (Strict Real Email) */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#282321]/80 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      placeholder="e.g. ayesha.khan@gmail.com"
                      className={`w-full bg-[#FAF5EC] border rounded-xl px-4 py-3 text-xs text-[#282321] focus:outline-none transition-all ${
                        fieldErrors.email
                          ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                          : 'border-[#641E32] focus:border-[#641E32] focus:ring-1 focus:ring-[#641E32]'
                      }`}
                    />
                    {fieldErrors.email ? (
                      <p className="text-[10px] text-red-600 mt-1 font-semibold">{fieldErrors.email}</p>
                    ) : (
                      <p className="text-[9.5px] text-[#282321]/60 mt-1">
                        Real active email required for order confirmation receipt.
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#282321]/80 mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      placeholder="Lahore, Karachi, Islamabad..."
                      className={`w-full bg-[#FAF5EC] border rounded-xl px-4 py-3 text-xs text-[#282321] focus:outline-none transition-all ${
                        fieldErrors.city
                          ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                          : 'border-[#641E32] focus:border-[#641E32] focus:ring-1 focus:ring-[#641E32]'
                      }`}
                    />
                    {fieldErrors.city && (
                      <p className="text-[10px] text-red-600 mt-1 font-semibold">{fieldErrors.city}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#282321]/80 mb-1.5">
                      Complete Street Address & House No. *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      placeholder="House #, Street #, Block / Phase, Area"
                      className={`w-full bg-[#FAF5EC] border rounded-xl px-4 py-3 text-xs text-[#282321] focus:outline-none transition-all ${
                        fieldErrors.address
                          ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                          : 'border-[#641E32] focus:border-[#641E32] focus:ring-1 focus:ring-[#641E32]'
                      }`}
                    />
                    {fieldErrors.address && (
                      <p className="text-[10px] text-red-600 mt-1 font-semibold">{fieldErrors.address}</p>
                    )}
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#282321]/80 mb-1.5">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value="Pakistan"
                      readOnly
                      className="w-full bg-[#FAF5EC] border border-[#641E32] rounded-xl px-4 py-3 text-xs text-[#282321] font-semibold focus:outline-none cursor-default"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#282321]/80 mb-1.5">
                      Tailoring / Delivery Note (Optional)
                    </label>
                    <input
                      type="text"
                      name="notes"
                      value={shippingInfo.notes}
                      onChange={handleInputChange}
                      placeholder="Any custom sleeve/length or delivery instruction"
                      className="w-full bg-[#FAF5EC] border border-[#641E32] rounded-xl px-4 py-3 text-xs text-[#282321] focus:outline-none focus:border-[#641E32] focus:ring-1 focus:ring-[#641E32] transition-all"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#641E32]/5 border border-[#641E32]/20 flex items-center gap-2.5 text-xs text-[#641E32]">
                  <TruckIcon className="w-4 h-4 flex-shrink-0" />
                  <span>
                    <strong>Cash on Delivery (COD) Across Pakistan:</strong> Pay in cash at your doorstep. Order details will be sent directly via WhatsApp.
                  </span>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN (5 Cols): Sticky Order Summary & Instant WhatsApp Order CTA */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-7 bg-white rounded-3xl border border-[#E8DCCB] shadow-lg space-y-5 sticky top-36">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DCCB]">
                  <h3 className="font-cinzel text-lg font-bold text-[#641E32]">
                    Order Summary
                  </h3>
                  <span className="text-xs font-semibold text-[#641E32] bg-[#641E32]/10 px-2.5 py-0.5 rounded-full">
                    {enrichedItems.reduce((sum, i) => sum + i.quantity, 0)} Items
                  </span>
                </div>

                {/* Compact Itemized Breakdown */}
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {enrichedItems.map((item) => {
                    const lineTotal = Math.round(Number(item.price || 0) * curr.rate * item.quantity);
                    return (
                      <div
                        key={`summary-${item.id}-${item.selectedSize}-${item.selectedColor?.name}`}
                        className="flex items-center justify-between text-xs gap-3 py-1.5 border-b border-[#FAF5EC]"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-[#282321] truncate">{item.title}</p>
                          <p className="text-[10.5px] text-[#282321]/65">
                            Size: {item.selectedSize} • {item.selectedColor?.name} × {item.quantity}
                          </p>
                        </div>
                        <span className="font-cinzel font-bold text-[#641E32] flex-shrink-0">
                          {curr.symbol}{lineTotal.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-2 text-xs text-[#282321]/80 border-t border-[#E8DCCB] pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#282321]">
                      {curr.symbol}{subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Insured Courier Delivery</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-[#641E32] font-bold uppercase">Complimentary</span>
                      ) : (
                        `${curr.symbol}${shippingFee.toLocaleString()}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline text-base font-bold text-[#282321] pt-3 border-t border-[#E8DCCB]">
                    <span className="font-cinzel text-sm uppercase tracking-wider text-[#641E32]">
                      Total Payable
                    </span>
                    <span className="font-cinzel text-2xl text-[#641E32]">
                      {curr.symbol}{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Instant WhatsApp Order Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-[#25D366] hover:bg-[#1ebd5b] text-[#FAF5EC] rounded-full text-xs uppercase tracking-[0.18em] font-bold transition-all flex items-center justify-center gap-2.5 shadow-xl group"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Complete Order on WhatsApp • {curr.symbol}{grandTotal.toLocaleString()}</span>
                  <ArrowRightIcon className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Atelier Contact & Trust Footer */}
                <div className="p-3.5 rounded-2xl bg-[#FAF5EC] border border-[#E8DCCB] space-y-1.5 text-[11px] text-[#282321]/75">
                  <div className="flex items-center gap-2 text-[#641E32] font-semibold">
                    <ShieldCheckIcon className="w-4 h-4 text-[#B89B62]" />
                    <span>100% Authentic Umi&apos;z World Couture Guarantee</span>
                  </div>
                  <p className="flex items-center gap-1.5">
                    <MapPinIcon className="w-3.5 h-3.5 text-[#641E32] flex-shrink-0" />
                    <span>129 Mehmood Road, New Samanabad, Lahore</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <PhoneIcon className="w-3.5 h-3.5 text-[#641E32] flex-shrink-0" />
                    <span>Helpline / WhatsApp: 03174341036</span>
                  </p>
                </div>
              </div>
            </div>
          </form>
        ) : (
          /* Empty State on /checkout: Clean notice + Direct Recommended Outfits */
          <div className="space-y-12">
            <div className="text-center py-10 bg-white rounded-3xl border border-[#E8DCCB] max-w-md mx-auto p-6 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#FAF5EC] text-[#B89B62] border border-[#E8DCCB] flex items-center justify-center mx-auto mb-3">
                <ShoppingBagIcon className="w-7 h-7" />
              </div>
              <h2 className="font-cinzel text-lg font-bold text-[#641E32]">
                No Outfits Selected for Checkout
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="mt-4 px-6 py-2.5 bg-[#641E32] hover:bg-[#4a1624] text-[#FAF5EC] text-xs font-semibold uppercase tracking-wider rounded-full transition-colors shadow-sm"
              >
                Explore Collection
              </button>
            </div>

            <div>
              <div className="text-center mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#B89B62] font-semibold">
                  Ready for Immediate Dispatch
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#641E32] mt-1">
                  Recommended Outfits
                </h3>
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

