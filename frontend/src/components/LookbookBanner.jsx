import React, { useEffect, useRef, useState } from 'react';
import { ArrowRightIcon } from './Icons';

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function CountUp({ end, suffix = '', start }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    const t0 = performance.now();
    const dur = 1600;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      setVal(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, end]);
  return <>{val}{suffix}</>;
}

export default function LookbookBanner({ onShopLook }) {
  const [ref, inView] = useInView();

  const reveal = (delay) => ({
    style: { transitionDelay: `${delay}ms` },
    className: `transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
      inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`
  });

  const pillars = [
    { no: '01', title: 'Authentic Craftsmanship', desc: 'Pure raw silk, fine lawn, organza & traditional hand-embroidery.' },
    { no: '02', title: 'Timeless Eastern Silhouettes', desc: 'Intricate tilla, dabka, resham threadwork & graceful drapes.' }
  ];

  const stats = [
    { end: 120, suffix: '+', label: 'Artisan Hours Per Piece' },
    { end: 100, suffix: '%', label: 'Pure Pakistani Textiles' },
    { end: 5, suffix: '★', label: 'Customer Favourites' }
  ];

  return (
    <section
      id="philosophy"
      ref={ref}
      className="relative py-20 sm:py-28 bg-[#FAF5EC] border-b border-[#E8DCCB] overflow-hidden"
    >
      {/* Giant watermark */}
      <span
        aria-hidden="true"
        className={`pointer-events-none select-none absolute -right-10 top-10 font-cinzel text-[180px] leading-none text-[#641E32]/[0.05] transition-all duration-[1800ms] ${
          inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
        }`}
      >
        LS
      </span>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        {/* ============ IMAGE ============ */}
        <div className="lg:col-span-5 relative">
          {/* Offset frame */}
          <div
            className={`absolute -top-4 -left-4 w-full h-full border border-[#B89B62]/60 transition-all duration-[1400ms] delay-500 ${
              inView ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 translate-x-4 translate-y-4'
            }`}
          />

          <div className="relative aspect-[4/5] overflow-hidden group">
            <img
              src="https://res.cloudinary.com/jpea5mb0/image/upload/v1793740272/lailashamsi_products/varnq4zuzvt1v4fqfxtz.jpg"
              alt="Pakistani Eastern Wear craftsmanship"
              className={`w-full h-full object-cover transition-transform duration-[2200ms] ease-out group-hover:scale-105 ${
                inView ? 'scale-100' : 'scale-125'
              }`}
            />
            {/* Curtain wipe */}
            <div
              className={`absolute inset-0 bg-[#641E32] origin-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.77,0,0.18,1)] ${
                inView ? 'scale-y-0' : 'scale-y-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#282321]/75 via-transparent to-transparent" />

            {/* Caption */}
            <div
              style={{ transitionDelay: '900ms' }}
              className={`absolute bottom-0 inset-x-0 p-6 text-[#FAF5EC] transition-all duration-1000 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <p className="font-serif-luxury italic text-[15px] leading-snug">
                “Celebrating Pakistani Fashion, One Beautiful Detail at a Time.”
              </p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-[#B89B62]">
                Umi&apos;z World · Pakistani Eastern Wear
              </p>
            </div>
          </div>
        </div>

        {/* ============ TEXT ============ */}
        <div className="lg:col-span-7">
          <div {...reveal(200)}>
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-[#B89B62] font-semibold">
              <span className={`h-px bg-[#B89B62] transition-all duration-1000 delay-500 ${inView ? 'w-10' : 'w-0'}`} />
              Our Heritage & Story
            </span>
          </div>

          <h2 {...reveal(350)}>
            <span className="block font-cinzel text-3xl sm:text-5xl lg:text-[50px] font-bold text-[#641E32] leading-[1.15] mt-5">
              Rooted in Tradition, Designed for Today
            </span>
          </h2>

          <p {...reveal(500)}>
            <span className="block mt-6 max-w-xl text-[15px] leading-[1.85] text-[#282321]/85">
              Discover a thoughtful selection of Pakistani Eastern Wear that brings together traditional artistry, elegant silhouettes, and contemporary style.
            </span>
          </p>

          {/* Pillars */}
          <div className="mt-10 grid sm:grid-cols-2 border-t border-[#E8DCCB]">
            {pillars.map((p, i) => (
              <div
                key={p.no}
                {...reveal(650 + i * 150)}
              >
                <div className={`group relative py-6 ${i === 0 ? 'sm:pr-8' : 'sm:pl-8 sm:border-l border-[#E8DCCB]'} cursor-default`}>
                  <span className="absolute top-0 left-0 h-px w-0 bg-[#641E32] transition-all duration-700 group-hover:w-full" />
                  <span className="font-cinzel text-xs text-[#B89B62] font-bold tracking-widest">{p.no}</span>
                  <h3 className="mt-2 font-cinzel text-base font-bold text-[#641E32] transition-transform duration-500 group-hover:translate-x-1">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#282321]/80">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div {...reveal(950)}>
            <div className="grid grid-cols-3 gap-4 py-7 border-y border-[#E8DCCB]">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-cinzel text-3xl sm:text-4xl font-bold text-[#641E32]">
                    <CountUp end={s.end} suffix={s.suffix} start={inView} />
                  </div>
                  <div className="mt-1 text-[10.5px] uppercase tracking-[0.16em] text-[#282321]/75">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div {...reveal(1100)}>
            <button
              onClick={onShopLook}
              className="group mt-9 inline-flex items-center gap-4 px-8 py-4 bg-[#641E32] hover:bg-[#4A1624] text-[#FAF5EC] rounded-full text-xs uppercase tracking-[0.22em] font-semibold transition-all shadow-md"
            >
              <span>Shop the Collection</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
