export const STORAGE_KEYS = {
  AUTH0_CALLBACK_PARAMS: 'auth0.callback_params',
};

export const CUSTOM_CHAINS = [
  {
    id: 9990,
    name: 'Altlayer Alpha Devnet',
    network: 'Altlayer Alpha Devnet',
    nativeCurrency: {
      decimals: 18,
      name: 'ALT',
      symbol: 'ALT',
    },
    rpcUrls: {
      public: { http: ['https://devnet-rpc.altlayer.io'] },
      default: { http: ['https://devnet-rpc.altlayer.io'] },
    },
    blockExplorers: {
      default: { name: 'Devnet Explorer', url: 'https://devnet-explorer.altlayer.io/' },
    },
    contracts: {},
  },
  {
    id: 534353,
    name: 'Scroll Alpha Testnet',
    network: 'Scroll Alpha Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'ETH',
      symbol: 'ETH',
    },
    rpcUrls: {
      public: { http: ['https://alpha-rpc.scroll.io/l2'] },
      default: { http: ['https://alpha-rpc.scroll.io/l2'] },
    },
    blockExplorers: {
      default: { name: 'Blockscout', url: 'https://blockscout.scroll.io' },
    },
    contracts: {},
  },
];
