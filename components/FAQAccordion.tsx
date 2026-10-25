'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ_DATA, FAQ_CATEGORIES, FAQItem } from '@/lib/faqData';

export function FAQAccordion() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openId, setOpenId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesQuery = 
        item.question.toLowerCase().includes(query.toLowerCase()) || 
        item.answer.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="mb-8 flex flex-col items-center justify-center">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Search questions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-[#F2F2F2] bg-[#F9F9F9] px-6 py-4 pl-12 text-[15px] text-[#222222] outline-none transition-all focus:border-[#FF37C7] focus:bg-white focus:ring-4 focus:ring-[#FF37C7]/10"
          />
          <svg
            className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#666666]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Category Pills */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActiveCategory('All')}
          className={`rounded-full px-4 py-2 text-[13px] font-[535] tracking-[-0.02em] transition-colors ${
            activeCategory === 'All' ? 'bg-[#FF37C7] text-white' : 'bg-[#F9F9F9] text-[#666666] hover:bg-[#F2F2F2]'
          }`}
        >
          All Questions
        </button>
        {FAQ_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-2 text-[13px] font-[535] tracking-[-0.02em] transition-colors ${
              activeCategory === cat ? 'bg-[#FF37C7] text-white' : 'bg-[#F9F9F9] text-[#666666] hover:bg-[#F2F2F2]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="mx-auto max-w-3xl space-y-4">
        {filteredData.length === 0 && (
          <div className="py-12 text-center text-[15px] text-[#666666]">
            No questions found matching your search.
          </div>
        )}

        {filteredData.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-[16px] border border-[#F2F2F2] bg-white shadow-sm transition-all hover:border-[#E5E5E5]">
            <button
              onClick={() => toggleAccordion(item.id)}
              className="flex w-full items-center justify-between px-6 py-5 text-left outline-none"
            >
              <span className="text-[16px] font-[535] text-[#222222]">{item.question}</span>
              <svg
                className={`h-5 w-5 flex-shrink-0 text-[#666666] transition-transform duration-300 ${
                  openId === item.id ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {openId === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="border-t border-[#F2F2F2] px-6 py-5">
                    <p className="text-[14px] leading-[1.6] text-[#666666]">
                      {item.answer}
                    </p>
                    {item.sources && item.sources.length > 0 && (
                      <div className="mt-4">
                        <span className="text-[12px] font-[535] text-[#999999]">Sources:</span>
                        <div className="mt-1 flex flex-col gap-1">
                          {item.sources.map((src, idx) => (
                            <a
                              key={idx}
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[12px] text-[#FF37C7] hover:underline"
                            >
                              {src.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
