import React, { useState } from 'react';
import { SearchIcon, CloseIcon, ArrowRightIcon } from './Icons';
import { CURRENCY_RATES } from '../data/products';

export default function SearchModal({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onApplySearchQuery,
  selectedCurrency = 'PKR'
}) {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const curr = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES.PKR;

  const popularTags = ['Raw Silk', 'Velvet Rose', 'Chiffon Kalidar', 'Angrakha', 'Pastel Pret', 'Co-ord'];

  const matchedProducts = query.trim() ? products.filter((p) => {
    return p.title.toLowerCase().includes(query.toLowerCase()) ||
           p.fabric.toLowerCase().includes(query.toLowerCase()) ||
           p.categoryLabel.toLowerCase().includes(query.toLowerCase());
  }) : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onApplySearchQuery(query.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:p-6">
        <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl shadow-2xl overflow-hidden border border-[#D4AF37]/50 z-10 animate-fade-up">
          
          {/* Search Header Input */}
          <form onSubmit={handleSearchSubmit} className="p-6 bg-white border-b border-[#E8DFC5] flex items-center gap-3">
            <SearchIcon className="w-5 h-5 text-[#C59B27] flex-shrink-0" />
            <input 
              type="text" 
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by outfit name, fabric (e.g. Silk, Chiffon), or style..."
              className="w-full text-sm sm:text-base bg-transparent text-[#24171A] focus:outline-none placeholder:text-gray-400"
            />
            {query && (
              <button 
                type="button"
                onClick={() => setQuery('')}
                className="text-xs text-gray-400 hover:text-black p-1"
              >
                Clear
              </button>
            )}
            <button 
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-black rounded-full"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </form>

          {/* Popular Tag Pills */}
          <div className="p-4 px-6 bg-[#FAF3EB] border-b border-[#E8DFC5] flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 whitespace-nowrap">
              Trending:
            </span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="text-xs bg-white border border-[#E8DFC5] px-3 py-1 rounded-full text-gray-700 hover:border-[#4A0E17] hover:text-[#4A0E17] whitespace-nowrap transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Results Area */}
          <div className="max-h-96 overflow-y-auto p-6">
            {query.trim() === '' ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                Type keywords above to discover handcrafted luxury pret, festive formals, and bridal couture.
              </div>
            ) : matchedProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs">
                No matching designs found for "<span className="text-black font-semibold">{query}</span>".
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Matching Outfits ({matchedProducts.length})
                </p>
                {matchedProducts.map((p) => {
                  const price = Math.round(p.price * curr.rate);

                  return (
                    <div 
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      className="flex items-center gap-4 p-2.5 rounded-xl bg-white border border-[#EBE3D5] hover:border-[#4A0E17] hover:shadow-md transition-all cursor-pointer group"
                    >
                      <img src={p.images[0]} alt="" className="w-14 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <span className="text-[10px] text-[#C59B27] uppercase tracking-wider font-semibold">{p.categoryLabel}</span>
                        <h4 className="font-serif text-sm font-bold text-[#24171A] group-hover:text-[#4A0E17] transition-colors">{p.title}</h4>
                        <p className="text-[11px] text-gray-500 italic">{p.fabric}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-serif font-bold text-[#4A0E17] text-sm">
                          {curr.symbol}{price.toLocaleString()}
                        </span>
                        <div className="text-[10px] text-gray-400 flex items-center gap-1 justify-end group-hover:text-[#4A0E17]">
                          <span>View</span>
                          <ArrowRightIcon className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
