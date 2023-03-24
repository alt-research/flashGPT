import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { createContext, useContext, useEffect, useState } from 'react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import {
  arbitrum,
  gnosis,
  gnosisChiado,
  mainnet,
  optimism,
  polygon,
  polygonMumbai,
  polygonZkEvmTestnet,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { CUSTOM_CHAINS } from '../constants';

export const WagmiContext = createContext({});

export const useWagmi = () => {
  return useContext(WagmiContext);
};

export const WagmiProvider = ({ children }) => {
  console.log('wagmi provider rerendering');
  const [chainsConfig, setChainsConfig] = useState([
    mainnet,
    polygon,
    optimism,
    arbitrum,
    polygonMumbai,
    polygonZkEvmTestnet,
    gnosis,
    gnosisChiado,
    ...CUSTOM_CHAINS,
  ]);

  const { chains: configuredChains, provider } = configureChains(chainsConfig, [publicProvider()]);
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
    const { chains, provider } = configureChains(chainsConfig, [publicProvider()]);
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
