import { useState } from 'react';
import './App.css';
import '@rainbow-me/rainbowkit/styles.css';

import Bridge from './pages/Bridge';

import {
  getDefaultWallets,
  RainbowKitProvider,
  ConnectButton
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { ALCHEMY_ID } from './config';
import { FilecoinWallaby } from './chain'

const { chains, provider } = configureChains(
  [FilecoinWallaby, chain.goerli, chain.polygonMumbai],
  [
    alchemyProvider({ apiKey: ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ConnectButton />
        <Bridge />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App;