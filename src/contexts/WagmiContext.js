import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
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

  const { chains: configuredChains, provider } = configureChains(chainsConfig, [
    // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider(),
  ]);
  const [chains, setChains] = useState(configuredChains);

  const { connectors: defaultConnectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    chains,
  });
  const initialClient = createClient({
    autoConnect: true,
    connectors: defaultConnectors,
    provider,
  });
  const [client, setClient] = useState(initialClient);

  useEffect(() => {
    const { chains, provider } = configureChains(chainsConfig, [
      //   alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
      publicProvider(),
    ]);
    setChains(chains);
    const { connectors } = getDefaultWallets({
      appName: 'My RainbowKit App',
      chains,
    });
    setClient(
      createClient({
        autoConnect: true,
        connectors,
        provider,
      })
    );
  }, [chainsConfig]);

  return (
    <WagmiContext.Provider value={{ setChainsConfig, chainsConfig, chains }}>
      <WagmiConfig client={client}>
        <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
      </WagmiConfig>
    </WagmiContext.Provider>
  );
};
