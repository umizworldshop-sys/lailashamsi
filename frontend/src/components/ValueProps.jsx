import React from 'react';
import { TruckIcon, ShieldCheckIcon, SparklesIcon, RefreshCwIcon } from './Icons';

export default function ValueProps() {
  const perks = [
    {
      icon: TruckIcon,
      title: 'Cash on Delivery (COD)',
      subtitle: 'Pay at Doorstep',
      desc: 'Order with complete peace of mind. Pay cash when your parcel arrives anywhere across Pakistan.'
    },
    {
      icon: ShieldCheckIcon,
      title: '100% Pure Fabrics',
      subtitle: 'Original Quality',
      desc: 'Breathable Pakistani fine lawn, pure raw silks, chiffons, and authentic handcrafted embroidery.'
    },
    {
      icon: SparklesIcon,
      title: 'Fast 2-4 Days Delivery',
      subtitle: 'Express Nationwide',
      desc: 'Direct dispatch from Lahore via express couriers to Karachi, Islamabad, Rawalpindi & all cities.'
    },
    {
      icon: RefreshCwIcon,
      title: 'Easy Exchange & Support',
      subtitle: 'Hassle-Free Policy',
      desc: 'Simple 14-day size exchanges with dedicated WhatsApp stylist support (03174341036).'
    }
  ];

  return (
    <section className="bg-[#FAF5EC] py-14 sm:py-16 border-b border-[#E8DCCB] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#B89B62] font-bold block mb-1">
            ✦ Umi&apos;z World Shopping Guarantee
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#641E32]">
            Why Women Across Pakistan Trust Us
          </h2>
          <div className="w-16 h-0.5 bg-[#B89B62] mx-auto mt-2.5" />
        </div>

        {/* 4 Prominent Pakistani Trust Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {perks.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E8DCCB] shadow-sm hover:shadow-lg hover:border-[#B89B62] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Icon & Subtitle Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#641E32]/10 border border-[#B89B62]/30 flex items-center justify-center text-[#641E32] group-hover:bg-[#641E32] group-hover:text-[#FAF5EC] transition-all duration-300 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[9.5px] uppercase tracking-wider font-semibold text-[#641E32] bg-[#641E32]/10 px-2.5 py-1 rounded-full">
                      {perk.subtitle}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-cinzel text-base font-bold text-[#641E32] mb-2 group-hover:text-[#B89B62] transition-colors">
                    {perk.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#282321]/75 leading-relaxed font-normal">
                    {perk.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E8DCCB]/60 flex items-center gap-1.5 text-[10.5px] text-[#B89B62] font-semibold">
                  <span>✦ Verified Pakistani Standard</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
