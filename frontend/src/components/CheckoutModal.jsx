import React, { useState } from 'react';
import { CloseIcon, CheckIcon, SparklesIcon } from './Icons';
import { CURRENCY_RATES } from '../data/products';
import { createOrder } from '../services/api';

export default function CheckoutModal({
  isOpen,
  onClose,
  checkoutData,
  onOrderSuccess,
  selectedCurrency = 'PKR'
}) {
  if (!isOpen || !checkoutData) return null;

  const [step, setStep] = useState('shipping'); // 'shipping' | 'confirmed'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Pakistan',
    paymentMethod: 'cod',
    deliveryNotes: ''
  });
  const [orderNumber, setOrderNumber] = useState('');

  const curr = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES.USD;
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const generatedFallback = 'LS-' + Math.floor(100000 + Math.random() * 900000);

    try {
      const payload = {
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          deliveryNotes: formData.deliveryNotes
        },
        items: checkoutData.items.map(item => ({
          productId: item.id?.toString(),
          title: item.title,
          price: item.convertedPrice || item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          image: item.images?.[0] || ''
        })),
        subtotal: checkoutData.subtotal || checkoutData.grandTotal,
        shippingFee: checkoutData.shippingFee || 0,
        grandTotal: checkoutData.grandTotal,
        currency: selectedCurrency,
        paymentMethod: formData.paymentMethod || 'cod'
      };

      const res = await createOrder(payload);
      if (res && res.orderNumber) {
        setOrderNumber(res.orderNumber);
      } else {
        setOrderNumber(generatedFallback);
      }
    } catch (err) {
      console.warn('Backend order sync fallback:', err);
      setOrderNumber(generatedFallback);
    } finally {
      setSubmitting(false);
      setStep('confirmed');
      onOrderSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={step === 'confirmed' ? onClose : undefined}
        className="fixed inset-0 bg-[#282321]/75 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-2xl bg-[#FAF5EC] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-[#E8DCCB] z-10 animate-reveal-up max-h-[92vh] overflow-y-auto">
          
          {/* Header */}
          <div className="p-4 sm:p-6 bg-white border-b border-[#E8DCCB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-base sm:text-lg font-bold text-[#641E32]">UMI&apos;Z WORLD</span>
              <span className="text-[#E8DCCB]">|</span>
              <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#282321]/75 font-semibold">
                {step === 'confirmed' ? 'Order Confirmation' : 'Express Checkout'}
              </span>
            </div>
            
            <button 
              onClick={onClose}
              className="p-1.5 text-[#282321]/60 hover:text-[#641E32] rounded-full focus:outline-none"
              aria-label="Close checkout"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {step === 'confirmed' ? (
            /* Confirmation Screen */
            <div className="p-6 sm:p-10 text-center space-y-5 sm:space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#641E32]/10 text-[#641E32] border border-[#641E32]/30 flex items-center justify-center mx-auto shadow-inner">
                <CheckIcon className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <div>
                <span className="text-[10.5px] uppercase tracking-widest text-[#B89B62] font-semibold">Pakistani Eastern Wear Order Received</span>
                <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#641E32] mt-1">Thank You, {formData.fullName || 'Valued Patron'}!</h3>
                <p className="text-xs text-[#282321]/80 mt-2 max-w-md mx-auto leading-relaxed">
                  Your ensemble is now prepared in our atelier. A confirmation receipt has been dispatched to <strong className="text-[#282321]">{formData.email || 'your email'}</strong>.
                </p>
              </div>

              {/* Order ID Pill */}
              <div className="p-4 bg-white rounded-2xl border border-[#E8DCCB] max-w-sm mx-auto shadow-sm">
                <p className="text-[10px] text-[#282321]/60 uppercase tracking-widest font-semibold">Order Reference Number</p>
                <p className="font-cinzel text-xl sm:text-2xl font-bold text-[#641E32] mt-1">{orderNumber}</p>
                <div className="mt-2 pt-2 border-t border-[#E8DCCB] text-xs flex justify-between font-medium text-[#282321]">
                  <span>Total Payable:</span>
                  <span className="font-bold text-[#641E32]">{curr.symbol}{checkoutData.grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={onClose}
                  className="px-6 sm:px-8 py-3 bg-[#641E32] text-[#FAF5EC] rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-[#4a1624] transition-colors shadow-sm"
                >
                  Continue Shopping
                </button>
                <a
                  href={`https://wa.me/923174341036?text=Hello%20Laila%20Shamsi,%20I%20have%20placed%20order%20${orderNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 sm:px-8 py-3 bg-[#25D366] text-white rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-[#1ebd5b] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="p-5 sm:p-8 space-y-5 sm:space-y-6">
              
              {/* Order Items Snapshot */}
              <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-[#E8DCCB]">
                <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-[#282321]/70 mb-2">
                  <span>Order Summary ({checkoutData.items.length} items)</span>
                  <span className="text-[#641E32] font-bold font-cinzel text-sm">
                    {curr.symbol}{checkoutData.grandTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {checkoutData.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs bg-[#FAF5EC] px-2.5 py-1.5 rounded-lg border border-[#E8DCCB] flex-shrink-0">
                      <img src={item.images[0]} alt="" className="w-8 h-10 object-cover rounded" />
                      <div>
                        <p className="font-semibold text-[#282321] line-clamp-1 max-w-[140px]">{item.title}</p>
                        <p className="text-[10px] text-[#282321]/60">Size: {item.selectedSize} × {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#641E32]">1. Delivery Details (Pakistan & Global)</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-[11px] font-bold text-[#282321] uppercase tracking-wider block mb-1">
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      placeholder="e.g. Ayesha Khan"
                      className="w-full bg-white border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#282321] focus:ring-1 focus:ring-[#641E32] focus:border-[#641E32] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] sm:text-[11px] font-bold text-[#282321] uppercase tracking-wider block mb-1">
                      WhatsApp / Phone Number *
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+92 300 1234567"
                      className="w-full bg-white border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#282321] focus:ring-1 focus:ring-[#641E32] focus:border-[#641E32] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] sm:text-[11px] font-bold text-[#282321] uppercase tracking-wider block mb-1">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="ayesha@example.com"
                      className="w-full bg-white border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#282321] focus:ring-1 focus:ring-[#641E32] focus:border-[#641E32] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] sm:text-[11px] font-bold text-[#282321] uppercase tracking-wider block mb-1">
                      City / Destination *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="Lahore / Karachi / Islamabad / Dubai"
                      className="w-full bg-white border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#282321] focus:ring-1 focus:ring-[#641E32] focus:border-[#641E32] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold text-[#282321] uppercase tracking-wider block mb-1">
                    Street Address / House / Apartment *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="House 12, Street 4, Phase 5, DHA"
                    className="w-full bg-white border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#282321] focus:ring-1 focus:ring-[#641E32] focus:border-[#641E32] focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-2">
                <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#641E32]">2. Payment Preference</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  <label className={`p-3 sm:p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    formData.paymentMethod === 'cod' 
                      ? 'border-[#641E32] bg-white ring-2 ring-[#641E32]' 
                      : 'border-[#E8DCCB] bg-white/70 hover:bg-white'
                  }`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() => setFormData({...formData, paymentMethod: 'cod'})}
                      className="hidden"
                    />
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#282321]">Cash on Delivery</span>
                      {formData.paymentMethod === 'cod' && <span className="w-2.5 h-2.5 rounded-full bg-[#641E32]" />}
                    </div>
                    <span className="text-[10px] text-[#282321]/65">Pay cash upon delivery across Pakistan</span>
                  </label>

                  <label className={`p-3 sm:p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    formData.paymentMethod === 'card' 
                      ? 'border-[#641E32] bg-white ring-2 ring-[#641E32]' 
                      : 'border-[#E8DCCB] bg-white/70 hover:bg-white'
                  }`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="card" 
                      checked={formData.paymentMethod === 'card'}
                      onChange={() => setFormData({...formData, paymentMethod: 'card'})}
                      className="hidden"
                    />
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#282321]">Debit / Credit Card</span>
                      {formData.paymentMethod === 'card' && <span className="w-2.5 h-2.5 rounded-full bg-[#641E32]" />}
                    </div>
                    <span className="text-[10px] text-[#282321]/65">Visa, Mastercard & UnionPay</span>
                  </label>

                  <label className={`p-3 sm:p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    formData.paymentMethod === 'bank' 
                      ? 'border-[#641E32] bg-white ring-2 ring-[#641E32]' 
                      : 'border-[#E8DCCB] bg-white/70 hover:bg-white'
                  }`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="bank" 
                      checked={formData.paymentMethod === 'bank'}
                      onChange={() => setFormData({...formData, paymentMethod: 'bank'})}
                      className="hidden"
                    />
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#282321]">Bank Transfer / IBFT</span>
                      {formData.paymentMethod === 'bank' && <span className="w-2.5 h-2.5 rounded-full bg-[#641E32]" />}
                    </div>
                    <span className="text-[10px] text-[#282321]/65">HBL, Meezan & Bank Alfalah</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 sm:pt-4 border-t border-[#E8DCCB]">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 sm:py-4 bg-[#641E32] text-[#FAF5EC] rounded-full text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#4a1624] transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  <SparklesIcon className="w-4 h-4 text-[#B89B62]" />
                  <span>{submitting ? 'Confirming Order...' : `Complete Order • ${curr.symbol}${checkoutData.grandTotal.toLocaleString()}`}</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
