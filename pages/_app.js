import { createClient, configureChains, defaultChains, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

import { MetaMaskConnector  } from 'wagmi/connectors/metaMask'
import {  WalletConnectConnector  } from 'wagmi/connectors/walletConnect'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'

// import { SessionProvider } from 'next-auth/react'
import '../styles/globals.scss'
import "antd/dist/antd.min.css";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

const {provider, webSocketProvider, chains} = configureChains(defaultChains, [publicProvider()])

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true
      }
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi'
      }
    })
  ]
})

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  
  )
}

export default MyApp
