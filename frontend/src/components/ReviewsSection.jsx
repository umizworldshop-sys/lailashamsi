import React from 'react';
import { StarIcon, SparklesIcon, CheckIcon } from './Icons';

const REVIEWS = [
  {
    id: 1,
    name: 'Ayla Tariq',
    city: 'Lahore',
    outfit: 'Gul-e-Noor Chiffon Suit',
    rating: 5,
    comment: 'The organza dupatta and delicate embroidery are stunning. Received so many compliments at my family event!'
  },
  {
    id: 2,
    name: 'Zara Hameed',
    city: 'Karachi',
    outfit: 'Zahra Velvet Kalidar',
    rating: 5,
    comment: 'Fabric weight and tilla stitching are top quality. The parcel arrived in Karachi in 2 days in beautiful packaging.'
  },
  {
    id: 3,
    name: 'Mahnoor Khan',
    city: 'Islamabad',
    outfit: 'Mah-e-Nau Lawn Pret',
    rating: 5,
    comment: 'Breathable pure lawn, accurate sizing, and very neat finishing. Exactly as shown on the website!'
  }
];

export default function ReviewsSection() {
  return (
    <section className="py-14 sm:py-16 bg-[#FAF5EC] text-[#282321] border-b border-[#E8DCCB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Concise Header */}
        <div className="text-center max-w-lg mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8DCCB]/60 text-[#641E32] text-[10px] font-semibold uppercase tracking-widest mb-2">
            <SparklesIcon className="w-3.5 h-3.5 text-[#B89B62]" />
            <span>Verified Customer Reviews</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#641E32]">
            What Our Customers Say
          </h2>
          <div className="w-14 h-0.5 bg-[#B89B62] mx-auto mt-2 mb-3" />

          {/* Simple Rating Summary */}
          <div className="inline-flex items-center gap-2 text-xs text-[#282321]/75">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-3.5 h-3.5 fill-[#B89B62] text-[#B89B62]" />
              ))}
            </div>
            <span className="font-bold text-[#641E32]">4.9 / 5.0</span>
            <span>•</span>
            <span>1,200+ Happy Customers Across Pakistan</span>
          </div>
        </div>

        {/* 3 Clean & Compact Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {REVIEWS.map((rev) => (
            <div 
              key={rev.id}
              className="bg-white rounded-2xl p-6 border border-[#E8DCCB] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-3.5 h-3.5 fill-[#B89B62] text-[#B89B62]" />
                  ))}
                </div>

                {/* Short Authentic Comment */}
                <p className="text-xs text-[#282321]/80 leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & City */}
              <div className="pt-3 border-t border-[#E8DCCB] flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-cinzel font-bold text-[#641E32]">{rev.name}</h4>
                  <p className="text-[10px] text-[#282321]/55 flex items-center gap-1">
                    <CheckIcon className="w-2.5 h-2.5 text-[#641E32]" />
                    <span>Verified Buyer, {rev.city}</span>
                  </p>
                </div>
                <span className="text-[10px] text-[#641E32] bg-[#FAF5EC] border border-[#E8DCCB] px-2 py-0.5 rounded-full font-medium truncate max-w-[120px]">
                  {rev.outfit}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
