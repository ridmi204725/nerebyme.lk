import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';

export default function PackageGallery({ images = [], title = 'Packages / Menu' }) {
  const items = (Array.isArray(images) ? images : []).map((pkg, i) => ({
    key: pkg?._id || `${pkg?.url || pkg}-${i}`,
    url: typeof pkg === 'string' ? pkg : pkg?.url,
    title: typeof pkg === 'string' ? '' : (pkg?.title || ''),
    description: typeof pkg === 'string' ? '' : (pkg?.description || '')
  })).filter(x => x.url);

  const [active, setActive] = useState(0);
  if (!items.length) return null;

  const current = items[Math.min(active, items.length - 1)];
  const go = (delta) => setActive((active + delta + items.length) % items.length);

  return (
    <section className="nm-package-gallery max-w-7xl mx-auto px-3 sm:px-5 md:px-8 py-7">
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <span className="text-[10px] uppercase tracking-[.2em] font-bold text-theme-accent">Curated by Admin</span>
          <h2 className="nm-section-title mt-1">{title}</h2>
        </div>
        {items.length > 1 && <span className="text-xs opacity-60">{active + 1} / {items.length}</span>}
      </div>

      <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20 shadow-2xl">
        <img src={current.url} alt={current.title || title} className="w-full max-h-[620px] min-h-[240px] object-contain bg-black/20" />
        {items.length > 1 && <>
          <button aria-label="Previous" onClick={() => go(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/55 text-white flex items-center justify-center backdrop-blur hover:bg-black/75"><FaChevronLeft size={13}/></button>
          <button aria-label="Next" onClick={() => go(1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/55 text-white flex items-center justify-center backdrop-blur hover:bg-black/75"><FaChevronRight size={13}/></button>
        </>}
        <div className="absolute right-3 bottom-3 px-3 py-2 rounded-xl bg-black/60 text-white text-xs backdrop-blur flex items-center gap-2">
          <FaExpand size={10}/> {current.title || 'View image'}
        </div>
      </div>

      {(current.title || current.description) && (
        <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
          {current.title && <h3 className="font-bold text-sm sm:text-base">{current.title}</h3>}
          {current.description && <p className="text-xs sm:text-sm opacity-70 mt-1 leading-relaxed">{current.description}</p>}
        </div>
      )}

      {items.length > 1 && (
        <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
          {items.map((item, i) => (
            <button key={item.key} onClick={() => setActive(i)} className={`overflow-hidden rounded-xl border ${i === active ? 'border-theme-accent ring-2 ring-[var(--accent-color)]/30' : 'border-white/10 opacity-65 hover:opacity-100'}`}>
              <img src={item.url} alt={item.title || `Preview ${i + 1}`} className="w-full h-16 sm:h-20 object-cover" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
