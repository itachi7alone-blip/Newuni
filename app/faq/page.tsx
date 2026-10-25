import type { Metadata } from 'next';
import { FAQ_DATA } from '@/lib/faqData';
import { FAQAccordion } from '@/components/FAQAccordion';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Uniswap FAQ: Swaps, Fees, Wallets & Troubleshooting',
  description: 'Get clear answers to 50 Uniswap questions about token swaps, fees, slippage, wallets, failed transactions, liquidity pools, bridges and crypto safety.',
};

export default function FAQPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_DATA.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-[#FFFFFF]">
      <Navbar />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto flex max-w-[1280px] flex-col items-center px-6 pt-20 pb-32">
        <h1 className="mb-4 text-center text-[42px] font-[500] leading-[1.1] tracking-[-0.02em] text-[#222222] md:text-[56px]">
          Uniswap FAQ
        </h1>
        <p className="mb-12 max-w-[600px] text-center text-[16px] leading-[1.5] tracking-[-0.02em] text-[#666666]">
          Get clear answers to common questions about swapping tokens, network fees, wallet security, and troubleshooting failed transactions.
        </p>

        <FAQAccordion />

        <div className="mt-20 rounded-[20px] border border-[#F2F2F2] bg-[#F9F9F9] p-6 text-center text-[13px] leading-[1.5] text-[#666666]">
          <p className="mb-2 font-[535] text-[#222222]">Educational Disclaimer</p>
          <p>
            This is an independent educational resource. Crypto swaps and liquidity provision carry risks. 
            Always verify token addresses and never share your recovery phrase. Information checked: October 2026.
          </p>
        </div>
      </div>
    </main>
  );
}
