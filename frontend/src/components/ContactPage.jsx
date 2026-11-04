import React, { useState, useEffect } from 'react';
import { 
  SparklesIcon, 
  CheckIcon, 
  ArrowRightIcon,
  MapPinIcon,
  MailIcon,
  PhoneIcon 
} from './Icons'; // WhatsAppIcon hata diya gaya hai

// Strict Pakistani Mobile Number Validation (03XXXXXXXXX - 11 digits, real network prefix)
const isValidPakistaniPhone = (phone) => {
  const digits = (phone || '').replace(/\D/g, '');
  if (!/^03[0-9]{9}$/.test(digits)) return false;
  const suffix = digits.slice(2);
  if (/^(\d)\1+$/.test(suffix)) return false;
  if (
    suffix === '123456789' ||
    suffix === '987654321' ||
    suffix === '012345678' ||
    suffix === '000000001'
  ) return false;
  return true;
};

// Strict Real Email Validation (Blocks fake, dummy, disposable addresses)
const isValidRealEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const cleaned = email.trim().toLowerCase();
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(cleaned)) return false;
  const [localPart, domainPart] = cleaned.split('@');
  if (!localPart || !domainPart || localPart.length < 2) return false;

  const fakePrefixes = [
    'test', 'fake', 'dummy', 'temp', 'asdf', 'qwerty', 'abc', 'xyz',
    'none', 'noemail', 'sample', 'example', 'user', 'admin', 'client'
  ];
  if (fakePrefixes.includes(localPart)) return false;

  const fakeDomains = [
    'example.com', 'test.com', 'fake.com', 'dummy.com', 'sample.com',
    'asdf.com', 'temp.com', 'mailinator.com', 'tempmail.com', 'trashmail.com'
  ];
  if (fakeDomains.includes(domainPart)) return false;

  const parts = domainPart.split('.');
  const tld = parts[parts.length - 1];
  if (!tld || tld.length < 2) return false;

  return true;
};

export default function ContactPage({ onShowToast, initialCategory }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Track Order',
    message: ''
  });
  const [formError, setFormError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check if a specific Client Care category was passed or stored
    let categoryToSelect = initialCategory;
    try {
      const stored = sessionStorage.getItem('laila_enquiry_category');
      if (stored) {
        categoryToSelect = stored;
        sessionStorage.removeItem('laila_enquiry_category');
      }
    } catch {}

    if (categoryToSelect) {
      setFormData((prev) => ({ ...prev, inquiryType: categoryToSelect }));
    }

    // If navigated with #enquiry-form, scroll straight to the form
    if (window.location.hash === '#enquiry-form' || window.location.hash.includes('enquiry')) {
      const scrollTimer = setTimeout(() => {
        const el = document.getElementById('enquiry-form');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
      return () => clearTimeout(scrollTimer);
    }
  }, [initialCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      setFormError('Please enter your full name (at least 3 characters).');
      return;
    }

    if (!isValidPakistaniPhone(formData.phone)) {
      setFormError('Please enter a valid 11-digit Pakistani mobile number starting with 03 (e.g. 03001234567). Dummy numbers are not accepted.');
      return;
    }

    if (!isValidRealEmail(formData.email)) {
      setFormError('Please enter a genuine, active email address (e.g. ayesha.khan@gmail.com). Fake emails are not accepted.');
      return;
    }

    setFormError('');
    setSubmitted(true);
    if (onShowToast) {
      onShowToast('Consultation request received! A senior stylist will contact you.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#282321] pt-36 sm:pt-40 lg:pt-44 pb-20 selection:bg-[#B89B62] selection:text-white font-sans">
      
      {/* ================= COMPACT HEADER SECTION ================= */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 text-center mb-12 sm:mb-16 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF5EC] border border-[#B89B62]/30 text-[#B89B62] text-[9px] uppercase tracking-[0.25em] font-bold mb-4 shadow-sm">
          <SparklesIcon className="w-3 h-3" />
          Discover Timeless Elegance
        </div>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#641E32] tracking-wide mb-4">
          Connect With Our Atelier
        </h1>
        <div className="w-16 h-[1px] bg-[#B89B62]/60 mx-auto mb-5"></div>
        <p className="text-sm text-[#282321]/70 font-light leading-relaxed">
          Whether you require guidance on unstitched fabrics, custom measurements, or styling advice, our expert team is delighted to assist you.
        </p>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ----- LEFT COLUMN: CLASSIC FORM (8 Cols) ----- */}
          <div className="lg:col-span-8" id="enquiry-form">
            <div className="bg-white rounded-xl p-8 sm:p-10 shadow-sm border border-[#E8DCCB] transition-shadow hover:shadow-md">
              
              <div className="mb-8 border-b border-[#E8DCCB]/50 pb-6">
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#641E32] mb-2">
                  Request a Consultation
                </h2>
                <p className="text-xs sm:text-sm text-[#282321]/60 font-light">
                  Please provide your details below and a senior stylist will coordinate with you.
                </p>
              </div>

              {submitted ? (
                <div className="py-12 px-6 bg-[#FAF5EC] border border-[#B89B62]/30 rounded-lg text-center space-y-4 animate-fade-in-up">
                  <div className="w-14 h-14 rounded-full bg-[#641E32] text-[#FAF5EC] flex items-center justify-center mx-auto shadow-md">
                    <CheckIcon className="w-6 h-6" />
                  </div>
                  <h3 className="font-cinzel text-xl font-bold text-[#641E32]">Enquiry Confirmed</h3>
                  <p className="text-sm text-[#282321]/70 max-w-sm mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-[#282321]">{formData.name}</span>. We have received your request and will reach out to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 border border-[#641E32] text-[10px] font-bold uppercase tracking-widest text-[#641E32] rounded hover:bg-[#641E32] hover:text-white transition-all duration-300"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {formError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                      {formError}
                    </div>
                  )}

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-[10px] uppercase tracking-widest text-[#282321] font-bold mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        id="name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          setFormError('');
                        }}
                        className="w-full bg-[#FDFBF7] border border-[#641E32] px-4 py-3 text-sm text-[#282321] rounded-md focus:outline-none focus:border-[#641E32] focus:ring-1 focus:ring-[#641E32] transition-all"
                        placeholder="e.g. Ayesha Khan"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-[10px] uppercase tracking-widest text-[#282321] font-bold mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        id="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          setFormError('');
                        }}
                        className="w-full bg-[#FDFBF7] border border-[#641E32] px-4 py-3 text-sm text-[#282321] rounded-md focus:outline-none focus:border-[#641E32] focus:ring-1 focus:ring-[#641E32] transition-all"
                        placeholder="ayesha.khan@gmail.com"
                      />
                    </div>
                  </div>

                  {/* Phone & Category Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="phone" className="block text-[10px] uppercase tracking-widest text-[#282321] font-bold">
                          Phone / WhatsApp *
                        </label>
                        <span className="text-[9.5px] font-bold text-[#641E32]">
                          {formData.phone.length}/11 digits
                        </span>
                      </div>
                      <input
                        type="tel"
                        required
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={11}
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 11);
                          setFormData({ ...formData, phone: digitsOnly });
                          setFormError('');
                        }}
                        className="w-full bg-[#FDFBF7] border border-[#641E32] px-4 py-3 text-sm text-[#282321] rounded-md focus:outline-none focus:border-[#641E32] focus:ring-1 focus:ring-[#641E32] transition-all"
                        placeholder="03XXXXXXXXX (Numbers only)"
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-[10px] uppercase tracking-widest text-[#282321] font-bold mb-2">
                        Enquiry Category
                      </label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full bg-[#FDFBF7] border border-[#641E32] px-4 py-3 text-sm text-[#282321] rounded-md focus:outline-none focus:border-[#641E32] focus:ring-1 focus:ring-[#641E32] transition-all appearance-none cursor-pointer font-medium"
                      >
                        <option value="Track Order">Track Order</option>
                        <option value="Size Guide">Size Guide</option>
                        <option value="Cash on Delivery">Cash on Delivery</option>
                        <option value="14-Day Exchanges">14-Day Exchanges</option>
                        <option value="Styling Assistance">Styling Assistance</option>
                        <option value="General Enquiry">General Enquiry & Support</option>
                      </select>
                      {/* Dropdown arrow */}
                      <div className="absolute right-4 top-[38px] pointer-events-none text-[#641E32]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-[10px] uppercase tracking-widest text-[#282321] font-bold mb-2">
                      Special Notes / Measurements / Date
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#FDFBF7] border border-[#641E32] px-4 py-3 text-sm text-[#282321] rounded-md focus:outline-none focus:border-[#641E32] focus:ring-1 focus:ring-[#641E32] transition-all resize-none"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="group w-full sm:w-auto px-8 py-3.5 bg-[#641E32] text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded hover:bg-[#4a1624] transition-colors flex items-center justify-center gap-3"
                    >
                      <span>Submit Request</span>
                      <ArrowRightIcon className="w-3.5 h-3.5 text-[#B89B62] group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ----- RIGHT COLUMN: CONTACT INFO (4 Cols) ----- */}
          <div className="lg:col-span-4">
            
            {/* Elegant Contact Details Box */}
            <div className="bg-[#FAF5EC] p-8 rounded-xl border border-[#E8DCCB] shadow-sm space-y-8 sticky top-24">
              <h4 className="font-cinzel text-lg font-bold tracking-wide text-[#641E32] border-b border-[#E8DCCB] pb-4">
                Our Details
              </h4>
              
              <div className="space-y-6 text-sm">
                
                {/* Store Address */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded bg-white border border-[#E8DCCB] flex items-center justify-center text-[#B89B62] shrink-0 mt-0.5">
                    <MapPinIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#282321] uppercase text-[10px] tracking-widest mb-1">Flagship Store</p>
                    <p className="text-xs font-light leading-relaxed text-[#282321]/80">
                      129 Mehmood Road, Near Telephone Exchange, New Samanabad, Lahore, Pakistan
                    </p>
                  </div>
                </div>

                {/* Official Email */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded bg-white border border-[#E8DCCB] flex items-center justify-center text-[#B89B62] shrink-0 mt-0.5">
                    <MailIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#282321] uppercase text-[10px] tracking-widest mb-1">Official Email</p>
                    <a href="mailto:umizworldshop@gmail.com" className="text-xs font-medium text-[#641E32] hover:underline transition-colors">
                      umizworldshop@gmail.com
                    </a>
                  </div>
                </div>

                {/* Direct Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded bg-white border border-[#E8DCCB] flex items-center justify-center text-[#B89B62] shrink-0 mt-0.5">
                    <PhoneIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[#282321] uppercase text-[10px] tracking-widest mb-1">Direct Line</p>
                    <a href="tel:03174341036" className="text-xs font-medium text-[#641E32] hover:underline transition-colors">
                      +92 317 434 1036
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}