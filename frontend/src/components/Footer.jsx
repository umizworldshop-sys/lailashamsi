import React from 'react';
import { 
  LockIcon,
  MapPinIcon,
  MailIcon,
  PhoneIcon,
  WhatsAppIcon,
  InstagramIcon,
  FacebookIcon,
  TikTokIcon
} from './Icons';

export default function Footer({ onSelectCategory, onOpenAdmin, onNavigate }) {
  const handleNav = (route) => {
    if (onNavigate) onNavigate(route);
  };

  const handleClientCareClick = (categoryName) => (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const targetCat = typeof categoryName === 'string' ? categoryName : 'Track Order';
    try {
      sessionStorage.setItem('laila_enquiry_category', targetCat);
    } catch {}
    if (onNavigate) {
      onNavigate('/contact', targetCat);
    }
    try {
      window.history.pushState({}, '', '/contact#enquiry-form');
    } catch {
      // ignore
    }
    setTimeout(() => {
      const el = document.getElementById('enquiry-form');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  return (
    <footer className="bg-[#282321] text-[#FAF5EC] border-t border-[#E8DCCB]/20 pt-12 sm:pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-14 border-b border-[#E8DCCB]/15">
          
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div 
              onClick={() => handleNav('/')}
              className="flex items-center gap-3 cursor-pointer group"
              title="Umi'z World - Home"
            >
              <img 
                src="/logo.png" 
                alt="Umi'z World" 
                onError={(e) => {
                  if (e.target.src.indexOf('Logo.jpeg') === -1) {
                    e.target.src = '/Logo.jpeg';
                  }
                }}
                className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl object-contain border border-[#B89B62]/60 shadow-md group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="font-cinzel tracking-[0.16em] text-lg sm:text-xl font-bold text-[#FAF5EC] uppercase block leading-tight group-hover:text-[#B89B62] transition-colors">
                  UMI&apos;Z WORLD
                </span>
                <p className="text-[8.5px] uppercase tracking-[0.28em] text-[#B89B62] font-semibold mt-0.5">
                  Umiz World Collection
                </p>
              </div>
            </div>
            
            <p className="text-xs text-[#E8DCCB]/85 font-normal leading-relaxed max-w-sm">
              Celebrating Pakistani Fashion, One Beautiful Detail at a Time. Handcrafted luxury pret, embroidered unstitched fabrics, and festive heirloom wear.
            </p>

            <button
              onClick={() => handleNav('/about')}
              className="text-[11px] text-[#B89B62] hover:text-[#FAF5EC] font-semibold uppercase tracking-wider block transition-colors"
            >
              Rooted in Tradition, Designed for Today →
            </button>
            
            {/* Social Media Links */}
            <div className="flex items-center gap-2.5 pt-2">
              <a 
                href="https://www.instagram.com/umizworld?dlrf=MTllNno1OWozcnh0aw==" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Instagram"
                title="Follow Umiz World on Instagram"
                className="w-9 h-9 rounded-full bg-white/5 border border-[#E8DCCB]/25 flex items-center justify-center text-[#E8DCCB] hover:text-[#FAF5EC] hover:bg-[#641E32] hover:border-[#641E32] transition-all duration-300 shadow-sm"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://www.tiktok.com/@umizworld?_r=1&_t=ZS-9B7gEmyDdyP" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="TikTok"
                title="Follow Umiz World on TikTok"
                className="w-9 h-9 rounded-full bg-white/5 border border-[#E8DCCB]/25 flex items-center justify-center text-[#E8DCCB] hover:text-[#FAF5EC] hover:bg-[#641E32] hover:border-[#641E32] transition-all duration-300 shadow-sm"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://www.facebook.com/share/1C9iyEgsgE/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Facebook"
                title="Follow Umiz World on Facebook"
                className="w-9 h-9 rounded-full bg-white/5 border border-[#E8DCCB]/25 flex items-center justify-center text-[#E8DCCB] hover:text-[#FAF5EC] hover:bg-[#641E32] hover:border-[#641E32] transition-all duration-300 shadow-sm"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://wa.me/923174341036" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="WhatsApp"
                title="Chat on WhatsApp"
                className="w-9 h-9 rounded-full bg-white/5 border border-[#E8DCCB]/25 flex items-center justify-center text-[#E8DCCB] hover:text-[#FAF5EC] hover:bg-[#641E32] hover:border-[#641E32] transition-all duration-300 shadow-sm"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Collections (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-[#B89B62] tracking-wider uppercase">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8DCCB]/80">
              <li>
                <button onClick={() => { onSelectCategory('female'); handleNav('/categories', 'female'); }} className="hover:text-[#FAF5EC] transition-colors">
                  Female (Women Wear)
                </button>
              </li>
              <li>
                <button onClick={() => { onSelectCategory('stitched'); handleNav('/stitched'); }} className="hover:text-[#FAF5EC] transition-colors">
                  Stitched (Ready to Wear)
                </button>
              </li>
              <li>
                <button onClick={() => { onSelectCategory('unstitched'); handleNav('/unstitched'); }} className="hover:text-[#FAF5EC] transition-colors">
                  Unstitched Suits
                </button>
              </li>
              <li>
                <button onClick={() => { onSelectCategory('babies'); handleNav('/baby-clothes'); }} className="hover:text-[#FAF5EC] transition-colors">
                  Kids Collection (Baby Clothes)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('/sales')} className="hover:text-[#FAF5EC] transition-colors">
                  Customer Favourites & Sale
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Help (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 
              onClick={handleClientCareClick('Track Order')}
              className="font-cinzel text-sm font-bold text-[#B89B62] tracking-wider uppercase cursor-pointer hover:underline inline-block"
              title="Click to visit Consultation & Inquiry"
            >
              Client Care
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8DCCB]/80">
              <li><button onClick={handleClientCareClick('Track Order')} className="hover:text-[#FAF5EC] transition-colors text-left cursor-pointer">Track Order</button></li>
              <li><button onClick={handleClientCareClick('Size Guide')} className="hover:text-[#FAF5EC] transition-colors text-left cursor-pointer">Size Guide</button></li>
              <li><button onClick={handleClientCareClick('Cash on Delivery')} className="hover:text-[#FAF5EC] transition-colors text-left cursor-pointer">Cash on Delivery</button></li>
              <li><button onClick={handleClientCareClick('14-Day Exchanges')} className="hover:text-[#FAF5EC] transition-colors text-left cursor-pointer">14-Day Exchanges</button></li>
              <li><button onClick={handleClientCareClick('Styling Assistance')} className="hover:text-[#FAF5EC] transition-colors text-left cursor-pointer">Styling Assistance</button></li>
            </ul>
          </div>

          {/* Official Store Location & Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div>
              <h4 className="font-cinzel text-sm font-bold text-[#B89B62] tracking-wider uppercase">
                Flagship Atelier
              </h4>
              <div className="w-10 h-0.5 bg-[#B89B62]/60 mt-1.5" />
            </div>
            
            <div className="space-y-3.5 text-xs">
              {/* Store Address */}
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-[#FAF5EC]/10 border border-[#B89B62]/40 flex items-center justify-center text-[#B89B62] shrink-0 group-hover:bg-[#641E32] group-hover:text-[#FAF5EC] group-hover:border-[#641E32] transition-all shadow-sm mt-0.5">
                  <MapPinIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-[#B89B62] font-semibold block mb-0.5">
                    Store Address
                  </span>
                  <p className="text-xs text-[#FAF5EC]/90 leading-relaxed font-normal">
                    129 Mehmood Road, Near Telephone Exchange, New Samanabad, Lahore, Pakistan
                  </p>
                </div>
              </div>

              {/* Email Us */}
              <a 
                href="mailto:umizworldshop@gmail.com" 
                className="flex items-start gap-3 group transition-colors block"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FAF5EC]/10 border border-[#B89B62]/40 flex items-center justify-center text-[#B89B62] shrink-0 group-hover:bg-[#641E32] group-hover:text-[#FAF5EC] group-hover:border-[#641E32] transition-all shadow-sm mt-0.5">
                  <MailIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-[#B89B62] font-semibold block mb-0.5">
                    Email Us
                  </span>
                  <p className="text-xs text-[#FAF5EC]/90 group-hover:text-[#B89B62] underline underline-offset-2 transition-colors truncate">
                    umizworldshop@gmail.com
                  </p>
                </div>
              </a>

              {/* Phone / WhatsApp */}
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-[#FAF5EC]/10 border border-[#B89B62]/40 flex items-center justify-center text-[#B89B62] shrink-0 group-hover:bg-[#641E32] group-hover:text-[#FAF5EC] group-hover:border-[#641E32] transition-all shadow-sm mt-0.5">
                  <PhoneIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-[#B89B62] font-semibold block mb-0.5">
                    Phone & WhatsApp
                  </span>
                  <a 
                    href="tel:03174341036" 
                    className="text-xs font-mono font-semibold text-[#FAF5EC] hover:text-[#B89B62] transition-colors block mt-0.5"
                  >
                    03174341036
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#E8DCCB]/60 gap-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <p>© {new Date().getFullYear()} UMI&apos;Z WORLD. Celebrating Pakistani Fashion, One Beautiful Detail at a Time.</p>
            <span className="hidden sm:inline text-[#E8DCCB]/30">•</span>
            {/* Admin Lock Icon (Name removed as requested) */}
            <button 
              onClick={onOpenAdmin} 
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#B89B62]/20 border border-[#E8DCCB]/25 hover:border-[#B89B62]/60 flex items-center justify-center text-[#B89B62] hover:text-[#FAF5EC] transition-all cursor-pointer shadow-sm group"
              title="Admin Login"
              aria-label="Admin Login"
            >
              <LockIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 sm:pr-24">
            <span className="hover:text-[#FAF5EC] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-[#FAF5EC] cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-[#FAF5EC] cursor-pointer transition-colors">100% Authentic Fabric</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
