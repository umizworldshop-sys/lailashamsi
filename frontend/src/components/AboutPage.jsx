import React from 'react';
import { SparklesIcon, ArrowRightIcon, MapPinIcon } from './Icons';

export default function AboutPage({ onExploreCollection }) {
  const categories = [
    {
      title: 'Unstitched Fabrics',
      desc: 'Exquisite lawn, pure raw silk, and delicate chiffon fabrics designed for you to customize your silhouette.'
    },
    {
      title: 'Stitched Luxury Pret',
      desc: 'Ready-to-wear formal and festive ensembles featuring intricate tilla, dabka, and resham threadwork.'
    },
    {
      title: 'Little Umi\'z (Baby Wear)',
      desc: 'Adorable, soft, and graceful traditional outfits crafted with utmost care for the little ones.'
    }
  ];

  const timeline = [
    { year: '2018', title: 'The Inception', desc: 'Started our journey in New Samanabad, Lahore, with a passion for authentic Pakistani Eastern wear.' },
    { year: '2021', title: 'Expanding Collections', desc: 'Introduced exclusive unstitched lawn suites and festive luxury pret lines for modern women.' },
    { year: '2024', title: 'Little Umi\'z Launch', desc: 'Expanded our curation to include handcrafted traditional clothing ranges for children.' },
    { year: '2026', title: 'A Trusted Name', desc: 'Continuing to dress families across Pakistan and globally with unmatched grace and heritage.' }
  ];

  return (
    <div className="min-h-screen bg-[#FAF5EC] text-[#282321] pt-36 sm:pt-40 lg:pt-44 pb-20 selection:bg-[#B89B62] selection:text-white font-sans">
      
      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#E8DCCB] shadow-sm">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF5EC] border border-[#B89B62]/40 text-[#B89B62] text-[10px] uppercase tracking-[0.25em] font-bold shadow-xs">
              <SparklesIcon className="w-3.5 h-3.5" />
              Welcome to Umi&apos;z World
            </div>
            
            <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#641E32] tracking-wide leading-tight">
              Rooted in Heritage, Crafted for Modern Elegance
            </h1>
            
            <p className="text-sm sm:text-base text-[#282321]/75 font-light leading-relaxed">
              At <strong className="font-medium text-[#641E32]">Umi&apos;z World</strong>, we celebrate the timeless beauty of Pakistani fashion. From exquisite unstitched fabrics and statement luxury pret to charming traditional wear for your little ones, every piece tells a story of grace and artisanal devotion.
            </p>

            <div className="pt-2">
              <button
                onClick={onExploreCollection}
                className="group px-8 py-3.5 bg-[#641E32] hover:bg-[#4a1624] text-[#FAF5EC] font-bold text-[10px] uppercase tracking-[0.2em] rounded-full transition-all shadow-md flex items-center gap-3"
              >
                <span>Explore Our Collections</span>
                <ArrowRightIcon className="w-3.5 h-3.5 text-[#B89B62] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden border border-[#E8DCCB] shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=85&w=800&auto=format&fit=crop"
                alt="Umi'z World Atelier"
                className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#641E32]/40 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                <p className="font-cinzel text-xs tracking-widest uppercase font-semibold">Handcrafted in Lahore</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= WHAT WE OFFER (CATEGORIES) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B89B62] font-bold block mb-2">
            Our Curation
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#641E32] mb-3">
            Designed for Every Generation
          </h2>
          <div className="w-16 h-[1px] bg-[#B89B62] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              className="bg-white p-8 rounded-2xl border border-[#E8DCCB] shadow-sm hover:shadow-md hover:border-[#641E32] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <span className="font-cinzel text-xl font-bold text-[#B89B62] block mb-3 group-hover:text-[#641E32] transition-colors">
                  0{idx + 1}
                </span>
                <h3 className="font-cinzel text-lg font-bold text-[#641E32] mb-3">
                  {cat.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#282321]/70 font-light leading-relaxed">
                  {cat.desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#FAF5EC]">
                <span className="text-[10px] uppercase tracking-widest text-[#641E32] font-semibold">
                  Discover Line &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BRAND TIMELINE / HERITAGE ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-[#282321] text-[#FAF5EC] rounded-3xl p-8 sm:p-14 border border-[#B89B62]/30 shadow-xl">
          <div className="max-w-xl mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#B89B62] font-semibold block mb-2">
              Our Journey
            </span>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#FAF5EC]">
              The Umi&apos;z World Legacy
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {timeline.map((step) => (
              <div key={step.year} className="space-y-2 border-l border-[#B89B62]/60 pl-4 py-1">
                <span className="font-cinzel text-lg font-bold text-[#B89B62] block">
                  {step.year}
                </span>
                <h4 className="font-cinzel text-sm font-bold text-[#FAF5EC]">
                  {step.title}
                </h4>
                <p className="text-xs text-[#E8DCCB]/70 font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FLAGSHIP STUDIO LOCATION ================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DCCB] shadow-sm relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#FAF5EC] rounded-full opacity-50 pointer-events-none" />
          
          <div className="w-12 h-12 rounded-full bg-[#FAF5EC] border border-[#B89B62]/40 flex items-center justify-center text-[#641E32] mx-auto mb-4 shadow-xs">
            <MapPinIcon className="w-5 h-5" />
          </div>

          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B89B62] font-bold block mb-1">
            Visit Our Atelier
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#641E32] mb-4">
            Flagship Studio in Lahore
          </h2>
          
          <p className="text-sm text-[#282321]/75 font-light max-w-md mx-auto leading-relaxed mb-6">
            Experience our fabrics, embroidery details, and luxury pret collections in person at our flagship location:
          </p>

          <div className="inline-block bg-[#FAF5EC] border border-[#E8DCCB] px-6 py-3 rounded-xl text-xs sm:text-sm font-medium text-[#282321] shadow-xs">
            129 Mehmood Road, Near Telephone Exchange, New Samanabad, Lahore, Pakistan
          </div>
        </div>
      </section>

    </div>
  );
}