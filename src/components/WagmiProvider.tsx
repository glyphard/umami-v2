import React from 'react'
import { WagmiConfig, createClient, chain, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { INFURA_RPC_URL } from '../constants'

const { chains, provider } = configureChains(
  [chain.arbitrum],
  [publicProvider()],
  { stallTimeout: 30000 }
)

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'umami.finance',
        jsonRpcUrl: INFURA_RPC_URL,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
        rpc: {
          1: INFURA_RPC_URL,
        },
      },
    }),
  ],
  provider,
})

type Props = {
  children: React.ReactNode;
};

export default function WagmiProvider({ children }: Props) {
  return <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
}
