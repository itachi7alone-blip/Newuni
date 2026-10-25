'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { TransferCard } from '@/components/TransferCard';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFFFF]">
      <Navbar />
      <div className="mx-auto flex max-w-[1280px] flex-col items-center px-6 pt-20 pb-32">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-6 flex items-center gap-2 rounded-full border border-[#F2F2F2] bg-[#F9F9F9] px-4 py-1.5 shadow-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-[#FF37C7] animate-pulse" />
          <span className="text-[13px] font-[535] tracking-[-0.02em] text-[#222222]">
            Audited by Blockaid · 7 chains supported
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="mb-4 text-center text-[56px] font-[500] leading-[1.0] tracking-[-0.02em] text-[#222222] md:text-[72px]"
        >
          Swap, earn, and more
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="mb-12 max-w-[600px] text-center text-[18px] leading-[1.5] tracking-[-0.02em] text-[#666666]"
        >
          The largest onchain marketplace. Send and secure your crypto across Ethereum and 7 other chains with one confirmation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, type: 'spring' }}
          className="w-full"
        >
          <TransferCard />
        </motion.div>

        <div className="mt-32 grid w-full max-w-[1040px] grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { title: '7 chains supported', body: 'Ethereum, BNB, Polygon, Arbitrum, Optimism, Base, Avalanche.' },
            { title: 'Non-custodial', body: 'Your keys, your coins. We never hold your assets at any point.' },
            { title: 'One-click sweep', body: 'Every wallet. Every chain. One single confirmation.' }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-[24px] border border-[#F2F2F2] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFEAF8] text-[#FF37C7] group-hover:scale-110 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="mb-1 text-[18px] font-[535] tracking-[-0.02em] text-[#222222]">{feature.title}</div>
              <div className="text-[14px] leading-[1.5] tracking-[-0.02em] text-[#666666]">{feature.body}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
