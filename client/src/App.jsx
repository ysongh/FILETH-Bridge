import { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import './App.css';
import '@rainbow-me/rainbowkit/styles.css';

import Navbar from './components/layout/Navbar';
import Bridge from './pages/Bridge';

import {
  getDefaultWallets,
  RainbowKitProvider,
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
    <ChakraProvider>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Navbar />
          <main>
            <Bridge />
          </main>
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  )
}

export default App;