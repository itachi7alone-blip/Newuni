export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  sources?: { label: string; url: string }[];
}

export const FAQ_CATEGORIES = [
  'Getting Started',
  'Swapping & Networks',
  'Fees & Gas',
  'Wallets & Security',
  'Troubleshooting',
  'Liquidity & Advanced',
];

export const FAQ_DATA: FAQItem[] = [
  // GETTING STARTED
  {
    id: 'what-is-uniswap',
    category: 'Getting Started',
    question: 'What is Uniswap?',
    answer: 'Uniswap is a decentralized trading protocol that lets people exchange supported crypto assets using smart contracts. Rather than depositing funds into a centralized exchange account, users authorize transactions from their own wallets.',
    sources: [{ label: 'Uniswap Protocol Docs', url: 'https://support.uniswap.org/hc/en-us/articles/8671701219853-What-is-the-Uniswap-protocol' }]
  },
  {
    id: 'how-uniswap-works',
    category: 'Getting Started',
    question: 'How does Uniswap work?',
    answer: "Uniswap's liquidity pools hold assets that users can trade against. An automated market maker (AMM) uses rules in smart contracts to determine how a swap changes the pool's balances and price. Liquidity providers supply assets and can earn fees from trades using their liquidity.",
    sources: [{ label: 'How the protocol works', url: 'https://support.uniswap.org/hc/en-us/articles/8671577468813-How-does-the-Uniswap-protocol-work' }]
  },
  {
    id: 'is-uniswap-safe',
    category: 'Getting Started',
    question: 'Is Uniswap safe to use?',
    answer: 'Using Uniswap involves risk even when you use a legitimate app. Risks include malicious tokens, harmful approvals, phishing websites, smart-contract bugs, and unfavorable trade execution. A token appearing in a search result or liquidity pool is not an endorsement.',
    sources: [{ label: 'Wallet security', url: 'https://support.uniswap.org/hc/en-us/articles/28278904584077-Uniswap-Wallet-Security-Measures' }]
  },
  {
    id: 'uniswap-account-kyc',
    category: 'Getting Started',
    question: 'Do I need an account or KYC to use Uniswap?',
    answer: 'An ordinary wallet-based swap does not use a centralized exchange login: you connect a compatible wallet and authorize the transaction. Buying or selling crypto for local currency is a different process and third-party payment providers may require identity checks.',
    sources: [{ label: 'Connecting a wallet', url: 'https://support.uniswap.org/hc/en-us/articles/8121191796749-How-to-connect-a-wallet-to-the-Uniswap-web-app' }]
  },
  {
    id: 'do-i-need-uni',
    category: 'Getting Started',
    question: 'What is UNI, and do I need it to swap on Uniswap?',
    answer: 'UNI is the token used in Uniswap governance. You do not need to buy UNI simply to make a normal swap. You need the asset you want to sell and, where the transaction requires it, the selected network\'s gas token (e.g., ETH).',
    sources: [{ label: 'Protocol and UNI governance', url: 'https://support.uniswap.org/hc/en-us/articles/8671701219853-What-is-the-Uniswap-protocol' }]
  },
  {
    id: 'what-is-dex',
    category: 'Getting Started',
    question: 'What is a DEX (Decentralized Exchange)?',
    answer: 'A DEX is a peer-to-peer marketplace where cryptocurrency transactions occur directly between users without a central intermediary. You retain control of your private keys and approve each transaction in your own wallet.',
  },
  {
    id: 'what-is-smart-contract',
    category: 'Getting Started',
    question: 'What is a smart contract?',
    answer: 'A smart contract is a self-executing contract with the terms of the agreement directly written into code. On blockchains, they automate actions like swapping tokens or transferring funds without needing a middleman.',
  },
  {
    id: 'what-is-stablecoin',
    category: 'Getting Started',
    question: 'What is a stablecoin?',
    answer: 'A stablecoin is a type of cryptocurrency designed to maintain a stable value, usually pegged to a fiat currency like the US Dollar (e.g., USDT, USDC). They are commonly used in DeFi to avoid the volatility of other crypto assets.',
  },

  // SWAPPING & NETWORKS
  {
    id: 'how-to-swap',
    category: 'Swapping & Networks',
    question: 'How do I swap tokens on Uniswap?',
    answer: '1. Connect a compatible wallet and choose the correct network. 2. Select the token you are selling and buying. 3. Enter the amount. 4. Review the quote, fees, and slippage. 5. Complete any required token approval, then confirm the swap.',
    sources: [{ label: 'How to swap tokens', url: 'https://support.uniswap.org/hc/en-us/articles/8370549680909-How-to-swap-tokens-with-the-Uniswap-web-app' }]
  },
  {
    id: 'connect-wallet',
    category: 'Swapping & Networks',
    question: 'Can I use MetaMask or Trust Wallet with Uniswap?',
    answer: 'Yes, compatible wallets such as MetaMask and Trust Wallet can connect to the Uniswap web app on supported networks. Open the app, choose Connect, and select your wallet. Approve the connection inside your wallet.',
    sources: [{ label: 'Wallet connection guide', url: 'https://support.uniswap.org/hc/en-us/articles/8121191796749-How-to-connect-a-wallet-to-the-Uniswap-web-app' }]
  },
  {
    id: 'supported-networks',
    category: 'Swapping & Networks',
    question: 'Which networks does Uniswap support?',
    answer: 'Uniswap supports Ethereum and several other networks, including Unichain, Arbitrum, Base, Optimism, Polygon, BNB Smart Chain, and Avalanche. Always check the live network table and your app\'s selector before moving funds.',
    sources: [{ label: 'Current networks', url: 'https://support.uniswap.org/hc/en-us/articles/14569415293325-Networks-on-Uniswap' }]
  },
  {
    id: 'swap-usdt-usdc',
    category: 'Swapping & Networks',
    question: 'Can I swap USDT and USDC on Uniswap?',
    answer: 'Yes, where the selected network, token contracts, and available liquidity support the trade. USDT and USDC are stablecoins, but their names alone do not identify the network. Confirm the issuer\'s contract information for that chain.',
    sources: [{ label: 'Stablecoins', url: 'https://support.uniswap.org/hc/en-us/articles/21302572675597-What-is-a-stablecoin' }]
  },
  {
    id: 'bitcoin-solana',
    category: 'Swapping & Networks',
    question: 'Can I swap Bitcoin or Solana tokens on Uniswap?',
    answer: 'The Uniswap web app supports Solana swaps through a Solana-compatible wallet. Native Bitcoin on the Bitcoin blockchain is different from a token representing Bitcoin on another chain (like WBTC). Check the exact network and asset.',
    sources: [{ label: 'Solana integration', url: 'https://blog.uniswap.org/solana-now-live' }]
  },
  {
    id: 'swap-vs-bridge',
    category: 'Swapping & Networks',
    question: 'What is the difference between swapping and bridging crypto?',
    answer: 'A same-network swap exchanges one asset for another on that blockchain. Bridging moves value between blockchains, sometimes using a different representation of the asset. A crosschain swap can combine bridging with exchanging assets.',
    sources: [{ label: 'Crosschain swaps vs bridging', url: 'https://support.uniswap.org/hc/en-us/articles/43793128689549-What-are-crosschain-swaps' }]
  },
  {
    id: 'crosschain-swaps',
    category: 'Swapping & Networks',
    question: 'Can I swap tokens between different networks on Uniswap?',
    answer: 'Yes, supported crosschain routes can combine a bridge and swap in the Uniswap interface. Availability is narrower than the full list of networks supported for ordinary swaps. Review bridge costs, expected delivery, and destination gas needs.',
    sources: [{ label: 'Crosschain support', url: 'https://support.uniswap.org/hc/en-us/articles/43793128689549-What-are-crosschain-swaps' }]
  },
  {
    id: 'eth-vs-weth',
    category: 'Swapping & Networks',
    question: 'What is the difference between ETH and WETH?',
    answer: "ETH is Ethereum's native asset. WETH is an ERC-20 representation created by wrapping ETH, allowing it to work with contracts that expect ERC-20 tokens. The standard wrapping mechanism exchanges ETH and WETH one-for-one.",
    sources: [{ label: 'Wrapped ether', url: 'https://ethereum.org/wrapped-eth/' }]
  },
  {
    id: 'v2-v3-v4',
    category: 'Swapping & Networks',
    question: 'What is the difference between Uniswap v2, v3, and v4?',
    answer: 'Uniswap v2 uses full-range liquidity pools. Uniswap v3 adds concentrated liquidity, letting providers choose price ranges. Uniswap v4 builds on concentrated liquidity with optional hooks, more flexible fees, and a shared pool-management architecture.',
    sources: [{ label: 'Uniswap versions', url: 'https://support.uniswap.org/hc/en-us/articles/7425482965517-Uniswap-v2-v3-and-v4' }]
  },
  {
    id: 'v4-hooks',
    category: 'Swapping & Networks',
    question: 'What are Uniswap v4 hooks?',
    answer: "Hooks are optional smart contracts that customize a v4 pool's behavior at defined points, such as before or after a swap or liquidity change. They can implement features such as dynamic fees or custom accounting.",
    sources: [{ label: 'v4 Hooks', url: 'https://developers.uniswap.org/docs/protocols/v4/concepts/hooks' }]
  },
  {
    id: 'uniswapx',
    category: 'Swapping & Networks',
    question: 'What is UniswapX, and are its swaps really gasless?',
    answer: 'UniswapX is a trading system in which competing fillers execute signed orders. In eligible flows, fillers pay the execution gas. "Gasless" therefore does not mean costless; initial onchain token approvals may still cost gas.',
    sources: [{ label: 'UniswapX overview', url: 'https://support.uniswap.org/hc/en-us/articles/17515415311501-What-is-UniswapX' }]
  },
  {
    id: 'unichain',
    category: 'Swapping & Networks',
    question: 'What is Unichain?',
    answer: 'Unichain is an Ethereum Layer 2 network in the Superchain ecosystem, designed for DeFi activity. It is a blockchain, whereas Uniswap is a trading protocol. Unichain uses ETH as its native gas asset.',
    sources: [{ label: 'What is Unichain?', url: 'https://support.uniswap.org/hc/en-us/articles/30948517268877-What-is-Unichain' }]
  },

  // FEES & GAS
  {
    id: 'uniswap-fees',
    category: 'Fees & Gas',
    question: 'How much does Uniswap charge in fees?',
    answer: 'A swap\'s total cost can include pool trading fees, network gas, and additional token or bridge costs. Uniswap Labs says its interface fee has been zero since 27 December 2025; that does not make every swap free. Pool fees are separate.',
    sources: [{ label: 'Uniswap Labs fees', url: 'https://support.uniswap.org/hc/en-us/articles/42640092742541-What-are-Uniswap-Labs-fees' }]
  },
  {
    id: 'reduce-gas-fees',
    category: 'Fees & Gas',
    question: 'Why are Uniswap gas fees high, and how can I reduce them?',
    answer: 'Gas pays for blockchain execution. A swap can use more gas than a simple token transfer. Compare the live cost at different times and evaluate a supported lower-cost network if suitable liquidity is available.',
    sources: [{ label: 'Ethereum gas', url: 'https://ethereum.org/developers/docs/gas/' }]
  },
  {
    id: 'native-gas-token',
    category: 'Fees & Gas',
    question: 'Why do I need ETH to swap USDT or USDC?',
    answer: 'For a standard Ethereum transaction, gas is paid in ETH even if the asset you are swapping is USDT or USDC. Having enough stablecoins does not necessarily mean you can pay that fee. You need gas funds on the network where you are transacting.',
    sources: [{ label: 'Network costs', url: 'https://support.uniswap.org/hc/en-us/articles/40074336993549-What-is-a-network-cost' }]
  },
  {
    id: 'slippage-tolerance',
    category: 'Fees & Gas',
    question: 'What is slippage tolerance, and what should I set it to?',
    answer: 'Slippage tolerance limits how much worse execution may be than the quoted result. There is no universally best percentage: it depends on liquidity, volatility, trade size, and route. A very high setting can allow a poor fill.',
    sources: [{ label: 'Changing slippage', url: 'https://support.uniswap.org/hc/en-us/articles/8643879653261-How-to-change-slippage-on-the-Uniswap-Web-app' }]
  },
  {
    id: 'price-impact-vs-slippage',
    category: 'Fees & Gas',
    question: 'What is price impact, and how is it different from slippage?',
    answer: 'Price impact is the change in price caused by your own trade against available liquidity. Slippage is the difference between the expected result and execution as conditions change. Raising slippage tolerance does not reduce price impact.',
    sources: [{ label: 'Price impact vs slippage', url: 'https://support.uniswap.org/hc/en-us/articles/8643794102669-Price-Impact-vs-Price-Slippage' }]
  },
  {
    id: 'what-is-gas',
    category: 'Fees & Gas',
    question: 'What is a gas fee?',
    answer: 'A gas fee is a payment made to blockchain validators to compensate for the computing energy required to process and validate transactions. It fluctuates based on network demand.',
  },
  {
    id: 'mev-protection',
    category: 'Fees & Gas',
    question: 'What is a sandwich attack, and how can I reduce MEV risk?',
    answer: 'A sandwich attack places trades before and after your swap to profit from the price movement. It is one form of transaction-ordering exploitation associated with maximal extractable value (MEV). Avoid unnecessarily wide slippage limits.',
    sources: [{ label: 'Sandwich attacks', url: 'https://support.uniswap.org/hc/en-us/articles/19387081481741-What-is-a-sandwich-attack' }]
  },

  // WALLETS & SECURITY
  {
    id: 'approvals-permit2',
    category: 'Wallets & Security',
    question: 'What are token approvals and Permit2?',
    answer: 'An ERC-20 approval lets a specified contract spend a token within an allowance. Permit2 is a Uniswap-developed permission system that can combine an onchain token approval with later signed permissions. Check the spender before approving.',
    sources: [{ label: 'Permit2 approvals', url: 'https://support.uniswap.org/hc/en-us/articles/39683402190733-What-is-a-Permit2-approval' }]
  },
  {
    id: 'revoke-approvals',
    category: 'Wallets & Security',
    question: 'How do I revoke a token approval, and is disconnecting my wallet enough?',
    answer: 'Disconnecting a wallet from a website does not revoke its onchain token allowances. Use the correct network\'s trusted block-explorer approval checker or your wallet\'s supported allowance controls to review and revoke unwanted permissions.',
    sources: [{ label: 'Revoking approvals', url: 'https://support.uniswap.org/hc/en-us/articles/15724901841037-How-to-revoke-a-token-approval' }]
  },
  {
    id: 'cannot-sell-token',
    category: 'Wallets & Security',
    question: 'Why can I buy a token on Uniswap but not sell it?',
    answer: 'Possible reasons include missing liquidity, transfer restrictions, very high sell fees, or a malicious honeypot contract. Third-party scanners can miss risks. Increasing slippage cannot remove a contract\'s selling restriction.',
    sources: [{ label: 'Unsellable token scams', url: 'https://support.uniswap.org/hc/en-us/articles/17523088290573-Unsellable-token-scams' }]
  },
  {
    id: 'verify-token',
    category: 'Wallets & Security',
    question: 'How do I verify a token contract and avoid fake tokens?',
    answer: 'Start with the project\'s verified official information and find its contract address for the exact network. Compare the complete address with the asset shown in the app and the blockchain explorer. Names, logos, and tickers can be copied.',
    sources: [{ label: 'Token contract addresses', url: 'https://support.uniswap.org/hc/en-us/articles/26757826138637-What-is-a-token-contract-address' }]
  },
  {
    id: 'seed-phrase',
    category: 'Wallets & Security',
    question: 'What is a seed phrase and why is it critical?',
    answer: 'A seed phrase (or recovery phrase) is a series of words that can generate all the private keys for your crypto wallet. Anyone with your seed phrase has complete control over your funds. Never share it, never type it into a website, and store it offline.',
  },
  {
    id: 'phishing-protection',
    category: 'Wallets & Security',
    question: 'How do I protect myself from phishing links?',
    answer: 'Always double-check the URL. Use official bookmarks. If a link claims your funds are at risk and asks you to "validate" or "secure" them by entering your seed phrase, it is a scam. Legitimate sites will never ask for your seed phrase.',
  },
  {
    id: 'hot-vs-cold-wallet',
    category: 'Wallets & Security',
    question: 'What is the difference between a hot wallet and a cold wallet?',
    answer: 'A hot wallet is connected to the internet (like MetaMask or Trust Wallet on your phone) and is convenient for daily trading. A cold wallet (hardware wallet like Ledger) stores keys offline, making it much more resistant to hacking.',
  },
  {
    id: 'reverse-transaction',
    category: 'Wallets & Security',
    question: 'Can Uniswap reverse a completed swap or recover stolen funds?',
    answer: 'Uniswap Labs cannot reverse a confirmed blockchain swap or recover funds from a self-custody wallet on your behalf. For an unexpected result, preserve the transaction hash and check the receiving address and network.',
    sources: [{ label: 'Security measures', url: 'https://support.uniswap.org/hc/en-us/articles/28278904584077-Uniswap-Wallet-Security-Measures' }]
  },

  // TROUBLESHOOTING
  {
    id: 'swap-failed',
    category: 'Troubleshooting',
    question: 'Why did my Uniswap swap fail?',
    answer: 'A swap may fail because the price moved beyond your slippage limit, you lack gas funds, the deadline expired, an approval is missing, or the token behaves unexpectedly. Check the transaction on the correct blockchain explorer.',
    sources: [{ label: 'Why transactions fail', url: 'https://support.uniswap.org/hc/en-us/articles/8643975058829-Why-did-my-transaction-fail' }]
  },
  {
    id: 'transaction-pending',
    category: 'Troubleshooting',
    question: 'Why is my Uniswap transaction pending?',
    answer: 'Pending means the transaction has not yet reached a final outcome. Possible causes include congestion, an insufficient fee offer, or an earlier pending transaction from the same account. Search the transaction hash on the correct explorer.',
    sources: [{ label: 'Pending transactions', url: 'https://support.uniswap.org/hc/en-us/articles/7422909292813-My-transaction-has-been-pending-for-a-long-time-What-can-I-do' }]
  },
  {
    id: 'cancel-speed-up',
    category: 'Troubleshooting',
    question: 'Can I cancel or speed up a pending Uniswap transaction?',
    answer: 'Sometimes. On supported EVM wallets, Speed up can submit a higher-fee replacement, while Cancel attempts a replacement that prevents the original action. Both depend on the original transaction still being pending.',
    sources: [{ label: 'Speed up or cancel', url: 'https://support.metamask.io/manage-crypto/transactions/how-to-speed-up-or-cancel-a-pending-transaction' }]
  },
  {
    id: 'approved-not-swapped',
    category: 'Troubleshooting',
    question: 'Why did I approve a token but receive nothing?',
    answer: 'Approving a token grants spending permission; it does not exchange the token. If you only completed the approval, your swap may still need a separate confirmation. Check the activity details to distinguish an approval from an executed swap.',
    sources: [{ label: 'Approvals', url: 'https://support.uniswap.org/hc/en-us/articles/8122264374925-Why-aren-t-my-tokens-showing-up-in-my-wallet' }]
  },
  {
    id: 'tokens-not-showing',
    category: 'Troubleshooting',
    question: 'My Uniswap swap succeeded—where are my tokens?',
    answer: 'Check the transaction receipt and token transfers on the explorer. Your wallet may be showing another account or network, hiding the token, or missing its display information. Add the verified token contract using your wallet\'s token-import feature.',
    sources: [{ label: 'Missing tokens', url: 'https://support.uniswap.org/hc/en-us/articles/8122264374925-Why-aren-t-my-tokens-showing-up-in-my-wallet' }]
  },
  {
    id: 'insufficient-liquidity',
    category: 'Troubleshooting',
    question: 'Why does Uniswap say "insufficient liquidity" or "no route found"?',
    answer: 'The app may be unable to find a supported trading path for the selected tokens, network, amount, and settings. This happens when liquidity is too small, the token address belongs to another chain, or an execution system cannot serve that trade.',
    sources: [{ label: 'Routing errors', url: 'https://developers.uniswap.org/docs/trading/swapping-api/common-errors' }]
  },

  // LIQUIDITY & ADVANCED
  {
    id: 'liquidity-pools',
    category: 'Liquidity & Advanced',
    question: 'What is a Uniswap liquidity pool?',
    answer: 'A liquidity pool holds assets in smart-contract infrastructure so traders can exchange one asset for another. Liquidity providers contribute assets and receive a position representing their share, earning applicable trading fees.',
    sources: [{ label: 'Liquidity pools', url: 'https://support.uniswap.org/hc/en-us/articles/8829880740109-What-is-a-liquidity-pool' }]
  },
  {
    id: 'add-liquidity',
    category: 'Liquidity & Advanced',
    question: 'How do I add liquidity on Uniswap?',
    answer: "Open the official app's Pool section, choose the network and protocol version, and select a token pair. Review the pool, fee settings, and required deposits. In concentrated-liquidity versions, choose a price range.",
    sources: [{ label: 'Adding liquidity', url: 'https://support.uniswap.org/hc/en-us/articles/32233918539533-How-to-add-a-new-liquidity-position-to-Uniswap-v4' }]
  },
  {
    id: 'remove-liquidity',
    category: 'Liquidity & Advanced',
    question: 'How do I remove liquidity and collect fees on Uniswap?',
    answer: 'Connect the wallet controlling the position, select the network, and open the position in Pool. Choose how much liquidity to remove, inspect the assets you will receive, and confirm the transaction. In v3 and v4, accrued fees can also be collected.',
    sources: [{ label: 'Removing liquidity', url: 'https://support.uniswap.org/hc/en-us/articles/33829355779853-How-to-remove-liquidity-from-Uniswap-v4' }]
  },
  {
    id: 'impermanent-loss',
    category: 'Liquidity & Advanced',
    question: 'What is impermanent loss?',
    answer: 'Impermanent loss describes how a liquidity position can underperform simply holding the same starting assets when their relative prices change. Trading fees may offset the difference, but they may not.',
    sources: [{ label: 'Impermanent loss', url: 'https://support.uniswap.org/hc/en-us/articles/20904453751693-What-is-Impermanent-Loss' }]
  },
  {
    id: 'cash-out-to-bank',
    category: 'Liquidity & Advanced',
    question: 'How do I cash out from Uniswap to a bank account?',
    answer: 'You generally need a fiat off-ramp provider to convert crypto into local currency. Where available, the app\'s Buy/Sell flow lets you choose a third-party provider. Supported countries, currencies, and identity checks vary.',
    sources: [{ label: 'Selling crypto', url: 'https://support.uniswap.org/hc/en-us/articles/34020466671757-How-to-sell-crypto-for-fiat-local-currency' }]
  },
  {
    id: 'dex-vs-cex',
    category: 'Liquidity & Advanced',
    question: 'How is Uniswap different from a centralized exchange?',
    answer: 'Uniswap lets you authorize onchain trades from a self-custody wallet using decentralized trading infrastructure. A centralized exchange generally manages customer accounts and custody. Wallet-based trading requires you to manage keys and fees.',
    sources: [{ label: 'How the protocol works', url: 'https://support.uniswap.org/hc/en-us/articles/8671577468813-How-does-the-Uniswap-protocol-work' }]
  }
];
