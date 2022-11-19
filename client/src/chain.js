export const FilecoinWallaby = {
  id: 31415,
  name: 'Filecoin Wallaby',
  network: 'Filecoin Wallaby',
  iconUrl: 'https://docs.filecoin.io/logos/Filecoin-symbol.png',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Test Filcoin',
    symbol: 'tFIL',
  },
  rpcUrls: {
    default: 'https://wallaby.node.glif.io/rpc/v0',
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.glif.io/?network=wallaby' },
  },
  testnet: true,
};