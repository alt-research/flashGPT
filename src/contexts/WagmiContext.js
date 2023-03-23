import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { createContext, useContext, useMemo, useState } from 'react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { arbitrum, mainnet, optimism, polygon } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

export const WagmiContext = createContext({});

export const useWagmi = () => {
  return useContext(WagmiContext);
};

export const WagmiProvider = ({ children }) => {
  console.log('wagmi provider rerendering');
  const [chainsConfig, setChainsConfig] = useState([mainnet, polygon, optimism, arbitrum]);
  const { chains, provider } = useMemo(
    () =>
      configureChains(chainsConfig, [
        alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
        publicProvider(),
      ]),
    [chainsConfig]
  );

  const { connectors } = useMemo(
    () =>
      getDefaultWallets({
        appName: 'My RainbowKit App',
        chains,
      }),
    [chains]
  );

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WagmiContext.Provider value={{ setChainsConfig }}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
      </WagmiConfig>
    </WagmiContext.Provider>
  );
};
