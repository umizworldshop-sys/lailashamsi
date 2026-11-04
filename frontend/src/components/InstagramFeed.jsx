import React from 'react';
import { INSTAGRAM_POSTS } from '../data/products';
import { HeartIcon, SparklesIcon } from './Icons';

export default function InstagramFeed() {
  return (
    <section className="py-20 bg-[#FAF5EC] border-b border-[#E8DCCB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-[0.22em] text-[#B89B62] font-semibold">
            Style Inspiration
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#641E32] mt-2 mb-2">
            #LailaShamsiElegance
          </h2>
          <div className="w-16 h-0.5 bg-[#B89B62] mx-auto mb-4" />
          <p className="text-xs sm:text-sm text-[#282321]/80">
            Celebrating Pakistani Fashion, One Beautiful Detail at a Time.
          </p>
        </div>

        {/* 6 Grid items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <div 
              key={post.id}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E8DCCB]"
            >
              <img 
                src={post.image} 
                alt="Pakistani Eastern Wear look" 
                className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#282321]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-[#FAF5EC] p-3 text-center">
                <HeartIcon className="w-5 h-5 text-[#B89B62] mb-1.5" filled={true} />
                <span className="text-xs font-bold">{post.likes}</span>
                <span className="text-[10px] text-[#E8DCCB] mt-1">{post.handle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Follow CTA */}
        <div className="text-center mt-10">
          <a
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#641E32] text-[#FAF5EC] hover:bg-[#4A1624] text-xs font-semibold uppercase tracking-[0.2em] transition-all shadow-sm"
          >
            <SparklesIcon className="w-4 h-4 text-[#B89B62]" />
            <span>Follow @LailaShamsiOfficial</span>
          </a>
        </div>

      </div>
    </section>
  );
}
